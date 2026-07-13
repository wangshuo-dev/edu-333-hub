import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];
const output = process.argv[3] ?? path.join(process.cwd(), "seed", "generated", "getnote-chapters.json");

if (!input) {
  console.error("Usage: node scripts/import-getnote.mjs <all-notes.json> [output.json]");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(input, "utf8"));
const notes = payload?.data?.notes;
if (!Array.isArray(notes)) throw new Error("Unsupported GetNote export: data.notes is missing");

const numerals = new Map([
  ["一", 1], ["二", 2], ["三", 3], ["四", 4], ["五", 5], ["六", 6],
  ["七", 7], ["八", 8], ["九", 9], ["十", 10], ["十一", 11], ["十二", 12],
]);

const names = (items) => (Array.isArray(items) ? items.map((item) => item?.name).filter(Boolean) : []);
const hasTopic = (note, topic) => names(note.topics).includes(topic);
const hasTag = (note, pattern) => names(note.tags).some((tag) => pattern.test(tag));
const cleanTitle = (title) => String(title || "未命名课程")
  .replace(/\.mp4$/i, "")
  .replace(/^\d+[.、]\s*/, "")
  .trim();

function cleanBody(content) {
  let body = String(content || "").trim();
  const summaryMarker = "#### 录音总结";
  const summaryStart = body.indexOf(summaryMarker);
  if (summaryStart >= 0) body = body.slice(summaryStart + summaryMarker.length).trim();
  const nextModule = body.search(/\n###\s+/);
  if (nextModule >= 0) body = body.slice(0, nextModule).trim();
  return body
    .replace(/\[([^\]]+)\]\(https:\/\/getnotes\.seek:[^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chapterNumber(title, fallback = 1) {
  const match = title.match(/第(1[0-2]|[1-9]|十二|十一|十|[一二三四五六七八九])章/);
  if (!match) return fallback;
  if (/^\d+$/.test(match[1])) return Number(match[1]);
  return numerals.get(match[1]) ?? fallback;
}

function subjectFor(note) {
  if (hasTopic(note, "教育学原理")) return "principles";
  if (hasTopic(note, "333教育心理学")) return "psychology";
  if (hasTopic(note, "外国教育史")) return "world-history";
  if (hasTopic(note, "暑假带背考点")) return "china-history";
  if (!hasTopic(note, "教育学")) return null;

  const haystack = `${note.title} ${names(note.tags).join(" ")}`;
  return /外国|古希腊|古罗马|中世纪|文艺复兴|宗教改革|英国|法国|德国|俄国|苏联|美国|日本|夸美纽斯|洛克|卢梭|裴斯泰洛|赫尔巴特|福禄|斯宾塞|杜威/.test(haystack)
    ? "world-history"
    : "china-history";
}

function worldChapter(title) {
  if (/东方.*古代|文明古国/.test(title)) return 1;
  if (/古希腊|古罗马|古风时期/.test(title)) return 2;
  if (/中世纪/.test(title)) return 3;
  if (/文艺复兴|宗教改革/.test(title)) return 4;
  if (/俄国近代/.test(title)) return 5;
  if (/二战后|20世纪后半期|战后.*改革/.test(title)) return 10;
  if (/苏联|俄罗斯/.test(title)) return 9;
  if (/现代教育思潮|新教育运动|进步教育|杜威/.test(title)) return 8;
  if (/现代教育|二战前|20世纪前半期/.test(title)) return 7;
  if (/夸美纽斯|洛克|卢梭|裴斯泰洛|赫尔巴特|福禄|马克思|斯宾塞|赫胥黎|教育思想/.test(title)) return 6;
  return 5;
}

function chapterFor(note, subject) {
  const title = String(note.title || "");
  if (subject === "world-history") return worldChapter(title);
  if (subject === "principles") {
    const source = chapterNumber(title, 1);
    return Math.max(1, Math.min(9, source));
  }
  if (subject === "psychology") {
    const source = chapterNumber(title, 1);
    return Math.max(1, Math.min(8, source));
  }
  return Math.max(1, Math.min(12, chapterNumber(title, 1)));
}

const groups = new Map();
for (const note of notes) {
  const subject = subjectFor(note);
  if (!subject) continue;
  const body = cleanBody(note.content);
  if (!body) continue;
  const chapter = chapterFor(note, subject);
  const key = `${subject}/${chapter}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({
    title: cleanTitle(note.title),
    body,
    updatedAt: Number(note.updated_at || note.created_at || 0),
  });
}

const generated = [...groups.entries()]
  .sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
  .map(([key, entries]) => {
    const [subjectSlug, chapterSlug] = key.split("/");
    entries.sort((a, b) => a.title.localeCompare(b.title, "zh-CN", { numeric: true }));
    return {
      subjectSlug,
      chapterSlug,
      summary: `来自 Get笔记的 ${entries.length} 份课程整理，按课程目录归入本章。`,
      sections: entries.map((entry, index) => {
        const isFrequent = /高频|重点|必考|真题/.test(entry.body);
        return {
          slug: `getnote-${chapterSlug}-${index + 1}`,
          title: entry.title,
          keyPoints: [{
            title: "课程笔记",
            body: entry.body,
            importance: isFrequent ? "high" : "mid",
            ...(isFrequent ? { frequencyTag: "高频" } : {}),
            orderIdx: 1,
          }],
        };
      }),
      questions: [],
    };
  });

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(generated, null, 2)}\n`, { mode: 0o600 });

const summary = generated.reduce((acc, chapter) => {
  acc.notes += chapter.sections.length;
  acc.chapters += 1;
  acc.subjects[chapter.subjectSlug] = (acc.subjects[chapter.subjectSlug] || 0) + chapter.sections.length;
  return acc;
}, { notes: 0, chapters: 0, subjects: {} });
console.log(JSON.stringify(summary, null, 2));
