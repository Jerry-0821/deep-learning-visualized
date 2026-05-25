# Bias vs. Variance Flat Visualization Design

## Scope

Revise only the standalone `bias-vs-variance-diagnosis` preview. The user supplied and
approved a complete static reading lesson for this topic and requested a page-native visual
treatment matching the approved Evaluation preview direction.

## Authoritative Interaction Logic

The existing local and published prototype exposes the instructional interaction to preserve:

- Five error inputs: human-level, training, training-dev, dev, and test error.
- Scenario presets: High bias, High variance, Good fit, Mismatch, and Dev overfit.
- Human baseline presets and the optional mismatch-mode comparison.
- Four computed gaps: avoidable bias, variance, data mismatch, and dev overfitting.
- A compact helper curve and a live dominant-diagnosis result.

The preview may reimplement this logic directly in the shared preview shell to remove the old
iframe presentation. It does not edit the authoritative source under `public/prototypes/`.

## Approved Reading Content

Place the supplied lesson after the interaction with these sections:

- Background and core question.
- Important Formulas and Diagnosis Table.
- Example and Recommended Fix.
- Pros / Cons and Common Mistake.
- Takeaway.

Render formulas as ordinary MathJax/LaTeX in document flow without internal draggable or
scrollable surfaces.

## Visual Direction

- Render a flat editorial interaction directly within the topic page, not a large embedded
  dashboard card.
- Preserve controls, numerical results, gap relationships, helper curve, and current diagnosis.
- Use spacing, rules, quiet tinted data encodings, and the page typography instead of stacked
  decorative panels.
- Keep the diagnosis result concise inside the interaction.
- Do not duplicate `Takeaway`, `Recommended Fix`, `Pros / Cons`, `Common Mistake`, or the long
  core-logic explanation inside the visualized interaction; those now belong to the reading
  lesson.
- Keep the right reading drawer empty and closed by default for this pass.

## Verification

- The Bias preview no longer displays its interaction through `#prototype-frame`.
- Every original control category remains available and changing a scenario or error input
  updates the error stack, computed gaps, curve, and dominant diagnosis.
- The supplied reading sections and formulas appear below the interaction without internal
  formula scrolling.
- The navigation drawer lists the new reading sections and the right drawer remains empty.
- Other authoritative prototypes and production route source files remain unchanged.
