import Link from "next/link";

type EditionPage = "home" | "topics" | "formula-hub" | "blog" | "mindmap" | "about";

export function EditionBackdrop() {
  return <div className="edition-atmosphere" aria-hidden="true" />;
}

export function EditionNav({ active }: { active: EditionPage }) {
  const startLearningHref = active === "home" ? "#modules" : "/#modules";

  return (
    <nav className="edition-nav" aria-label="Main navigation">
      <div className="edition-nav-inner">
        <Link className="edition-brand" href="/">
          Deep <span>Learning</span> Visualized
        </Link>
        <div className="edition-nav-links">
          <Link className={`edition-nav-link ${active === "home" ? "active" : ""}`} href="/">
            Curriculum
          </Link>
          <Link className={`edition-nav-link ${active === "topics" ? "active" : ""}`} href="/topics">
            Topics
          </Link>
          <Link className={`edition-nav-link ${active === "formula-hub" ? "active" : ""}`} href="/formula-hub">
            Formula Hub
          </Link>
          <Link className={`edition-nav-link ${active === "blog" ? "active" : ""}`} href="/blog">
            Blog
          </Link>
          <Link className={`edition-nav-link ${active === "mindmap" ? "active" : ""}`} href="/mindmap">
            Mindmap
          </Link>
          <Link className={`edition-nav-link ${active === "about" ? "active" : ""}`} href="/about">
            About
          </Link>
        </div>
        <div className="edition-nav-actions">
          <Link className="edition-nav-icon" href="/formula-hub/saved" aria-label="Saved formulas">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.75c0-.69.56-1.25 1.25-1.25h7.5c.69 0 1.25.56 1.25 1.25v15.02l-5-3.12-5 3.12V4.75Z" />
            </svg>
          </Link>
          <Link className="edition-nav-cta" href={startLearningHref}>
            Start learning {"\u2192"}
          </Link>
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
