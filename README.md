# 333 教育综合 · 学习中枢

为考研 **333 教育综合统考** 打造的结构化学习系统：章节精读 → 考点卡片（分 核心 / 重要 / 了解）→ 真题练习。

- 技术栈：Next.js 15 (App Router) + TypeScript + Tailwind v4 + SQLite + Drizzle ORM
- 设计语言：**Claude Design**（奶油底 / 珊瑚色主色 / 衬线标题 / 低调阴影）
- 内容：手工录入；**不依赖 AI API**，无持续成本

## 科目范围
| 科目 | 分值 | 章节 |
|---|---|---|
| 教育学原理 | 100 | 11 |
| 中国教育史 | 50 | 10 |
| 外国教育史 | 50 | 10 |
| 教育心理学 | 50 | 13 |

## 本地开发
```bash
pnpm install
pnpm db:migrate       # 建表
pnpm db:seed          # 写入 4 科章节骨架 + 1 章样例内容
pnpm dev              # http://localhost:3000
```

## 目录结构
```
app/              # Next.js App Router 路由
  /               # 首页：四科目卡片
  /s/[subject]    # 学科章节列表
  /s/[subject]/c/[chapter]         # 章节精读（考点卡片分级）
  /s/[subject]/c/[chapter]/practice  # 章节练习
  /review         # 复习中心（阶段 3 接入）
components/       # 组件（Header / KeyPointCard / QuestionCard …）
lib/              # db / schema / queries / markdown
seed/             # 科目与样例章节数据（纯 TS）
scripts/          # migrate.ts / seed.ts
styles/globals.css  # Claude Design tokens + Tailwind v4
```

## 如何补内容

每章数据是一个导出对象，结构参考 `seed/sample-chapter.ts`：
```ts
{
  subjectSlug: "principles",
  chapterSlug: "2",
  sections: [ { slug, title, keyPoints: [ { title, body, importance, frequencyTag, orderIdx } ] } ],
  questions: [ { type: "mcq" | "short" | "essay", stem, options, answer, explanation, yearTag, orderIdx } ],
}
```
在 `scripts/seed.ts` 里 import 并调用相同的 insert 流程即可。后期会加 `/admin` 可视化录入页。

## 设计 tokens（摘）
- 背景 `#FAF9F5` · 表面 `#FFFFFF` · 下沉表面 `#F4F1EA`
- 主色珊瑚 `#CC785C` · 强调橄榄 `#6B8E23`
- 墨色 `#1F1E1D` / 柔墨 `#5A5954`
- 圆角 `10px / 16px` · 阴影极浅双层
- 标题衬线字体 Copernicus → Noto Serif SC → Songti

## 路线图
- [x] 阶段 1：骨架 + Claude Design + 1 章样例（**当前**）
- [ ] 阶段 2：内容批量录入、剩余章节骨架填充
- [ ] 阶段 3：艾宾浩斯复习算法、错题本、今日任务、部署到 `333.learnword.site`

## License
MIT（仅代码；教材考点内容仅供学习参考）
