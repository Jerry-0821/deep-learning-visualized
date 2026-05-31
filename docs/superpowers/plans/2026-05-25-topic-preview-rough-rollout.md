# Rough Topic Preview Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build rough editorial-template preview pages for the user-specified topics without changing any authoritative lesson or prototype file.

**Architecture:** Keep authoritative interactive prototypes inside same-origin frames under a
shared standalone preview shell. The shell supplies the topbar, default desktop navigation
drawer, reserved reading sections, and right reading drawer. For the four approved live-output
topics, mirror the existing DOM outputs into the drawer and hide only those duplicated source
panels; computation and controls continue to run inside the original frame.

**Tech Stack:** Standalone HTML/CSS/JavaScript, same-origin iframe DOM mirroring, Node assertion scripts, Codex in-app browser.

---

### Task 1: Contract Checks

**Files:**
- Create: `scripts/verify_topic_preview_rollout.mjs`
- Modify: `topic-design-previews/README.md`

- [x] Add assertions for the universal shell: topbar `Back to module`, left navigation
  drawer, right drawer, absence of the old repeated outer action pattern, and placeholder
  sections for four missing-notes topics.
- [x] Add assertions for drawer classifications: live mirroring for
  `backpropagation-intuition`, `convolution-operation`, `dropout`, and
  `gradient-descent-learning-rate`; empty drawers for `attention-mechanism-intuition`,
  `evaluation-metrics-confusion-matrix`, `bias-vs-variance-diagnosis`,
  `transfer-learning-intuition`, and `rnn-structure`.
- [x] Run `node scripts/verify_topic_preview_rollout.mjs` and confirm it fails because the
  shared shell files/pages do not exist yet.

### Task 2: Shared Rough Preview Shell

**Files:**
- Create: `topic-design-previews/topic-preview-shell.css`
- Create: `topic-design-previews/topic-preview-shell.js`
- Modify: `topic-design-previews/single-neuron.html`
- Modify: `scripts/verify_single_neuron_preview.mjs`

- [x] Implement the common editorial topbar with `Back to module`, the left navigation
  drawer behavior, and a right drawer closed by default.
- [x] Load each authoritative prototype from `../public/prototypes/<slug>.html` in a
  same-origin frame; do not edit anything beneath `public/prototypes/`.
- [x] Provide topic configurations with module links, titles, subtitles, prototype paths,
  reserved-sections status, and drawer mode.
- [x] Add `Back to module` to the existing Single Neuron preview and extend its preservation
  verification.

### Task 3: Rough Preview Pages And Reading Sections

**Files:**
- Create: `topic-design-previews/attention-mechanism-intuition.html`
- Create: `topic-design-previews/evaluation-metrics-confusion-matrix.html`
- Create: `topic-design-previews/bias-vs-variance-diagnosis.html`
- Create: `topic-design-previews/transfer-learning-intuition.html`
- Create: `topic-design-previews/rnn-structure.html`
- Create: `topic-design-previews/backpropagation-intuition.html`
- Create: `topic-design-previews/convolution-operation.html`
- Create: `topic-design-previews/dropout.html`
- Create: `topic-design-previews/gradient-descent-learning-rate.html`

- [x] Use one minimal page entry point per topic that declares its slug and loads the shared
  shell.
- [x] For the four topics without approved notes, render reserved empty sections only:
  `Background`, `Important formulas`, `Pros / Cons`, and `Example / Mistake`.
- [x] For existing-notes pages in this batch, render the already-approved local structured
  notes without adding new instructional language.
- [x] Keep `rnn-structure` interaction content intact and provide its empty drawer only.

### Task 4: Approved Live Reading Drawers

**Files:**
- Modify: `topic-design-previews/topic-preview-shell.js`
- Modify: `topic-design-previews/topic-preview-shell.css`

- [x] Mirror the original Backpropagation formula/cache/concept/current-moment outputs to its
  right drawer and suppress only the duplicated source output blocks in its frame.
- [x] Mirror the original Convolution live calculation, filter characteristics, and current
  step blocks to its right drawer.
- [x] Mirror the original Dropout live math, current action, and PyTorch context blocks to its
  right drawer.
- [x] Mirror the original Gradient Descent five approved output blocks to its right drawer.
- [x] Keep mutation synchronization active so selector/step/play interactions update the
  drawer from the authoritative running prototype.

### Task 5: Verification

**Files:**
- Verify: `scripts/verify_single_neuron_preview.mjs`
- Verify: `scripts/verify_topic_preview_rollout.mjs`

- [x] Run the two Node verification scripts and confirm both pass.
- [x] In the in-app browser, verify one empty-drawer page and each live-drawer family at least
  once; confirm the drawer opens, content is in its approved location, and interactions still
  update it.
- [x] Confirm `git diff --name-only -- public data app components` is empty.
