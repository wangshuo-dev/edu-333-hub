import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapter, getSubjectBySlug, listQuestions } from "../../../../../../lib/queries";
import QuestionCard from "../../../../../../components/QuestionCard";

export default async function PracticePage({ params }: { params: Promise<{ subject: string; chapter: string }> }) {
  const { subject: subjectSlug, chapter: chapterSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return notFound();
  const chapter = getChapter(subject.id, chapterSlug);
  if (!chapter) return notFound();
  const questions = listQuestions(chapter.id);

  return (
    <div className="py-2">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[color:var(--color-ink)]">学科</Link>
        <span>/</span>
        <Link href={`/s/${subjectSlug}`} className="hover:text-[color:var(--color-ink)]">{subject.title}</Link>
        <span>/</span>
        <Link href={`/s/${subjectSlug}/c/${chapterSlug}`} className="hover:text-[color:var(--color-ink)]">{chapter.title}</Link>
        <span>/</span>
        <span className="text-[color:var(--color-ink-soft)]">练习</span>
      </nav>
      <div className="flex items-baseline justify-between mt-5 mb-6 flex-wrap gap-3">
        <h1>{chapter.title} · 练习</h1>
        <Link href={`/s/${subjectSlug}/c/${chapterSlug}`} className="btn btn-outline text-xs">← 返回精读</Link>
      </div>

      {questions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="serif text-xl mb-2">暂无练习题</div>
          <p className="text-sm text-[color:var(--color-ink-soft)]">本章的练习题尚未录入。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)}
        </div>
      )}
    </div>
  );
}
