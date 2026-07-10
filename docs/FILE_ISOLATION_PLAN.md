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

## Stage 3C Candidate Evidence

No files were moved or deleted during this pass.

| Candidate | Evidence checked | Current decision |
| --- | --- | --- |
| `public/prototypes/adam-optimizer-vs-sgd.html` | Same SHA256 hash and same length as `public/prototypes/adam-vs-sgd.html`; no app/preview reference points directly to this file; `/topic/adam-optimizer-vs-sgd` resolves through canonical slug `adam-vs-sgd`; production direct URL `/prototypes/adam-optimizer-vs-sgd.html` still returns 200. | Confirmed duplicate public artifact. Do not delete blindly because the direct URL is live. If isolated later, add or accept a redirect/deprecation decision first. |
| `public/blog/batch-normalization/batchnorm-04.png` | 1448x1086 PNG; teaching image about MLP vs CNN BatchNorm axes; not referenced by `data/blogPosts.ts`; production direct URL `/blog/batch-normalization/batchnorm-04.png` still returns 200. | Useful but currently unpublished spare blog image. Do not delete blindly. Later choices are: keep as spare art, add to the article intentionally, or archive with acceptance that the direct public URL disappears. |

## Stage 3D Historical Docs Evidence

No files were moved or deleted during this pass.

| Area | Evidence checked | Current decision |
| --- | --- | --- |
| `docs/superpowers/plans/**` | Four tracked implementation plans for topic preview rollout work. They reference files such as `topic-design-previews/**` and verification scripts, but nothing imports or executes these plan files. | User decided to keep on 2026-07-10. Historical project memory, not runtime-critical. |
| `docs/superpowers/specs/**` | Five tracked design specs for topic previews and the blog editorial shell. They explain approved layout/content decisions that shaped current files. | User decided to keep on 2026-07-10. Historical design memory, not runtime-critical. |
| `docs/superpowers/**` old workflow lines | Several files contain old `REQUIRED SUB-SKILL` text from the workflow used when the plans were written. | Treat as historical notes, not active instructions for current maintenance. Added `docs/superpowers/README.md` to make this clear. |

## Stage 3E Formula Hub Freeze

No Formula Hub files were moved, merged, deleted, or edited during this pass.

| Item | Evidence checked | Current decision |
| --- | --- | --- |
| `codex/formula-hub-dynamic-experiment` | Local branch only; remote branches are only `origin/main`. It contains local experiment commit `6ad4075 Isolate Formula Hub dynamic loading experiment`. | Freeze this branch. It is a half-finished local experiment and must not be merged into `main` during cleanup. |
| Formula Hub experiment files | Commit `6ad4075` modifies `app/globals.css`, `components/formula-hub/FormulaHubClient.tsx`, and adds `components/formula-hub/FormulaHubExplorer.tsx`. | Do not touch these experiment files from `main` cleanup. They affect `/formula-hub` first-render/loading behavior. |
| Branch freshness | The branch fork point is `0e67cb6`; current `main` has several later docs/source-maintenance commits. A raw branch diff includes stale docs differences because the experiment branch is behind `main`. | Do not merge the branch directly. If the experiment is resumed later, start from current `main` and port only the intended Formula Hub changes deliberately. |

## Stage 3F Local Reference Archive Index

No tracked source, runtime files, or public website assets were moved or deleted during this pass.

| Area | Evidence checked | Current decision |
| --- | --- | --- |
| `reference_materials/**` | Ignored by `.gitignore`; `git check-ignore` confirms the folder stays outside Git. Current local inventory is 158 files, about 42 MB. | Keep local-only. Do not upload to GitHub. |
| `reference_materials/README.md` | Added as a local ignored index describing `archive/`, `content_sources/`, `legacy_web_versions/`, `blog-inputs/`, and `project_notes/`. | Keep as local-only map. It makes the archive understandable without promoting old materials into `main`. |
| Archive promotion rule | The folder contains old design handoffs, source inputs, previous website versions, and generated drafts. | Promote only a specific file when a future task needs it; never bulk-copy an archive folder back into tracked code. |

## Candidate Items For Later Isolation

Do not move these yet. They need one more verification pass before any cleanup action.

| Candidate | Current evidence | Risk | Suggested later action |
| --- | --- | --- | --- |
| `public/prototypes/adam-optimizer-vs-sgd.html` | App routes map both `adam-vs-sgd` and `adam-optimizer-vs-sgd` to `public/prototypes/adam-vs-sgd.html`. | Medium, because it is still a public direct URL and documented as a historical runtime artifact. | Check production URL and search traffic/bookmark risk before archiving or redirecting. |
| `public/blog/batch-normalization/batchnorm-04.png` | Present in `public/blog/**` but not referenced by `data/blogPosts.ts` in the Stage 3B scan. | Medium, because it is still a public direct URL and may have been kept for future blog expansion. | Open the file, confirm it is not part of the published article, then decide whether to archive or keep as spare source art. |
| `docs/superpowers/**` | Tracked historical plans/specs from the topic preview rollout. Not used by website runtime; `docs/superpowers/README.md` now marks it as historical, not active instructions. | Low for website, medium for project memory. | Keep, per user decision on 2026-07-10. If GitHub needs to look cleaner later, move to a tracked docs archive folder with the README index instead of deleting. |
| Old local-only material in `reference_materials/archive/**` | Already ignored by Git and not used by routes. | Low for website, possible historical-value risk. | Keep isolated. Only summarize or index it; do not copy it back into tracked folders unless needed. |
| Local branch `codex/formula-hub-dynamic-experiment` | Local branch only, not part of `main`; contains half-finished Formula Hub dynamic loading experiment. | Medium if merged, because it changes `/formula-hub` first-render behavior and is behind current `main`. | Frozen during cleanup. Do not merge, delete, rebase, or tidy this branch until the Formula Hub loading strategy is intentionally resumed. |

Resolved cleanup notes:

- RNN source metadata now points to `source/visualizations/rnn-structure/rnn_structure_colab.py`.
- Old local branches `codex/maintenance-local-cleanup` and `codex/final-edition-index-redesign` were removed after review.

## Recommended Cleanup Order

1. Keep `main` focused on website code and maintenance docs.
2. Leave `reference_materials/**` as the local archive boundary.
3. Leave `codex/formula-hub-dynamic-experiment` frozen until Formula Hub work is resumed intentionally.
4. Use the local `reference_materials/README.md` index when deciding whether any old material is worth promoting.
5. Review duplicate or unreferenced public artifacts, starting with `public/prototypes/adam-optimizer-vs-sgd.html` and `public/blog/batch-normalization/batchnorm-04.png`.
6. Keep `docs/superpowers/**` as visible historical project memory unless a later cleanup explicitly moves it to a tracked docs archive.
7. For any `public/**` candidate, prefer a deprecation note or redirect strategy over immediate deletion.

## Current Decision

No files should be moved or deleted yet.

The safest next practical change is a documentation-only cleanup that makes the current boundaries clear. Runtime cleanup should wait until every candidate has a route check, reference search, production URL check, and successful build.
