# Bias vs. Variance Flat Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bias preview's embedded dashboard card with a page-native flat diagnostic interaction and the user-approved static reading lesson.

**Architecture:** Extend the existing standalone topic preview shell with a Bias-only `inline-bias-variance` renderer and controller. It preserves the source prototype's input state, presets, gap equations, diagnosis rules, and helper curve while removing duplicated instructional prose from the visual layer; other topic prototypes remain unchanged.

**Tech Stack:** Standalone HTML/CSS/JavaScript, MathJax, Node assertion verification, Codex in-app browser.

---

### Task 1: Add Contract Tests For The Approved Bias Page

**Files:**
- Modify: `scripts/verify_topic_preview_rollout.mjs`

- [x] **Step 1: Require the new reading and interaction configuration**

Add assertions that the Bias config contains:

```js
`reservedReading: false`
`readingMode: "bias-variance-supplement"`
`interactionMode: "inline-bias-variance"`
```

and does not contain:

```js
`prototype: "../public/prototypes/bias-vs-variance-diagnosis.html"`
```

- [x] **Step 2: Require approved static lesson and interaction markers**

Assert that the shell includes the approved text markers and renderer/controller markers:

```js
"Where does the biggest error gap appear?"
"Avoidable Bias"
"Data Mismatch"
"The biggest gap usually tells you what to fix first."
"renderBiasVarianceInteraction"
"initializeBiasVarianceInteraction"
"bias-error-stack"
"bias-gap-grid"
"bias-diagnosis-result"
```

Also require `.bias-interaction`, `.bias-error-stack`, and `.bias-gap-grid` in the shared CSS.

- [x] **Step 3: Run the verifier to prove the new behavior is missing**

Run:

```powershell
node scripts\verify_topic_preview_rollout.mjs
```

Expected: FAIL on the Bias page configuration or asset revision assertion because it still renders the prior reserved iframe page.

### Task 2: Render The Flat Bias Interaction

**Files:**
- Modify: `topic-design-previews/topic-preview-shell.js`
- Modify: `topic-design-previews/topic-preview-shell.css`
- Modify: `topic-design-previews/bias-vs-variance-diagnosis.html`

- [x] **Step 1: Switch the topic to its inline visual mode**

Update the Bias config to use:

```js
drawerMode: "empty",
reservedReading: false,
readingMode: "bias-variance-supplement",
interactionMode: "inline-bias-variance",
```

and version its page assets as `?v=bias-visual-1`.

- [x] **Step 2: Render only interactive visual teaching**

Add `renderBiasVarianceInteraction()` with:

```html
<div class="bias-interaction" id="bias-interaction">
  <!-- scenario presets; five numeric range controls; baseline presets; view mode -->
  <!-- bias-error-stack; bias-gap-grid; helper curve; compact bias-diagnosis-result -->
</div>
```

Do not add static `Takeaway`, `Recommended Fix`, `Pros / Cons`, `Common Mistake`, or long core-logic explanation inside that visual root.

- [x] **Step 3: Preserve the original calculation behavior**

In `initializeBiasVarianceInteraction()`, use the source preset values and equations:

```js
const bias = Math.max(0, state.train - state.human);
const variance = state.mismatchMode
  ? Math.max(0, state.trainDev - state.train)
  : Math.max(0, state.dev - state.train);
const mismatch = state.mismatchMode ? Math.max(0, state.dev - state.trainDev) : 0;
const devOverfit = Math.max(0, state.test - state.dev);
```

Update bars, visible gap results, helper SVG curve, and current diagnosis from a shared `render()` after every preset, baseline, mode, or range-input change.

- [x] **Step 4: Style the visual as document flow rather than a dashboard**

Add flat `.bias-*` styles based on divider rules, line-oriented inputs, modest color encodings, and balanced whitespace. Avoid an outer iframe/card frame or decorative nested cards.

### Task 3: Render The Approved Static Lesson

**Files:**
- Modify: `topic-design-previews/topic-preview-shell.js`
- Modify: `topic-design-previews/topic-preview-shell.css`

- [x] **Step 1: Add the reading sections and navigation destinations**

Add `renderBiasVarianceSupplement()` containing the approved Background, Important Formulas,
Diagnosis Table, Example, Recommended Fix, Pros / Cons, Common Mistake, and Takeaway text.
Route `readingSections()` and `renderNavigationLinks()` through `readingMode: "bias-variance-supplement"`.

- [x] **Step 2: Typeset formulas in ordinary document flow**

Generalize `typesetSupplementMath()` so both approved supplement reading modes load MathJax.
Use existing `.lesson-formula` and `.lesson-table` styles without overflow-driven formula
surfaces.

- [x] **Step 3: Run the contract verifier**

Run:

```powershell
node scripts\verify_topic_preview_rollout.mjs
```

Expected: `Rough topic preview rollout checks passed.`

### Task 4: Verify Interaction And Scope

**Files:**
- Verify: `scripts/verify_topic_preview_rollout.mjs`
- Verify: `scripts/verify_single_neuron_preview.mjs`
- Verify: `topic-design-previews/topic-preview-shell.js`

- [x] **Step 1: Run automated verification**

Run:

```powershell
node scripts\verify_topic_preview_rollout.mjs
node scripts\verify_single_neuron_preview.mjs
node --check topic-design-previews\topic-preview-shell.js
git diff --name-only -- public data app components
```

Expected: both verifiers pass, JavaScript syntax check exits successfully, and no authoritative/production source paths are listed.

- [x] **Step 2: Verify the page in the local browser**

Open:

```text
http://127.0.0.1:3016/topic-design-previews/bias-vs-variance-diagnosis.html?v=bias-visual-1#interactive-prototype
```

Confirm the page has no interaction iframe, the right drawer starts closed and empty, formulas
do not internally scroll, and selecting `Mismatch` or `High bias` changes the visible gap and
diagnosis states consistently.
