# Website File Impact Map

This map separates files that affect the live Vercel website from files that are useful for maintenance but do not directly change the public site.

Current Vercel project binding:

- Project: `deep-learning-visualized`
- Project id: `prj_WuVsl6ol2KG059x3WYVi0e7m2cXs`
- Team/org id: `team_6r5X3vqDPSyofe5UabfA9hw4`
- Production URL: `https://deep-learning-visualized.vercel.app`

Verified production paths on 2026-07-10:

- `/`
- `/topics`
- `/blog`
- `/about`
- `/formula-hub`
- `/formula-hub/neuron-weighted-sum`
- `/topic/neuron-structure`
- `/mindmap`

## Build And Deployment Files

These affect the Vercel build or the generated website:

- `package.json`
  - Defines `build` as `npm run sync:topic-previews && next build`.
  - Changing scripts or dependencies can affect Vercel output.
- `package-lock.json`
  - Locks dependency versions used by install/build.
- `next.config.ts`
  - Next.js behavior.
- `tsconfig.json`
  - TypeScript and path alias behavior.
- `next-env.d.ts`
  - Next.js TypeScript support file.
- `app/layout.tsx`
  - Global HTML shell, metadata, font links.
- `app/globals.css`
  - Global CSS for the whole site.
- `app/icon.svg`
  - App icon route.
- `public/favicon.ico`
  - Browser favicon.
- `scripts/sync_topic_design_previews.mjs`
  - Runs before `next build`.
  - Copies `topic-design-previews/*.html`, `topic-preview-shell.css`, and `topic-preview-shell.js` into `public/topic-design-previews/`.
  - Editing `topic-design-previews/` can therefore affect production after build.

## Live Route Map

These routes are the main public website surface.

### Home: `/`

- Entry: `app/page.tsx`
- Main component: `components/landing/LandingPage.tsx`
- Shared chrome: `components/edition/EditionChrome.tsx`
- Data: `data/modules.tsx`
- Assets:
  - `public/edition-art/home-module-1.svg`
  - `public/edition-art/home-module-2.svg`
  - `public/edition-art/home-module-3.svg`
  - Selected blog links from `data/blogPosts.ts`

### Topics Catalog: `/topics`

- Entry: `app/topics/page.tsx`
- Shared chrome: `components/edition/EditionChrome.tsx`
- Data: `data/modules.tsx`
- Assets:
  - `public/edition-art/topic-*.svg`

### Topic Pages: `/topic/[slug]`

- Entry: `app/topic/[slug]/page.tsx`
- Main components:
  - `components/topic/RedesignedTopicPage.tsx`
  - `components/topic/EmbeddedPrototypePage.tsx`
  - `components/topic/PrototypeFrame.tsx`
  - `components/topic/TopicTeachingNotes.tsx`
  - `components/shared/TopicPlaceholderPage.tsx`
- Data:
  - `data/topics.ts`
  - `data/modules.tsx`
  - `data/redesignedTopicPreviews.ts`
  - `data/prototypeMappings.ts`
  - `data/topicTeachingContent.ts`
- Live redesigned topic assets:
  - `public/topic-design-previews/*.html`
  - `public/topic-design-previews/topic-preview-shell.css`
  - `public/topic-design-previews/topic-preview-shell.js`
- Build source for redesigned topic assets:
  - `topic-design-previews/*.html`
  - `topic-design-previews/topic-preview-shell.css`
  - `topic-design-previews/topic-preview-shell.js`
- Prototype assets used by redesigned topic shell or fallback pages:
  - `public/prototypes/*.html`

Important topic routing rule:

- If a slug exists in `data/redesignedTopicPreviews.ts`, `/topic/[slug]` iframes the matching `public/topic-design-previews/*.html`.
- If a slug does not exist there but exists in `data/prototypeMappings.ts`, it falls back to `public/prototypes/*.html`.
- Currently `pooling` is the clear fallback topic and uses `public/prototypes/pooling.html`.

### Module Redirects: `/module/[id]`

- Entry: `app/module/[id]/page.tsx`
- Data: `data/modules.tsx`
- Behavior:
  - Redirects to `/topics#mod-[id]`.
  - Does not render a standalone module page now.

### Formula Hub: `/formula-hub` and `/formula-hub/saved`

- Entries:
  - `app/formula-hub/page.tsx`
  - `app/formula-hub/saved/page.tsx`
- Main component on production `origin/main`:
  - `components/formula-hub/FormulaHubClient.tsx`
- Shared helper:
  - `components/blog/MathJaxRefresh.tsx`
- Data:
  - `data/formulaHub.ts`
  - `data/formulaHubEntries.json`
  - `data/blogPosts.ts`
  - `data/topics.ts`
- External runtime script:
  - `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js`

Current local maintenance branch note:

- `components/formula-hub/FormulaHubExplorer.tsx` is untracked and not part of production `origin/main`.
- The local modified `FormulaHubClient.tsx` dynamically imports `FormulaHubExplorer` with `ssr: false`.
- Treat this as an experimental/local change until reviewed, because it may alter first render, SEO, and no-JS behavior.

### Formula Detail Pages: `/formula-hub/[id]`

- Entry: `app/formula-hub/[id]/page.tsx`
- Data:
  - `data/formulaHub.ts`
  - `data/formulaHubEntries.json`
  - `data/blogPosts.ts`
  - `data/topics.ts`
