# HTML Asset Manifest

This manifest explains which HTML files are part of the live website, which files are generated copies, and which files are archive/reference material.

The goal is to keep local development, Vercel production, and GitHub aligned while preventing the repository from looking like a loose pile of unrelated HTML pages.

## Safety Rule

Do not move or remove an HTML file until it has one of these labels:

- `Active runtime`: served directly by the website.
- `Active source`: edited as the source for generated/public HTML.
- `Generated copy`: produced from source by a script.
- `Archive material`: reference, design input, handoff, or old edition.
- `Local-only material`: useful locally, but not needed in GitHub.

Before any cleanup batch:

1. Check references with `rg`.
2. Move only one category at a time.
3. Run `npm.cmd run build`.
4. Verify important pages locally when layout/runtime files are touched.
5. Commit only the intended category.

## Current HTML Counts

Current tracked HTML inventory:

| Area | Tracked HTML count | Category | Website risk |
| --- | ---: | --- | --- |
| `public/prototypes/` | 19 | Active runtime | High |
| `public/topic-design-previews/` | 17 | Generated copy, currently served | High until build/dev flow is adjusted |
| `topic-design-previews/` | 17 | Active source | High |
| `public/mindmap/` | 1 | Active runtime | High |
| `project-materials/` | 10 | Archive material | Low |
| `outdated-materials/` | 3 | Archive/outdated material | Low |

Untracked local HTML currently observed:

| Area | HTML count | Category | Recommendation |
| --- | ---: | --- | --- |
| `docs/formula-hub-design/` | 1 | Design/reference material | Keep as docs or move to local-only reference after review |
| `project-materials/design-handoffs/` | 2 | Handoff/export material | Prefer local-only or archive; not runtime |
| `project-materials/design-inputs/train-val-test-split/` | 1 | Design input | Archive/reference; not runtime |
| `reference_materials/` | 8 | Local-only material | Already ignored by Git |

Generated and dependency folders are not source material:

- `.next/` contains build output.
- `node_modules/` contains installed dependencies.
- These should not be used to decide source organization.

## Active Runtime HTML

These files are directly reachable by browser URL or iframe and must not be moved casually.

### Public Prototypes

Folder: `public/prototypes/`

Status: active runtime.

Used by:

- `data/prototypeMappings.ts`
- `components/topic/EmbeddedPrototypePage.tsx`
- `components/topic/PrototypeFrame.tsx`
- `topic-design-previews/topic-preview-shell.js`
- several verification scripts

Tracked files:

- `public/prototypes/activation-functions-comparison.html`
- `public/prototypes/adam-optimizer-vs-sgd.html`
- `public/prototypes/adam-vs-sgd.html`
- `public/prototypes/attention-mechanism-intuition.html`
- `public/prototypes/backpropagation-intuition.html`
- `public/prototypes/bias-vs-variance-diagnosis.html`
- `public/prototypes/convolution-operation.html`
- `public/prototypes/dropout.html`
- `public/prototypes/evaluation-metrics-confusion-matrix.html`
- `public/prototypes/feature-map-visualization.html`
- `public/prototypes/gradient-descent-learning-rate.html`
- `public/prototypes/loss-functions.html`
- `public/prototypes/mini-batch-training-batch-size.html`
- `public/prototypes/neuron-structure.html`
- `public/prototypes/overfitting-vs-underfitting.html`
- `public/prototypes/pooling.html`
- `public/prototypes/rnn-structure.html`
- `public/prototypes/train-val-test-split.html`
- `public/prototypes/transfer-learning-intuition.html`

Cleanup decision:

- Do not remove from GitHub right now.
- Do not move unless every URL and iframe reference is changed and tested.
- Long-term replacement would be a React/TSX rebuild of each prototype, but that is feature work, not cleanup.

### Mindmap HTML

File: `public/mindmap/training-pipeline-mindmap.html`

Status: active runtime.

Used by:

- `app/mindmap/page.tsx`

Cleanup decision:

- Do not move.
- If rebuilt later, replace with a React route or a generated static asset only after testing `/mindmap`.

## Active Source HTML

Folder: `topic-design-previews/`

