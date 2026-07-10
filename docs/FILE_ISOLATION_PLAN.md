# File Isolation Plan

This document is a cleanup plan only. It does not move, delete, or archive files.

Use it to decide what can be isolated later without breaking the live website or losing useful source material.

Last reviewed: 2026-07-10

## Cleanup Rules

Before moving or deleting any file:

1. Check imports from `app/**`, `components/**`, and `data/**`.
2. Check string references in `data/**`, `topic-design-previews/**`, and `public/topic-design-previews/**`.
3. Check build scripts, especially `scripts/sync_topic_design_previews.mjs`.
4. Treat anything under `public/**` as a possible live URL, even if it is not imported.
5. Move only after a build passes and the affected public route has been manually checked.

## Do Not Move In The Cleanup Phase

These files affect the Vercel website, static public URLs, or build output.

| Area | Paths | Why it stays in place |
| --- | --- | --- |
| Next.js routes | `app/**` | Defines public pages and route behavior. |
| React components | `components/**` | Used by live routes, topic pages, blog, Formula Hub, and shared chrome. |
| Site data | `data/**` | Controls curriculum, routes, topic mappings, formulas, and blog content. |
| Global assets and config | `app/globals.css`, `app/layout.tsx`, `next.config.ts`, `tsconfig.json`, `package.json`, `package-lock.json` | Affects build, rendering, styling, and dependencies. |
| Redesigned topic source | `topic-design-previews/**` | Copied into `public/topic-design-previews/**` before build. |
| Published topic previews | `public/topic-design-previews/**` | Loaded by `/topic/[slug]` through iframe routes. |
| Prototype HTML | `public/prototypes/**` | Used by fallback topic pages, preview shell embeds, and possible direct public URLs. |
| Blog images | `public/blog/**` | Referenced by `data/blogPosts.ts`. |
| Card and module art | `public/edition-art/**` | Used by the home page, topic cards, and blog cards. |
| Mindmap HTML | `public/mindmap/training-pipeline-mindmap.html` | Embedded by `/mindmap`. |
| Build sync script | `scripts/sync_topic_design_previews.mjs` | Required by the `build` script. |

## Keep, But Not Runtime-Critical

These files are useful but do not directly render the website unless a developer runs a script, edits code, or references them later.

| Area | Paths | Keep reason |
| --- | --- | --- |
| Visualization source | `source/visualizations/**` | Source of truth for regenerating prototype HTML. |
| Documentation | `docs/**`, `README.md`, `LICENSE` | Maintenance and handoff knowledge. |
| Verification scripts | `scripts/verify_*.mjs`, `scripts/formula_hub_test_utils.mjs` | Useful for checks, not directly used by production routes. |
| Prototype export script | `scripts/export_notebook_prototypes.py` | Useful when intentionally regenerating `public/prototypes/**` from `source/visualizations/**`. |
| README screenshots | `public/readme/**` | Used by GitHub README, not website runtime. |
| Local Vercel binding | `.vercel/project.json` | Useful locally, ignored by Git, not committed. |

## Already Isolated Locally

These should stay outside Git and outside the live website surface.

| Area | Paths | Current status |
| --- | --- | --- |
| Local reference archive | `reference_materials/**` | Ignored by Git. Local-only historical material, raw inputs, notes, and archived drafts. |
| Dependency install | `node_modules/**` | Ignored generated dependency folder. |
| Next build output | `.next/**` | Ignored generated build output. |
| TypeScript cache | `tsconfig.tsbuildinfo` | Ignored generated cache. |
| Local Vercel folder | `.vercel/**` | Ignored local project binding and Vercel state. |

## Stage 3B Read-Only Audit

No files were moved or deleted during this pass.

