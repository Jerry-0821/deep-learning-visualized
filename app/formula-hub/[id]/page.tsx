import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { MathJaxRefresh } from "@/components/blog/MathJaxRefresh";
import { EditionBackdrop, EditionNav } from "@/components/edition/EditionChrome";
import {
  formulaHubEntryAliasesById,
  formulaHubEntries,
  formulaHubEntriesById,
  getFormulaBlogLinks,
  getFormulaRelationGroups,
  getFormulaTopicLinks,
  type FormulaHubEntry,
} from "@/data/formulaHub";

type FormulaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return formulaHubEntries.map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: FormulaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = formulaHubEntriesById[id];

  return {
    title: entry ? `${entry.title} | Formula Hub` : "Formula Hub",
    description: entry?.description ?? "Deep learning formula reference.",
  };
}

function FormulaMath({ latex, display = false }: { latex: string; display?: boolean }) {
  return <span>{display ? `\\[${latex}\\]` : `\\(${latex}\\)`}</span>;
}

function hasMathSyntax(value: string) {
  return /[\\^_{}]/.test(value);
}

function FormulaShapeText({ value }: { value: string }) {
  const [label, ...details] = value.split(":");
  const detail = details.join(":").trim();
  const labelText = label.trim();

  if (!detail) {
    return hasMathSyntax(labelText) ? <FormulaMath latex={labelText} /> : <>{labelText}</>;
  }

  return (
    <>
      {hasMathSyntax(labelText) ? <FormulaMath latex={labelText} /> : labelText}
      <small>{hasMathSyntax(detail) ? <FormulaMath latex={detail} /> : detail}</small>
    </>
  );
}

function getCategoryUseHint(entry: FormulaHubEntry) {
  switch (entry.category) {
    case "Backpropagation":
      return "Use this when tracing how loss gradients move backward into activations, parameters, or cached forward values.";
    case "Optimization":
      return "Use this when deciding how a parameter update is computed from the current gradient and optimizer state.";
    case "Initialization":
      return "Use this before training starts, when parameter scale and symmetry breaking decide whether signals stay useful.";
    case "Regularization":
      return "Use this when the model fits training data too tightly and needs a constraint, penalty, or noise pattern.";
    case "CNN":
      return "Use this when reasoning about image tensors, spatial size changes, channels, kernels, and local feature extraction.";
    case "RNN / LSTM":
      return "Use this when a sequence model carries information through time steps or gates memory across a long sequence.";
    case "Transformer":
      return "Use this when tokens exchange information through attention scores, value mixing, residual paths, or normalization.";
    case "Evaluation":
      return "Use this when turning model behavior into a metric or diagnostic signal for comparison.";
    case "Practice":
      return "Use this as a practical training habit: it helps connect notation, data flow, and implementation checks.";
    case "Shapes & Dimensions":
      return "Use this as a shape sanity check before trusting a formula or implementation.";
    default:
      return "Use this as a foundation for reading the surrounding formula flow and checking each symbol's role.";
  }
}

function getCategoryMistakeHint(entry: FormulaHubEntry) {
  if (entry.shape?.explanation) {
    return `Do not skip the shape check: ${entry.shape.explanation}`;
  }

  switch (entry.category) {
    case "Backpropagation":
      return "A common mistake is multiplying gradients in the forward direction instead of following the reversed dependency path.";
    case "Optimization":
      return "A common mistake is treating the update rule as only algebra; the moving averages, bias correction, and learning rate each change behavior.";
    case "Initialization":
      return "A common mistake is making hidden weights identical, which can prevent hidden units from learning different features.";
    case "Regularization":
      return "A common mistake is applying the training-time rule unchanged at inference time; check whether scaling or running behavior changes.";
    case "CNN":
      return "A common mistake is losing track of padding, stride, and channel dimensions when moving from one layer to the next.";
    case "RNN / LSTM":
      return "A common mistake is mixing up hidden state, cell state, and output probability; they carry different information.";
    case "Transformer":
      return "A common mistake is confusing score shape with value shape; QK^T scores positions, while V carries the mixed content.";
    case "Evaluation":
      return "A common mistake is reading a metric without checking its denominator, threshold, or class imbalance context.";
    default:
      return "A common mistake is memorizing the expression without checking what each symbol represents in the surrounding computation.";
  }
}