- Shared helper:
  - `components/blog/MathJaxRefresh.tsx`
- External runtime script:
  - `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js`

### Blog Listing: `/blog`

- Entry: `app/blog/page.tsx`
- Data: `data/blogPosts.ts`
- Assets:
  - `public/edition-art/blog-*.svg`

### Blog Posts: `/blog/[slug]`

- Entry: `app/blog/[slug]/page.tsx`
- Components:
  - `components/blog/BlogReadingLayout.tsx`
  - `components/blog/MathJaxRefresh.tsx`
- Data: `data/blogPosts.ts`
- Assets:
  - `public/blog/**`
  - `public/edition-art/blog-*.svg`
- External runtime script:
  - `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js`

### Mindmap: `/mindmap`

- Entry: `app/mindmap/page.tsx`
- Asset:
  - `public/mindmap/training-pipeline-mindmap.html`

### About: `/about`

- Entry: `app/about/page.tsx`
- Shared chrome:
  - `components/edition/EditionChrome.tsx`

### Not Found

- Entry: `app/not-found.tsx`

## Useful And Affects Website

Changing these can change the live website or Vercel build:

- Root build/config files:
  - `package.json`
  - `package-lock.json`
  - `next.config.ts`
  - `tsconfig.json`
  - `next-env.d.ts`
- Next app routes:
  - `app/**`
- Live React components:
  - `components/landing/**`
  - `components/edition/**`
  - `components/module/**`
  - `components/topic/**`
  - `components/shared/**`
  - `components/blog/**`
  - `components/formula-hub/FormulaHubClient.tsx`
  - `components/icons.tsx`
- Live data:
  - `data/modules.tsx`
  - `data/topics.ts`
  - `data/redesignedTopicPreviews.ts`
  - `data/prototypeMappings.ts`
  - `data/topicTeachingContent.ts`
  - `data/formulaHub.ts`
  - `data/formulaHubEntries.json`
  - `data/blogPosts.ts`
- Live public assets:
  - `public/topic-design-previews/**`
  - `public/prototypes/**` when referenced by topic shell/fallback/direct public URLs
  - `public/blog/**`
  - `public/edition-art/**`
  - `public/mindmap/training-pipeline-mindmap.html`
  - `public/favicon.ico`
- Build-time topic source:
  - `topic-design-previews/**`
  - `scripts/sync_topic_design_previews.mjs`

## Useful But Does Not Directly Affect Website

These are useful for maintenance, verification, source preservation, or future edits. They do not directly render on the site unless a script copies or imports them.

- Documentation:
  - `README.md`
  - `LICENSE`
  - `docs/**`
- Verification and utility scripts, except the build sync script:
  - `scripts/verify_*.mjs`
  - `scripts/formula_hub_test_utils.mjs`
  - `scripts/generate_siamese_blog_assets.mjs`
  - `scripts/export_notebook_prototypes.py`
- Visualization source/archive source:
  - `source/visualizations/**`
- README preview images:
  - `public/readme/**`
- Vercel local binding:
  - `.vercel/project.json`
  - Useful locally for identifying the Vercel project, but `.vercel/` is ignored and should not be committed.

## Not Currently Used By Main Routes, But Still Public Or Historical

Do not delete these blindly. Move to an archive only after checking direct public URLs, old links, and whether they are needed as fallback sources.

- `public/prototypes/adam-optimizer-vs-sgd.html`
  - Current app routes map both `adam-vs-sgd` and `adam-optimizer-vs-sgd` to `public/prototypes/adam-vs-sgd.html`.
  - This file appears to be a duplicate public artifact, but the direct URL may still work if someone bookmarked it.
- Most `public/prototypes/*.html` files for redesigned topics
  - Not the first choice for `/topic/[slug]` when a redesigned preview exists.
  - Still used by `topic-preview-shell.js` as embedded prototype content for many redesigned pages.
  - Also remain public direct URLs.

## Local Or Ignored Files

These should remain isolated from GitHub and do not affect the deployed site unless manually copied into tracked paths:

- `.next/`
- `.vercel/`
- `node_modules/`
- `reference_materials/`
- `tsconfig.tsbuildinfo`
- log files and local env files covered by `.gitignore`

## Current Uncommitted Maintenance Branch Files

Branch: `codex/maintenance-local-cleanup`

These are not production until committed and pushed:

- `app/globals.css`
  - Adds Formula Hub loading skeleton styles.
- `components/formula-hub/FormulaHubClient.tsx`
  - Changes Formula Hub entry to dynamic client-only loading.
- `components/formula-hub/FormulaHubExplorer.tsx`
  - New untracked component containing the extracted Formula Hub implementation.
- `docs/PROJECT_STRUCTURE_MAP.md`
  - Useful maintenance doc, no direct website impact.
- `docs/PROJECT_STYLE_GUIDE.md`
  - Useful maintenance doc, no direct website impact.

## Safe Cleanup Rule

Use this order before moving or deleting anything:

1. Check whether the file is imported by `app/**`, `components/**`, or `data/**`.
2. Check whether it is referenced as a string path in `data/**`, `topic-design-previews/**`, or `public/topic-design-previews/**`.
3. Check whether it is copied by a build script.
4. Check whether it is a public direct URL under `public/**`.
5. Only then classify it as archive-safe.