Status: active source for redesigned topic preview pages.

Used by:

- `scripts/sync_topic_design_previews.mjs`
- `data/redesignedTopicPreviews.ts`
- `components/topic/RedesignedTopicPage.tsx`
- verification scripts

Tracked files:

- `topic-design-previews/activation-functions-comparison.html`
- `topic-design-previews/adam-vs-sgd.html`
- `topic-design-previews/attention-mechanism-intuition.html`
- `topic-design-previews/backpropagation-intuition.html`
- `topic-design-previews/bias-vs-variance-diagnosis.html`
- `topic-design-previews/convolution-operation.html`
- `topic-design-previews/dropout.html`
- `topic-design-previews/evaluation-metrics-confusion-matrix.html`
- `topic-design-previews/feature-map-visualization.html`
- `topic-design-previews/gradient-descent-learning-rate.html`
- `topic-design-previews/loss-functions.html`
- `topic-design-previews/mini-batch-training-batch-size.html`
- `topic-design-previews/overfitting-vs-underfitting.html`
- `topic-design-previews/rnn-structure.html`
- `topic-design-previews/single-neuron.html`
- `topic-design-previews/train-val-test-split.html`
- `topic-design-previews/transfer-learning-intuition.html`

Cleanup decision:

- Keep in GitHub for now.
- These are the editable HTML sources for the current topic preview experience.
- If these are moved, `sync_topic_design_previews.mjs`, verification scripts, and docs must be updated in the same commit.

## Generated Public Copies

Folder: `public/topic-design-previews/`

Status: generated copy, but currently served by the live website.

Generated by:

- `scripts/sync_topic_design_previews.mjs`

Generated from:

- `topic-design-previews/`

Served by:

- paths in `data/redesignedTopicPreviews.ts`, for example `/topic-design-previews/single-neuron.html`

Tracked files:

- `public/topic-design-previews/activation-functions-comparison.html`
- `public/topic-design-previews/adam-vs-sgd.html`
- `public/topic-design-previews/attention-mechanism-intuition.html`
- `public/topic-design-previews/backpropagation-intuition.html`
- `public/topic-design-previews/bias-vs-variance-diagnosis.html`
- `public/topic-design-previews/convolution-operation.html`
- `public/topic-design-previews/dropout.html`
- `public/topic-design-previews/evaluation-metrics-confusion-matrix.html`
- `public/topic-design-previews/feature-map-visualization.html`
- `public/topic-design-previews/gradient-descent-learning-rate.html`
- `public/topic-design-previews/loss-functions.html`
- `public/topic-design-previews/mini-batch-training-batch-size.html`
- `public/topic-design-previews/overfitting-vs-underfitting.html`
- `public/topic-design-previews/rnn-structure.html`
- `public/topic-design-previews/single-neuron.html`
- `public/topic-design-previews/train-val-test-split.html`
- `public/topic-design-previews/transfer-learning-intuition.html`

Cleanup decision:

- This is the best candidate for reducing GitHub HTML count later.
- Safe plan requires changing scripts before removing tracked copies:
  - Make `npm run dev` run the sync step before `next dev`.
  - Keep `npm run build` running the sync step.
  - Add `public/topic-design-previews/` to `.gitignore`.
  - Remove tracked generated copies with `git rm --cached` only after local and Vercel builds are verified.
- Do not do this in an archive cleanup commit.

## Archive Material

These files are useful as design records or historical reference, but the website does not import or serve them directly.

### Project Materials

Folder: `project-materials/`

Status: archive material.

Tracked HTML:

- `project-materials/design-inputs/redesign-visualized-content-decided/adam_vs_sgd/adam-vs-sgd_v3.html`
- `project-materials/design-inputs/redesign-visualized-content-decided/loss function/topics_v3/loss-functions.html`
- `project-materials/design-inputs/redesign-visualized-content-decided/mini-batch/mini-batch-training-batch-size.html`
- `project-materials/design-inputs/redesign-visualized-content-decided/Overfitting vs. Underfitting/topics_v2/overfitting-vs-underfitting.html`
- `project-materials/design-inputs/transfer-learning-intuition/v3/transfer-learning-intuition.html`
- `project-materials/legacy-topic-examples/mindmap_v5_brutalism(final).html`
- `project-materials/legacy-topic-examples/single_neuron_final.html`
- `project-materials/old-site-editions/final-edition/blog_v1.html`
- `project-materials/old-site-editions/final-edition/index.html`
- `project-materials/old-site-editions/final-edition/topics_v1_tilt.html`

