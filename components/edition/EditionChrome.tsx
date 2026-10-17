import Link from "next/link";
import { EditionMenu } from "@/components/edition/EditionMenu";
import { ThemeToggle } from "@/components/edition/ThemeToggle";

type EditionPage = "home" | "topics" | "formula-hub" | "blog" | "mindmap" | "about";

export function EditionBackdrop() {
  return <div className="edition-atmosphere" aria-hidden="true" />;
}

const navItems: { page: EditionPage; href: string; label: string }[] = [
  { page: "home", href: "/", label: "Curriculum" },
  { page: "topics", href: "/topics", label: "Topics" },
  { page: "formula-hub", href: "/formula-hub", label: "Formula Hub" },
  { page: "blog", href: "/blog", label: "Blog" },
  { page: "mindmap", href: "/mindmap", label: "Mindmap" },
  { page: "about", href: "/about", label: "About" },
];

export function EditionNav({ active }: { active?: EditionPage }) {
  const startLearningHref = active === "home" ? "#modules" : "/#modules";

  return (
    <nav className="edition-nav" aria-label="Main navigation">
      <div className="edition-nav-inner">
        <Link className="edition-brand" href="/">
          Deep <span>Learning</span> Visualized
        </Link>
        <div className="edition-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`edition-nav-link ${active === item.page ? "active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="edition-nav-actions">
          <ThemeToggle />
          <Link className="edition-nav-icon" href="/formula-hub/saved" aria-label="Saved formulas">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.75c0-.69.56-1.25 1.25-1.25h7.5c.69 0 1.25.56 1.25 1.25v15.02l-5-3.12-5 3.12V4.75Z" />
            </svg>
          </Link>
          <Link className="edition-nav-cta" href={startLearningHref}>
            Start learning {"→"}
          </Link>
          <EditionMenu
            links={navItems.map((item) => ({ href: item.href, label: item.label, active: active === item.page }))}
            startLearningHref={startLearningHref}
          />
        </div>
      </div>
    </nav>
  );
}

export function EditionFooter() {
  return (
    <footer className="edition-footer">
      <div className="edition-footer-inner">
        <div className="edition-brand">
          Deep <span>Learning</span> Visualized
        </div>
        <nav className="edition-footer-links" aria-label="Footer navigation">
          <Link href="/">Curriculum</Link>
          <Link href="/topics">Topics</Link>
          <Link href="/formula-hub">Formula Hub</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/mindmap">Mindmap</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="edition-footer-copy">Copyright 2026 Deep Learning Visualized. Designed for clarity.</div>
      </div>
    </footer>
  );
}
