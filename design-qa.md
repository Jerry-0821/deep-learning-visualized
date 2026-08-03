# Design QA — Shared Blog Topic-pattern layout

## Comparison target

- Source visual truth: `C:/Users/jiaji/.codex/visualizations/2026/08/02/019fc2f3-07d3-76d1-9335-5686baf420c1/topic-source-matched-viewport.png`.
- Source code truth: `topic-design-previews/topic-preview-shell.css` (`.page`, `.navigation-drawer`, `.toc`, and the 980 px breakpoint).
- Implementation: every `/blog/[slug]` route through the shared `BlogReadingLayout` and Blog reading CSS.
- Implementation screenshot: `C:/Users/jiaji/.codex/visualizations/2026/08/02/019fc2f3-07d3-76d1-9335-5686baf420c1/blog-all-routes-final-top.png`.
- Scrolled-state screenshot: `C:/Users/jiaji/.codex/visualizations/2026/08/02/019fc2f3-07d3-76d1-9335-5686baf420c1/blog-all-routes-final-scrolled.png`.
- Mobile formula screenshot: `C:/Users/jiaji/.codex/visualizations/2026/08/02/019fc2f3-07d3-76d1-9335-5686baf420c1/blog-all-routes-mobile-formula.png`.

## Normalization and state

- Desktop CSS viewport: 1917 × 841, device density controlled by the in-app browser.
- Source and desktop implementation capture pixels: 1655 × 835 each; both were captured through the same browser surface, viewport override, crop, scale, and expanded-navigation state.
- Mobile QA viewport: 390 × 844; every route was checked at this width.
- Desktop state: page top, navigation expanded. Additional evidence covers article end with the navigation still sticky.

## Full-view comparison evidence

- The shared Blog layout uses the Topic shell's 1440 px outer frame, 220 px navigation track, 60 px column gap, and 1000 px reading track.
- At 1917 px viewport width, Topic and Blog both measure navigation x=311 and width=220; main/article x=591 and width=1000; display heading width=850.
- The Blog keeps its own top navigation, color tokens, copy, content, and imagery as requested. Those are intentional differences, not fidelity defects.
- No horizontal overflow appears on desktop or mobile. Long MathJax formulas use contained horizontal scrolling without widening the article.

## Focused comparison evidence

- Left navigation behavior was checked separately because the full-view top capture cannot prove sticky behavior.
- At scrollY=1588 on the final Transfer Learning build, the navigation remains visible at y=122 while its full-height rail continues to the end of the article.
- All 12 Blog routes were checked at 1700 × 934: every route measured article width=1000, navigation width=220, navigation y=122 after scrolling, zero article overflow, zero broken images, and no document overflow.
- This focused check catches the earlier short-parent bug that caused the navigation to disappear while scrolling.

## Required fidelity surfaces

- Fonts and typography: Blog Edition typography and optical hierarchy are intentionally retained. Topic geometry is reused without copying Topic colors or replacing Blog typography.
- Spacing and layout rhythm: Topic grid tracks, reading width, navigation width, gap, title width, lede width, collapsed centering, and 980 px transition are matched.
- Colors and tokens: Blog Edition tokens remain intact by scope; contrast and selected Blog navigation state remain unchanged.
- Image quality and asset fidelity: existing Blog images are unchanged, uncropped, and rendered at the 1000 px reading width; no placeholder, CSS-art, or replacement asset was introduced.
- Copy and content: all Blog copy, headings, formulas, tables, captions, and section order remain unchanged.
- Icons and controls: the existing Blog navigation toggle is retained and remains a 46 px control with accurate expanded state and labels.
- Responsiveness and accessibility: at 390 px every route becomes one column with no article overflow. The navigation is hidden initially, opens as a fixed drawer, and the backdrop now starts after the 320 px drawer so its visible strip is a reliable close target. Correct `aria-expanded` / `aria-hidden` state and Escape handling remain implemented.

## Findings

- No actionable P0, P1, or P2 issue remains.
- Intentional differences from Topic: Blog top chrome, Blog colors, Blog fonts, Blog copy, and Blog images.

## Comparison history

- Earlier P1 behavior defect: the left navigation disappeared after scrolling because the grid used `align-items: start`, leaving the navigation rail only as tall as its own content.
- Fix: removed the short-item alignment and made the shared rail stretch to the article height while keeping the navigation itself sticky at 122 px.
- Post-fix evidence: Transfer Learning remains sticky at scrollY=4837; Batch Normalization remains sticky at scrollY=3400; both have no horizontal overflow.
- The former `?layout=topic` single-route preview switch was removed. The corrected structure now comes from the shared Blog layout and applies to all Blog detail routes locally.
- P2 mobile issue found during all-route QA: seven formula-heavy articles had content wider than the 335 px article column because grid items used their MathJax min-content width.
- Fix: the formula grid now uses `minmax(0, 1fr)`, cards are width-constrained, and long MathJax output scrolls inside its own container. All 12 routes now report zero article overflow at 390 px.
- P2 mobile backdrop issue: at 390 px the backdrop's center was under the drawer, making automated/keyboard-style activation unreliable. The backdrop now begins after the drawer, matching the Topic pattern, and closes the drawer correctly.

## Functional verification

- Production build: passed; 160 static pages generated.
- Routes checked: Batch Normalization, Residual Block / ResNet Intuition, Vanishing Gradient Problem, Word Embeddings, Attention Mechanism, Add & Norm, Self-Attention vs RNN vs CNN, Transfer Learning, Momentum, RMSProp, DenseNet Intuition, and Siamese Network.
- Desktop navigation: expanded, sticky while scrolling, and shared 220/60/1000 geometry passed.
- Mobile navigation: closed, open, visible-strip backdrop close, formula containment, and responsive layout passed at 390 px.
- Browser console warnings/errors: none.

## Final result

passed