Untracked local HTML:

- `project-materials/design-handoffs/latest-homepage.html`
- `project-materials/design-handoffs/real-homepage-from-build/index.raw-from-next-build.html`
- `project-materials/design-handoffs/real-homepage-from-build/index.viewable-local.html`
- `project-materials/design-inputs/train-val-test-split/v6/train-val-test-split.html`

Cleanup decision:

- Safe to keep as archive.
- If GitHub should look more code-focused, this folder can become local-only later:
  - Move important public notes to `docs/`.
  - Move bulky/raw HTML handoffs to `reference_materials/`.
  - Add a short tracked README explaining where local reference material lives.

### Outdated Materials

Folder: `outdated-materials/`

Status: archive/outdated material.

Tracked HTML:

- `outdated-materials/formula-hub-reference/formula-hub-v6.html`
- `outdated-materials/old-standalone-prototypes/activation/v1/activation-functions-comparison.html`
- `outdated-materials/old-standalone-prototypes/feature-map/fm_v4.html`

Cleanup decision:

- Safe to keep as a tracked archive if the design history matters.
- Also safe to move to `reference_materials/` later if GitHub should contain less HTML.
- Do not mix this cleanup with active runtime changes.

## Local-only Material

Folder: `reference_materials/`

Status: local-only reference.

Git status:

- Ignored by `.gitignore`.

Observed HTML count:

- 8 local HTML files.

Cleanup decision:

- This is the safest destination for raw inputs, private notes, old web exports, and non-runtime design material that should not appear on GitHub.
- Moving archive HTML here keeps local access while removing it from GitHub.

## Recommended Cleanup Batches

### Batch 1: Document-only inventory

Risk: none.

Actions:

- Maintain this manifest.
- Do not move runtime HTML.
- Run build.

### Batch 2: Archive-only GitHub cleanup

Risk: low.

Candidate folders:

- `project-materials/design-handoffs/`
- `outdated-materials/`
- old `project-materials/design-inputs/` HTML if not needed on GitHub

Safe approach:

- Move chosen archive material into `reference_materials/` or keep it tracked with a clear README.
- Do not touch `public/`.
- Do not touch `topic-design-previews/`.
- Run build.

### Batch 3: Generated-copy cleanup

Risk: medium.

Candidate folder:

- `public/topic-design-previews/`

Safe approach:

- Update npm scripts so local dev and production build both generate the folder.
- Add the generated folder to `.gitignore`.
- Remove tracked generated copies only after build passes.
- Verify `/topics` and several `/topic/...` pages.

### Batch 4: Runtime HTML rebuilds

Risk: high.

Candidate folders:

- `public/prototypes/`
- `topic-design-previews/`
- `public/mindmap/`

Meaning:

- Rebuild selected HTML experiences as React/TSX or data-driven components.
- The user still views the result in localhost/Vercel.
- The source becomes code instead of standalone HTML.

This is not a cleanup task. Treat each page as a feature migration.

## Quick Decision Table

| Path | Move now? | Remove from GitHub now? | Reason |
| --- | --- | --- | --- |
| `app/` | No | No | Website routes |
| `components/` | No | No | Website components |
| `data/` | No | No | Website content and route mappings |
| `scripts/` | No | No | Build and verification scripts |
| `public/prototypes/` | No | No | Active iframe runtime |
| `public/mindmap/` | No | No | Active `/mindmap` runtime |
| `topic-design-previews/` | No | No | Active editable source |
| `public/topic-design-previews/` | Not yet | Later | Generated but currently served |
| `project-materials/` | Maybe | Maybe | Archive, not runtime |
| `outdated-materials/` | Maybe | Maybe | Archive, not runtime |
| `reference_materials/` | N/A | Already ignored | Local-only reference |

