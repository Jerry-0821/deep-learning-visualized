import Link from "next/link";
import { LandingArrowIcon } from "@/components/icons";
import { modules } from "@/data/modules";

export function LandingPage() {
  return (
    <main id="apple_dl_root">
      <div className="page">
        <nav className="nav">
          <div className="nav_brand">Deep Learning Visualized</div>
          <div className="nav_links">
            <a className="nav_link" href="#modules">
              Curriculum
            </a>
            <Link className="nav_link" href="/topics">
              Topics
            </Link>
            <Link className="nav_link" href="/blog">
              Blog
            </Link>
            <Link className="nav_link" href="/about">
              About
            </Link>
          </div>
          <a className="nav_cta" href="#modules">
            Start learning →
          </a>
        </nav>

        <section className="hero">
          <div className="hero_chip">
            <span className="hero_chip_dot"></span>
            3 Learning Groups · 18 Visual Topics
          </div>

          <h1 className="hero_title">
            Learn deep learning.
            <br />
            <span className="accent">Understand the system behind it.</span>
          </h1>

          <p className="hero_sub">
            A refined visual learning space for deep learning concepts — calm, structured, and
            easy to explore, with a clear path from fundamentals to modern architectures.
          </p>

          <div className="hero_actions">
            <a className="btn_primary" href="#modules">
              Start for free
            </a>
            <a className="btn_secondary" href="#modules">
              View curriculum
            </a>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat_num">18</div>
              <div className="stat_label">Visual topics</div>
            </div>
            <div className="stat">
              <div className="stat_num">3</div>
              <div className="stat_label">Core groups</div>
            </div>
            <div className="stat">
              <div className="stat_num">60+</div>
              <div className="stat_label">Visual animations</div>
            </div>
            <div className="stat">
              <div className="stat_num">0</div>
              <div className="stat_label">Required prerequisites</div>
            </div>
          </div>
        </section>

        <section className="section_intro">
          <div className="section_label">Course groups</div>
          <h2 className="section_title">
            The most important deep learning topics, arranged as one elegant learning path.
          </h2>
          <p className="section_sub">
            From neurons and activations to optimization, CNNs, and sequence models, each group is
            presented like a premium content card instead of a crowded dashboard block.
          </p>
        </section>

        <section className="bento_wrap" id="modules">
          <div className="bento">
            {modules.map((module) => (
              <Link
                key={module.id}
                className="card-link"
                href={`/module/${module.id}`}
                aria-label={`Open ${module.fullTitle}`}
              >
                <div
                  className={[
                    "card",
                    module.landing.cardClassName,
                    module.landing.wide ? "wide" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {module.landing.wide ? (
                    <div className="wide_inner">
                      <div>
                        <div className="card_top landing-card-top-tight">
                          <div className="card_num">{module.badge}</div>
                          {module.landing.icon}
                        </div>
                        <h3 className="card_title">{module.landing.title}</h3>
                        <p className="card_sub">{module.landing.description}</p>
                        <div className="topics">
                          {module.topics.map((topic) => (
                            <span key={topic.slug} className="topic">
                              {topic.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mini_stack">
                        {module.landing.panels?.map((panel) => (
                          <div key={panel.label} className="mini_panel">
                            <div className="mini_label">{panel.label}</div>
                            <div className="mini_text">{panel.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card_top">
                        <div className="card_num">{module.badge}</div>
                        {module.landing.icon}
                      </div>
                      <h3 className="card_title">{module.landing.title}</h3>
                      <p className="card_sub">{module.landing.description}</p>
                      <div className="topics">
                        {module.topics.map((topic) => (
                          <span key={topic.slug} className="topic">
                            {topic.title}
                          </span>
                        ))}
                      </div>
                      {(module.landing.cardClassName === "black" || module.landing.cardClassName === "blue") && (
                        <div className="card_glow"></div>
                      )}
                    </>
                  )}
                </div>
              </Link>
            ))}
            <Link className="card-link" href="/blog" aria-label="Open Visual Notes on Deep Learning">
              <div className="card notes-card">
                <div className="card_top">
                  <div className="card_num">Notes</div>
                  <LandingArrowIcon />
                </div>
                <h3 className="card_title">Visual Notes on Deep Learning</h3>
                <p className="card_sub">
                  Read focused written explanations for concepts that need extra intuition beside
                  the interactive lessons.
                </p>
                <div className="topics">
                  <span className="topic">Batch Normalization</span>
                  <span className="topic">Residual Blocks</span>
                  <span className="topic">Attention</span>
                  <span className="topic">Transfer Learning</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="principles" id="about">
          <div className="principle">
            <div className="principle_num">01</div>
            <h3 className="principle_title">Simple at first glance.</h3>
            <p className="principle_text">
              The page removes the dashboard feeling and replaces it with fewer, stronger visual
              blocks.
            </p>
          </div>

          <div className="principle">
            <div className="principle_num">02</div>
            <h3 className="principle_title">Elegant typography.</h3>
            <p className="principle_text">
              Large headlines, quieter body text, and stronger spacing create a more premium
              learning identity.
            </p>
          </div>

          <div className="principle">
            <div className="principle_num">03</div>
            <h3 className="principle_title">Deep learning focused.</h3>
            <p className="principle_text">
              Every card is tied to a real deep learning topic, so the style supports your
              curriculum instead of distracting from it.
            </p>
          </div>
        </section>

        <div className="footer">
          Designed for clarity · Deep learning topics · Interactive animations · Self-paced
        </div>
      </div>
    </main>
  );
}
