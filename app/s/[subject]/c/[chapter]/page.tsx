import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapter, getSubjectBySlug, listKeyPointsByChapter, listQuestions } from "../../../../../lib/queries";
import KeyPointCard from "../../../../../components/KeyPointCard";

export default async function ChapterPage({ params }: { params: Promise<{ subject: string; chapter: string }> }) {
  const { subject: subjectSlug, chapter: chapterSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return notFound();
  const chapter = getChapter(subject.id, chapterSlug);
  if (!chapter) return notFound();
  const { sections, keyPoints } = listKeyPointsByChapter(chapter.id);
  const questions = listQuestions(chapter.id);

  if (!sections.length && !questions.length) {
    return (
      <div className="py-6">
        <Breadcrumb subject={subject.title} subjectSlug={subjectSlug} chapter={chapter.title} />
        <div className="card p-12 text-center mt-8">
          <div className="serif text-xl mb-2">本章内容正在整理</div>
          <p className="text-sm text-[color:var(--color-ink-soft)] max-w-md mx-auto leading-7">
            考点卡片与练习题还在录入中。你可以先回学科页看看其它章节，或 fork 仓库按 <code>seed/</code> 格式自己补内容。
          </p>
          <Link href={`/s/${subjectSlug}`} className="btn btn-outline mt-5">返回章节列表</Link>
        </div>
      </div>
    );
  }

  const byImportance = { high: [] as typeof keyPoints, mid: [] as typeof keyPoints, low: [] as typeof keyPoints };
  for (const kp of keyPoints) (byImportance[kp.importance as keyof typeof byImportance] ?? byImportance.mid).push(kp);

  return (
    <div className="py-2">
      <Breadcrumb subject={subject.title} subjectSlug={subjectSlug} chapter={chapter.title} />

      <div className="flex items-baseline justify-between mt-5 mb-6 flex-wrap gap-3">
        <h1>{chapter.title}</h1>
        <div className="flex items-center gap-3 text-xs text-[color:var(--color-muted)]">
          <span>{sections.length} 节 · {keyPoints.length} 考点 · {questions.length} 题</span>
          {questions.length > 0 ? (
            <Link className="btn btn-primary text-xs" href={`/s/${subjectSlug}/c/${chapterSlug}/practice`}>
              去练习 →
            </Link>
          ) : null}
        </div>
      </div>

      {/* Side-by-side: section nav (desktop) + content */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-6 self-start">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--color-muted)] mb-3">目录</div>
          <ul className="space-y-1.5 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#sec-${s.id}`} className="block px-3 py-1.5 rounded-[var(--radius-sm)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-surface-sunken)] hover:text-[color:var(--color-ink)]">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0">
          {sections.map((s) => {
            const sectionKps = keyPoints.filter((k) => k.sectionId === s.id);
            const highs = sectionKps.filter((k) => k.importance === "high");
            const mids = sectionKps.filter((k) => k.importance === "mid");
            const lows = sectionKps.filter((k) => k.importance === "low");
            return (
              <section key={s.id} id={`sec-${s.id}`} className="mb-12 scroll-mt-20">
                <h2 className="mb-4">{s.title}</h2>
                <div className="space-y-4">
                  {[...highs, ...mids, ...lows].map((kp) => (
                    <KeyPointCard key={kp.id} title={kp.title} body={kp.body} importance={kp.importance} frequencyTag={kp.frequencyTag} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ subject, subjectSlug, chapter }: { subject: string; subjectSlug: string; chapter: string }) {
  return (
    <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5">
      <Link href="/" className="hover:text-[color:var(--color-ink)]">学科</Link>
      <span>/</span>
      <Link href={`/s/${subjectSlug}`} className="hover:text-[color:var(--color-ink)]">{subject}</Link>
      <span>/</span>
      <span className="text-[color:var(--color-ink-soft)]">{chapter}</span>
    </nav>
  );
}
