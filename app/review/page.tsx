export default function ReviewPage() {
  return (
    <div className="py-2">
      <h1 className="mb-3">复习中心</h1>
      <p className="text-[color:var(--color-ink-soft)] text-[15px] leading-7 max-w-2xl">
        错题本 / 最近学习 / 艾宾浩斯推送将在第 3 阶段接入。当前版本优先跑通章节精读与基础练习。
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["错题本", "最近学习", "今日任务"].map((t) => (
          <div key={t} className="card p-6">
            <div className="serif text-[1.05rem] mb-1">{t}</div>
            <p className="text-xs text-[color:var(--color-muted)]">即将上线</p>
          </div>
        ))}
      </div>
    </div>
  );
}
