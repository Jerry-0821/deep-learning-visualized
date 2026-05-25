# Topic Preview Rollout Rules

## Purpose

Extend the approved Single Neuron preview direction into rough external-design previews for
selected topics. These previews test the common page template and drawer placement before
fine visual refinement. They are not permission to rewrite any lesson.

## Required Preflight For Every Topic

Before changing a topic preview, read `topic-design-previews/README.md` again and compare the
topic against its authoritative local prototype and the live website. The non-negotiable rule
remains: presentation may change, teaching content may not.

## Shared Template Rule

- Use the approved topic template: editorial hero, left `On This Page` navigation drawer,
  reading column, and an optional right explanation drawer.
- Add `Back to module` in the top-right navigation area. In standalone previews it may link to
  the corresponding live module; a production replacement must use the internal module route.
- Do not repeat the existing route wrapper pattern inside the new template: remove the extra
  `Interactive prototype` badge, duplicated topic title/description, `Return to module`, and
  `Open prototype only` block shown above the old embedded prototype.
- Retain the authoritative interactive lesson itself. Rough external-design previews may keep
  an interaction visually provisional while its later internal restyling is still awaiting
  review.

## Topics With Reserved Teaching Sections

The current website provides an authoritative interactive prototype but no completed
`Background / Important formulas / Pros / Cons / Quick example / Common mistake` reading
material for these topics:

- `attention-mechanism-intuition`
- `evaluation-metrics-confusion-matrix`
- `bias-vs-variance-diagnosis`
- `transfer-learning-intuition`

For the rough previews, include the standard section positions so later supplied material has
a home, but do not invent lesson paragraphs, formulas, examples, or warnings. Their right
drawers start as empty reading surfaces for later decisions.

## Topic-Specific Drawer Decisions

### Attention Mechanism Inside a Transformer

- Apply the shared external template first.
- Treat internal visual restyling as substantial later work because the current embedded
  presentation is visibly card-heavy.
- Keep its right explanation drawer empty in this rough pass.

### Evaluation Metrics & Confusion Matrix

- Apply the shared external template and reserved reading sections.
- Keep its right explanation drawer empty in this rough pass until the user supplies the
  intended reading content and placement decisions.

### Bias vs. Variance Diagnosis

- Apply the shared external template and reserved reading sections.
- Expect later work to break up the visibly heavy card presentation.
- Keep its right explanation drawer empty in this rough pass.

### Transfer Learning Intuition

- Apply the shared external template and reserved reading sections.
- Keep its right explanation drawer empty in this rough pass.

### RNN Structure

- Change external page styling only; do not rearrange or reinterpret its interactive content.
- Keep its right explanation drawer empty in this rough pass.

### Backpropagation Intuition

- Use the Single Neuron pattern because its staged calculation presentation has the same
  reading problem.
- Place its changing calculation-step explanation in the right drawer while preserving the
  original interaction and values.

### Convolution Operation

- Place `Live Calculation (Element-wise Multiply & Sum)`, `Current Step`, the current
  `Computing Feature Map at y(...)` explanation, and `Filter Characteristics` in the right
  drawer.
- Do not present these explanations as decorative cards in the main reading flow.

### Dropout

- Place `Live Math Area: Bernoulli Mask & Scaling`, `Current Action`, and `PyTorch Context`
  in the right drawer because they change with live steps.
- Do not keep duplicative live-step cards beneath the interaction.

### Gradient Descent & Learning Rate

- Place `3D formula`, `Current 3D step computation`, `2D intuition formula`,
  `Interpretation`, and `Current moment` in the right drawer.
- Preserve its 3D and 2D interaction controls and computations.

## Implementation Boundary

This pass creates standalone rough previews under `topic-design-previews/`. It must not modify
the production route wrapper, authoritative `public/prototypes/` assets, or instructional data
under `data/`.

