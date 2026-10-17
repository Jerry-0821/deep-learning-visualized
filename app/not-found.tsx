import Link from "next/link";
import { EditionBackdrop, EditionFooter, EditionNav } from "@/components/edition/EditionChrome";
import { topicsBySlug } from "@/data/topics";

// A few good places to continue from a broken or old link.
const suggestedLessons = ["attention-mechanism-intuition", "pooling", "backpropagation-intuition"]
  .map((slug) => topicsBySlug[slug])
  .filter(Boolean);

const places = [
  { href: "/topics", title: "All topics", text: "Browse the 18 interactive lessons by module." },
  { href: "/formula-hub", title: "Formula Hub", text: "Search formulas, symbols and tensor shapes." },
  { href: "/blog", title: "Blog", text: "Visual essays on modern deep learning." },
];

export default function NotFoundPage() {
  return (
    <main className="edition-root not-found-root">
      <EditionBackdrop />
      <EditionNav />
      <section className="not-found">
        <div className="not-found-code" aria-hidden="true">404</div>
        <p className="not-found-eyebrow">Page not found</p>
        <h1>
          This page <span className="edition-serif">doesn&rsquo;t exist.</span>
        </h1>
        <p className="not-found-lede">
          The link may be old, or the address may have a typo. Here are some good places to continue learning.
        </p>
        <div className="not-found-actions">
          <Link className="edition-button-primary" href="/">
            Back to the curriculum {"→"}
          </Link>
          <Link className="edition-button-secondary" href="/topics">
            Browse all topics
          </Link>
        </div>

        <div className="not-found-grid">
          {places.map((place) => (
            <Link key={place.href} className="not-found-card" href={place.href}>
              <strong>{place.title}</strong>
              <span>{place.text}</span>
            </Link>
          ))}
        </div>

        {suggestedLessons.length ? (
          <div className="not-found-lessons">
            <p className="not-found-eyebrow">Popular lessons</p>
            <div className="not-found-lesson-row">
              {suggestedLessons.map((topic) => (
                <Link key={topic.slug} className="not-found-lesson" href={`/topic/${topic.slug}`}>
                  <span>Module {topic.moduleId.padStart(2, "0")}</span>
                  {topic.pageTitle ?? topic.title} {"→"}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
      <EditionFooter />
    </main>
  );
}
