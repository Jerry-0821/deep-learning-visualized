import { Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import type { Metadata } from "next";
import { EditionBackdrop, EditionNav } from "@/components/edition/EditionChrome";
import { FormulaHubClient } from "@/components/formula-hub/FormulaHubClient";
import { MathJaxRefresh } from "@/components/blog/MathJaxRefresh";
import "./formula-unified.css";

// Design review sample: the real Formula Hub with the unified site styles from
// ./formula-unified.css. Not linked from the site and hidden from search engines.
export const metadata: Metadata = {
  title: "Formula Hub (unified design sample) | Deep Learning Visualized",
  robots: { index: false, follow: false },
};

export default function FormulaHubDesignReviewPage() {
  return (
    <main className="edition-root formula-v6-root formula-unified">
      <Script id="formula-hub-mathjax-config" strategy="beforeInteractive">
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
        id="formula-hub-mathjax"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
      />
      <MathJaxRefresh />
      <div className="design-review-banner">
        <span>Design review sample: Formula Hub in the unified site style. Search and data are the real ones.</span>
        <Link href="/formula-hub">Compare with the current Formula Hub {"→"}</Link>
      </div>
      <EditionBackdrop />
      <EditionNav active="formula-hub" />
      <Suspense fallback={<div className="formula-hub-loading">Loading Formula Hub...</div>}>
        <FormulaHubClient />
      </Suspense>
    </main>
  );
}
