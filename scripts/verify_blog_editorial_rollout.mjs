import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  assert.ok(existsSync(fullPath), `Missing blog editorial file: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

const data = readRequired("data/blogPosts.ts");
for (const slug of [
  "batch-normalization",
  "residual-block-resnet-intuition",
  "vanishing-gradient-problem",
  "word-embeddings",
  "attention-mechanism",
  "add-and-norm",
  "self-attention-vs-rnn-vs-cnn",
  "transfer-learning",
]) {
  assert.ok(data.includes(`slug: "${slug}"`), `Existing blog post is missing: ${slug}`);
}

const page = readRequired("app/blog/[slug]/page.tsx");
const layout = readRequired("components/blog/BlogReadingLayout.tsx");
const style = readRequired("app/globals.css");

for (const marker of [
  "BlogReadingLayout",
  "buildBlogNavigationItems",
  "blog-reading-root",
  "EditionBackdrop",
  "EditionNav",
]) {
  assert.ok(page.includes(marker), `Blog post route is missing editorial marker: ${marker}`);
}

for (const marker of [
  "On This Page",
  "blog-reading-navigation",
  "blog-reading-navigation-toggle",
  "aria-expanded",
  "Escape",
]) {
  assert.ok(layout.includes(marker), `Blog navigation component is missing behavior: ${marker}`);
}

for (const marker of [
  ".blog-reading-root",
  ".blog-reading-layout",
  ".blog-reading-navigation",
  ".blog-reading-article",
  ".blog-reading-layout.navigation-collapsed",
]) {
  assert.ok(style.includes(marker), `Blog editorial style is missing: ${marker}`);
}

assert.ok(!page.includes("calculation-drawer"), "Blog pages must not include a right calculation drawer.");
assert.ok(!layout.includes("calculation-drawer"), "Blog navigation must not implement a right drawer.");

console.log("Blog editorial rollout checks passed.");
