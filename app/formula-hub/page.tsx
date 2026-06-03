import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { FormulaHubClient } from "@/components/formula-hub/FormulaHubClient";
import { MathJaxRefresh } from "@/components/blog/MathJaxRefresh";

export const metadata: Metadata = {
  title: "Formula Hub | Deep Learning Visualized",
  description: "Search deep learning formulas, tensor shapes, symbols, and update rules.",
};

export default function FormulaHubPage() {
  return (
    <main className="formula-v6-root">
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
      <Suspense fallback={<div className="formula-hub-loading">Loading Formula Hub...</div>}>
        <FormulaHubClient />
      </Suspense>
    </main>
  );
}
