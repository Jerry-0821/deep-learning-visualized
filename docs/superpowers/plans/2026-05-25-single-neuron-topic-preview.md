# Single Neuron Topic Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone editorial Single Neuron preview while preserving the complete
existing lesson, and record the preservation rules for all later topic redesigns.

**Architecture:** The new preview provides the approved editorial reading layout and mounts the
complete authoritative interaction from `public/prototypes/neuron-structure.html` at runtime
inside its interactive figure. The approved revision keeps the original runtime DOM alive but
moves activation explanations into a default-closed right reading drawer, renders the original
calculation sequence there as stable LaTeX, and places current-moment text near the controls.
The structured notes below reproduce the existing `neuron-structure` supporting content, while
a focused Node verifier protects the original content and drawer contract.

**Tech Stack:** Static HTML/CSS, MathJax, Node.js assertions, Codex in-app browser.

---

### Task 1: Establish Content-Preservation Checks

**Files:**
- Create: `scripts/verify_single_neuron_preview.mjs`

- [x] Add a Node script that reads the authoritative prototype and asserts that the animation
  retains `neuronCanvasA`, the calculated-formula output IDs, activation output IDs, and
  current-moment IDs, with calculated formulas following the canvas in document order.
- [x] Have the same script require `topic-design-previews/README.md` and
  `topic-design-previews/single-neuron.html`.
- [x] Assert that the preview loads `../public/prototypes/neuron-structure.html`, places its
  interactive area before its teaching notes and important formulas, and includes exact key
  phrases copied from the current lesson notes.
- [x] Run `node scripts/verify_single_neuron_preview.mjs` before creating the preview files and
  confirm it fails because those deliverables do not exist.

### Task 2: Record Rules And Build The Preview

**Files:**
- Create: `topic-design-previews/README.md`
- Create: `topic-design-previews/single-neuron.html`

- [x] Write the durable redesign reminder: no teaching-content changes, formulas below the
  animation, local/live source comparison required, and visual references are styling only.
- [x] Build a standalone editorial shell using the local design tokens, display/body fonts,
  translucent header, sticky table of contents, and borderless reading layout.
- [x] Mount the authoritative local Single Neuron prototype rather than duplicating or
  shortening its JavaScript/DOM; preserve its full dynamic calculation and MathJax outputs.
- [x] Render the unchanged structured notes after the interaction: Background, Important
  formulas, Pros, Cons, Quick example, and Common mistake.

### Task 3: Verify The Deliverable

**Files:**
- Verify: `scripts/verify_single_neuron_preview.mjs`
- Verify: `topic-design-previews/single-neuron.html`
- Verify: `topic-design-previews/README.md`

- [x] Run the focused Node verifier and confirm all preservation/order assertions pass.
- [x] Open the preview in the in-app browser, confirm the editorial layout renders, and inspect
  the embedded original controls and formula output below the canvas.
- [x] Step through animation stages and change the activation choice to confirm the preserved
  calculation and activation-formula output still updates.
- [x] Inspect Git status to confirm the active production prototype and routes were untouched.

### Task 4: Add The Approved Drawer Regression Checks

**Files:**
- Modify: `scripts/verify_single_neuron_preview.mjs`

- [x] Assert the README records the reusable rule for a default-closed, resizable right-side
  drawer when an animation previously required following changing calculation cards.
- [x] Assert the preview declares `calculation-drawer-toggle`, `calculation-drawer`,
  `drawer-resizer`, and `live-moment-status`, while continuing to load the authoritative
  interaction file rather than editing the production prototype.
- [x] Assert the drawer source contains the four original running-sum equations:
  `0.96`, `0.48`, `0.93`, and `1.33`, plus an activation-dependent final-result container.
- [x] Run `node scripts/verify_single_neuron_preview.mjs` before updating README or HTML and
  confirm it fails on the missing approved drawer rule.

### Task 5: Implement The Reading Drawer Pattern

