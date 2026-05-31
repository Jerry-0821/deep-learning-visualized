# Evaluation Metrics Flat Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Evaluation preview's embedded prototype card with a page-native flat interaction and restore ordinary non-scrollable LaTeX reading flow.

**Architecture:** Extend the existing standalone preview shell with a topic-only `inline-evaluation` interaction renderer and controller. It reuses the original fixed score sample set and metric equations inside the preview code, while other topics continue to render their authoritative iframes unchanged.

**Tech Stack:** Standalone HTML/CSS/JavaScript, MathJax, Node assertion verification, Codex in-app browser.

---

### Task 1: Lock The New Presentation Contract

**Files:**
- Modify: `scripts/verify_topic_preview_rollout.mjs`

- [x] Add assertions that the Evaluation config uses `interactionMode: "inline-evaluation"`, the shell exposes its inline renderer/controller markers, and the config no longer embeds the old prototype iframe.
- [x] Add assertions that static formula styling does not opt into `overflow-x: auto`.
- [x] Run `node scripts\verify_topic_preview_rollout.mjs` and confirm failure occurs because inline rendering is not implemented yet.

### Task 2: Render The Inline Evaluation Interaction

**Files:**
- Modify: `topic-design-previews/topic-preview-shell.js`
- Modify: `topic-design-previews/topic-preview-shell.css`

- [x] Add an `inline-evaluation` config mode and render a flat interaction surface containing metric buttons, threshold input, score strip SVG, confusion matrix, metrics display, and current insight.
- [x] Reuse the source prototype sample values and rules:
  `predictedPositive = score >= threshold`,
  `Accuracy = (TP + TN) / total`,
  `Precision = TP / (TP + FP)`,
  `Recall = TP / (TP + FN)`, and
  `F1 = 2 * Precision * Recall / (Precision + Recall)`.
- [x] Wire metric buttons and threshold input so every visible count, metric value, formula, highlighting, and insight updates from the same state.
- [x] Keep the empty right drawer behavior unchanged.

### Task 3: Repair Static Formula And Vertical Flow Styling

**Files:**
- Modify: `topic-design-previews/topic-preview-shell.css`

- [x] Remove scrollable formula-block behavior and override MathJax display overflow inside reading formulas.
- [x] Remove formula-panel treatment from the approved static lesson so formulas read as ordinary display math separated by whitespace.
- [x] Rely on the inline interaction's natural height so `Background` follows the interaction without the former iframe blank region.

### Task 4: Verification

**Files:**
- Verify: `scripts/verify_topic_preview_rollout.mjs`
- Verify: `scripts/verify_single_neuron_preview.mjs`

- [x] Run both Node verifiers and JavaScript syntax checking.
- [x] Confirm `git diff --name-only -- public data app components` remains empty.
- [x] In the local browser, check the Evaluation page: no iframe in the interactive section, metric selection updates content, formulas do not internally scroll, `Background` follows at a reasonable gap, and the right drawer remains closed and empty. Threshold update wiring is included from the same state renderer; browser automation could not drive the native range control reliably.
