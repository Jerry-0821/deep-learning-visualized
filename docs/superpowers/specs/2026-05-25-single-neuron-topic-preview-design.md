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
- Local-only visual rules: `reference_materials/archive/project-materials/design-system/design_system_guidelines.md`
- Layout reference only:
  `reference_materials/archive/project-materials/legacy-topic-examples/single_neuron_final.html`

The layout reference is not an authoritative content source. It embeds the animation canvas
but omits the existing dynamic calculation display, activation formula display, activation
explanation, and current-moment explanation elements that the original script updates.

## Required Preview Content

The standalone HTML preview must retain the current Single Neuron interactive experience:

- the five named phases: `Inputs light up`, `Weighted sum`, `Bias enters`, `Activation`, and
  `Output`
- previous, next, play/pause, replay, activation selector, and timeline controls
- activation choices: sigmoid, ReLU, tanh, and Leaky ReLU
- the original values and complete forward-pass calculation, presented in the approved stable
  reading drawer
- the original MathJax equation content, shown together in that drawer rather than replaced
  stage-by-stage in the always-visible flow
- the selected activation formula and activation explanation, shown in the drawer and updated
  only when the selected activation changes
- the current-moment title and explanation, shown as a lightweight live status near the controls

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
- a collapsible left table-of-contents drawer and a flexible wide reading column
- spacious editorial typography rather than bordered text cards

The animation itself may remain visually distinct inside its interactive canvas. Its controls
and computed outputs must remain functional and visible.

## Approved Left Navigation Drawer Revision

Every redesigned topic page must provide the same left-side navigation behavior for its
`On This Page` section list.

### Desktop Behavior

- Show the left navigation drawer expanded by default so a learner can see and use the topic
  outline immediately.
- Add a small white outline sidebar icon button as the left drawer control. It must be visually
  distinct from the right calculation drawer's three-horizontal-line button.
- Allow the learner to collapse the left drawer. When it is collapsed, the reading content may
  use the reclaimed horizontal space.
- Keep the icon control available after collapse so the drawer can be reopened at any time.
- Selecting a section link on desktop navigates to that section without automatically closing
  the drawer; closing it remains an explicit learner choice.

### Narrow-Screen Behavior

- On narrow screens, keep the left navigation drawer closed by default so it does not crowd out
  the reading content.
- Open it as an overlay or sheet from the same white outline sidebar control.
- Close the overlay after the learner selects a section, presses `Escape`, or selects the
  backdrop.

### Relationship To The Calculation Drawer

- The left drawer is navigation only and is a universal layout requirement for all topics.
- The right calculation drawer remains a lesson-specific explanatory surface and stays closed
  by default.
- Both drawers may exist together, but their controls, visual symbols, default states, and
  purposes must remain unambiguous.

## Formula Placement And Rendering

The interactive animation comes first. Its mathematical explanation must never appear above the
animation.

The structured `Important formulas` section belongs below the interactive experience as part of
the teaching notes.

All visible equations and mathematical variables introduced by the redesigned shell should be
rendered with MathJax/LaTeX. Existing lesson formulas must be preserved in meaning and values.

## Approved Calculation Drawer Revision

The first preview revealed that continually changing formula cards below an animation make the
reader repeatedly chase the current playback step. This revision is approved as the reusable
pattern for any later topic whose calculation explanation changes repeatedly during animation.

### Drawer Behavior

- Add a small three-horizontal-line button on the right side of the interactive lesson.
- The button opens a resizable right-side reading drawer and closes it again.
- The drawer is closed by default. It must not cover the animation until the learner chooses to
  inspect the explanation.
- The drawer uses the page typography and a plain editorial surface, without colored formula
  cards or decorative framing.
- On narrow layouts the same information may open as a full-width overlay or sheet, provided it
  remains closed by default and dismissible.

### Calculation Content

- For Single Neuron, move the changing formula-card experience out of the always-visible reading
  flow.
- In the drawer, list the complete forward-pass calculation in stable sequence rather than
  replacing one partial step with another as the animation runs.
- Keep the original values, operations, activation choice, and result. The presentation may
  reveal all calculation steps together, but it may not invent, remove, or rewrite teaching
  meaning.
- Display the stable steps with normal page typography and MathJax/LaTeX.
- The selected activation formula, activation note, and final activation-dependent result belong
  in this drawer. When the activation selector changes, these activation-dependent entries may
  update to match the selection; they should not flicker through time-based animation stages.

### Current Moment Treatment

- Do not leave `Current moment` as a large colored card under the animation.
- Keep its instructional content available as a lightweight live-status line near the animation
  controls, because the learner still needs orientation while the drawer is closed.
- This status may change with animation playback because its purpose is to describe the visible
  moment, not to serve as a reading transcript of the calculation.

### Content-Preservation Interpretation

Relocating the calculation and activation explanations into the drawer is a presentation change,
not permission to delete content. The preview must still preserve every calculation value,
activation explanation, formula, and current-moment explanation supplied by the authoritative
interactive lesson. The existing interaction engine remains the source of truth.

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
2. On desktop, confirm the left outline/sidebar navigation drawer is visible by default, can
   collapse and reopen, and gives the reading column more space when collapsed.
3. On a narrow viewport, confirm the left navigation drawer is initially closed and behaves as
   a dismissible overlay.
4. Confirm the right three-line calculation-drawer control is visible and its drawer is closed
   by default.
5. Open and resize the calculation drawer, then confirm it lists the full Single Neuron calculation without
   needing to advance animation steps.
6. Step through the five animation phases and confirm the lightweight current-moment status
   changes while the complete drawer calculation remains stable.
7. Change the activation selector and confirm the calculation drawer's selected activation formula, note,
   and final output change consistently.
8. Compare every displayed instructional paragraph and formula with the existing local/live
   Single Neuron lesson.
9. Confirm existing production files and routes have not been overwritten.

## Future Rollout Rule

This Single Neuron page is a design test only. The remaining 17 topic pages must not be
redesigned in bulk until the user has accepted this preview as the correct style and content
preservation pattern.
