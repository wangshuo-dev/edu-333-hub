import Link from "next/link";
import { searchKnowledge } from "../../lib/queries";

function excerpt(body: string, query: string) {
  const plain = body
    .replace(/[#*_`>\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const index = plain.toLowerCase().indexOf(query.toLowerCase());
  const start = index > 80 ? index - 80 : 0;
  const text = plain.slice(start, start + 220);
  return `${start > 0 ? "…" : ""}${text}${start + 220 < plain.length ? "…" : ""}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim() ?? "";
  const results = q ? searchKnowledge(q) : [];

  return (
    <div className="py-2">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)] mb-2">Knowledge Search</p>
        <h1 className="mb-5">搜索 333 知识库</h1>
        <form action="/search" method="get" className="flex gap-2">
          <input
            autoFocus
            name="q"
            type="search"
            defaultValue={q}
            placeholder="输入人物、理论、法案或考点"
            className="search-input !w-full !text-sm !py-3 !px-4"
          />
          <button className="btn btn-primary" type="submit">搜索</button>
        </form>
      </div>

      {q ? (
        <section className="mt-9">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2>“{q}”</h2>
            <span className="text-xs text-[color:var(--color-muted)]">找到 {results.length} 条结果</span>
          </div>
          {results.length ? (
            <div className="grid gap-3">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/s/${result.subjectSlug}/c/${result.chapterSlug}`}
                  className="card card-hover p-5 block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-[color:var(--color-brand)] mb-1">
                        {result.subjectTitle} · {result.chapterTitle}
                      </p>
                      <h3>{result.sectionTitle}</h3>
                    </div>
                    {result.frequencyTag ? <span className="badge badge-accent">{result.frequencyTag}</span> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-ink-soft)]">
                    {excerpt(result.body, q)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-sm text-[color:var(--color-ink-soft)]">
              暂时没有找到。试试人物名、理论名或法案关键词。
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
