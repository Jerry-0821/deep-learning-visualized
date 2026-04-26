import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MathJaxRefresh } from "@/components/blog/MathJaxRefresh";
import { blogPosts, blogPostsBySlug } from "@/data/blogPosts";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];

  return {
    title: post ? `${post.title} | Deep Learning Blog` : "Blog | Deep Learning",
    description: post?.description ?? "Deep learning blog note.",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-post-root">
      <Script id="blog-mathjax-config" strategy="beforeInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['\\\\(', '\\\\)']],
              displayMath: [['\\\\[', '\\\\]']]
            },
            svg: { fontCache: 'global' }
          };
        `}
      </Script>
      <Script
        id="blog-mathjax"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
      />
      <MathJaxRefresh />
      <div className="blog-post-page">
        <nav className="blog-post-nav">
          <Link href="/blog">All blog topics</Link>
          <span className="blog-post-brand">Deep Learning Blog</span>
          <Link href="/">All modules</Link>
        </nav>

        <article className="blog-post-shell">
          <header className="blog-post-header">
            <div className="blog-post-badge">{post.tag}</div>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </header>

          {post.blocks.length > 0 ? (
            <div className="blog-post-blocks">
              {post.blocks.map((block, index) => {
                if (block.type === "image") {
                  return (
                    <figure
                      key={`${block.type}-${index}`}
                      className={`blog-image-card ${block.size === "wide" ? "blog-image-wide" : ""}`}
                    >
                      <img src={block.src} alt={block.alt} />
                      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                    </figure>
                  );
                }

                if (block.type === "formula") {
                  return (
                    <section key={`${block.type}-${index}`} className="blog-content-card">
                      {block.heading ? <h2>{block.heading}</h2> : null}
                      <div className="blog-formula-list">
                        {block.formulas.map((formula) => (
                          <div key={formula.expression} className="blog-formula-card">
                            <div className="blog-formula-expression">{`\\[${formula.expression}\\]`}</div>
                            {formula.note ? <p>{formula.note}</p> : null}
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                }

                if (block.type === "list") {
                  return (
                    <section key={`${block.type}-${index}`} className="blog-content-card">
                      <h2>{block.heading}</h2>
                      <ol className={block.tone === "muted" ? "blog-list-muted" : ""}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </section>
                  );
                }

                if (block.type === "table") {
                  return (
                    <section key={`${block.type}-${index}`} className="blog-content-card">
                      <h2>{block.heading}</h2>
                      <div className="blog-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>{block.columns[0]}</th>
                              <th>{block.columns[1]}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row) => (
                              <tr key={row.join("-")}>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  );
                }

                return (
                  <section key={`${block.type}-${index}`} className="blog-content-card">
                    {block.heading ? <h2>{block.heading}</h2> : null}
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                );
              })}
            </div>
          ) : (
            <section className="blog-content-card blog-draft-card">
              <div className="blog-content-eyebrow">Draft page</div>
              <h2>Content layout is ready.</h2>
              <p>
                This topic already has its own page. When the final text and images are ready, add
                them as ordered content blocks in the blog post data file.
              </p>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
