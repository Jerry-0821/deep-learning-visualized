# Evaluation Metrics Flat Visualization Design

## Scope

Revise only the standalone `evaluation-metrics-confusion-matrix` preview. The user has
approved teaching-content revision for this topic and supplied its static reading lesson.
The remaining work in this pass is the visualized lesson presentation and the related
plain-LaTeX reading cleanup.

## Approved Direction

Use a page-native, flat interaction rather than displaying the existing prototype as a large
embedded card. The screenshot is a reference for information hierarchy and muted palette, not
permission to reproduce its enclosing card treatment.

The interaction keeps the original concept and controls:

- Metric selection: Accuracy, Precision, Recall, and F1.
- Threshold slider.
- Score distribution split by the selected threshold.
- Confusion matrix with TP, FP, FN, and TN.
- Current metric value, formula, and explanatory insight.

The new interaction may reuse the original example scores and calculation rules directly in the
preview shell. It does not edit the authoritative source under `public/prototypes/`.

## Presentation Rules

- Render the Evaluation interaction directly in the editorial page rather than through an
  iframe.
- Avoid a card-inside-a-card layout. Use spacing, fine divider rules, muted tinted regions, and
  the existing page typography.
- Treat the colored confusion-matrix cells and metric states as data encodings, not surrounding
  decorative cards.
- Keep the right explanation drawer empty for now; the interactive concept remains readable in
  the main visualization until the user decides otherwise.
- Let the interactive section end at its actual content height so `Background` follows without
  a large blank region.

## Static Reading Formula Rules

- Preserve the approved supplementary reading lesson below the interaction.
- Display reading formulas as ordinary MathJax/LaTeX within the document flow.
- Do not create internal draggable or scrollable formula surfaces.
- Do not use bordered formula cards or formula-by-formula panels in the static reading text.

## Verification

- The Evaluation preview no longer renders its interaction through `#prototype-frame`.
- Metric buttons and threshold changes update the confusion matrix, selected metric value,
  formula, and insight.
- The right drawer remains empty and closed by default.
- The static reading sections and LaTeX remain present without internal formula scrolling.
- Other prototype sources and production routes remain unchanged.