function getFormulaStudyGuide(entry: FormulaHubEntry, relationGroups: ReturnType<typeof getFormulaRelationGroups>) {
  const stepCount = entry.steps?.length ?? 1;
  const firstStep = entry.steps?.[0]?.title;
  const lastStep = entry.steps?.[stepCount - 1]?.title;
  const pathRelations = relationGroups
    .flatMap((group) =>
      group.relations.map((relation) => ({
        href: `/formula-hub/${relation.targetId}`,
        label: relation.target.title,
        note: relation.label ?? group.label,
      })),
    )
    .slice(0, 5);

  return {
    why:
      stepCount > 1 && firstStep && lastStep
        ? `This entry is a ${stepCount}-step flow: it starts from ${firstStep} and ends at ${lastStep}. Read it as one connected computation, not as isolated formulas.`
        : `${entry.description} The main check is whether the symbols, shape, and use case all describe the same computation.`,
    when: getCategoryUseHint(entry),
    mistake: getCategoryMistakeHint(entry),
    path: pathRelations,
  };
}

function FormulaDetailPageBody({ entry }: { entry: FormulaHubEntry }) {
  const relatedEntries = entry.relatedFormulaIds.map((id) => formulaHubEntriesById[id]).filter(Boolean).slice(0, 6);
  const relationGroups = getFormulaRelationGroups(entry);
  const topicLinks = getFormulaTopicLinks(entry);
  const blogLinks = getFormulaBlogLinks(entry);
  const studyGuide = getFormulaStudyGuide(entry, relationGroups);

  return (
    <div className="formula-page-shell">
      <aside className="formula-page-rail" aria-label="Formula page navigation">
        <Link href="/formula-hub">All formulas</Link>
        <a href="#formula-overview">Overview</a>
        <a href="#formula-study-guide">Study guide</a>
        {entry.steps && entry.steps.length > 1 ? <a href="#formula-flow">Formula flow</a> : null}
        {entry.shape ? <a href="#formula-shape">Shape check</a> : null}
        <a href="#formula-symbols-detail">Symbols</a>
        {relationGroups.length > 0 ? <a href="#formula-connections">Connections</a> : null}
        {relatedEntries.length > 0 ? <a href="#formula-related">Related</a> : null}
      </aside>

      <article className="formula-page-article">
        <header className="formula-page-header" id="formula-overview">
          <Link className="formula-page-back" href="/formula-hub">
            {"\u2190"} Formula Hub
          </Link>
          <span>{entry.nodeLabel ? `${entry.nodeLabel} / ${entry.category}` : entry.category}</span>
          <h1>{entry.title}</h1>
          <div className="formula-page-expression">
            <FormulaMath latex={entry.latex} display />
          </div>
          <p>{entry.description}</p>
        </header>

        <section className="formula-page-section" id="formula-study-guide">
          <div className="formula-page-section-heading">
            <p>Study Guide</p>
            <span>Why / When / Mistake / Path</span>
          </div>
          <div className="formula-page-guide-grid">
            <article>
              <span>Why it matters</span>
              <p>{studyGuide.why}</p>
            </article>
            <article>
              <span>When to use</span>
              <p>{studyGuide.when}</p>
            </article>
            <article>
              <span>Common mistake</span>
              <p>{studyGuide.mistake}</p>
            </article>
          </div>
          {studyGuide.path.length > 0 ? (
            <div className="formula-page-path">
              <strong>Related path</strong>
              <div>
                {studyGuide.path.map((item) => (
                  <Link href={item.href} key={`${entry.id}-${item.href}`}>
                    <span>{item.label}</span>
                    <small>{item.note}</small>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {entry.steps && entry.steps.length > 1 ? (
          <section className="formula-page-section" id="formula-flow">
            <div className="formula-page-section-heading">
              <p>Formula Flow</p>
              <span>{entry.steps.length} steps</span>
            </div>
            <div className="formula-page-steps">
              {entry.steps.map((step, index) => (
                <div className="formula-page-step" key={`${entry.id}-${step.id}`}>
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step.title}</strong>
                  </div>
                  <div className="formula-page-step-expression">
                    <FormulaMath latex={step.latex} display />
                  </div>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {entry.shape ? (
          <section className="formula-page-section" id="formula-shape">
            <div className="formula-page-section-heading">
              <p>Shape Check</p>
              <span>{entry.shape.output ? <FormulaShapeText value={entry.shape.output} /> : "Concept"}</span>
            </div>
            <div className="formula-page-shape-flow">
              {(entry.shape.input ?? []).slice(0, 4).map((item) => (
                <span key={item}>
                  <FormulaShapeText value={item} />
                </span>
              ))}
              {entry.shape.output ? (
                <b>
                  <FormulaShapeText value={entry.shape.output} />
                </b>
              ) : null}
            </div>
            {entry.shape.explanation ? <p>{entry.shape.explanation}</p> : null}
          </section>
        ) : null}

        <section className="formula-page-section" id="formula-symbols-detail">
          <div className="formula-page-section-heading">
            <p>Symbols</p>
            <span>{entry.symbols.length} items</span>
          </div>
          <div className="formula-page-symbols">
            {entry.symbols.map((symbol) => (
              <div key={`${entry.id}-${symbol.symbol}`}>
                <span>
                  <FormulaMath latex={symbol.symbol} />
                </span>
                <p>
                  {symbol.meaning}
                  {symbol.shape ? (
                    <small>
                      <FormulaShapeText value={symbol.shape} />
                    </small>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>

        {relationGroups.length > 0 ? (
          <section className="formula-page-section" id="formula-connections">
            <div className="formula-page-section-heading">
              <p>Connection Map</p>
              <span>{relationGroups.reduce((total, group) => total + group.relations.length, 0)} links</span>
            </div>
            <div className="formula-page-connections">
              {relationGroups.map((group) => (
                <div className="formula-page-connection-group" key={`${entry.id}-${group.type}`}>
                  <h3>{group.label}</h3>
                  <div>
                    {group.relations.map((relation) => (
                      <Link key={`${entry.id}-${relation.type}-${relation.targetId}`} href={`/formula-hub/${relation.targetId}`}>
                        <span>{relation.target.title}</span>
                        {relation.label ? <small>{relation.label}</small> : null}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {relatedEntries.length > 0 ? (
          <section className="formula-page-section" id="formula-related">
            <div className="formula-page-section-heading">
              <p>Related Formulas</p>
              <span>{relatedEntries.length}</span>
            </div>
            <div className="formula-page-related">
              {relatedEntries.map((related) => (
                <Link key={related.id} href={`/formula-hub/${related.id}`}>
                  <span>{related.title}</span>
                  <FormulaMath latex={related.latex} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="formula-page-section">
          <div className="formula-page-section-heading">
            <p>Learn This Visually</p>
            <span>Links</span>
          </div>
          <div className="formula-page-link-row">
            {topicLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            {blogLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="formula-page-pdf">
            PDF source: {entry.pdfSection}
            {entry.pdfPage ? `, p. ${entry.pdfPage}` : ""}
          </div>
        </section>
      </article>
    </div>
  );
}

export default async function FormulaDetailPage({ params }: FormulaDetailPageProps) {
  const { id } = await params;
  const entry = formulaHubEntriesById[id];
  const aliasId = formulaHubEntryAliasesById[id];

  if (!entry) {
    if (aliasId) {
      redirect(`/formula-hub/${aliasId}`);
    }
    notFound();
  }

  return (
    <main className="edition-root formula-hub-root">
      <Script id="formula-detail-mathjax-config" strategy="beforeInteractive">
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
        id="formula-detail-mathjax"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
      />
      <MathJaxRefresh />
      <EditionBackdrop />
      <EditionNav active="formula-hub" />
      <FormulaDetailPageBody entry={entry} />
    </main>
  );
}
