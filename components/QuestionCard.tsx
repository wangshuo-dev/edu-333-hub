"use client";
import { useState } from "react";
import { renderMarkdown } from "../lib/md";

type Q = {
  id: number;
  type: string;
  stem: string;
  optionsJson: string | null;
  answer: string;
  explanation: string | null;
  yearTag: string | null;
};

export default function QuestionCard({ q, index }: { q: Q; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const options: string[] = q.optionsJson ? JSON.parse(q.optionsJson) : [];
  const typeLabel: Record<string, string> = {
    mcq: "选择题", fill: "填空题", short: "简答题", essay: "论述题",
  };

  return (
    <article className="card p-6">
      <div className="flex items-center gap-2 mb-3 text-xs text-[color:var(--color-muted)]">
        <span>第 {index + 1} 题</span>
        <span>·</span>
        <span>{typeLabel[q.type] ?? q.type}</span>
        {q.yearTag ? <><span>·</span><span className="badge badge-accent">{q.yearTag}</span></> : null}
      </div>
      <p className="text-[15px] leading-7 text-[color:var(--color-ink)] mb-4 whitespace-pre-wrap">
        {q.stem}
      </p>

      {q.type === "mcq" && options.length > 0 ? (
        <div className="space-y-2 mb-4">
          {options.map((opt) => {
            const letter = opt.match(/^([A-D])[.、．]?\s*/)?.[1] ?? opt[0];
            const chosen = picked === letter;
            const isCorrect = revealed && letter === q.answer;
            const isWrong = revealed && chosen && letter !== q.answer;
            return (
              <button
                key={letter}
                onClick={() => { setPicked(letter); }}
                className={[
                  "w-full text-left px-4 py-2.5 rounded-[var(--radius)] border text-sm transition-colors",
                  chosen ? "bg-[color:var(--color-brand-soft)] border-[color:var(--color-brand)]" : "bg-white border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-sunken)]",
                  isCorrect ? "!border-[color:var(--color-accent)] !bg-[color:var(--color-accent-soft)]" : "",
                  isWrong ? "!border-[color:var(--color-danger)] !bg-[color:var(--color-danger-soft)]" : "",
                ].join(" ")}
              >{opt}</button>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button className="btn btn-primary" onClick={() => setRevealed(true)}>
          {q.type === "mcq" ? "查看答案" : "查看参考答案"}
        </button>
        {revealed ? (
          <button className="btn btn-ghost" onClick={() => { setRevealed(false); setPicked(null); }}>
            重置
          </button>
        ) : null}
      </div>

      {revealed ? (
        <div className="mt-5 pt-5 border-t border-[color:var(--color-border)]">
          <div className="text-xs text-[color:var(--color-muted)] mb-1">参考答案</div>
          <div className="prose-soft mb-3 whitespace-pre-wrap">{q.answer}</div>
          {q.explanation ? (
            <>
              <div className="text-xs text-[color:var(--color-muted)] mb-1">解析</div>
              <div className="prose-soft" dangerouslySetInnerHTML={{ __html: renderMarkdown(q.explanation) }} />
            </>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
