import { db, schema } from "./db";
import { and, asc, eq, inArray, like, or } from "drizzle-orm";

export function listSubjects() {
  return db.select().from(schema.subjects).orderBy(asc(schema.subjects.orderIdx)).all();
}

export function getSubjectBySlug(slug: string) {
  return db.select().from(schema.subjects).where(eq(schema.subjects.slug, slug)).get();
}

export function listChapters(subjectId: number) {
  return db.select().from(schema.chapters)
    .where(eq(schema.chapters.subjectId, subjectId))
    .orderBy(asc(schema.chapters.orderIdx)).all();
}

export function getChapter(subjectId: number, slug: string) {
  return db.select().from(schema.chapters)
    .where(and(eq(schema.chapters.subjectId, subjectId), eq(schema.chapters.slug, slug)))
    .get();
}

export function listSections(chapterId: number) {
  return db.select().from(schema.sections)
    .where(eq(schema.sections.chapterId, chapterId))
    .orderBy(asc(schema.sections.orderIdx)).all();
}

export function listKeyPointsByChapter(chapterId: number) {
  const secs = listSections(chapterId);
  const ids = secs.map(s => s.id);
  if (!ids.length) return { sections: [], keyPoints: [] as Array<typeof schema.keyPoints.$inferSelect> };
  const kps = db.select().from(schema.keyPoints)
    .where(inArray(schema.keyPoints.sectionId, ids))
    .orderBy(asc(schema.keyPoints.sectionId), asc(schema.keyPoints.orderIdx)).all();
  return { sections: secs, keyPoints: kps };
}

export function listQuestions(chapterId: number) {
  return db.select().from(schema.questions)
    .where(eq(schema.questions.chapterId, chapterId))
    .orderBy(asc(schema.questions.orderIdx)).all();
}

export function chapterStats(subjectId: number) {
  const chs = listChapters(subjectId);
  return chs.map(c => {
    const secIds = db.select({ id: schema.sections.id }).from(schema.sections)
      .where(eq(schema.sections.chapterId, c.id)).all().map(s => s.id);
    const kpCount = secIds.length
      ? db.select({ id: schema.keyPoints.id }).from(schema.keyPoints)
          .where(inArray(schema.keyPoints.sectionId, secIds)).all().length
      : 0;
    const qCount = db.select({ id: schema.questions.id }).from(schema.questions)
      .where(eq(schema.questions.chapterId, c.id)).all().length;
    return { ...c, sectionCount: secIds.length, keyPointCount: kpCount, questionCount: qCount };
  });
}

export function searchKnowledge(query: string, limit = 40) {
  const term = `%${query.trim()}%`;
  if (term === "%%") return [];
  return db
    .select({
      id: schema.keyPoints.id,
      title: schema.keyPoints.title,
      body: schema.keyPoints.body,
      importance: schema.keyPoints.importance,
      frequencyTag: schema.keyPoints.frequencyTag,
      sectionTitle: schema.sections.title,
      chapterSlug: schema.chapters.slug,
      chapterTitle: schema.chapters.title,
      subjectSlug: schema.subjects.slug,
      subjectTitle: schema.subjects.title,
    })
    .from(schema.keyPoints)
    .innerJoin(schema.sections, eq(schema.keyPoints.sectionId, schema.sections.id))
    .innerJoin(schema.chapters, eq(schema.sections.chapterId, schema.chapters.id))
    .innerJoin(schema.subjects, eq(schema.chapters.subjectId, schema.subjects.id))
    .where(or(like(schema.keyPoints.title, term), like(schema.keyPoints.body, term), like(schema.sections.title, term)))
    .limit(Math.min(Math.max(limit, 1), 100))
    .all();
}
