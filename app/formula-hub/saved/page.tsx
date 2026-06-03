import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { MathJaxRefresh } from "@/components/blog/MathJaxRefresh";
import { FormulaHubClient } from "@/components/formula-hub/FormulaHubClient";

export const metadata: Metadata = {
  title: "Saved Formulas | Formula Hub",
  description: "Saved deep learning formulas from Formula Hub.",
};

export default function SavedFormulaHubPage() {
  return (
    <main className="formula-v6-root">
      <Script id="saved-formula-hub-mathjax-config" strategy="beforeInteractive">
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
        id="saved-formula-hub-mathjax"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
      />
      <MathJaxRefresh />
      <Suspense fallback={<div className="formula-hub-loading">Loading saved formulas...</div>}>
        <FormulaHubClient />
      </Suspense>
    </main>
  );
}
