import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dbDir = path.join(process.cwd(), "db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const sqlite = new Database(path.join(dbDir, "data.sqlite"));

sqlite.exec(`
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  score INTEGER NOT NULL,
  summary TEXT,
  order_idx INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  order_idx INTEGER NOT NULL DEFAULT 0,
  UNIQUE(subject_id, slug)
);
CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  order_idx INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS key_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'mid',
  frequency_tag TEXT,
  order_idx INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  stem TEXT NOT NULL,
  options_json TEXT,
  answer TEXT NOT NULL,
  explanation TEXT,
  year_tag TEXT,
  order_idx INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_key TEXT NOT NULL,
  section_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'unseen',
  updated_at INTEGER NOT NULL,
  UNIQUE(user_key, section_id)
);

CREATE INDEX IF NOT EXISTS idx_chapters_subject ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_sections_chapter ON sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_kp_section ON key_points(section_id);
CREATE INDEX IF NOT EXISTS idx_q_chapter ON questions(chapter_id);
`);
console.log("migration done");
sqlite.close();
