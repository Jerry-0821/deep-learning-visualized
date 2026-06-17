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
  "cnn-tensor-convention",
  "cnn-output-size",
  "convolution-operation",
  "convolution-parameter-count",
  "cnn-padding-conventions",
  "pooling-output-size",
  "max-pooling",
  "average-pooling",
  "pointwise-convolution",
  "depthwise-separable-convolution",
];

for (const id of requiredSourceIds) {
  assert.ok(rawIds.has(id), `Missing PDF-based CNN basics source formula block: ${id}`);
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
assert.ok(categories.has("CNN"), "Formula Hub category list should include CNN.");

const parent = formulaHubEntriesById["cnn-basics-core"];
assert.ok(parent, "Batch D needs a CNN Basics Core parent topic.");
assert.equal(parent.title, "CNN Basics Core");
assert.equal(parent.category, "CNN");
assert.equal(parent.type, "pipeline");

const expectedParentStepOrder = [
  "cnn-tensor-convention",
  "cnn-output-size",
  "convolution-operation",
  "convolution-parameter-count",
  "cnn-padding-conventions",
  "pooling-output-size",
  "max-pooling",
  "average-pooling",
  "pointwise-convolution",
  "depthwise-separable-convolution",
];
assert.equal(
  JSON.stringify(parent.steps?.map((step) => step.id)),
  JSON.stringify(expectedParentStepOrder),
  "CNN Basics parent should follow PDF section 11 teaching order.",
);

const childTopicIds = [
  "cnn-tensor-convention",
  "cnn-output-size",
  "convolution-operation",
  "convolution-parameter-count",
  "cnn-padding-conventions",
  "pooling-output-size",
  "pointwise-convolution",
  "depthwise-separable-convolution",
];

for (const id of childTopicIds) {
  const entry = formulaHubEntriesById[id];
  assert.ok(entry, `Missing CNN basics child topic: ${id}`);
  assert.equal(entry.category, "CNN", `${id} should use CNN category.`);
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === "part-of" && relation.targetId === "cnn-basics-core"),
    `${id} should be marked as part of CNN Basics Core.`,
  );
  assert.ok(
    (parent.relations ?? []).some((relation) => relation.targetId === id),
    `CNN Basics Core should connect to ${id}.`,
  );
}

assert.ok(
  parent.steps?.some((step) => step.latex.includes("n_H^{[l]}=\\left\\lfloor")),
  "CNN basics should include convolution spatial output size.",
);
assert.ok(
  parent.steps?.some((step) => step.latex.includes("Z^{[l](i)}_{h,w,k}")),
  "CNN basics should include multi-channel convolution indexing.",
);
assert.ok(
  parent.steps?.some((step) => step.latex.includes("\\#params_{layer}")),
  "CNN basics should include convolution parameter count.",
);
assert.ok(
  parent.steps?.some((step) => step.id === "average-pooling"),
  "CNN basics should include average pooling, not only max pooling.",
);
assert.ok(
  (formulaHubEntriesById["convolution-operation"].relations ?? []).some((relation) => relation.targetId === "feature-map-activation"),
  "Convolution operation should connect to feature maps.",
);
assert.ok(
  (formulaHubEntriesById["cnn-output-size"].relations ?? []).some((relation) => relation.targetId === "cnn-padding-conventions"),
  "CNN output size should connect to padding conventions.",
);

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !formulaHubEntriesById[relation.targetId])
    .map((relation) => `${entry.id}->${relation.targetId}`),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `CNN basics pass should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
);

console.log("Formula Hub Batch D CNN basics verification passed.");
