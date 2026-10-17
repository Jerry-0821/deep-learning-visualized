import Link from "next/link";
import { topics, type TopicLookup } from "@/data/topics";

// Slim site bar above a full-page lesson iframe. It only links around the site;
// the lesson itself is untouched.
export function TopicRouteBar({ topic }: { topic: TopicLookup }) {
  const index = topics.findIndex((item) => item.slug === topic.canonicalSlug);
  const previous = index > 0 ? topics[index - 1] : undefined;
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined;

  return (
    <nav className="topic-route-bar" aria-label="Lesson navigation">
      <Link className="topic-route-bar-back" href={topic.moduleHref}>
        <span aria-hidden="true">{"←"}</span> All topics
      </Link>
      <div className="topic-route-bar-context">
        <span>Module {topic.moduleId.padStart(2, "0")}</span>
        <strong>{topic.pageTitle ?? topic.title}</strong>
      </div>
      <div className="topic-route-bar-steps">
        {previous ? (
          <Link href={`/topic/${previous.slug}`} title={previous.pageTitle ?? previous.title}>
            <span aria-hidden="true">{"←"}</span> <span className="topic-route-bar-step-label">Previous</span>
          </Link>
        ) : null}
        {next ? (
          <Link href={`/topic/${next.slug}`} title={next.pageTitle ?? next.title}>
            <span className="topic-route-bar-step-label">Next</span> <span aria-hidden="true">{"→"}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
