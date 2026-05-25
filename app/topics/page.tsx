import Link from "next/link";
import type { Metadata } from "next";
import { EditionBackdrop, EditionFooter, EditionNav } from "@/components/edition/EditionChrome";
import { modules } from "@/data/modules";

export const metadata: Metadata = {
  title: "Topics | Deep Learning Visualized",
  description: "Explore 18 visual, interactive deep learning topics.",
};

export default function TopicsPage() {
  return (
    <main className="edition-root edition-catalog">
      <EditionBackdrop />
      <EditionNav active="topics" />
      <div className="edition-stage">
        <header className="edition-catalog-hero">
          <h1>
            Interactive <span className="edition-serif">Catalog.</span>
          </h1>
          <p>
            Explore all 18 topics through visual, interactive lessons. See the inner workings of
            deep learning concepts up close.
          </p>
        </header>

        <div className="edition-catalog-layout">
          <aside className="edition-sidebar" aria-label="Topic modules">
            <div className="edition-sidebar-title">Modules</div>
            {modules.map((module) => (
              <a key={module.id} className={`edition-sidebar-link edition-mod-${module.id}`} href={`#mod-${module.id}`}>
                <span />
                {module.id === "1" ? "Foundations" : module.id === "2" ? "Vision & Seq" : "Toolkit"}
              </a>
            ))}
          </aside>

          <div className="edition-module-list">
            {modules.map((module) => (
              <section key={module.id} id={`mod-${module.id}`} className={`edition-module edition-mod-${module.id}`}>
                <header className="edition-module-header">
                  <span>0{module.id}</span>
                  <h2>{module.fullTitle}</h2>
                </header>
                <div className="edition-card-grid">
                  {module.topics.map((topic) => (
                    <Link key={topic.slug} className="edition-topic-card" href={`/topic/${topic.slug}`}>
                      <div className="edition-card-stripe" />
                      <div className="edition-card-art">
                        <img src={`/edition-art/topic-${topic.slug}.svg`} alt="" aria-hidden="true" />
                      </div>
                      <div className="edition-card-body">
                        <div className="edition-card-meta">
                          <span className="edition-card-badge">Mod {module.id}</span>
                          <span className="edition-card-category">{topic.tag}</span>
                        </div>
                        <h3>{topic.title}</h3>
                        <p>{topic.subtitle}</p>
                        <span className="edition-card-action">
                          Explore topic <b>{"\u2192"}</b>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <EditionFooter />
    </main>
  );
}
