import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Deep Learning Visualized",
  description:
    "Learn what Deep Learning Visualized is, why it exists, and how it supports visual deep learning intuition.",
};

const sections = [
  {
    title: "Why This Website Exists",
    paragraphs: [
      "Many beginners struggle not because they are unwilling to learn deep learning, but because the internal flow of a model is often hard to imagine. A diagram may show a neural network as a few circles and arrows, but it may not show what actually happens inside each step.",
      "For example, a single neuron is not only a node. It takes inputs, applies weights, adds bias, passes through an activation function, and produces an output. Backpropagation is not only a formula. It is a backward flow of gradients used to update parameters. Convolution is not only a filter. It is a sliding operation that detects local patterns.",
      "Deep Learning Visualized focuses on making these processes visible.",
    ],
  },
  {
    title: "What This Site Focuses On",
    paragraphs: [
      "This site is designed around visual intuition first.",
      "Each topic aims to show how a deep learning concept works through step-by-step visual explanations, interactive animations, clear data-flow diagrams, beginner-friendly formulas, parameter intuition, and practical examples.",
      "The goal is to help learners build a mental picture of what is happening inside a model before going deeper into advanced mathematics or research-level theory.",
    ],
  },
  {
    title: "What You Can Explore",
    paragraphs: [
      "The website covers important deep learning topics such as single neurons, activation functions, forward propagation, backpropagation, gradient descent, loss functions, dropout, batch normalization, convolution, pooling, feature maps, RNNs, LSTMs, attention, Transformer components, and practical model diagnosis ideas.",
      "Each topic is treated as a focused visual explanation. Instead of trying to explain everything at once, the site breaks deep learning into smaller concepts that are easier to explore, compare, and understand.",
    ],
  },
  {
    title: "What This Site Is Not",
    paragraphs: [
      "Deep Learning Visualized is not meant to replace a complete deep learning course, textbook, or rigorous mathematical study.",
      "It does not aim to cover every proof, derivation, implementation detail, or advanced research topic. If you want full mathematical depth, you should still study a structured deep learning course and work through proper exercises.",
      "This site is meant to support that learning process. It helps you understand the intuition, the flow, and the purpose behind each concept, so that formal materials become easier to follow later.",
    ],
  },
  {
    title: "Who This Is For",
    paragraphs: [
      "This site is for beginners who want to understand deep learning more visually.",
      "It is especially useful if you have ever looked at a formula, diagram, or neural network architecture and thought:",
      '"What is actually moving through this model?"',
      '"What happens at each step?"',
      '"Why does this component exist?"',
      '"How do the pieces connect together?"',
      "Deep Learning Visualized is built to answer those questions visually.",
    ],
  },
  {
    title: "A Visual Companion for Deep Learning",
    paragraphs: [
      "The purpose of this website is simple: to make deep learning feel less abstract.",
      "By combining clean explanations with interactive visualizations, Deep Learning Visualized helps learners see the system behind the concept, not just memorize the name of the concept.",
      "Start with the curriculum, explore one topic at a time, and build your intuition step by step.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="about-page-root">
      <div className="about-page">
        <nav className="blog-post-nav">
          <Link href="/">Curriculum</Link>
          <span className="blog-post-brand">Deep Learning Visualized</span>
          <Link href="/topics">Topics</Link>
        </nav>

        <article className="about-article">
          <header className="about-header">
            <h1>About Deep Learning Visualized</h1>
            <p>
              Deep Learning Visualized is a visual learning library for beginners who want to
              understand deep learning through clear diagrams, interactive animations, and
              step-by-step explanations.
            </p>
            <p>
              Deep learning can be difficult to understand when it is explained only through
              formulas, static diagrams, or long theoretical descriptions. Many important concepts
              are not just definitions. They are processes. Data moves through layers. Signals are
              transformed. Gradients flow backward. Parameters change. Representations become more
              abstract step by step.
            </p>
            <p>This website is built to make those hidden processes easier to see.</p>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="about-section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <div className="about-cta-row">
            <Link className="about-cta" href="/#modules">
              Explore the curriculum →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
