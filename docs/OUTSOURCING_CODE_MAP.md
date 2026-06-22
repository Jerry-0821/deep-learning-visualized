# Outsourcing Code Map

This project has two kinds of editable source:

1. Next.js application code
2. Standalone HTML prototype code

Use this map when handing work to another designer or developer.

## Main Website Code

- `app/`: Next.js routes and page structure.
- `components/`: shared React components.
- `data/`: curriculum, topic, and blog content data.
- `public/`: static assets served by the website.

Important blog files:

- `data/blogPosts.ts`: all blog article content, image order, formulas, tables, and links.
- `app/blog/page.tsx`: blog listing page.
- `app/blog/[slug]/page.tsx`: individual blog article template.
- `public/blog/`: blog images.

## Topic Preview Code

The redesigned topic pages currently use standalone HTML prototypes.
These are still code, but they are not React components yet.

- `topic-design-previews/*.html`: editable source files for redesigned topic previews.
- `public/topic-design-previews/*.html`: published copies loaded by the website.
- `data/redesignedTopicPreviews.ts`: connects topic slugs to redesigned preview HTML files.
- `app/topic/[slug]/page.tsx`: decides whether a topic uses a redesigned preview or the older topic route.

When editing a redesigned topic, update the source file in `topic-design-previews/`.
The build script copies those files into `public/topic-design-previews/`.

## Older Prototype Code

- `public/prototypes/*.html`: older standalone prototype pages that have not yet been migrated to the redesigned template.
- Local-only archives such as original visualization source exports, design inputs, and old site editions live under `reference_materials/archive/` and are intentionally not tracked by Git.

## Mindmap

- `app/mindmap/page.tsx`: route that embeds the mindmap.
- `public/mindmap/training-pipeline-mindmap.html`: published mindmap page.

## If Converting HTML To React Later

The clean migration path is:

1. Keep the teaching content unchanged.
2. Move reusable layout into React components under `components/topic/`.
3. Move topic-specific text/formulas into `data/`.
4. Keep animation logic isolated so each topic can still be tested independently.
5. Replace the iframe route only after the React version matches the existing HTML behavior.

Do not rewrite teaching content during conversion unless the content owner explicitly approves it.
