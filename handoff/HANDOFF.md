# Project handoff (shared by Codex, Claude and any other AI assistant)

Rules for every assistant are in `AGENTS.md` at the repo root. Read the change log first; add a dated entry at the top of it whenever you change anything.

# Change log (newest first)

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/mathjax-404-noindex`

User approved three items.

1. MathJax pinned: every CDN URL `mathjax@3/` -> `mathjax@3.2.2/` (37 occurrences: site pages for blog + Formula Hub, lesson shell, 4 standalone lessons, 8 animations and their notebook/py sources so the exporter stays in sync). Both `tex-svg.js` and `tex-mml-chtml.js` exist at 3.2.2; formulas render with `MathJax.version === "3.2.2"` on a formula page, an animation and the Pooling notes.
2. 404 page rebuilt (`app/not-found.tsx` + "404 page" block at the end of `app/globals.css`): shared site nav/backdrop/footer (so dark mode and the menu work), gradient "404", "This page doesn't exist.", buttons back to the curriculum and all topics, cards for Topics / Formula Hub / Blog and three popular lessons. The old page's outdated developer text ("all five module pages", "PAGE 1 and PAGE 2 routes only") is gone. Status is still 404.
3. Embedded-only pages get `X-Robots-Tag: noindex, indexifembedded` via `headers()` in `next.config.ts`: `/topic-design-previews/*`, `/prototypes/*`, `/mindmap/*` (the `:path+` patterns need at least one segment, so the real `/mindmap` page is not affected). Search engines no longer list those pages on their own but may still credit their content to the `/topic/*` lesson that embeds them. No lesson or animation file was edited for this.

How it was checked: `npm run build` 194/194; all 18 verify scripts pass; exporter preview unchanged; on `next start`: header present on embedded pages and absent on /mindmap, /topic/pooling, /, /formula-hub; 404 returns 404 with the new page; MathJax 3.2.2 renders with no errors.

Status: pushed to `claude/mathjax-404-noindex` for a Vercel preview. NOT merged to `main`.

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/seo-sitemap-share`

User approved adding a sitemap, robots.txt and share preview images.

- `data/site.ts`: one place for the site URL, name and description (used by layout, sitemap, robots, share cards).
- `app/sitemap.ts` -> `/sitemap.xml`: 151 URLs (home, topics, Formula Hub, blog, mindmap, about, the 18 lessons, all blog posts, all Formula Hub pages). Left out on purpose: the topic alias route, `/formula-hub/saved` (per reader), `/module/*` (redirects).
- `app/robots.ts` -> `/robots.txt`: allow everything except `/formula-hub/saved`, and point to the sitemap. (Embedded lesson/prototype pages are still crawlable; giving them `noindex` is a separate, not-yet-approved item.)
- Share preview cards (1200 x 630, generated at build time with `next/og`): `components/share/ShareCard.tsx` (shared design: site background with purple glow, eyebrow, Instrument Serif title, subtitle, purple badge + site address, teal 4 x 4 grid with an amber 2 x 2 window from the guided lessons). `app/opengraph-image.tsx` (site default, used by every page without its own), `app/topic/[slug]/opengraph-image.tsx` (one per lesson: module + lesson title + subtitle), `app/blog/[slug]/opengraph-image.tsx` (one per post). Fonts are fetched from Google Fonts during the build; if that fails the cards fall back to the built-in font instead of breaking the build.
- `app/layout.tsx`: `metadataBase`, Open Graph site name/type/locale and `summary_large_image` Twitter card. Pages keep their own titles/descriptions.

How it was checked: `npm run build` 194/194 (now includes the image routes, sitemap and robots); all 18 verify scripts pass; on `next start`: robots.txt and sitemap.xml served, `/topic/pooling` has og:title/description/image (1200 x 630) and twitter card tags, card PNGs rendered and reviewed (local copies in `design-review/share-cards/`, not committed).

Status: user approved; `main` fast-forwarded to `f4d89cd` on 2026-10-17 (live). Checked on production: /sitemap.xml (151 URLs), /robots.txt, share cards for the site, a lesson and a blog post (200, image/png), og:image + twitter:card tags on the home page.

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/pooling-guided-lesson`

User approved the redesigned Pooling lesson (draft v2) to replace the old fallback page.

What changed:
- New `public/prototypes/pooling-guided-lesson.html` (hand-written, its own source): four stages of slides, built like the guided Attention lesson. Stage 1 why shrink (layer size count-up; "how pooling works" with a window that fills the output one cell at a time and shows the calculation; "small shifts" with four coloured 2 x 2 blocks matching their output cells); Stage 2 max (learner picks the max in each window, value flies to the output) / average (animated arithmetic) / compare; Stage 3 output-size explorer with live LaTeX, leftover edges and overlap, per-channel pooling; Stage 4 convolution vs pooling ("train the kernel"), parameter count, three-question check. Data grids use a teal/amber palette, not the site purple (user request: avoid colour fatigue). All numbers computed from the matrices in the script. `?embed=1` hides its own title and reading sections.
- New lesson page `topic-design-previews/pooling.html` + `"pooling"` config in `topic-design-previews/topic-preview-shell.js` (notes with LaTeX formulas, `notesMath`, `autoFrameHeight`), and `"pooling"` in `data/redesignedTopicPreviews.ts`. `/topic/pooling` now uses the lesson shell with the top route bar like the other 17 topics; no topic uses `EmbeddedPrototypePage` any more (kept as fallback).
- Removed the old `public/prototypes/pooling.html`; `next.config.ts` redirects it (308) to `/topic/pooling`. Exporter mapping and title removed (source `pooling_style_aligned_source.py` kept as archive); `data/prototypeMappings.ts`, `docs/HTML_AND_SOURCE_MAP.md`, `docs/WEBSITE_FILE_IMPACT_MAP.md` updated; app-integration check now requires the pooling lesson page.
- Shell `autoFrameHeight` made robust (affects Attention and Pooling): the ResizeObserver is created from the frame's own window, uses a short timer instead of requestAnimationFrame, and a 500 ms check keeps the frame matched even in tabs that are not repainting. Checked: frame grows (2936 -> 2997) and shrinks (2918) with the slides; Attention still matches exactly.

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; on `next start`: /prototypes/pooling.html -> 308 -> /topic/pooling, attention redirect still 308, /topic/pooling renders the route bar + lesson shell, 4 stages embedded, 16 MathJax + 14 KaTeX formulas with no errors, no console errors. The draft's full 12-slide run-through passed earlier (max output 4 4 2 / 3 5 2 / 3 4 4, sizes, leftover/overlap counts, parameter counts all correct).

Status: user approved the Vercel preview; `main` fast-forwarded to `06fe5b4` on 2026-10-17, so the guided Pooling lesson is live. Checked on production: /topic/pooling has the route bar and lesson shell, 4 stages embedded, 16 MathJax + 14 KaTeX formulas, no errors, no inner scrollbar; /prototypes/pooling.html redirects (308) to /topic/pooling.

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/accent-text-contrast`

User approved fixing accent colours that were too light as text.

- `app/globals.css`, new block at the end ("Accessible text colours"): darker text shades `--edition-purple-text` #5b4bd6, `--edition-green-text` #00775f, `--edition-coral-text` #b54a30, `--edition-pink-text` #b83d71 (all at least 4.5:1 on white and the light tints; white on them also passes). Used only where an accent is text (module labels and arrows on the home map, "View all" links, pink note kicker, green note formula text, small purple labels on purple tints) in light mode. Card badges and "Explore topic" / "Read note" chips (white text) use `--edition-module-strong` in both themes. Two small Formula Hub detail labels use body grey. Decorative uses of the accents (stripes, dots, art) are unchanged.
- Checked with a browser contrast audit (light mode): home, topics, Formula Hub, two formula pages, blog, about now report no text below AA. Remaining: the old Pooling page wrapper badges (blue #0071e3 on blue tint, about 4.1:1), which the planned Pooling redesign replaces.

Status: user approved; `main` fast-forwarded to `301b45b` on 2026-10-17 (live).

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/description-contrast`

User approved review items 1 and 7.

1. Site description (`app/layout.tsx`, used by the home page and any page without its own): was the dev note "Deep learning course pages migrated from the approved static prototype." (unchanged since the first commit, 2026-04-26). Now: "Learn deep learning visually: interactive lessons, formulas and essays, from single neurons to transformers." (the user's choice, option A).
7. Light grey text contrast (light mode only; dark mode unchanged): `--edition-muted` #9b95b0 -> #6f6888, Formula Hub `--muted` #9590ab -> #6f6888, topic route bar label, lesson shell `--text-muted` #817d8f -> #6f6888, guided Attention lesson `--muted` #817d8f -> #6f6888. #6f6888 is at least 4.55:1 on every light background used (#f7f6fc, #ffffff, #f0eef6, #f9f8fe, #fcfbfd). A browser audit of home, topics, Formula Hub, a formula page, blog, a blog post and about found no grey text below AA afterwards.

Still below AA (not changed, needs a design decision): module accent colours used as text (green #00b894 about 2.4:1, coral #e17055 about 3:1, pink #fd79a8 about 2.3:1 on light backgrounds) and white text on green/coral card badges and "Explore topic" chips (2.5:1 / 3.2:1); purple #6c5ce7 small labels on light-purple tints (about 4.0-4.4:1).

Pooling finding (for the user's next decision): Pooling is the only one of the 18 topics without a redesigned lesson page. `/topic/pooling` still uses the old fallback wrapper `components/topic/EmbeddedPrototypePage.tsx` ("Interactive prototype" badge, "Return to module" / "Open prototype only" buttons, no site nav, notes from `data/topicTeachingContent.ts`), and `public/prototypes/pooling.html` is the original animation. The old local note (untracked `POOLING_UNPUSHED_NOTES.md`, removed in 0aee99c) said the Pooling fixes were "intentionally not pushed" on 2026-09-21 but gave no reason; the fixes themselves were released in 0aee99c.

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; browser contrast audit as above.

Status: user approved; `main` fast-forwarded to `2e3cc97` on 2026-10-17 (live; new description served).

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/content-labels-cleanup`

User approved items 2, 3, 4, 8 and 12 of the latest site review (item 1, the site description, is waiting for the user to choose wording).

2. Module badges inside animations now match the site: Dropout and Overfitting say Module 1 (they said 2 and 3). Fixed in `public/prototypes/*.html` and their sources (`Dropout.ipynb`, `overfitting_top_controls_colab.py`).
3. Pooling fixes released (were local-only since 2026-09-21): Module 2 label, learner-facing Controls text, `(a + b + c + d) / 4` average formula, full no-padding H/W output-size formulas, rewritten Pooling teaching notes in `data/topicTeachingContent.ts` (also removes the "Your prototype..." page description). `POOLING_UNPUSHED_NOTES.md` deleted.
   - `scripts/export_notebook_prototypes.py` released with it: preview by default, writes only with `--write --topic X` / `--write --all`; new `TITLES` map gives generated pages real titles; titles are HTML-escaped; the old Attention notebook is no longer exported.
4. Real page titles: 14 animation pages (e.g. "Dropout — Interactive Explorer" instead of "Dropout.ipynb"), static titles on the 12 lesson pages that had none, and lesson titles end in "| Deep Learning Visualized" instead of "| Topic Design Preview" (shell `document.title` too).
8. `components/blog/blogImageSize.ts` uses `decodeURIComponent`, so images whose filenames contain "&" (Add & Norm post) now go through next/image. All 34 blog image paths resolve.
12. Cleanup:
   - Removed the unused `approvedNotes` map from `topic-design-previews/topic-preview-shell.js` (about 13.5 KB, never read).
   - Removed the old Attention animation `public/prototypes/attention-mechanism-intuition.html`; `next.config.ts` redirects that URL (308) to `/topic/attention-mechanism-intuition`. `data/prototypeMappings.ts`, docs and source READMEs point at `attention-guided-lesson.html`; `transfomer.ipynb` stays as an archive.
   - Removed 90 CSS rules (about 470 lines) from `app/globals.css` whose selectors need classes the code never produces (old landing page, old Formula Hub nav/footer, old topic list). Checked by fingerprinting the computed style of every element on 15 page states (home, topics, Formula Hub index/detail/saved, blog index/post, about, mindmap, pooling, a lesson page, 404, plus dark home/Formula Hub/blog post) before and after: 0 differences.

Not done: item 1 (site description, app/layout.tsx line 6, unchanged since the first commit), items 5 (noindex for embedded pages), 6 (sitemap/robots/share image), 7 (light grey contrast), 9 (small content wording), 10-11, 13.

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; exporter preview matches the published files exactly as before (same Unchanged/Would-overwrite list); on `next start`: redirect returns 308 to the lesson, Add & Norm images use `/_next/image`, new titles and badges are served.

Status: user approved the Vercel preview; `main` fast-forwarded to `0aee99c` on 2026-10-17, so these changes are live (checked: redirect 308, new titles and badges, Pooling fixes, Add & Norm images optimized).

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/attention-guided-lesson`

User approved the redesigned Attention lesson (draft v3) and asked for it to replace the old one.

What changed:
- New `public/prototypes/attention-guided-lesson.html` (hand-written; it is its own source, not produced by the notebook exporter). Three stages of slides: The idea (question, embeddings, Q/K/V) / Scoring (dot product, sqrt(d_k) scaling, softmax) / Using the weights (causal mask, weighted sum, full formula + multi-head). Next moves within a stage; the last slide scrolls to the next stage. KaTeX for formulas; attention arcs, flowing particles, mask curtain, count-ups and slide transitions; respects reduced motion. All numbers are computed from the vectors in its script (no hand-tuned score terms). With `?embed=1` it hides its own title and reading sections.
- `topic-design-previews/topic-preview-shell.js` (synced to `public/`): the Attention config now loads the guided lesson, has real `notes` (Background, 5 LaTeX formulas, Pros/Cons, Quick example, Common mistake) instead of the "RESERVED READING SECTION" placeholders, `notesMath: true` (MathJax for plain notes) and `autoFrameHeight: true` (ResizeObserver keeps the frame matched to the slide height).
- `topic-design-previews/topic-preview-shell.css`: display LaTeX in formula rows can scroll sideways on narrow screens.
- Small labels in the guided lesson match the other lessons' `.kicker` / `.section-kicker` (Inter 600, 0.2em / 0.16em, uppercase) and use the lesson palette.
- `scripts/verify_topic_preview_rollout.mjs`: Attention is no longer expected to have reserved reading sections; new checks for the guided lesson wiring.
- The old `public/prototypes/attention-mechanism-intuition.html` and `transfomer.ipynb` are kept (direct-URL retention policy) but no lesson uses them now.

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; in the browser the lesson page shows the guided lesson embedded (no duplicate title), 20 MathJax formulas render with no errors, no inner scrollbar; the draft's full 9-slide run-through passed earlier with no JS errors.

Status: user approved the Vercel preview; `main` fast-forwarded to `fcb7778` on 2026-10-17, so the guided Attention lesson is live. Checked on production: lesson embeds the guided lesson (3 stages), 20 KaTeX + 20 MathJax formulas render, no reserved placeholders, no inner scrollbar, no console errors.

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/attention-and-author-text`

User-approved content fixes after an animation review (all 18 animations load and pass a click-everything stress test with no JS errors; core math checked).

1. Attention lesson cleaned up (`topic-design-previews/topic-preview-shell.js`): new `attention-editorial` frame treatment, like the other lessons. It hides the animation's old top bar, old header ("Module 5 · Transformer Intuition", "Transformer Visualization", the Colab description), section label and footer, removes the outer card, and uses the site purple for active controls. Animation content unchanged.
2. Double scrollbar fixed for all framed lessons: `lockFrameHeight` now measures from the document top plus the body's bottom spacing, then grows to the frame's real scroll height if anything still overflows. Attention was 36px short (inner scrollbar); Feature Map and Train/Val/Test were 8px short (clipped). All framed lessons now measure 0px overflow.
3. Author-facing text rewritten for learners: Convolution and RNN lesson Background (shell + `data/topicTeachingContent.ts`), Train/Val/Test and Feature Map teaching text (used for page descriptions), Attention footer, Dropout PyTorch note (now `nn.Dropout(p)` + train/eval behaviour). Notebook sources (`source/visualizations/attention-mechanism-intuition/transfomer.ipynb`, `source/visualizations/dropout/Dropout.ipynb`) updated to match. RNN wording also corrected: unaligned many-to-many is sequence-to-sequence (e.g. translation), not "sequence labeling".
   - `data/topicTeachingContent.ts` also holds the unpublished Pooling edits; only the non-Pooling hunks were committed.

Still open from the animation review (not approved yet): Attention scores include undisclosed hand-tuned terms (+0.75 self, -0.22 x distance, preset relations); module badges inside Dropout (Module 2), Overfitting (Module 3) and standalone Attention (Module 5) disagree with the site; activation derivative labelled g'(z) instead of f'(z); British/US spelling mix; dev filenames as animation page titles ("transfomer.ipynb" etc.); backprop shows W2 but labels values v1/v2.

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; every framed lesson measured for inner overflow in the browser; exporter preview shows notebooks and published HTML match (Dropout differs only by a pre-existing blank line).

Status: user approved everything EXCEPT the Attention lesson changes, because they want to redesign the whole Attention teaching content. Released to `main` via `claude/release-content-fixes`, which drops item 1 (the `attention-editorial` treatment) and the Attention footer rewrite (`public/prototypes/attention-mechanism-intuition.html`, `transfomer.ipynb`). The general frame-height fix (item 2) is shared code and was released, so the Attention lesson's inner scrollbar is gone too. The full Attention version stays on branch `claude/attention-and-author-text` for reference; Attention redesign is being discussed with the user, do not ship Attention changes without their approval.

## 2026-10-17 (newest) · Claude (Claude Code) · branch `claude/images-mathjax-backlink`

User approved items 1, 4, 5 of the second design review.

1. Blog post images now use `next/image` (`app/blog/[slug]/page.tsx`): resized to the reader's screen, served as WebP/AVIF where supported, lazy-loaded. `components/blog/blogImageSize.ts` reads each PNG's width/height at build time, so `data/blogPosts.ts` and the image files are unchanged. Local test: a ~1.5MB figure now loads as ~120-145KB even as PNG. Non-PNG sources fall back to a lazy `<img>`. Note: uses Vercel Image Optimization (Hobby plan has a monthly transformation quota; 35 images x a few widths is well within it).
4. Lesson pages' own "Back to module" link now has `target="_top"` (`topic-design-previews/topic-preview-shell.js` line ~3173, synced to `public/` by `scripts/sync_topic_design_previews.mjs`). Before, it opened the Topics page inside the lesson iframe. The user approved this one-attribute change to a lesson file.
5. MathJax raw-TeX race fixed: MathJax configs on `/formula-hub`, `/formula-hub/saved`, `/formula-hub/[id]` and `/blog/[slug]` set `startup: { typeset: false }`, so MathJax never typesets the server HTML before React hydrates. `MathJaxRefresh` (existing) typesets after mount; `FormulaHubClient` now also typesets its whole app once MathJax is ready (hero chips + symbol dictionary were previously only typeset by MathJax's startup pass).

How it was checked: `npm run build` 160/160; all 18 verify scripts pass; on `next start`: blog images load via `/_next/image`, Formula Hub 0 raw formulas over 2 reloads (35 rendered), formula detail and blog post formulas render, lesson back link navigates the top page to `/topics#mod-1`.

Status: user approved the Vercel preview; `main` fast-forwarded to `2d8cea8` on 2026-10-17, so it is live in production.

## 2026-10-17 (latest) · Claude (Claude Code) · branch `claude/formula-hub-unified`

User reviewed a local side-by-side demo and approved item 4: Formula Hub now uses the shared site design system.

What changed (style only, no formulas/data/search logic touched):
- `app/globals.css`: Formula Hub font declarations switched in place (DM Sans -> Inter, DM Serif Display -> Instrument Serif). New block at the end of the file ("Formula Hub in the shared site design system"): Formula Hub colour variables point at the `--edition-*` tokens, its own aurora/noise backdrop is turned off in favour of the shared site backdrop, 18px cards with hover lift, pill-shaped controls, glass search bar, form controls inherit the font. The now-unused dark rule for the old backdrop was removed.
- `app/layout.tsx`: Google Fonts request trimmed to Inter + Instrument Serif (DM Sans and DM Serif Display removed). The site now loads 2 font families instead of 5.
- Deleted the review sample (`app/design-review/`, `public/design-review-formula-hub.html`) and their `.git/info/exclude` lines.

How it was checked: `npm run build` 160/160 pages; all 18 verify scripts pass; `/formula-hub` checked in the browser against the approved sample.

Status: user approved the Vercel preview; `main` fast-forwarded to `fa431c8` on 2026-10-17, so it is live in production.

## 2026-10-17 (later) · Claude (Claude Code) · branch `claude/nav-menu-lesson-bar`

User approved items 1, 2, 3, 5 of the design review. Item 4 (unify Formula Hub with the rest of the site) is only a separate SAMPLE awaiting review.

What changed (site chrome only, no lesson content touched):
1 + 3. Compact nav menu. Below 1180px wide, the page links and "Start learning" move into a menu button (`components/edition/EditionMenu.tsx`); theme and saved icons stay visible. Nav labels no longer wrap ("Formula Hub" used to break onto two lines even at 1280px). Full nav needs about 1125px, hence the 1180px breakpoint.
2. Lesson pages (`/topic/*` using topic-design-previews) get a slim 48px bar above the iframe: All topics, module + lesson title, Previous/Next (`components/topic/TopicRouteBar.tsx`, `components/topic/RedesignedTopicPage.tsx`). The Pooling page uses a different wrapper with its own links and is unchanged.
5. Fonts: removed the unused "SF Pro Display" family from the Google Fonts request in `app/layout.tsx`. DM Sans + DM Serif Display are still loaded because only Formula Hub uses them; they can be dropped if item 4 is approved.
4. SAMPLE ONLY: `/design-review/formula-hub` (`app/design-review/formula-hub/page.tsx` + `formula-unified.css`). It renders the real Formula Hub with the site's fonts, colours, radii and shadows. All rules are scoped to `.formula-unified`; the real `/formula-hub` and its styles are untouched. Page is noindex and not linked from the site. If approved: fold the rules into the Formula Hub styles, drop the DM fonts, delete `app/design-review/`. If rejected: delete `app/design-review/`.

How it was checked:
- `npm run build`: 161/161 pages. All 18 `scripts/verify_*.mjs` pass.
- Browser: menu opens/closes and navigates at 900px; full nav at 1200px with no wrap; menu at 1150px; lesson bar at 375px (no horizontal scroll) with correct prev/next; review page renders MathJax and search.
- If `npm run build` fails with `EINVAL ... readlink .next	ypes`, delete `.next/` (OneDrive + dev-server leftovers) and rebuild.

Status: user approved the preview. Items 1, 2, 3, 5 were merged to `main` WITHOUT the sample (`app/design-review/` was removed in the release commit). The sample still lives only on branch `claude/nav-menu-lesson-bar` (and its Vercel preview) until the user gives feedback on item 4.

## 2026-10-17 · Claude (Claude Code) · branch `codex/fix-adam-convolution-logic`

What changed (style only, no lesson content touched):
- Site-wide light/dark theme toggle. A moon/sun icon button sits in the top nav on every page that uses the site shell (`EditionNav`): home, Topics, Formula Hub (index, saved, formula detail), Blog (index + every post), Mindmap, About. It also shows on phone widths.
- Light mode is still the default and looks exactly as before. Dark mode only applies after a reader clicks the toggle; the choice is saved in `localStorage` key `dlv-theme`.
- Lesson content is intentionally NOT themed: `/topic/*` pages, `public/prototypes/**`, topic preview iframes and the Mindmap iframe keep their original light design.

Files:
- `app/layout.tsx`: tiny inline script that applies the saved theme before first paint (avoids a flash); `suppressHydrationWarning` on `<html>`.
- `components/edition/ThemeToggle.tsx` (new): the toggle button.
- `components/edition/EditionChrome.tsx`: renders `<ThemeToggle />` in the nav actions.
- `app/globals.css`: one new block appended at the end of the file ("Site-wide dark theme"). Append-only; no existing rule was edited, so light mode is unchanged. Every dark rule is scoped to `html[data-theme="dark"]`.
- Replaced the earlier Transfer-Learning-only dark-mode prototype (`components/blog/BlogThemeToggle.tsx`, `blog-dark-mode-demo` CSS, `data-blog-theme`); those uncommitted pieces were removed because the site-wide toggle supersedes them.
- `AGENTS.md`, `CLAUDE.md` (new): shared rules so Codex and Claude both read this file first.

How it was checked:
- `npm run build`: compiled, 160/160 static pages.
- All 18 `node scripts/verify_*.mjs` pass (including `verify_topic_preview_rollout.mjs`, which used to fail).
- In a browser, a script scanned every shell page in dark mode for leftover light backgrounds and dark text; every hit was fixed except intentional ones (white blog figure images, purple accent lines).
- Checked by hand: toggle switches and persists across pages; light mode values unchanged; toggle visible at 375px with no horizontal scroll; `/topic/pooling` unaffected while dark mode is saved.

Not done / next:
- User checked the Vercel preview and approved it. Fast-forwarded `main` to `1fe351c` on 2026-10-17, so production (https://deep-learning-visualized.vercel.app) now has the toggle.
- Optional later: theme the lesson prototypes too (user said not now).

## Local-only work, do not commit (until the user says so)

- `.claude/launch.json`: local preview-server config for Claude; not needed by the site.
- Pooling lesson design drafts: `design-review/pooling-lesson-v1.html` and `design-review/pooling-lesson-v2.html` (approved, shipped as `public/prototypes/pooling-guided-lesson.html`).
- Attention lesson design drafts: `design-review/attention-lesson-v2.html` (first draft) and `design-review/attention-lesson-v3.html` (approved draft, now shipped as `public/prototypes/attention-guided-lesson.html`). Folder is in `.git/info/exclude`; safe to delete once the guided lesson is live.

---

# Historical handoff (2026-07-28, Codex). Kept for reference; facts below may be outdated.

# 1. Current Goal

- 当前任务的最终目标：把这个久未维护的 Next.js/Vercel 网站项目整理到可继续维护的状态，并留下准确交接，让下一个 Codex 会话能无缝继续，不误动主要网站和内容。
- 用户原本要求完成什么：详细检查本地、GitHub、Vercel 当前状态；先判断 Vercel 实际呈现和连接的文件，区分“影响网站的文件”“有用但不影响网站的文件”“没用且不影响网站的文件”；没用文件先隔离/记录，不要贸然删除；Formula Hub 本地实验先不要动；本次结束前整理 handoff，并最终放在 `handoff/HANDOFF.md`。
- Done Criteria:
  - `handoff/HANDOFF.md` 基于实际文件、`git status`、`git diff`、验证命令和生产 URL 检查更新。
  - 明确记录已经完成的 cleanup stages、提交、验证结果、失败项和下一步。
  - 不把未验证事项写成已完成。
  - 不修改主要网站源码、数据、public runtime 内容或 Formula Hub 实验代码。
  - 如果要让另一个不在同一工作区的 chat 或 GitHub 看到交接文件，需要后续把 `handoff/HANDOFF.md` commit/push。

# 2. Current Status

- 当前阶段：Stage 3 安全分类和保留决策已完成；正在收尾交接。Stage 4 实际物理清理/删除/重构尚未开始。
- 当前分支：`main`
- 当前 HEAD：`9e6d2e8 Document public asset retention strategy`
- `origin/main`：`9e6d2e8`，已在 2026-07-28 通过 `git fetch origin main` 确认本地 `main` 与 GitHub `origin/main` 同步。
- 当前 handoff 文件：`handoff/HANDOFF.md`。
- 已确认曾有两份 handoff：根目录 `HANDOFF.md` 与 `handoff/HANDOFF.md`。两者 SHA256 相同，内容完全一样；已合并为 folder 内的 `handoff/HANDOFF.md`，并移除根目录重复文件。
- 当前未跟踪文件：`handoff/`。这就是另一个 chat 或 GitHub 可能“开不到/看不到”的原因之一：交接文件目前是本地未提交文件。
- 已完成：
  - 建立网站文件影响地图、项目结构地图、脚本清单、文件隔离计划。
  - 检查并记录 Vercel production 主要公开路径和关键 public 资产路径。
  - 把 `source/visualizations/**` 定为有用但非 runtime 的 GitHub 源材料，保留。
  - 把 `reference_materials/**` 定为本地 ignored 参考归档，保留本地，不进 GitHub。
  - 把 `docs/superpowers/**` 按用户要求保留，并标记为历史资料，不作为当前 active instructions。
  - 修正 `data/prototypeMappings.ts` 里 RNN source metadata，不改变公开路径。
  - 冻结本地 Formula Hub 动态拆分实验分支，不合并到 `main`。
  - 对两个 public 候选项做保留决策：`public/prototypes/adam-optimizer-vs-sgd.html` 和 `public/blog/batch-normalization/batchnorm-04.png` 暂时保留。
- 部分完成：
  - 本地已经更清楚：主要影响网站的文件、有用但非 runtime 文件、历史/本地参考材料已有文档分类。
  - 还没有做真正删除或移动 runtime/public 文件，因为这会影响直接 URL、内容引用或未来恢复能力。
- 尚未开始：
  - 没有清理或删除 public 候选文件。
  - 没有修复 `verify_topic_preview_rollout.mjs` 的已知失败。
  - 没有重做 Formula Hub 动态拆分；用户明确说那是本地改到一半的实验，先不要动。
  - 没有更新 Vercel dashboard/deployment 设置；本次只验证了 public production URL。

# 3. Changes Made

- 本次 cleanup 已提交到 `main` 的文件变更：
  - `docs/PROJECT_STRUCTURE_MAP.md`：新增/更新项目结构和文件位置说明。
  - `docs/PROJECT_STYLE_GUIDE.md`：新增维护和风格指南。
  - `docs/WEBSITE_FILE_IMPACT_MAP.md`：新增网站 runtime 文件影响地图、Vercel production 路径记录。
  - `docs/FILE_ISOLATION_PLAN.md`：新增并持续更新文件隔离/保留/候选清理计划。
  - `docs/README_DEV_RUN.md`：更新本地开发和脚本运行说明。
  - `docs/SCRIPT_INVENTORY.md`：新增脚本用途、风险和维护边界。
  - `scripts/export_notebook_prototypes.py`：更新为从 `source/visualizations/**` 工作，避免继续依赖旧位置。
  - `data/prototypeMappings.ts`：修正 RNN prototype 的 source metadata 为 `rnn_structure_colab.py`；公开 prototype URL 未改变。
  - `docs/superpowers/README.md`：新增并更新，说明该目录是历史资料。
- 本次交接修正新增/更新：
  - `handoff/HANDOFF.md`：正式交接文件，已改为当前 cleanup 任务的真实状态。
  - `HANDOFF.md`：曾与 `handoff/HANDOFF.md` 重复；确认 hash 相同后移除根目录重复文件，只保留 folder 内版本。
- 重要实现决定及原因：
  - 不移动、不删除 `public/**`：即使没有 import，也可能是 Vercel 直接公开 URL。
  - 保留 `source/visualizations/**` 在 GitHub：它不直接影响网站 runtime，但对再生成 prototypes 有用。
  - 保留 `docs/superpowers/**`：用户明确说保留，但必须记录这是以前的东西。
  - 保留 Formula Hub 实验分支：用户明确说 Formula Hub 是本地改到一半的实验，先不要动。
  - 不直接 merge `codex/formula-hub-dynamic-experiment`：该分支 fork 点较旧，直接合并会把旧 docs 状态带回来，也会影响 `/formula-hub` 首屏渲染方式。
- Git commits on `main`:
  - `0e67cb6 Add website maintenance documentation`
  - `7d9fb56 Document file isolation plan`
  - `9684e97 Document script maintenance boundaries`
  - `1bf48c9 Fix RNN prototype source metadata`
  - `0c94ee8 Clarify script maintenance inventory`
  - `678ad92 Document stage 3B cleanup audit`
  - `fe33744 Document stage 3C cleanup candidates`
  - `e424aab Document stage 3D historical docs cleanup`
  - `42e8bcb Record decision to keep historical docs`
  - `3ec613f Document Formula Hub experiment freeze`
  - `9cc9122 Document local reference archive index`
  - `9e6d2e8 Document public asset retention strategy`
- Local-only branch:
  - `codex/formula-hub-dynamic-experiment`
  - Local commit: `6ad4075 Isolate Formula Hub dynamic loading experiment`
  - Status: frozen, not merged, do not touch unless user explicitly resumes Formula Hub work.

# 4. Verification

- `git fetch origin main`
  - Result: succeeded on 2026-07-28.
- `git status --short --branch`
  - Result after fetch, before duplicate consolidation: `## main...origin/main`
  - Additional untracked files before duplicate consolidation: `?? HANDOFF.md`, `?? handoff/`
  - After duplicate consolidation, expected untracked file/folder: `?? handoff/`
- `git rev-parse --short HEAD`
  - Result: `9e6d2e8`
- `git rev-parse --short origin/main`
  - Result: `9e6d2e8`
- `git diff --stat`
  - Result: no tracked content diff.
  - Git printed LF/CRLF warnings for `public/topic-design-previews/**`; no actual diff entries were reported.
- Verification scripts run on 2026-07-28:
  - `node scripts\verify_formula_hub_integrity.mjs` passed.
  - `node scripts\verify_formula_hub_search.mjs` passed.
  - `node scripts\verify_formula_hub_search_v2.mjs` passed.
  - `node scripts\verify_topic_preview_app_integration.mjs` passed.
  - `node scripts\verify_single_neuron_preview.mjs` passed.
  - `node scripts\verify_topic_preview_rollout.mjs` failed.
- Known failing command:
  - `node scripts\verify_topic_preview_rollout.mjs`
  - Error: `AssertionError [ERR_ASSERTION]: transfer-learning-intuition needs reserved reading-section positions.`
  - Location: `scripts/verify_topic_preview_rollout.mjs:114:10`
- Build:
  - `npm.cmd run build` in the default sandbox failed with `spawn EPERM`.
  - Same command rerun outside the sandbox passed.
  - Successful build output included `Compiled successfully` and `Generating static pages (160/160)`.
  - Current build route sizes show `/formula-hub` and `/formula-hub/saved` first-load JS at `193 kB`; no Formula Hub split is active on `main`.
- Lint:
  - Standalone `npm.cmd run lint` was not rerun during this correction because `package.json` defines it as `next lint`, which is deprecated in current Next and may prompt for config if no ESLint config exists.
  - `next build` did run its build-time lint/type validity step and passed in the successful build.
- Vercel public production URL HEAD checks on 2026-07-28:
  - `https://deep-learning-visualized.vercel.app/` returned 200.
  - `https://deep-learning-visualized.vercel.app/formula-hub` returned 200.
  - `https://deep-learning-visualized.vercel.app/topic/rnn-structure` returned 200.
  - `https://deep-learning-visualized.vercel.app/blog` returned 200.
  - `https://deep-learning-visualized.vercel.app/prototypes/adam-optimizer-vs-sgd.html` returned 200.
  - `https://deep-learning-visualized.vercel.app/blog/batch-normalization/batchnorm-04.png` returned 200.

# 5. Problems and Blockers

- Confirmed fact: `handoff/HANDOFF.md` is local and untracked. If the next chat is not attached to this exact local workspace, or if the user expects to see it on GitHub, it will not be visible until committed and pushed.
- Confirmed fact: the first `HANDOFF.md` content written in this handoff pass was wrong; it described a Formula Hub optimization task, not the actual cleanup/handoff task. This has now been corrected in both handoff files.
- Confirmed fact: `verify_topic_preview_rollout.mjs` still fails for `transfer-learning-intuition` reserved reading-section positions.
- Confirmed fact: sandboxed `npm.cmd run build` fails with `spawn EPERM`, but the same build succeeds outside the sandbox. Do not treat the sandbox failure as a source-code build failure.
- Confirmed fact: `npm.cmd run lint` is not a reliable standalone verification command until lint setup is modernized; it uses deprecated `next lint`.
- Likely cause: `transfer-learning-intuition` topic preview HTML does not include the reserved reading-section structure expected by `scripts/verify_topic_preview_rollout.mjs`.
- Unverified assumption: Vercel authenticated dashboard/project settings are unchanged. Only public production URLs were checked in this pass.
- Avoid repeating:
  - Do not try to fix cleanliness by deleting `public/**` candidates without checking direct URL behavior and content strategy.
  - Do not merge `codex/formula-hub-dynamic-experiment` directly into `main`.
  - Do not answer that local is fully clean while `handoff/` is still untracked.

# 6. Important Context

- User requirements and preferences:
  - Do not affect the main website or connected content.
  - First understand what Vercel serves and which files are connected before deleting or moving anything.
  - Useful files can stay on GitHub; useless files can be removed only after proof they do not affect the website.
  - Keep `docs/superpowers/**`, but document clearly that it is old/historical.
  - Formula Hub is a half-finished local experiment; do not touch it for now.
  - Prefer GitHub and Vercel to reflect the actual useful website files, but not at the cost of breaking routes or direct public URLs.
- Key docs for next session:
  - `docs/WEBSITE_FILE_IMPACT_MAP.md`
  - `docs/FILE_ISOLATION_PLAN.md`
  - `docs/PROJECT_STRUCTURE_MAP.md`
  - `docs/SCRIPT_INVENTORY.md`
  - `docs/README_DEV_RUN.md`
  - `docs/superpowers/README.md`
- Runtime-sensitive areas:
  - `app/**`
  - `components/**`
  - `data/**`
  - `public/**`
  - `topic-design-previews/**`
  - `scripts/sync_topic_design_previews.mjs`
  - `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`
- Useful but not direct runtime:
  - `source/visualizations/**`
  - `docs/**`
  - `scripts/verify_*.mjs`
  - `scripts/export_notebook_prototypes.py`
- Local-only/ignored:
  - `.next/**`
  - `.vercel/**`
  - `node_modules/**`
  - `reference_materials/**`
  - `tsconfig.tsbuildinfo`
- Public candidates currently retained:
  - `public/prototypes/adam-optimizer-vs-sgd.html`
  - `public/blog/batch-normalization/batchnorm-04.png`
- Production URL:
  - `https://deep-learning-visualized.vercel.app`
- Formula Hub performance handoff from the prior Codex pass:
  - User asked for Formula Hub to feel lighter and more elegant for readers, especially search: load the page shell first, then lazy-load formula data/search/details/KaTeX/filter-heavy logic.
  - This optimization is not active on current `main`.
  - Confirmed current `main` state at handoff time: `components/formula-hub/FormulaHubClient.tsx` still directly imports `@/data/formulaHub`; no active `FormulaHubExplorer`, `FormulaHubLoadingShell`, or dynamic wrapper split exists on `main`.
  - Prior recommended shape: move the full existing interactive client into `components/formula-hub/FormulaHubExplorer.tsx`; replace `FormulaHubClient.tsx` with a lightweight `next/dynamic` wrapper and a polished loading/search shell; put only minimal shell UI in the first bundle; let the explorer import `@/data/formulaHub`.
  - Search usability must stay strong: preserve existing search/filter behavior, saved formula behavior, formula detail links, and readable empty/loading states.
  - Do not merge `codex/formula-hub-dynamic-experiment` directly. If Formula Hub work resumes, inspect that branch only as reference and port intentional changes by hand from current `main`.

# 7. Exact Next Steps

1. First check the workspace state:
   - Run: `git status --short --branch`
   - Expected: `main...origin/main` plus `?? handoff/` if the handoff folder has not been committed.
   - If unexpected tracked diffs appear, inspect with `git diff --stat` and do not revert user changes.
2. Decide whether to publish the corrected handoff:
   - If another chat/GitHub must see it, run: `git add handoff/HANDOFF.md`
   - Then commit: `git commit -m "Update project handoff"`
   - Then push: `git push origin main`
   - Expected: GitHub will contain the handoff files and other chats using GitHub/current branch can open them.
   - If a root-level duplicate `HANDOFF.md` appears again, compare hashes/content first, then keep `handoff/HANDOFF.md` as the canonical file unless the user changes the convention.
3. Investigate the known failing rollout verification:
   - Open: `scripts/verify_topic_preview_rollout.mjs`
   - Check line 114 and the expected reserved reading-section positions.
   - Inspect: `topic-design-previews/transfer-learning-intuition.html`
   - Run: `node scripts\sync_topic_design_previews.mjs`
   - Rerun: `node scripts\verify_topic_preview_rollout.mjs`
   - Expected: the assertion for `transfer-learning-intuition` passes after the HTML structure is corrected.
4. If continuing cleanup Stage 4:
   - Review `public/prototypes/adam-optimizer-vs-sgd.html` versus `public/prototypes/adam-vs-sgd.html`.
   - Review `public/blog/batch-normalization/batchnorm-04.png` against `data/blogPosts.ts`.
   - Decide keep/archive/redirect behavior before moving anything.
   - Run `npm.cmd run build` and direct URL checks after any public file change.
5. If resuming Formula Hub performance work later:
   - Start from current `main`.
   - Do not merge `codex/formula-hub-dynamic-experiment` directly.
   - Inspect current files first: `components/formula-hub/FormulaHubClient.tsx`, `data/formulaHub.ts`, `data/formulaHubEntries.json`, `app/formula-hub/page.tsx`, `app/formula-hub/saved/page.tsx`, `app/formula-hub/[id]/page.tsx`, and `app/globals.css`.
   - Implement the split conservatively: create `components/formula-hub/FormulaHubExplorer.tsx` from the current full client; change `components/formula-hub/FormulaHubClient.tsx` into the lightweight dynamic wrapper/loading shell; add any needed shell styles in `app/globals.css`.
   - Static check after edits: `rg -n "@/data/formulaHub|dynamic\\(|FormulaHubExplorer|ssr: false|FormulaHubLoadingShell" components/formula-hub app/globals.css -S`
   - Expected static result: `FormulaHubClient.tsx` should no longer import `@/data/formulaHub`; `FormulaHubExplorer.tsx` may import it; the wrapper should show a graceful Formula Hub loading/search shell.
   - Run `npm.cmd run build`; if the default sandbox fails with `spawn EPERM`, rerun outside the sandbox as recorded above.
   - Verify `/formula-hub`, `/formula-hub/saved`, and at least one `/formula-hub/[id]`; specifically test search typing, category/filter behavior, formula opening, and saved-formula UI.
6. Modernize lint only when needed:
   - Check current Next.js lint recommendation.
   - Replace deprecated `next lint` with a supported ESLint setup.
   - Avoid answering that standalone lint passes until it has actually run non-interactively.

# 8. First Recommended Action

Run: `git status --short --branch`
