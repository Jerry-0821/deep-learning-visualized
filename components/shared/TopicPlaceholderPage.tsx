import Link from "next/link";
import { TopicTeachingNotes } from "@/components/topic/TopicTeachingNotes";
import type { TopicLookup } from "@/data/topics";
import { hasTopicTeachingContent } from "@/data/topicTeachingContent";

export function TopicPlaceholderPage({
  topic,
  slug,
}: {
  topic?: TopicLookup;
  slug: string;
}) {
  const moduleHref = topic?.moduleHref ?? "/";
  const topicTitle = topic?.pageTitle ?? topic?.title ?? slug.replace(/-/g, " ");
  const hasTeachingNotes = topic ? hasTopicTeachingContent(topic.canonicalSlug) : false;

  return (
    <main className="placeholder-root">
      <div className="placeholder-page">
        <nav className="placeholder-nav">
          <Link href="/">All modules</Link>
          <span className="placeholder-nav-brand">Deep Learning</span>
          <Link href={moduleHref}>Back to module</Link>
        </nav>

        <div className="placeholder-main">
          <div className={`placeholder-shell${hasTeachingNotes ? " has-teaching-notes" : ""}`}>
            <section className="placeholder-panel">
              <div className="placeholder-badge">
                {hasTeachingNotes ? "Prototype pending" : "PAGE 3 placeholder"}
              </div>
              <h1 className="placeholder-title">
                <span>{topicTitle}</span>{" "}
                {hasTeachingNotes ? "still needs its interactive prototype." : "is not built yet."}
              </h1>
              <p className="placeholder-desc">
                {hasTeachingNotes
                  ? "The interactive version of this lesson is still being integrated. The finalized teaching notes are already available below so the topic can stay useful without changing the current routing structure."
                  : "PAGE 1 and PAGE 2 are now running inside the Next.js app. The individual teaching pages for each topic are reserved for future implementation, so this placeholder keeps topic navigation safe and future-ready."}
              </p>
              <div className="placeholder-meta">
                <span className="placeholder-pill">
                  {topic?.optional ? "Optional topic" : topic ? `Module ${topic.moduleId}` : "Module"}
                </span>
                <span className="placeholder-pill">
                  {topic ? `Topic ${topic.topicIndex}` : "Topic placeholder"}
                </span>
              </div>
              <div className="placeholder-actions">
                <Link className="placeholder-btn-primary" href={moduleHref}>
                  Return to module
                </Link>
                <Link className="placeholder-btn-secondary" href="/">
                  Return to homepage
                </Link>
              </div>
            </section>
          </div>

          {topic ? <TopicTeachingNotes topic={topic} hasPrototype={false} /> : null}
        </div>

        <div className="placeholder-footer">
          {hasTeachingNotes
            ? "Interactive prototype pending - Structured teaching notes are already live below"
            : "Placeholder only - Topic teaching pages will be integrated as PAGE 3 later"}
        </div>
      </div>
    </main>
  );
}
