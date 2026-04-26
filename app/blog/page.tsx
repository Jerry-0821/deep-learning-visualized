import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog | Deep Learning",
  description: "Browse supporting deep learning explanation topics.",
};

export default function BlogPage() {
  return (
    <main id="all_topics_root">
      <div className="page">
        <nav className="nav">
          <Link className="nav-back" href="/">
            All modules
          </Link>
          <span className="nav-brand">Deep Learning Blog</span>
          <span className="nav-status">{blogPosts.length} topics</span>
        </nav>

        <section className="topics-hero">
          <div className="topics-badge">Blog index</div>
          <h1 className="topics-title">Deep learning notes.</h1>
          <p className="topics-desc">
            Supporting explanation topics for concepts that need a little more written intuition
            around the visual lessons.
          </p>
        </section>

        <section className="topics-list" aria-label="Deep learning blog topics">
          {blogPosts.map((topic, index) => {
            const tone = index % 2 === 0 ? "black" : "blue";

            return (
              <Link
                key={topic.slug}
                className={`topic-index-block ${tone}`}
                href={`/blog/${topic.slug}`}
                aria-label={`Open ${topic.title}`}
              >
                <div className="topic-index-meta">
                  <span>Blog</span>
                  <span>Topic {String(index + 1).padStart(2, "0")}</span>
                  <span>{topic.tag}</span>
                </div>
                <div className="topic-index-main">
                  <h2>{topic.title}</h2>
                  <p>{topic.description}</p>
                </div>
                <div className="topic-index-footer">
                  <span>Deep Learning Notes</span>
                  <span className="topic-index-arrow">{topic.status === "ready" ? "Read note" : "Draft page"}</span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
