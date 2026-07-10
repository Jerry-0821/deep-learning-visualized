# Script Inventory

This document explains which scripts are part of the build and which are manual maintenance tools.

## Build Script

| Script | Used by | Purpose | Cleanup rule |
| --- | --- | --- | --- |
| `scripts/sync_topic_design_previews.mjs` | `npm run build` | Copies editable topic preview HTML/CSS/JS from `topic-design-previews/` into `public/topic-design-previews/` and rewrites local prototype paths for production. | Do not move or delete. Changes can affect Vercel output. |

## Manual Prototype Export

| Script | Purpose | Notes |
| --- | --- | --- |
| `scripts/export_notebook_prototypes.py` | Regenerates `public/prototypes/*.html` from tracked files in `source/visualizations/**`. | Not part of the normal build. It overwrites public prototype HTML, so run it only when intentionally regenerating prototypes and then verify affected topic routes. |

## Formula Hub Verification

| Script | Purpose |
| --- | --- |
| `scripts/formula_hub_test_utils.mjs` | Shared loader/assertion helpers for Formula Hub checks. |
| `scripts/verify_formula_hub_integrity.mjs` | Checks duplicate ids, missing source ids, broken relations, and empty steps. |
| `scripts/verify_formula_hub_search.mjs` | Checks required Formula Hub source/topic-model coverage. Despite the name, this is not the current ranking-quality check. |
| `scripts/verify_formula_hub_search_v2.mjs` | Current Formula Hub search ranking verification. |
| `scripts/verify_formula_hub_batch_*.mjs` | Batch-specific Formula Hub content checks for graph, logistic, activation/loss, optimizers, initialization, regularization, CNN, RNN/LSTM, and attention/Transformer groups. |

## Topic Preview Verification

| Script | Purpose |
| --- | --- |
| `scripts/verify_single_neuron_preview.mjs` | Guards the Single Neuron preview against losing authoritative prototype behavior and teaching content. |
| `scripts/verify_topic_preview_rollout.mjs` | Checks redesigned topic preview shell contracts and per-topic rollout details. |
| `scripts/verify_topic_preview_app_integration.mjs` | Checks app routing, sync script wiring, icon presence, and topic preview mappings. |

## Blog Tools

| Script | Purpose | Notes |
| --- | --- | --- |
| `scripts/verify_blog_editorial_rollout.mjs` | Checks blog content/layout/editorial rollout files. | Manual verification helper. |
| `scripts/generate_siamese_blog_assets.mjs` | Generates Siamese Network blog images and cover art used by `data/blogPosts.ts`. | Manual asset-generation script. It writes `public/blog/siamese-network/**` and `public/edition-art/blog-siamese-network.svg`; do not run unless intentionally regenerating those website assets. It imports `sharp`, which is currently available through Next's optional dependency lockfile entry rather than a direct `package.json` dependency. |

## Cleanup Guidance

- Keep build scripts and verification scripts in GitHub because they explain and protect the current website.
- Do not run scripts that write into `public/**` unless the intent is to update website assets.
- If a script becomes obsolete, prefer documenting its replacement before deleting it.
