import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topicModelPath = path.join(root, "data", "formulaHub.ts");
const rawEntriesPath = path.join(root, "data", "formulaHubEntries.json");

assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");
assert.ok(existsSync(rawEntriesPath), "Formula Hub source entry file is missing.");

const rawEntries = require(rawEntriesPath);
const rawIds = new Set(rawEntries.map((entry) => entry.id));
const requiredSourceIds = [
  "batchnorm-mini-batch-statistics",
  "batchnorm-single-example-normalization",
  "batchnorm-vectorized-normalization",
  "batchnorm-scale-shift",
  "batchnorm-forward-pipeline",
  "batchnorm-running-statistics",
  "batchnorm-training-normalization",
  "batchnorm-training-scale-shift",
  "batchnorm-inference-normalization",
  "batchnorm-inference-transform",
  "batchnorm-parameter-shapes",
];

for (const id of requiredSourceIds) {
  assert.ok(rawIds.has(id), `Missing PDF-based BatchNorm source formula block: ${id}`);
}

let source = readFileSync(topicModelPath, "utf8");
source = source.replace(
  'import rawFormulaHubEntries from "@/data/formulaHubEntries.json";',
  'const rawFormulaHubEntries = require("./data/formulaHubEntries.json");',
);
source = source.replace('import { blogPostsBySlug } from "@/data/blogPosts";', "const blogPostsBySlug = {};");
source = source.replace('import { topicsBySlug } from "@/data/topics";', "const topicsBySlug = {};");

const outputText = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    resolveJsonModule: true,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const sandbox = {
  console,
  exports: {},
  require: (request) => {
    if (request === "./data/formulaHubEntries.json") {
      return rawEntries;
    }
    return require(request);
  },
};

vm.runInNewContext(outputText, sandbox, { filename: "formulaHub.transpiled.cjs" });

const { formulaHubEntries, formulaHubEntriesById, formulaCategories } = sandbox.exports;
const categories = new Set(formulaCategories.map((category) => category.id));
assert.ok(categories.has("Optimization"), "Formula Hub category list should include Optimization.");

const parent = formulaHubEntriesById["batchnorm-normalize-scale-shift"];
assert.ok(parent, "Batch C should keep BatchNorm's existing URL/topic id.");
assert.equal(parent.title, "Batch Normalization Forward Pipeline");
assert.equal(parent.category, "Optimization");
assert.equal(parent.type, "pipeline");

const expectedParentStepOrder = [
  "batchnorm-mini-batch-statistics",
  "batchnorm-single-example-normalization",
  "batchnorm-vectorized-normalization",
  "batchnorm-scale-shift",
  "batchnorm-forward-pipeline",
  "batchnorm-running-statistics",
  "batchnorm-training-normalization",
  "batchnorm-training-scale-shift",
  "batchnorm-inference-normalization",
  "batchnorm-inference-transform",
  "batchnorm-parameter-shapes",
];
assert.equal(
  JSON.stringify(parent.steps?.map((step) => step.id)),
  JSON.stringify(expectedParentStepOrder),
  "BatchNorm parent should follow PDF section 10 teaching order.",
);

const childTopicIds = [
  "batchnorm-mini-batch-statistics",
  "batchnorm-normalization-step",
  "batchnorm-scale-shift-step",
  "batchnorm-running-statistics",
  "batchnorm-inference-transform",
  "batchnorm-parameter-shape-reference",
];

for (const id of childTopicIds) {
  const entry = formulaHubEntriesById[id];
  assert.ok(entry, `Missing BatchNorm child topic: ${id}`);
  assert.equal(entry.category, "Optimization", `${id} should use Optimization category.`);
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === "part-of" && relation.targetId === "batchnorm-normalize-scale-shift"),
    `${id} should be marked as part of Batch Normalization Forward Pipeline.`,
  );
  assert.ok(
    (parent.relations ?? []).some((relation) => relation.targetId === id),
    `BatchNorm parent should connect to ${id}.`,
  );
}

assert.ok(
  parent.steps?.some((step) => step.latex.includes("\\mu_B^{[l]}=\\frac{1}{m}")),
  "BatchNorm flow should include mini-batch mean.",
);
assert.ok(
  parent.steps?.some((step) => step.latex.includes("\\hat{Z}^{[l]}=\\frac{Z^{[l]}-\\mu_B^{[l]}}")),
  "BatchNorm flow should include vectorized normalization.",
);
assert.ok(
  parent.steps?.some((step) => step.latex.includes("\\tilde{Z}^{[l]}=\\gamma^{[l]}\\odot\\hat{Z}^{[l]}+\\beta^{[l]}")),
  "BatchNorm flow should include vectorized scale and shift.",
);
assert.ok(
  parent.steps?.some((step) => step.latex.includes("\\mu_{run}^{[l]}\\leftarrow\\rho\\mu_{run}^{[l]}")),
  "BatchNorm flow should include running mean update.",
);
assert.ok(
  parent.steps?.some((step) => step.id === "batchnorm-inference-transform" && step.latex.includes("\\tilde{Z}^{[l]}_{test}")),
  "BatchNorm flow should include inference scale and shift.",
);

assert.ok(
  (parent.relations ?? []).some((relation) => relation.type === "compare-with" && relation.targetId === "layer-normalization"),
  "BatchNorm should compare with LayerNorm.",
);
assert.ok(
  (parent.relations ?? []).some((relation) => relation.targetId === "regularization-strategy-core"),
  "BatchNorm should connect to regularization without being treated as L2/dropout.",
);
assert.ok(
  (parent.relations ?? []).some((relation) => relation.targetId === "initialization-strategy-core"),
  "BatchNorm should connect to initialization stability.",
);
assert.ok(
  (parent.relations ?? []).some((relation) => relation.targetId === "optimizer-family-core"),
  "BatchNorm should connect to optimizer/training stability.",
);

const inference = formulaHubEntriesById["batchnorm-inference-transform"];
assert.ok(
  inference.steps?.some((step) => step.id === "batchnorm-training-normalization"),
  "Inference topic should contrast training normalization.",
);
assert.ok(
  inference.steps?.some((step) => step.id === "batchnorm-inference-normalization"),
  "Inference topic should include inference normalization.",
);

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !formulaHubEntriesById[relation.targetId])
    .map((relation) => `${entry.id}->${relation.targetId}`),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `BatchNorm pass should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
);

console.log("Formula Hub Batch C BatchNorm verification passed.");
