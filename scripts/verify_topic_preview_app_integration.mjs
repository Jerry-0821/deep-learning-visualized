import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  assert.ok(existsSync(fullPath), `Missing topic preview integration file: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

const requiredPreviews = {
  "neuron-structure": "single-neuron.html",
  "attention-mechanism-intuition": "attention-mechanism-intuition.html",
  "evaluation-metrics-confusion-matrix": "evaluation-metrics-confusion-matrix.html",
  "bias-vs-variance-diagnosis": "bias-vs-variance-diagnosis.html",
  "transfer-learning-intuition": "transfer-learning-intuition.html",
  "rnn-structure": "rnn-structure.html",
  "backpropagation-intuition": "backpropagation-intuition.html",
  "convolution-operation": "convolution-operation.html",
  dropout: "dropout.html",
  "gradient-descent-learning-rate": "gradient-descent-learning-rate.html",
};

const mapping = readRequired("data/redesignedTopicPreviews.ts");
for (const [slug, fileName] of Object.entries(requiredPreviews)) {
  assert.ok(mapping.includes(`"${slug}": "/topic-design-previews/${fileName}"`), `Missing redesigned route: ${slug}`);
}

const topicRoute = readRequired("app/topic/[slug]/page.tsx");
assert.ok(topicRoute.includes("RedesignedTopicPage"), "Topic route must load the redesigned page component.");
assert.ok(topicRoute.includes("getRedesignedTopicPreviewPath"), "Topic route must select approved redesigned previews.");

const pageComponent = readRequired("components/topic/RedesignedTopicPage.tsx");
for (const marker of ["redesigned-topic-route", "redesigned-topic-frame", "<iframe", "src={src}"]) {
  assert.ok(pageComponent.includes(marker), `Redesigned page frame is missing: ${marker}`);
}

const syncScript = readRequired("scripts/sync_topic_design_previews.mjs");
for (const marker of [
  "topic-design-previews",
  "public",
  "../public/prototypes/",
  "../prototypes/",
  "https://deep-learning-visualized.vercel.app/module/",
  "/module/",
]) {
  assert.ok(syncScript.includes(marker), `Preview sync contract is missing: ${marker}`);
}

const packageJson = readRequired("package.json");
assert.ok(packageJson.includes("sync:topic-previews"), "Build must synchronize redesigned topic assets.");

readRequired("app/icon.svg");
assert.ok(existsSync(path.join(root, "public", "favicon.ico")), "Traditional favicon asset must be published.");

const modules = readRequired("data/modules.tsx");
assert.match(
  modules,
  /title: "Backpropagation",[\s\S]{0,260}slug: "backpropagation-intuition"/,
  "The published module catalogue must use the approved Backpropagation title.",
);

console.log("Topic preview app integration checks passed.");
