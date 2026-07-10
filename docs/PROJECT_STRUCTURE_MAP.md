# Project Structure Map

Use this file when you want to quickly find where things live.

## Root Folder

The root folder keeps only project-level folders and the config files that Next.js, npm, TypeScript, Git, and Vercel expect to find at the top level.

Important root files:

- `README.md`: public project introduction.
- `package.json`: npm scripts and dependencies.
- `package-lock.json`: locked dependency versions.
- `next.config.ts`: Next.js config.
- `tsconfig.json`: TypeScript config.
- `.gitignore`: ignored local/build files.
- `LICENSE`: project license.

These files should usually stay in the root folder.

## Main Website Code

- `app/`: Next.js routes and pages.
- `components/`: reusable React UI and topic components.
- `data/`: curriculum, topic, blog, and preview metadata.
- `public/`: static files served by the website.
- `scripts/`: build/copy/verification helper scripts.

## Topic Preview Code

- `topic-design-previews/`: editable redesigned topic HTML source.
- `public/topic-design-previews/`: published copies loaded by the website.
- `public/prototypes/`: older standalone prototype pages.
- `reference_materials/archive/visualization-source/`: local-only source archive for visualizations and topic code notes.

When editing a redesigned topic, start from `topic-design-previews/`.

## Blog Assets

- `data/blogPosts.ts`: blog content and image ordering.
- `public/blog/`: full article images.
- `public/edition-art/`: small abstract card cover art.

Card covers should match the site style and should not be pasted full teaching screenshots.

## Documentation

- `docs/PROJECT_STYLE_GUIDE.md`: main style and workflow guide for future chats.
- `docs/FILE_ISOLATION_PLAN.md`: cleanup boundary and archive decision plan.
- `docs/SCRIPT_INVENTORY.md`: script purpose and cleanup guide.
- `docs/OUTSOURCING_CODE_MAP.md`: guide for handing work to external designers/developers.
- `docs/README_DEV_RUN.md`: local development commands.
- `docs/superpowers/`: historical implementation plans and design specs from previous work; not active website runtime code.
- `reference_materials/archive/formula-hub-design/`: local-only formula hub planning notes.

New chat sessions should read `docs/PROJECT_STYLE_GUIDE.md` first.

## Project Materials

`reference_materials/archive/project-materials/` stores design inputs, older HTML drafts, and local reference material that should not clutter the root folder.

- `reference_materials/archive/project-materials/design-system/`
  - `design_system_guidelines.md`: original design-system guidance.

- `reference_materials/archive/project-materials/legacy-topic-examples/`
  - `single_neuron_final.html`: earlier single-neuron design example.
  - `mindmap_v5_brutalism(final).html`: original mindmap HTML input.

- `reference_materials/archive/project-materials/design-inputs/`
  - `redesign-visualized-content-decided/`: user-provided redesigned topic HTML inputs.

- `reference_materials/archive/project-materials/old-site-editions/`
  - `final-edition/`: earlier full-site HTML editions.

## Local Reference Materials

`reference_materials/` is ignored by Git and is for local-only notes, raw inputs, or private working material.

It is useful for storing files you want to keep locally but do not necessarily want to publish.

## Quick Lookup

If you want to change a topic page:

1. read `docs/PROJECT_STYLE_GUIDE.md`
2. edit `topic-design-previews/<topic>.html`
3. confirm the matching published copy in `public/topic-design-previews/`
4. check `data/redesignedTopicPreviews.ts` if routing is involved

If you want to change a blog:

1. edit `data/blogPosts.ts`
2. put article images in `public/blog/<slug>/`
3. put card cover art in `public/edition-art/`
4. check `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` only if layout changes are needed

If you want to hand work to someone else:

1. send them `docs/PROJECT_STYLE_GUIDE.md`
2. send them `docs/OUTSOURCING_CODE_MAP.md`
3. send only the specific topic/blog folders they need
