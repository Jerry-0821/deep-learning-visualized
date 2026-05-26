# Topic Design Preview Rules

This folder holds topic-by-topic visual tests before any replacement of the current published
website. A preview may explore presentation, but the lesson remains the lesson.

## Non-Negotiable Contract

- Do not change teaching content.
- Keep all existing explanatory text, formulas, values, controls, animation stages, examples,
  pros/cons, and common-mistake guidance.
- Use styling, typography, spacing, navigation, and layout changes only.
- Check each redesigned topic against both its local authoritative source and the live website
  before it can be accepted.
- Visual references are styling references only. They cannot silently replace or shorten the
  teaching material.
- Before starting work on each topic, read this note again and identify that topic's
  authoritative prototype and teaching-text source.

## Shared Topic Shell Rule:

- Use the same editorial topic template instead of retaining the current route wrapper around
  the prototype.
- Do not duplicate the existing wrapper's `Interactive prototype` badge, topic title and
  subtitle, `Return to module`, or `Open prototype only` action block inside the redesigned
  page; the new template already supplies that context.
- Put `Back to module` in the top-right topbar control area. Standalone design previews may
  link to the existing live module page; production replacement pages must use their internal
  module route.
- External shell work may precede detailed restyling of a complicated interaction, but this
  does not allow any instructional content or calculation behavior to change.

## Formula Placement:

- Show the animation first.
- Never place calculation explanations or animation-generated LaTeX above the animation content.
- Place the structured `Important formulas` reading section after the complete interactive
  lesson.
- Preserve MathJax/LaTeX rendering wherever the current interaction uses it.

## Calculation Drawer Rule:

When a topic's calculation explanation would otherwise change repeatedly while the animation
runs:

- Provide a small three-horizontal-line button on the right side of the interactive lesson.
- Open a resizable right-side reading drawer from that button, and keep it closed by default.
- List the complete calculation sequence in stable MathJax/LaTeX inside the drawer so the reader
  does not need to chase changing steps.
- Use plain page typography in the drawer rather than colored formula cards.
- Place activation-specific note, formula, and result in the drawer; these may change only when
  the learner changes the activation selector.
- Preserve `Current moment` as a lightweight live status near the animation controls instead of
  an always-visible large card.

Moving material into this drawer is a layout change only. It does not permit deleting,
shortening, or rewording teaching content.

## Navigation Drawer Rule:

Every topic uses the same `On This Page` left navigation behavior:

- Keep the left navigation drawer expanded by default on desktop.
- Use a white outline sidebar icon for its control, distinct from the right calculation
  drawer's three-horizontal-line icon.
- Let readers collapse the desktop navigation drawer to reclaim horizontal reading space and
  reopen it at any time.
- Keep the left navigation drawer closed by default on narrow screens, opening it as an overlay.
- On narrow screens, close the navigation overlay after a section link, backdrop, or `Escape`
  selection.
- Keep the right calculation drawer independent and closed by default.

## Rough Rollout Topic Decisions:

- `attention-mechanism-intuition` and `transfer-learning-intuition` currently have
  interactive sources but do not yet have
  approved structured reading notes. Create section positions for future `Background`,
  `Important formulas`, `Pros / Cons`, and `Example / Mistake` content, but do not author
  that content. Their right drawers stay empty in the first rough pass.
- `evaluation-metrics-confusion-matrix` now has user-approved static supplementary teaching
  content: subtitle, Background, Idea, Formula, Symbols, Example, Workflow, Pros & Cons,
  Common Mistake, and Takeaway. Place it below the preserved interaction; keep its right
  drawer empty until its visual interaction treatment is decided separately.
- `rnn-structure` now receives the user-supplied static lesson and preserves its architecture
  animation. Move its changing `Current step`, `Architecture`, `Core equations`, `Formula
  block`, and `Application` material into the right reading drawer; present the interaction
  itself in the shared page style without duplicate internal navigation or hero framing.
- `backpropagation-intuition` follows the Single Neuron drawer pattern: changing calculation
  steps belong in the right reading drawer.
- `convolution-operation` sends `Live Calculation (Element-wise Multiply & Sum)`,
  `Current Step`, `Computing Feature Map at y(...)`, and `Filter Characteristics` to the
  right reading drawer.
  Its drawer must re-typeset the original LaTeX calculation rather than clone rendered
  MathJax output, so final numeric answers remain visible. Native select menus on the dark
  interaction surface must use readable light option backgrounds with dark option text.
- `dropout` sends `Live Math Area: Bernoulli Mask & Scaling` and `Current Action` to the
  right reading drawer. The earlier PyTorch-specific explanatory callout is removed once the
  user-supplied reading lesson is integrated.
- `gradient-descent-learning-rate` sends `3D formula`, `Current 3D step computation`,
  `2D intuition formula`, `Interpretation`, and `Current moment` to the right reading drawer.
  It now also receives the user-supplied static lesson. Keep its 3D and 2D interactive teaching
  behavior, but remove the heavy blue card framing, avoid large blank areas after the visual,
  and render supplementary formulas as ordinary LaTeX in document flow.

## Authorized Content Rewrite Exception:

