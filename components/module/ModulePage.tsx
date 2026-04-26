import Link from "next/link";
import { TopicIcon } from "@/components/icons";
import type { ModuleData } from "@/data/modules";

export function ModulePage({ module }: { module: ModuleData }) {
  return (
    <main id="module_topics_root">
      <div className="page">
        <nav className="nav">
          <Link className="nav-back" href="/">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
            All modules
          </Link>
          <span className="nav-brand">Deep Learning</span>
          <span className="nav-status">Group {module.id} of 3</span>
        </nav>

        <div className="module-hero">
          <div className="hero-shell">
            <div>
              <div className="module-badge">{module.badge}</div>
              <h1 className="module-title">
                {module.title} <span>{module.titleAccent}</span>
              </h1>
              <p className="module-desc">{module.description}</p>

              <div className="module-meta">
                <div className="meta-item">
                  <span>{module.topics.length}</span> topics
                </div>
                <div className="meta-item">
                  <span>{module.estimated}</span> estimated
                </div>
                <div className="meta-item">
                  <span>{module.completed}</span> completed
                </div>
              </div>

              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: module.progressWidth ?? "0%" }}></div>
              </div>
            </div>

            <div className="hero-panel">
              <div className="hero-panel-label">{module.heroPanelLabel}</div>
              <div className="hero-panel-title">{module.heroPanelTitle}</div>

              <div className="hero-points">
                {module.heroPoints.map((point) => (
                  <div key={point.title} className="hero-point">
                    <div className="hero-dot"></div>
                    <div>
                      <strong>{point.title}</strong>
                      <span>{point.body}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="topics-section">
          <div className="topics-shell">
            <div className="section-label">Topics</div>

            <div className="topics-grid">
              {module.topics.map((topic) => {
                const card = (
                  <div
                    className={[
                      "topic-card",
                      topic.featured ? "featured" : "",
                      topic.wide ? "wide split" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {topic.wide && topic.preview ? (
                      <div className="topic-layout">
                        <div>
                          <div className="topic-num">{topic.numberLabel}</div>
                          <div className="topic-icon">
                            <TopicIcon path={topic.icon} />
                          </div>
                          <div className="topic-title">{topic.title}</div>
                          <div className="topic-sub">{topic.subtitle}</div>
                          <div className="topic-footer">
                            <span className="topic-tag">{topic.tag}</span>
                            <span className="topic-arrow">→</span>
                          </div>
                        </div>

                        <div className="mini-preview">
                          <div className="preview-box">
                            <div className="preview-label">{topic.preview.leftLabel}</div>
                            <div className="preview-value">{topic.preview.leftValue}</div>
                            <div className="preview-sub">{topic.preview.leftSub}</div>
                          </div>
                          <div className="preview-box">
                            <div className="preview-label">{topic.preview.rightLabel}</div>
                            <div className="preview-value">{topic.preview.rightValue}</div>
                            <div className="preview-sub">{topic.preview.rightSub}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="topic-num">{topic.numberLabel}</div>
                        <div className="topic-icon">
                          <TopicIcon path={topic.icon} />
                        </div>
                        <div className="topic-title">{topic.title}</div>
                        <div className="topic-sub">{topic.subtitle}</div>
                        <div className="topic-footer">
                          <span className="topic-tag">{topic.tag}</span>
                          <span className="topic-arrow">→</span>
                        </div>
                      </>
                    )}
                  </div>
                );

                return (
                  <Link
                    key={topic.slug}
                    className="topic-link"
                    href={`/topic/${topic.slug}`}
                    title="Topic teaching page placeholder"
                  >
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-strip">{module.footerStrip}</div>
      </div>
    </main>
  );
}
