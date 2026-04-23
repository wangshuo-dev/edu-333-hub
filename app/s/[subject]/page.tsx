import Link from "next/link";
import { notFound } from "next/navigation";
import { chapterStats, getSubjectBySlug } from "../../../lib/queries";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params;
  const subject = getSubjectBySlug(slug);
  if (!subject) return notFound();
  const chapters = chapterStats(subject.id);

  return (
    <div className="py-2">
      <div className="mb-8">
        <Link href="/" className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
          ← 返回学科
        </Link>
        <div className="flex items-baseline gap-3 mt-3">
          <h1>{subject.title}</h1>
          <span className="serif text-2xl text-[color:var(--color-brand)]">{subject.score} 分</span>
        </div>
        {subject.summary ? (
          <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-7 mt-3 max-w-2xl">{subject.summary}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {chapters.map((c) => {
          const hasContent = c.keyPointCount > 0 || c.questionCount > 0;
          return (
            <Link key={c.id} href={`/s/${subject.slug}/c/${c.slug}`} className="block">
              <div className="card card-hover p-5 flex items-center gap-5">
                <div className="w-14 shrink-0 text-center">
                  <div className="serif text-xl text-[color:var(--color-ink-soft)]">{c.slug}</div>
                  <div className="text-[10px] text-[color:var(--color-muted)] uppercase tracking-wider mt-0.5">Ch.</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="serif text-[1.05rem] text-[color:var(--color-ink)] truncate">{c.title}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-[12px] text-[color:var(--color-muted)]">
                    {hasContent ? (
                      <>
                        <span>{c.sectionCount} 节</span>
                        <span>·</span>
                        <span>{c.keyPointCount} 考点</span>
                        <span>·</span>
                        <span>{c.questionCount} 题</span>
                      </>
                    ) : (
                      <span className="badge badge-low">内容待填充</span>
                    )}
                  </div>
                </div>
                <span className="text-[color:var(--color-muted)]">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
