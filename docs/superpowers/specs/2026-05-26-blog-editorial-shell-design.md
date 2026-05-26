# Blog Editorial Shell Design

## Approved Direction

The user directed that every blog post adopt the same calm purple-blue editorial language as
the redesigned topic pages. This is a presentation change only: the eight posts keep their
existing prose, formulas, images, captions, tables, and ordering unchanged.

## Layout

- Use the current final-edition global navigation and atmospheric background so blog reading
  belongs visually to the new homepage and topic redesign.
- Replace the large rounded outer article card with a flat reading canvas.
- Add an `On This Page` navigation rail on the left, generated from each post's existing
  headings. It is expanded by default on desktop and collapsible by a white sidebar icon.
- On narrow screens the navigation opens as an overlay, closes after selecting a section, and
  supports `Escape` or backdrop close.
- Do not create a right drawer for blog posts.

## Content Treatment

- Preserve all block data in `data/blogPosts.ts`.
- Render prose in ordinary document flow rather than stacked content cards.
- Keep figures as the supplied instructional images with understated caption treatment and no
  heavy surrounding container.
- Render formulas with MathJax as before, using a restrained typographic treatment rather than
  prominent embedded cards.
- Keep list and table content intact, using subtle rules and the edition palette.

## Verification

- Assert all eight existing blog slugs remain available and the data file is not changed.
- Assert the post route uses one shared navigation layout with no right-drawer behavior.
- Build the Next.js app.
- Browser-check every blog route, desktop drawer behavior, a mobile overlay close action, and
  console/resource errors.
- Deploy the verified build to the linked Vercel production project, then update GitHub `main`
  with the verified source changes.