**Files:**
- Modify: `topic-design-previews/README.md`
- Modify: `topic-design-previews/single-neuron.html`

- [x] Document the approved reusable behavior: dynamic calculation walkthroughs open through a
  three-line button into a closed-by-default resizable reading drawer, activation information
  moves into that drawer, and current-moment instruction remains a lightweight live status.
- [x] Add the drawer button, fixed right drawer, resize separator, close behavior, plain
  typography, small-screen sheet treatment, and stable MathJax calculation list.
- [x] After mounting the authoritative source, keep its changing formula nodes hidden for its
  runtime, move its unchanged activation-description and activation-formula nodes into the
  drawer, and move its unchanged current-moment nodes into the lightweight status area.
- [x] Render the activation-dependent final equation in the drawer from the authoritative
  formula/value outcomes whenever `activationSelectA` changes; it must not change as playback
  merely advances through time.

### Task 6: Verify Drawer Interaction And Preservation

**Files:**
- Verify: `scripts/verify_single_neuron_preview.mjs`
- Verify: `topic-design-previews/single-neuron.html`
- Verify: `topic-design-previews/README.md`

- [x] Run `node scripts/verify_single_neuron_preview.mjs` and confirm the drawer/content
  assertions pass.
- [x] Open the visible local preview and confirm the drawer is closed at first render, opens
  from the three-line button, and responds to keyboard resize control.
- [x] Confirm animation stages change the lightweight `Current moment` text without replacing
  the full calculation list in the drawer.
- [x] Switch from sigmoid to ReLU and confirm drawer activation formula/result update from
  `0.79` to `1.33`.
- [x] Confirm `git diff --name-only -- public data app components` remains empty.

### Task 7: Add The Approved Left-Navigation Regression Checks

**Files:**
- Modify: `scripts/verify_single_neuron_preview.mjs`

- [x] Assert the README records `Navigation Drawer Rule:` for every topic, including desktop
  default-open and narrow-screen default-closed behavior.
- [x] Assert the preview declares `navigation-drawer-toggle`, `navigation-drawer`,
  `navigation-backdrop`, and the white outline sidebar icon class.
- [x] Assert the preview initially marks the desktop navigation as expanded while the right
  calculation drawer remains `aria-hidden="true"`.
- [x] Run `node scripts/verify_single_neuron_preview.mjs` before updating README or HTML and
  confirm it fails because the new navigation rule is absent.

### Task 8: Implement The Universal Topic Navigation Drawer

**Files:**
- Modify: `topic-design-previews/README.md`
- Modify: `topic-design-previews/single-neuron.html`

- [x] Add the durable rule: on desktop each topic opens with `On This Page` displayed in a
  collapsible left drawer; on narrow screens that drawer starts closed and overlays when opened.
- [x] Move the existing topic navigation into `navigation-drawer`, add the white outline
  sidebar toggle icon and backdrop, and preserve every existing anchor target.
- [x] Make collapsing the desktop drawer reclaim horizontal space for the reading column while
  keeping navigation visible by default at first render.
- [x] Close the left overlay on narrow-screen link selection, backdrop, or `Escape`, without
  changing the right calculation drawer's closed-by-default behavior.

### Task 9: Verify Two-Drawer Behavior And Preservation

**Files:**
- Verify: `scripts/verify_single_neuron_preview.mjs`
- Verify: `topic-design-previews/single-neuron.html`
- Verify: `topic-design-previews/README.md`

- [x] Run `node scripts/verify_single_neuron_preview.mjs` and confirm both drawer contracts and
  content assertions pass.
- [x] In a desktop viewport, confirm the left outline drawer initially appears, collapses and
  reopens from its white icon while the right calculation drawer remains independent.
- [x] In a narrow viewport, confirm left navigation initially hides and closes after selecting
  a section link or its backdrop.
- [x] Recheck calculation-drawer activation output and confirm production directories remain
  unchanged.
