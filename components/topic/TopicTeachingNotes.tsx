import type { TopicLookup } from "@/data/topics";
import { getTopicTeachingContent } from "@/data/topicTeachingContent";

type TopicTeachingNotesProps = {
  topic: TopicLookup;
  hasPrototype: boolean;
};

export function TopicTeachingNotes({ topic, hasPrototype }: TopicTeachingNotesProps) {
  const content = getTopicTeachingContent(topic.canonicalSlug);

  if (!content) {
    return null;
  }

  return (
    <section className="topic-notes-section" aria-labelledby={`topic-notes-title-${topic.slug}`}>
      <div className="topic-notes-header">
        <div className="topic-notes-badge">
          {hasPrototype ? "Structured teaching notes" : "Teaching notes available"}
        </div>
        <h2 className="topic-notes-title" id={`topic-notes-title-${topic.slug}`}>
          {hasPrototype ? "Connect the interaction to the core idea." : "The explanation is ready while the prototype is pending."}
        </h2>
        <p className="topic-notes-subtitle">
          {hasPrototype
            ? "These notes are written to sit below the interactive prototype, preserve the same teaching flow, and help the learner name what the visualization is showing."
            : "This topic already has finalized teaching notes integrated into the site, even though the interactive prototype has not been connected yet."}
        </p>
      </div>

      <div className="topic-notes-layout">
        <article className="topic-note-card topic-note-card-wide">
          <div className="topic-note-kicker">Background</div>
          <div className="topic-note-prose">
            {content.background.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="topic-note-card topic-note-card-wide">
          <div className="topic-note-kicker">Important formulas</div>
          <div className="topic-formula-grid">
            {content.formulas.map((formula) => (
              <div key={`${topic.slug}-${formula.expression}`} className="topic-formula-card">
                <div
                  className={[
                    "topic-formula-display",
                    formula.tone === "statement" ? "topic-formula-display-statement" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  dangerouslySetInnerHTML={{ __html: formula.expression }}
                />
                <p className="topic-formula-explanation">{formula.explanation}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="topic-note-card">
          <div className="topic-note-kicker">Pros</div>
          <ul className="topic-note-list">
            {content.pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="topic-note-card">
          <div className="topic-note-kicker">Cons</div>
          <ul className="topic-note-list topic-note-list-muted">
            {content.cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="topic-note-card">
          <div className="topic-note-kicker">Quick example</div>
          <p className="topic-callout topic-callout-example">{content.quickExample}</p>
        </article>

        <article className="topic-note-card">
          <div className="topic-note-kicker">Common mistake</div>
          <p className="topic-callout topic-callout-mistake">{content.commonMistake}</p>
        </article>
      </div>
    </section>
  );
}
