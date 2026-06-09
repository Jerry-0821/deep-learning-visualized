import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDataPath = path.join(root, "data", "formulaHubEntries.json");
const topicModelPath = path.join(root, "data", "formulaHub.ts");

assert.ok(existsSync(sourceDataPath), "Formula Hub source block data file is missing.");
assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");

const sourceBlocks = JSON.parse(readFileSync(sourceDataPath, "utf8"));
const topicModel = readFileSync(topicModelPath, "utf8");

assert.ok(Array.isArray(sourceBlocks), "Formula Hub source data must be an array.");
assert.ok(sourceBlocks.length >= 78, "Formula Hub should keep the existing source formula blocks.");

const topicDefinitionSection = topicModel.slice(
  topicModel.indexOf("const formulaTopicDefinitions"),
  topicModel.indexOf("export const formulaHubEntries"),
);

const topicCount = (topicDefinitionSection.match(/\n\s+\{\n\s+id: /g) ?? []).length;
assert.ok(topicCount >= 50, "Formula Hub should expose PDF-node formula topics, not a tiny formula sample.");

assert.ok(
    topicModel.includes('id: "adam-update-rule"') &&
    topicModel.includes('title: "Adam Optimization Flow"') &&
    topicModel.includes('id: "adam-first-moment-bias-correction"') &&
    topicModel.includes('id: "adam-second-moment-bias-correction"') &&
    topicModel.includes('id: "adam-parameter-update"'),
  "Adam should be a full Formula Topic with explicit bias-correction steps.",
);

assert.ok(
  topicModel.includes('id: "batchnorm-normalize-scale-shift"') &&
    topicModel.includes('title: "Batch Normalization Forward Pipeline"') &&
    topicModel.includes('"batchnorm-mini-batch-statistics", "batchnorm-normalize-scale-shift", "batchnorm-inference-transform"'),
  "BatchNorm should be represented as a multi-step pipeline topic.",
);

assert.ok(
  topicModel.includes("entry.steps ?? []") &&
    topicModel.includes("step.title") &&
    topicModel.includes("step.latex") &&
    topicModel.includes("step.description"),
  "Search indexing should include formula topic steps.",
);

assert.ok(
  topicModel.includes("formulaHubEntryAliasesById") && topicModel.includes("sourceFormulaIds"),
  "Legacy source block IDs should alias into their Formula Topic pages.",
);

const requiredTopicIds = [
  "dense-layer-weight-gradient",
  "optimizer-family-core",
  "adam-update-rule",
  "rmsprop-update-rule",
  "momentum-update-rule",
  "batchnorm-normalize-scale-shift",
  "scaled-dot-product-attention",
  "transformer-block-pipeline",
  "yolo-grid-output-shape",
  "neural-style-style-cost",
  "beam-search-log-score",
  "precision-recall-f1",
  "matrix-multiplication-shape",
];

for (const id of requiredTopicIds) {
  assert.ok(topicDefinitionSection.includes(`id: "${id}"`), `Missing Formula Topic definition: ${id}`);
}

console.log("Formula Hub topic-model verification passed.");
