# Project handoff (shared by Codex, Claude and any other AI assistant)

Rules for every assistant are in `AGENTS.md` at the repo root. Read the change log first; add a dated entry at the top of it whenever you change anything.

# Change log (newest first)

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

Found, not fixed (lesson file, needs the user's OK):
- The lesson pages' own "Back to module" link (`public/topic-design-previews/topic-preview-shell.js`, line ~3173) has no `target="_top"`, so clicking it opens the Topics page inside the lesson iframe (page within a page). Fix would be adding `target="_top"` to that link. The new top bar gives a correct way out meanwhile.

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

- Pooling fixes: `public/prototypes/pooling.html`, `source/visualizations/pooling-and-downsampling/pooling_style_aligned_source.py`, Pooling section of `data/topicTeachingContent.ts`. Details in `POOLING_UNPUSHED_NOTES.md`. The user said on 2026-10-17 to leave Pooling alone for now.
- `scripts/export_notebook_prototypes.py`: safer preview-by-default exporter (needs `--write`). Finished, but kept local with the Pooling work.
- `.claude/launch.json`: local preview-server config for Claude; not needed by the site.
- Found, not fixed: Formula Hub has a MathJax/React hydration race, seen with the local dev server (production rendered correctly on two checks). MathJax can typeset before hydration, React then reports a mismatch and re-renders, and some formulas (hero chips, symbol dictionary) stay as raw `\(...\)` until the next typeset. Fix idea: have `MathJaxRefresh` call `MathJax.typesetClear()` + `typesetPromise()` after hydration, or render `FormulaMath` only on the client.

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
