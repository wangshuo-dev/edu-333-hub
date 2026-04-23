import { renderMarkdown } from "../lib/md";

export default function KeyPointCard({
  title, body, importance, frequencyTag,
}: {
  title: string; body: string; importance: string; frequencyTag?: string | null;
}) {
  const badgeClass =
    importance === "high" ? "badge-high" : importance === "low" ? "badge-low" : "badge-mid";
  const impLabel = importance === "high" ? "核心" : importance === "low" ? "了解" : "重要";
  return (
    <article className="card card-hover p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="serif text-[1.08rem] text-[color:var(--color-ink)] leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`badge ${badgeClass}`}>{impLabel}</span>
          {frequencyTag ? <span className="badge badge-accent">{frequencyTag}</span> : null}
        </div>
      </div>
      <div
        className="prose-soft"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </article>
  );
}
