import Link from "next/link";
import { EditionBackdrop, EditionFooter, EditionNav } from "@/components/edition/EditionChrome";
import { modules } from "@/data/modules";

const featureCards = [
  {
    title: "Simple at first glance.",
    text: "Fewer, stronger visual blocks guide your eye naturally without dashboard clutter.",
  },
  {
    title: "Elegant typography.",
    text: "Large headlines, quieter body text, and deliberate spacing create a clearer learning identity.",
  },
  {
    title: "Deep learning focused.",
    text: "Every visual is tied to a real topic, so style supports the substance behind it.",
  },
];

export function LandingPage() {
  return (
    <main className="edition-root edition-home">
      <EditionBackdrop />
      <EditionNav active="home" />
      <div className="edition-stage">
        <section className="edition-home-hero" aria-labelledby="edition-home-title">
          <div className="edition-hero-chip">
            <span className="edition-chip-dot" />
            3 learning groups / 18 visual topics
          </div>
          <h1 id="edition-home-title" className="edition-home-title">
            Learn deep learning.
            <br />
            <span>Understand the system behind it.</span>
          </h1>
          <p className="edition-home-subtitle">
            A refined visual learning space for deep learning concepts - calm, structured, and
            easy to explore, with a clear path from fundamentals to modern architectures.
          </p>
          <div className="edition-home-actions">
            <a className="edition-button-primary" href="#modules">
              Start for free
            </a>
            <Link className="edition-button-secondary" href="/topics">
              Browse all topics
            </Link>
          </div>
          <div className="edition-stats" aria-label="Library summary">
            <div>
              <strong>18</strong>
              <span>Visual topics</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Core groups</span>
            </div>
            <div>
              <strong>8</strong>
              <span>Visual notes</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Prerequisites</span>
            </div>
          </div>
        </section>

        <section className="edition-intro">
          <div className="edition-section-label">Course groups</div>
          <h2>
            The most important deep learning topics, arranged as one{" "}
            <span className="edition-serif">elegant</span> learning path.
          </h2>
          <p>
            Start with core training intuition, move through vision and sequence models, then
            sharpen practical diagnosis skills.
          </p>
        </section>

        <section id="modules" className="edition-curriculum" aria-label="Course modules">
          {modules.map((module) => (
            <article key={module.id} className={`edition-map edition-mod-${module.id}`}>
              <div className="edition-map-summary">
                <div className="edition-map-stripe" />
                <div className="edition-map-label">{module.badge}</div>
                <h3>{module.fullTitle}</h3>
                <img
                  className="edition-map-art"
                  src={`/edition-art/home-module-${module.id}.svg`}
                  alt=""
                  aria-hidden="true"
                />
                <p>{module.landing.description}</p>
              </div>
              <div className="edition-node-list">
                {module.topics.map((topic) => (
                  <Link key={topic.slug} className="edition-node" href={`/topic/${topic.slug}`}>
                    <span>{topic.title}</span>
                    <span className="edition-node-arrow">{"\u2192"}</span>
                  </Link>
                ))}
                <Link className="edition-map-view-all" href={`/topics#mod-${module.id}`}>
                  View all {module.topics.length} topics <span>{"\u2192"}</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="edition-notes-banner" aria-label="Visual notes">
          <Link className="edition-notes-inner" href="/blog">
            <div className="edition-notes-stripe" />
            <div className="edition-notes-copy">
              <div>Notes</div>
              <h3>Visual Notes on Deep Learning</h3>
              <p>Focused written explanations for ideas that need extra intuition beside the interactive lessons.</p>
            </div>
            <div className="edition-notes-tags">
              <span>Batch Normalization</span>
              <span>Residual Blocks</span>
              <span>Attention</span>
              <span>Transfer Learning</span>
            </div>
          </Link>
        </section>

        <section className="edition-features" aria-label="Why the library works">
          <div className="edition-intro edition-features-intro">
            <div className="edition-section-label">Why it works</div>
            <h2>
              Designed with one <span className="edition-serif">clear</span> intention.
            </h2>
          </div>
          <div className="edition-feature-grid">
            {featureCards.map((feature, index) => (
              <article key={feature.title} className="edition-feature-card">
                <div className="edition-feature-mark">{String(index + 1).padStart(2, "0")}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <EditionFooter />
    </main>
  );
}
