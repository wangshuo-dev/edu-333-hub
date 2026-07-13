import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SUBJECTS } from "../seed/subjects";
import { ALL_CHAPTERS } from "../seed/chapters";
import type { ChapterContent } from "../seed/chapters/types";

const sqlite = new Database(path.join(process.cwd(), "db", "data.sqlite"));
sqlite.pragma("journal_mode = WAL");

sqlite.exec(`
  DELETE FROM questions;
  DELETE FROM key_points;
  DELETE FROM sections;
  DELETE FROM chapters;
  DELETE FROM subjects;
`);

const insertSubject = sqlite.prepare(
  "INSERT INTO subjects (slug,title,score,summary,order_idx) VALUES (?,?,?,?,?)"
);
const insertChapter = sqlite.prepare(
  "INSERT INTO chapters (subject_id,slug,title,summary,order_idx) VALUES (?,?,?,?,?)"
);
const updateChapterSummary = sqlite.prepare(
  "UPDATE chapters SET summary=? WHERE id=?"
);
const insertSection = sqlite.prepare(
  "INSERT INTO sections (chapter_id,slug,title,order_idx) VALUES (?,?,?,?)"
);
const insertKp = sqlite.prepare(
  "INSERT INTO key_points (section_id,title,body,importance,frequency_tag,order_idx) VALUES (?,?,?,?,?,?)"
);
const insertQ = sqlite.prepare(
  "INSERT INTO questions (chapter_id,type,stem,options_json,answer,explanation,year_tag,order_idx) VALUES (?,?,?,?,?,?,?,?)"
);
const selectSubject = sqlite.prepare("SELECT id FROM subjects WHERE slug=?");
const selectChapter = sqlite.prepare("SELECT id FROM chapters WHERE subject_id=? AND slug=?");

for (const s of SUBJECTS) {
  const result = insertSubject.run(s.slug, s.title, s.score, s.summary ?? null, s.orderIdx);
  const subjectId = Number(result.lastInsertRowid);
  s.chapters.forEach((c, idx) => {
    insertChapter.run(subjectId, c.slug, c.title, null, idx + 1);
  });
}

const generatedPath = path.join(process.cwd(), "seed", "generated", "getnote-chapters.json");
const generatedChapters: ChapterContent[] = fs.existsSync(generatedPath)
  ? JSON.parse(fs.readFileSync(generatedPath, "utf8"))
  : [];

let filled = 0;
for (const ch of [...ALL_CHAPTERS, ...generatedChapters]) {
  const subRow = selectSubject.get(ch.subjectSlug) as { id: number } | undefined;
  if (!subRow) {
    console.warn(`[seed] skip: unknown subject ${ch.subjectSlug}`);
    continue;
  }
  const chRow = selectChapter.get(subRow.id, ch.chapterSlug) as { id: number } | undefined;
  if (!chRow) {
    console.warn(`[seed] skip: unknown chapter ${ch.subjectSlug}/${ch.chapterSlug}`);
    continue;
  }
  if (ch.summary) updateChapterSummary.run(ch.summary, chRow.id);

  ch.sections.forEach((sec, sIdx) => {
    const r = insertSection.run(chRow.id, sec.slug, sec.title, sIdx + 1);
    const secId = Number(r.lastInsertRowid);
    sec.keyPoints.forEach((kp) => {
      insertKp.run(secId, kp.title, kp.body, kp.importance, kp.frequencyTag ?? null, kp.orderIdx);
    });
  });
  ch.questions.forEach((q) => {
    insertQ.run(
      chRow.id,
      q.type,
      q.stem,
      q.options ? JSON.stringify(q.options) : null,
      q.answer,
      q.explanation ?? null,
      q.yearTag ?? null,
      q.orderIdx
    );
  });
  filled++;
}

console.log(
  `seed done. subjects=${SUBJECTS.length} content_batches=${filled}/${ALL_CHAPTERS.length + generatedChapters.length}`
);
sqlite.close();
