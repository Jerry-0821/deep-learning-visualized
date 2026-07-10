# Next.js Development Migration

This project has been migrated from the approved static site into a Next.js App Router app with TypeScript.

## Run Commands

From this folder:

```powershell
cd C:\Users\USER\Documents\雜貨專區\PLAN\DeepLearning_web
```

Install dependencies:

```powershell
npm.cmd install
```

Start the dev server:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000/
```

## Routes Ready

- `/`
- `/topics`
- `/topic/[slug]`
- `/formula-hub`
- `/formula-hub/[id]`
- `/formula-hub/saved`
- `/blog`
- `/blog/[slug]`
- `/mindmap`
- `/about`

## Topic Routes And Prototype Sources

Topic routes are now backed by two layers:

- Redesigned topic pages use editable HTML from `topic-design-previews/`.
- Older fallback prototype pages use exported HTML from `public/prototypes/`.

Clean notebook and Python source files for the standalone prototypes are tracked under
`source/visualizations/`. Historical raw inputs and older local handoffs stay under
`reference_materials/`, which is ignored by Git.

## Migration Notes

- The approved static site in `site/` was used as the primary visual reference.
- Module pages are data-driven through `data/modules.tsx`.
- Topic routing is driven through `data/topics.ts`, `data/redesignedTopicPreviews.ts`, and `data/prototypeMappings.ts`.
- Styling was migrated into `app/globals.css` with the same layout values, spacing, and card treatments as the approved static version.
- Preserved notebook prototype exports are stored in `public/prototypes/` and embedded via same-origin iframe routes to avoid changing prototype internals.
