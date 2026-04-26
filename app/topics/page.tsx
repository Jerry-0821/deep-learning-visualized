import Link from "next/link";
import type { Metadata } from "next";
import { topics } from "@/data/topics";

export const metadata: Metadata = {
  title: "All Topics | Deep Learning",
  description: "Browse every topic in the Deep Learning Visualized curriculum.",
};

export default function TopicsPage() {
  return (
    <main id="all_topics_root">
      <div className="page">
        <nav className="nav">
          <Link className="nav-back" href="/">
            All modules
          </Link>
          <span className="nav-brand">Deep Learning</span>
          <span className="nav-status">{topics.length} syllabus topics</span>
        </nav>

        <section className="topics-hero">
          <div className="topics-badge">Full topic index</div>
          <h1 className="topics-title">All deep learning topics.</h1>
          <p className="topics-desc">
            A direct index of every individual lesson in the curriculum, arranged as clean topic
            blocks so you can jump into any page without going module by module.
          </p>
        </section>

        <section className="topics-list" aria-label="All deep learning topics">
          {topics.map((topic, index) => {
            const tone = index % 2 === 0 ? "black" : "blue";

            return (
              <Link
                key={topic.slug}
                className={`topic-index-block ${tone}`}
                href={`/topic/${topic.slug}`}
                aria-label={`Open ${topic.title}`}
              >
                <div className="topic-index-meta">
                  <span>Module {topic.moduleId}</span>
                  <span>Topic {String(topic.topicIndex).padStart(2, "0")}</span>
                  <span>{topic.tag}</span>
                </div>
                <div className="topic-index-main">
                  <h2>{topic.title}</h2>
                  <p>{topic.subtitle}</p>
                </div>
                <div className="topic-index-footer">
                  <span>{topic.moduleTitle}</span>
                  <span className="topic-index-arrow">View topic</span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
