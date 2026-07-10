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

## Candidate Items For Later Isolation

Do not move these yet. They need one more verification pass before any cleanup action.

| Candidate | Current evidence | Risk | Suggested later action |
| --- | --- | --- | --- |
| `public/prototypes/adam-optimizer-vs-sgd.html` | App routes map both `adam-vs-sgd` and `adam-optimizer-vs-sgd` to `public/prototypes/adam-vs-sgd.html`. | Medium, because it is still a public direct URL and documented as a historical runtime artifact. | Check production URL and search traffic/bookmark risk before archiving or redirecting. |
| Old local-only material in `reference_materials/archive/**` | Already ignored by Git and not used by routes. | Low for website, possible historical-value risk. | Keep isolated. Only summarize or index it; do not copy it back into tracked folders unless needed. |
| Old local branch `codex/final-edition-index-redesign` | Local branch only, not part of `main`. | Low for website, but could confuse future work. | Review branch purpose later before deleting any branch. |

Resolved cleanup notes:

- RNN source metadata now points to `source/visualizations/rnn-structure/rnn_structure_colab.py`.

## Recommended Cleanup Order

1. Keep `main` focused on website code and maintenance docs.
2. Leave `reference_materials/**` as the local archive boundary.
3. Review duplicate public artifacts, starting with `public/prototypes/adam-optimizer-vs-sgd.html`.
4. For any `public/**` candidate, prefer a deprecation note or redirect strategy over immediate deletion.

## Current Decision

No files should be moved or deleted yet.

The safest next practical change is a documentation-only cleanup that makes the current boundaries clear. Runtime cleanup should wait until every candidate has a route check, reference search, production URL check, and successful build.
