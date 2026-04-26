import Link from "next/link";
import { PrototypeFrame } from "@/components/topic/PrototypeFrame";
import { TopicTeachingNotes } from "@/components/topic/TopicTeachingNotes";
import type { TopicLookup } from "@/data/topics";
import type { PrototypeMapping } from "@/data/prototypeMappings";

export function EmbeddedPrototypePage({
  topic,
  prototype,
}: {
  topic: TopicLookup;
  prototype: PrototypeMapping;
}) {
  const displayTitle = topic.pageTitle ?? topic.title;

  return (
    <main className="prototype-route-root">
      <div className="prototype-route-page">
        <nav className="prototype-route-nav">
          <Link href="/">All modules</Link>
          <span className="prototype-route-brand">Deep Learning</span>
          <Link href={topic.moduleHref}>Back to module</Link>
        </nav>

        <div className="prototype-route-shell">
          <div className="prototype-route-header">
            <div className="prototype-route-badge">Interactive prototype</div>
            <h1 className="prototype-route-title">{displayTitle}</h1>
            <p className="prototype-route-desc">{topic.subtitle}</p>
            <div className="prototype-route-actions">
              <Link className="prototype-route-btn-secondary" href={topic.moduleHref}>
                Return to module
              </Link>
              <a
                className="prototype-route-btn-primary"
                href={prototype.publicPath}
                target="_blank"
                rel="noreferrer"
              >
                Open prototype only
              </a>
            </div>
          </div>

          <div className="prototype-frame-wrap">
            <PrototypeFrame
              src={prototype.publicPath}
              title={topic.title}
              fallbackHeight={prototype.iframeHeight}
            />
          </div>

          <TopicTeachingNotes topic={topic} hasPrototype />
        </div>
      </div>
    </main>
  );
}
