import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="placeholder-root">
      <div className="placeholder-page">
        <nav className="placeholder-nav">
          <Link href="/">All modules</Link>
          <span className="placeholder-nav-brand">Deep Learning</span>
          <Link href="/">Back to homepage</Link>
        </nav>
        <div className="placeholder-shell">
          <section className="placeholder-panel">
            <div className="placeholder-badge">Route not found</div>
            <h1 className="placeholder-title">
              <span>This page</span> does not exist.
            </h1>
            <p className="placeholder-desc">
              The migrated Next.js app currently includes the landing page, all five module pages,
              and topic placeholders. If you expected a teaching page here, it has not been built yet.
            </p>
            <div className="placeholder-actions">
              <Link className="placeholder-btn-primary" href="/">
                Return to homepage
              </Link>
            </div>
          </section>
        </div>
        <div className="placeholder-footer">Available now · PAGE 1 and PAGE 2 routes only</div>
      </div>
    </main>
  );
}
