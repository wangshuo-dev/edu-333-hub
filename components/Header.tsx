import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]">
      <div className="container-page flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-6 w-6 rounded-md bg-[color:var(--color-brand)]" />
          <span className="serif text-[17px]">333 学习中枢</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-[color:var(--color-ink-soft)]">
          <Link className="hover:text-[color:var(--color-ink)]" href="/">学科</Link>
          <Link className="hover:text-[color:var(--color-ink)]" href="/review">复习</Link>
          <form action="/search" method="get" className="hidden sm:flex items-center">
            <label className="sr-only" htmlFor="header-search">搜索知识点</label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="搜索知识点"
              className="search-input"
            />
          </form>
        </nav>
      </div>
    </header>
  );
}
