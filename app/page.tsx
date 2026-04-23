import Link from "next/link";
import { chapterStats, listSubjects } from "../lib/queries";

const BRAND_ACCENTS: Record<string, string> = {
  principles: "bg-[color:var(--color-brand-soft)]",
  "china-history": "bg-[color:var(--color-warn-soft)]",
  "world-history": "bg-[color:var(--color-accent-soft)]",
  psychology: "bg-[color:var(--color-surface-sunken)]",
};

export default function Home() {
  const subjects = listSubjects();
  const progress = subjects.map((s) => {
    const chs = chapterStats(s.id);
    const filled = chs.filter((c) => c.keyPointCount > 0 || c.questionCount > 0).length;
    return { total: chs.length, filled };
  });
  const totalFilled = progress.reduce((a, p) => a + p.filled, 0);
  const totalChapters = progress.reduce((a, p) => a + p.total, 0);

  return (
    <div className="py-6">
      <section className="mb-12">
        <h1 className="mb-3">为 333 教育综合而设计</h1>
        <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-7 max-w-2xl">
          结构化的章节精读、考点卡片与真题练习。目录清晰、重点分级、易错提示 — 帮你把四科 250 分的内容变成每天能推进的阅读任务。
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h2>四科目</h2>
          <span className="text-xs text-[color:var(--color-muted)]">
            共 250 分 · 约 {totalChapters} 章 · 已完成 {totalFilled} 章
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((s, i) => {
            const p = progress[i];
            const pct = p.total > 0 ? Math.round((p.filled / p.total) * 100) : 0;
            return (
              <Link key={s.id} href={`/s/${s.slug}`} className="block group">
                <div className="card card-hover p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`h-2 w-2 rounded-full ${BRAND_ACCENTS[s.slug] ?? "bg-[color:var(--color-border)]"}`}
                        />
                        <span className="text-[11px] tracking-widest uppercase text-[color:var(--color-muted)]">
                          Subject {s.orderIdx}
                        </span>
                      </div>
                      <h3 className="serif text-[1.4rem] leading-tight">{s.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="serif text-[1.6rem] leading-none text-[color:var(--color-brand)]">{s.score}</div>
                      <div className="text-[10px] text-[color:var(--color-muted)] tracking-widest uppercase mt-0.5">
                        分
                      </div>
                    </div>
                  </div>
                  {s.summary ? (
                    <p className="text-sm text-[color:var(--color-ink-soft)] leading-6">{s.summary}</p>
                  ) : null}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)] mb-1.5">
                      <span>内容进度 {p.filled}/{p.total}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[color:var(--color-surface-sunken)] overflow-hidden">
                      <div
                        className="h-full bg-[color:var(--color-brand)] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-[color:var(--color-brand)] group-hover:underline">
                    进入学习 →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
