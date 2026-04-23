import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  score: integer("score").notNull(),
  summary: text("summary"),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const chapters = sqliteTable("chapters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chapterId: integer("chapter_id").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  orderIdx: integer("order_idx").notNull().default(0),
});

export const keyPoints = sqliteTable("key_points", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionId: integer("section_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(), // markdown-lite
  importance: text("importance").notNull().default("mid"), // 'high' | 'mid' | 'low'
  frequencyTag: text("frequency_tag"), // '高频' | '真题' | '易错' | null
  orderIdx: integer("order_idx").notNull().default(0),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chapterId: integer("chapter_id").notNull(),
  type: text("type").notNull(), // 'mcq' | 'fill' | 'short' | 'essay'
  stem: text("stem").notNull(),
  optionsJson: text("options_json"), // ["A","B","C","D"]
  answer: text("answer").notNull(),
  explanation: text("explanation"),
  yearTag: text("year_tag"), // '2023' | null
  orderIdx: integer("order_idx").notNull().default(0),
});

export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userKey: text("user_key").notNull(),
  sectionId: integer("section_id").notNull(),
  status: text("status").notNull().default("unseen"), // 'unseen' | 'reading' | 'mastered'
  updatedAt: integer("updated_at").notNull(),
});