- `evaluation-metrics-confusion-matrix`: On 2026-05-25, the user explicitly requested a major
  revision that may rewrite its teaching content as well as its visual design. Before
  implementation, study the original prototype and live page, then agree on the revised
  lesson scope. The user then supplied and approved the supplementary static reading lesson;
  on the same date the user approved a page-native flat visualization rather than the old
  embedded-card presentation. Preserve the threshold/confusion-matrix/metric teaching logic,
  keep the right drawer empty, remove the iframe-shaped blank gap, and render static reading
  formulas as ordinary non-scrollable LaTeX in the document flow. This exception applies only
  to this topic unless another topic receives its own exception.
- `bias-vs-variance-diagnosis`: On 2026-05-25, the user supplied and approved a complete
  static reading lesson covering Background, Important Formulas, Diagnosis Table, Example,
  Recommended Fix, Pros / Cons, Common Mistake, and Takeaway. The user approved the same
  page-native flat interaction direction as Evaluation. Preserve the source interaction's five
  error controls, scenario presets, baseline controls, mismatch mode, four gap calculations,
  helper curve, and dominant diagnosis. Do not repeat Takeaway, Recommended Fix, Pros / Cons,
  Common Mistake, or long core-logic explanations inside the visual section because they now
  belong to the reading lesson. Keep the right drawer empty and render reading formulas as
  ordinary non-scrollable LaTeX. All topics without a listed exception still follow the
  content-preservation contract.
- `rnn-structure`: On 2026-05-25, the user supplied approved static content covering
  Background, Idea, general Formula, RNN Structures, Example, Pros, Cons, and Common
  Mistake. Keep the existing architecture choices and animation behavior unchanged in
  substance. Relocate the changing step, architecture, formula, and application explanation
  blocks to the right drawer, and restyle controls and visual framing to match the page.
- `gradient-descent-learning-rate`: On 2026-05-25, the user supplied approved static content
  covering Background, Formulas, Example, Pros, Cons, Common Mistakes, and Takeaway. Preserve
  the synchronized 3D surface, 2D intuition plot, playback and parameter controls, and live
  calculations. Keep the already-directed live formula/current-moment material in the right
  drawer, flatten the card-heavy visual styling and pale-blue framing, remove excess visual
  whitespace, and use ordinary LaTeX for the supplied reading formulas.
- `dropout`: On 2026-05-26, the user supplied approved static content covering Background,
  Important Formulas, Pros, Cons, Quick Example, Common Mistakes, and a short takeaway.
  Preserve the existing animation and controls; flatten its visual framing and color treatment.
  Remove the internal `PyTorch model.train() Mode` hero and `Key concepts` presentation because
  the approved reading replaces that duplicated prose. Keep live math and current action in
  the right drawer using plain page typography.
- `convolution-operation`: On 2026-05-26, the user supplied approved static content covering
  Background, Important Formulas, Pros, Cons, Quick Example, Common Mistakes, and Takeaway.
  Preserve the sliding-window animation and every functional control. Reduce the oversized
  control treatment, flatten the card-heavy wrapper and adjust its color treatment to the
  shared page style. Keep the live calculation, current step, and filter characteristics in
  the right drawer.
- `backpropagation-intuition`: On 2026-05-26, the user renamed this page to `Backpropagation`
  and supplied approved static content covering Background, formulas for Single Neuron and
  Multi-layer Network derivations, Pros, Cons, Quick Example, Common Mistakes, and Takeaway.
  Preserve its cache-aware animation and controls. In the on-page Important Formulas section,
  display rectangular `Single Neuron` and `Multi-layer Network` buttons that open the right
  drawer to their corresponding LaTeX derivations. The drawer has three views: `Single Neuron`,
  `Multi-layer Network`, and `Live detail`; changing animation details stay in `Live detail`.
  Flatten the old card-heavy visual presentation and align its colors with the shared page.

## Single Neuron Sources

- Authoritative interaction: `public/prototypes/neuron-structure.html`
- Authoritative supporting notes: `data/topicTeachingContent.ts`, key `neuron-structure`
- Live comparison pages:
  `https://deep-learning-visualized.vercel.app/topic/neuron-structure` and
  `https://deep-learning-visualized.vercel.app/prototypes/neuron-structure.html`
- Design guidance: `design_system_guidelines.md`
- Layout reference only:
  `../deep-learning-redesign/website/topic_prototypes/single_neuron_final.html`

The layout reference omitted dynamic calculation/formula and current-moment displays from the
original interactive lesson. It is not a valid source for Single Neuron teaching content.
The Single Neuron preview loads the authoritative interaction file at runtime; do not replace
it with a reduced visual copy.

## Acceptance Checklist For Every Topic

1. Identify the authoritative local animation and note sources.
2. Compare the live topic before changing presentation.
3. Confirm that all controls, states, formulas, and calculation outputs still exist.
4. Confirm that the animation appears before its mathematical explanation and, when this rule
   applies, that the calculation drawer is closed by default.
5. Confirm that the left navigation drawer is expanded by default on desktop and closed by
   default on narrow screens.
6. Confirm that every lesson paragraph and structured note remains unchanged in substance.
7. Present one topic for approval before using its pattern on the remaining topics.
