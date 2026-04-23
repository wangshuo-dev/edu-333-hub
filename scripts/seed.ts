import Database from "better-sqlite3";
import path from "node:path";
import { SUBJECTS } from "../seed/subjects";
import { SAMPLE_CHAPTER } from "../seed/sample-chapter";

const sqlite = new Database(path.join(process.cwd(), "db", "data.sqlite"));
sqlite.pragma("journal_mode = WAL");

// wipe for idempotent seed
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
const insertSection = sqlite.prepare(
  "INSERT INTO sections (chapter_id,slug,title,order_idx) VALUES (?,?,?,?)"
);
const insertKp = sqlite.prepare(
  "INSERT INTO key_points (section_id,title,body,importance,frequency_tag,order_idx) VALUES (?,?,?,?,?,?)"
);
const insertQ = sqlite.prepare(
  "INSERT INTO questions (chapter_id,type,stem,options_json,answer,explanation,year_tag,order_idx) VALUES (?,?,?,?,?,?,?,?)"
);

for (const s of SUBJECTS) {
  const result = insertSubject.run(s.slug, s.title, s.score, s.summary ?? null, s.orderIdx);
  const subjectId = Number(result.lastInsertRowid);
  s.chapters.forEach((c, idx) => {
    insertChapter.run(subjectId, c.slug, c.title, null, idx + 1);
  });
}

// Fill in the sample chapter
const subRow = sqlite.prepare("SELECT id FROM subjects WHERE slug=?").get(SAMPLE_CHAPTER.subjectSlug) as { id: number };
const chRow = sqlite.prepare("SELECT id FROM chapters WHERE subject_id=? AND slug=?").get(subRow.id, SAMPLE_CHAPTER.chapterSlug) as { id: number };

SAMPLE_CHAPTER.sections.forEach((sec, sIdx) => {
  const r = insertSection.run(chRow.id, sec.slug, sec.title, sIdx + 1);
  const secId = Number(r.lastInsertRowid);
  sec.keyPoints.forEach((kp) => {
    insertKp.run(secId, kp.title, kp.body, kp.importance, kp.frequencyTag ?? null, kp.orderIdx);
  });
});

SAMPLE_CHAPTER.questions.forEach((q) => {
  insertQ.run(
    chRow.id,
    q.type,
    q.stem,
    "options" in q && q.options ? JSON.stringify(q.options) : null,
    q.answer,
    q.explanation ?? null,
    q.yearTag ?? null,
    q.orderIdx
  );
});

console.log("seed done. subjects:", SUBJECTS.length, "sample chapter filled.");
sqlite.close();