| Area | Evidence checked | Current decision |
| --- | --- | --- |
| `source/visualizations/**` | 18 topic source folders; mapped by `docs/HTML_AND_SOURCE_MAP.md` and referenced by `data/prototypeMappings.ts` metadata. | Keep in GitHub. Useful source material, but it does not directly render the website unless a developer regenerates prototypes. |
| `topic-design-previews/**` | 17 active redesigned topic HTML files plus shared shell assets; copied into `public/topic-design-previews/**` by `scripts/sync_topic_design_previews.mjs`. | Do not move. Editing this can affect production after build. |
| `public/topic-design-previews/**` | Published copy loaded by `/topic/[slug]` for redesigned topics. | Do not move or manually clean. It is website runtime output. |
| `public/prototypes/**` | Referenced by `data/prototypeMappings.ts`, `topic-design-previews/topic-preview-shell.js`, and direct public URLs. | Treat as runtime/public URL surface. Only isolate individual files after route and direct URL checks. |
| `public/blog/**` | Compared against `data/blogPosts.ts` image references. | Keep referenced images. One unreferenced candidate is listed below. |
| `public/edition-art/**` | Blog cover, topic card, and home module art all match current dynamic app rules. | Do not move. No extra candidate found in this pass. |
| `public/readme/**` | Referenced by `README.md`, not by the live website. | Keep in GitHub for README presentation; not website runtime. |
| `docs/superpowers/**` | Historical tracked planning/spec files, not imported by app code or build scripts. | Useful history, but not runtime-critical. Could be moved to a tracked docs archive later if GitHub cleanup is desired. |
| `reference_materials/**` | Ignored by Git and has no tracked files. | Already isolated locally. Keep ignored unless a specific item is promoted intentionally. |

## Candidate Items For Later Isolation

Do not move these yet. They need one more verification pass before any cleanup action.

| Candidate | Current evidence | Risk | Suggested later action |
| --- | --- | --- | --- |
| `public/prototypes/adam-optimizer-vs-sgd.html` | App routes map both `adam-vs-sgd` and `adam-optimizer-vs-sgd` to `public/prototypes/adam-vs-sgd.html`. | Medium, because it is still a public direct URL and documented as a historical runtime artifact. | Check production URL and search traffic/bookmark risk before archiving or redirecting. |
| `public/blog/batch-normalization/batchnorm-04.png` | Present in `public/blog/**` but not referenced by `data/blogPosts.ts` in the Stage 3B scan. | Medium, because it is still a public direct URL and may have been kept for future blog expansion. | Open the file, confirm it is not part of the published article, then decide whether to archive or keep as spare source art. |
| `docs/superpowers/**` | Tracked historical plans/specs from the topic preview rollout. Not used by website runtime. | Low for website, medium for project memory. | If GitHub needs to look cleaner, move to a tracked docs archive folder with a short index instead of deleting. |
| Old local-only material in `reference_materials/archive/**` | Already ignored by Git and not used by routes. | Low for website, possible historical-value risk. | Keep isolated. Only summarize or index it; do not copy it back into tracked folders unless needed. |
| Local branch `codex/formula-hub-dynamic-experiment` | Local branch only, not part of `main`; contains Formula Hub dynamic loading experiment. | Medium if merged, because it changes `/formula-hub` first-render behavior. | Keep isolated until the Formula Hub loading strategy is intentionally reviewed. |

Resolved cleanup notes:

- RNN source metadata now points to `source/visualizations/rnn-structure/rnn_structure_colab.py`.
- Old local branches `codex/maintenance-local-cleanup` and `codex/final-edition-index-redesign` were removed after review.

## Recommended Cleanup Order

1. Keep `main` focused on website code and maintenance docs.
2. Leave `reference_materials/**` as the local archive boundary.
3. Review duplicate or unreferenced public artifacts, starting with `public/prototypes/adam-optimizer-vs-sgd.html` and `public/blog/batch-normalization/batchnorm-04.png`.
4. Decide whether `docs/superpowers/**` should stay as visible project history or move under a tracked docs archive.
5. For any `public/**` candidate, prefer a deprecation note or redirect strategy over immediate deletion.

## Current Decision

No files should be moved or deleted yet.

The safest next practical change is a documentation-only cleanup that makes the current boundaries clear. Runtime cleanup should wait until every candidate has a route check, reference search, production URL check, and successful build.
