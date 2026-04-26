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
- `/module/1`
- `/module/2`
- `/module/3`
- `/module/4`
- `/module/5`

## Placeholder Routes

- `/topic/[slug]`

These topic routes are intentionally placeholders for future PAGE 3 teaching content. They preserve navigation without introducing broken links.

## Notebook-Backed Topic Routes

These topic routes now embed preserved notebook prototype output from `better_content/`:

- `/topic/neuron-structure`
- `/topic/backpropagation-intuition`
- `/topic/gradient-descent-learning-rate`
- `/topic/convolution-operation`

These notebook files were intentionally left unmapped because they do not cleanly match a current syllabus route one-to-one:

- `Evaluation Metrics _ Confusion Matrix Intuition.ipynb`
- `Mini-batch Training and Batch Size Intuition.ipynb`

## Migration Notes

- The approved static site in `site/` was used as the primary visual reference.
- Module pages are data-driven through `data/modules.tsx`.
- Topic placeholder routing is driven through `data/topics.ts`.
- Styling was migrated into `app/globals.css` with the same layout values, spacing, and card treatments as the approved static version.
- Preserved notebook prototype exports are stored in `public/prototypes/` and embedded via same-origin iframe routes to avoid changing prototype internals.
