# Deep Learning Visualized Project Style Guide

This file is the first document to read before changing any topic page, blog page, or visual prototype in this project.

It records the design direction, teaching-content rules, and workflow preferences established through repeated redesign rounds.

## Core Direction

Deep Learning Visualized should feel like a calm, refined visual learning space.

The site is not a developer demo gallery. It is an editorial learning website where animations, formulas, and explanations feel integrated into one consistent reading experience.

The desired feeling:

- clean
- calm
- structured
- visual-first
- beginner-friendly
- elegant but not decorative
- modern purple / blue / teal style
- soft gradients and subtle borders
- enough whitespace, but not empty or unfinished

Avoid making pages feel like separate prototype cards embedded inside another website.

## Absolute Teaching Rule

Do not change teaching content unless the user explicitly says the content should change.

This includes:

- formulas
- examples
- explanations
- animation logic
- step order
- variable meanings
- topic conclusions
- educational wording

When redesigning, preserve the educational meaning first. Styling, layout, drawers, and spacing can change, but the lesson itself should not silently change.

If the user provides new text content, replace the page text with that content carefully and keep the formulas as LaTeX-style math.

## Visual Style

Use the current website style as the source of truth:

- purple / blue / teal accents
- soft gradient backgrounds
- subtle borders
- light editorial layout
- large refined serif topic titles
- clean sans-serif body text
- understated section dividers
- minimal shadows

The user dislikes heavy card UI. Avoid:

- strong boxed cards everywhere
- nested cards inside cards
- thick shadows
- heavy rounded blocks
- old blue / black / white prototype styling
- screenshot-like blocks that look pasted in
- duplicated prototype headers inside the topic template

Use panels only when they truly help structure an animation or important group of controls. Even then, keep them light.

## Page Layout

Topic pages should follow the common topic template:

- top site header
- `Back to module` button on the top right
- left `On This Page` drawer / navigation
- main hero title and subtitle
- interactive lesson section
- written teaching sections below

The left drawer should exist for each topic. On desktop, the default should be open unless the user changes this direction. It can be collapsed for readers who want more space.

The right drawer is only for optional details, usually live calculations or long derivations. It should be closed by default.

## Topic Interaction Rules

Animations should stay smooth and readable.

If an animation already works and the user says the teaching interaction is fine, do not rebuild the animation. Restyle the frame, controls, colors, and surrounding layout only.

Avoid duplicate prototype wrappers such as:

- `Interactive prototype`
- `Return to module`
- `Open prototype only`
- large internal prototype title blocks

The site template already provides the outer page structure.

## Formula Rules

Formulas should look like normal teaching formulas in the page, not like draggable or scrollable embedded widgets.

Use LaTeX-style presentation with a readable size. Match the visual scale of the current Dropout formula page:

- not huge like a poster
- not tiny like plain text
- centered when useful
- integrated with the paragraph flow
- no unnecessary scrollbars
- no weird drag handles

For topic pages, formulas usually belong below the animation, not above it.

## Dynamic Calculation Rules

When a page has calculations that change step by step during the animation, avoid forcing the learner to keep switching steps just to read formulas.

Preferred pattern:

- keep the animation clean in the main section
- place full static calculation steps in the right drawer
- use a small drawer button on the right side
- let the drawer contain complete LaTeX derivations or live details
- default drawer state is closed

Examples of content that usually belongs in the right drawer:

- live calculation
- current step
- current moment
- selected activation formula
- PyTorch context
- formula block
- derivation details
- long multi-step calculation

For Backpropagation-style derivations, the right drawer can have tabs such as:

- Single Neuron
- Multi-layer Network
- Live Detail

## Written Content Sections

Common topic sections:

- Background
- Idea
- Important Formulas
- Symbols
- Example
- Workflow
- Pros / Cons
- Common Mistake
- Takeaway

Not every topic needs every section visible in the visual interaction area. If the written section already covers a concept, avoid repeating the same content inside the animation area.

Some topics may temporarily need placeholder sections because the user plans to add content later. Keep those placeholders light and integrated, not heavy cards.

## Blog Style

Blog pages should feel like clean reading pages.

They should have:

- article-style layout
- left drawer / on-page navigation
- no right drawer
- formulas rendered as readable LaTeX-style math
- visual images placed where the user specifies
- no heavy card grid inside the article body

For blog listing cards, do not use full teaching screenshots as thumbnails if they look pasted in. Create simple abstract SVG cover art that matches the other blog cards.

Good blog card covers are:

- simplified
- icon-like
- diagram-inspired
- soft gradient background
- visually consistent with existing cards like Word Embeddings and Attention Mechanism

Article images can still be the user-provided full diagrams, but card thumbnails should be designed separately when needed.

## About Page Style

The About page should be simple and vertical.

The user prefers:

- text from top to bottom
- clean reading flow
- no heavy card grid
- no large decorative illustration
- no over-designed blocks
- same calm website colors and typography

Do not include the personal name `Jerry Lau` in the footer. Use the site name instead.

## Things To Avoid

Avoid these unless the user explicitly asks for them:

- changing teaching content silently
- rebuilding working animations unnecessarily
- heavy card/block effects
- too many nested rounded rectangles
- formula widgets with scrollbars
- pasted screenshots as blog card covers
- duplicated titles inside the same page
- repeated template UI inside the template
- asking the user to choose when the recommended path is obvious
- pushing GitHub main without clear approval

## User Working Preference

The user prefers direct execution.

If there is an obvious recommended plan, use it. The user has repeatedly said that when the choice is the recommended `A` plan, proceed without stopping to ask.

Ask only when:

- teaching content may need to change
- a design decision cannot be inferred from existing pages
- deployment or GitHub main push needs confirmation
- a risky operation could overwrite work

## Deployment And GitHub

For website changes, the expected end state is usually:

1. update local files
2. run a build
3. deploy to Vercel production when requested
4. verify the production link
5. commit and push GitHub main only when approved

The production site is:

```text
https://deep-learning-visualized.vercel.app
```

Keep Vercel and GitHub main consistent when the user asks for a full upload/push cycle.

## File Organization Notes

Important source locations:

- `topic-design-previews/*.html` contains editable topic preview source HTML.
- `public/topic-design-previews/*.html` contains the published copy used by the site.
- `public/prototypes/*.html` contains older prototype pages that may not yet be migrated.
- `public/edition-art/` contains blog card cover art.
- `public/blog/` contains blog article images.
- `docs/OUTSOURCING_CODE_MAP.md` explains which folders to hand to external collaborators.
- `reference_materials/archive/project-materials/design-system/design_system_guidelines.md` contains broader local-only design-system notes.
- `reference_materials/archive/project-materials/design-inputs/` contains local-only user-provided redesigned HTML inputs.
- `reference_materials/archive/project-materials/legacy-topic-examples/` contains local-only older standalone HTML examples.

When starting a new topic or blog task, read this file first, then read the relevant existing page and any user-provided content.

## Quick Checklist Before Finishing

Before telling the user the work is done, check:

- teaching content was preserved or intentionally updated from user-provided text
- formulas are readable and not too large or too small
- animation controls still work
- no unwanted key-concepts blocks remain if the user asked to remove them
- no duplicated internal prototype header remains
- page style matches the current purple / blue / teal site
- card effects are not too heavy
- images load correctly
- local build passes when code changed
- Vercel production is updated if the user asked for upload
- GitHub main is pushed only if the user approved it
