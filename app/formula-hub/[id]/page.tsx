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

function FormulaDetailPageBody({ entry }: { entry: FormulaHubEntry }) {
  const relatedEntries = entry.relatedFormulaIds.map((id) => formulaHubEntriesById[id]).filter(Boolean).slice(0, 6);
  const topicLinks = getFormulaTopicLinks(entry);
  const blogLinks = getFormulaBlogLinks(entry);

  return (
    <div className="formula-page-shell">
      <aside className="formula-page-rail" aria-label="Formula page navigation">
        <Link href="/formula-hub">All formulas</Link>
        <a href="#formula-overview">Overview</a>
        {entry.steps && entry.steps.length > 1 ? <a href="#formula-flow">Formula flow</a> : null}
        {entry.shape ? <a href="#formula-shape">Shape check</a> : null}
        <a href="#formula-symbols-detail">Symbols</a>
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
