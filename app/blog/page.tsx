import Link from "next/link";
import type { Metadata } from "next";
import { EditionBackdrop, EditionFooter, EditionNav } from "@/components/edition/EditionChrome";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog | Deep Learning Visualized",
  description: "Conceptual visual essays and deep dives into modern deep learning mechanisms.",
};

export default function BlogPage() {
  return (
    <main className="edition-root edition-blog">
      <EditionBackdrop />
      <EditionNav active="blog" />
      <div className="edition-stage">
        <header className="edition-blog-hero">
          <div className="edition-hero-chip">
            <span className="edition-chip-dot edition-chip-purple" />
            Visual notes
          </div>
          <h1>
            The deep learning
            <br />
            <span className="edition-serif">blog.</span>
          </h1>
          <p>
            Conceptual visual essays, tutorials, and deep dives into the mechanisms that make
            modern AI easier to understand.
          </p>
        </header>

        <section className="edition-blog-grid" aria-label="Deep learning blog topics">
          {blogPosts.map((post, index) => {
            const tone = (index % 3) + 1;
            const coverImage = post.coverImage ?? `/edition-art/blog-${post.slug}.svg`;

            return (
              <Link key={post.slug} className={`edition-topic-card edition-mod-${tone}`} href={`/blog/${post.slug}`}>
                <div className="edition-card-stripe" />
                <div className="edition-card-art">
                  <img src={coverImage} alt="" aria-hidden="true" />
                </div>
                <div className="edition-card-body">
                  <div className="edition-card-meta">
                    <span className="edition-card-badge">Deep Dive</span>
                    <span className="edition-card-category">{post.tag}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <span className="edition-card-action">
                    Read note <b>{"\u2192"}</b>
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
      <EditionFooter />
    </main>
  );
}
