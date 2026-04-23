import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "333 教育综合 · 学习中枢",
  description: "考研 333 教育综合统考的结构化精读与练习系统。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="container-page py-8 min-h-screen">{children}</main>
        <footer className="container-page py-10 text-sm text-[color:var(--color-muted)]">
          <div className="divider mb-6" />
          <div className="flex items-center justify-between">
            <span>333 教育综合 · 学习中枢</span>
            <span className="text-xs">Designed with Claude Design · 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
