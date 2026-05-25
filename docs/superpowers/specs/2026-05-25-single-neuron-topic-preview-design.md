# Single Neuron Topic Preview Design

## Purpose

Create one standalone HTML preview for the `Single Neuron Forward Pass` topic to test the
future visual direction for all 18 topic pages. This preview evaluates presentation only. It
must not rewrite, shorten, replace, or reinterpret the existing lesson.

## Content Preservation Contract

For this preview and every later topic redesign:

1. Existing teaching content is authoritative.
2. Redesign work may change layout, spacing, typography, navigation, and visual framing only.
3. Redesign work must not change animation steps, calculation values, formulas, controls,
   explanatory text, examples, pros/cons, or common-mistake guidance.
4. Content must be checked against both the live website and the local source before a
   redesigned topic is accepted.
5. When a visual reference conflicts with existing lesson content, preserve the existing
   lesson content and use the reference for styling only.

## Authoritative Single Neuron Sources

- Live topic shell: `https://deep-learning-visualized.vercel.app/topic/neuron-structure`
- Live animation: `https://deep-learning-visualized.vercel.app/prototypes/neuron-structure.html`
- Local animation artifact: `public/prototypes/neuron-structure.html`
- Local supporting notes: `data/topicTeachingContent.ts`, key `neuron-structure`
- Visual rules: `design_system_guidelines.md`
- Layout reference only:
  `../deep-learning-redesign/website/topic_prototypes/single_neuron_final.html`

The layout reference is not an authoritative content source. It embeds the animation canvas
but omits the existing dynamic calculation display, activation formula display, activation
explanation, and current-moment explanation elements that the original script updates.

## Required Preview Content

The standalone HTML preview must retain the current Single Neuron interactive experience:

- the five named phases: `Inputs light up`, `Weighted sum`, `Bias enters`, `Activation`, and
  `Output`
- previous, next, play/pause, replay, activation selector, and timeline controls
- activation choices: sigmoid, ReLU, tanh, and Leaky ReLU
- the original values and accumulating forward-pass calculation
- the dynamic MathJax equations shown as the animation progresses
- the selected activation formula and activation explanation
- the current-moment title and explanation

After the interactive lesson, it must retain the current structured teaching notes exactly:

- Background
- Important formulas
- Pros
- Cons
- Quick example
- Common mistake

## Layout And Visual Direction

Use the local design-system guidelines for presentation:

- milk-white page background, deep gray-purple text, and purple accents
- `Instrument Serif` for major display headings and `Inter` for body/UI text
- a fixed translucent top bar
- a left sticky table of contents and a flexible wide reading column
- spacious editorial typography rather than bordered text cards

The animation itself may remain visually distinct inside its interactive canvas. Its controls
and computed outputs must remain functional and visible.

## Formula Placement And Rendering

The interactive animation comes first. Dynamic calculation and activation-formula output must
be shown directly below that animation, not above it.

The structured `Important formulas` section belongs below the interactive experience as part of
the teaching notes.

All visible equations and mathematical variables introduced by the redesigned shell should be
rendered with MathJax/LaTeX. Existing lesson formulas must be preserved in meaning and values.

## Implementation Boundary

The first deliverable is a standalone preview HTML file outside the active Next.js route flow.
It does not overwrite `public/prototypes/neuron-structure.html`, does not change any production
route, and does not deploy or publish the current website.

Create `topic-design-previews/README.md` beside the preview as the durable reminder for every
later topic design pass. It must state the content preservation contract, formula placement
rule, authoritative-source check, and the warning that visual examples cannot silently replace
teaching content.

The preview should be built by combining the approved editorial shell with the complete
existing interactive implementation and the existing supporting notes. The incomplete layout
reference must not be used as a replacement for the original animation content.

## Verification

Before presenting the preview:

1. Open it in a browser and confirm it renders in the new editorial layout.
2. Confirm the dynamic formula area is visible below the animation.
3. Step through the five animation phases and confirm formula values update.
4. Change the activation selector and confirm the activation formula/output changes.
5. Compare every displayed instructional paragraph and formula with the existing local/live
   Single Neuron lesson.
6. Confirm existing production files and routes have not been overwritten.

## Future Rollout Rule

This Single Neuron page is a design test only. The remaining 17 topic pages must not be
redesigned in bulk until the user has accepted this preview as the correct style and content
preservation pattern.
