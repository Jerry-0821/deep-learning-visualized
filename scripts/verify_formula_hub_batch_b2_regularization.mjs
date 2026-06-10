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
  "l2-regularized-cost",
  "l2-gradient-term",
  "l2-weight-decay-update",
  "l2-weight-decay-shrinkage",
  "dropout-mask",
  "inverted-dropout-forward",
  "dropout-training-scaling",
  "dropout-inference-convention",
  "early-stopping-rule",
  "data-augmentation-transform",
];

for (const id of requiredSourceIds) {
  assert.ok(rawIds.has(id), `Missing PDF-based Regularization source formula block: ${id}`);
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
assert.ok(categories.has("Regularization"), "Formula Hub category list should include Regularization.");

const parent = formulaHubEntriesById["regularization-strategy-core"];
assert.ok(parent, "Batch B2 needs a Regularization Strategy Core parent topic.");
assert.equal(parent.title, "Regularization Strategy Core");
assert.equal(parent.category, "Regularization");

const expectedParentStepOrder = [
  "l2-regularized-cost",
  "l2-gradient-term",
  "l2-weight-decay-update",
  "l2-weight-decay-shrinkage",
  "dropout-mask",
  "inverted-dropout-forward",
  "dropout-training-scaling",
  "dropout-inference-convention",
  "early-stopping-rule",
  "data-augmentation-transform",
];
assert.equal(
  JSON.stringify(parent.steps?.map((step) => step.id)),
  JSON.stringify(expectedParentStepOrder),
  "Regularization parent should follow PDF section 9 teaching order.",
);

const childTopicIds = [
  "l2-regularized-cost",
  "dropout-mask",
  "early-stopping-rule",
  "data-augmentation-transform",
];

for (const id of childTopicIds) {
  const entry = formulaHubEntriesById[id];
  assert.ok(entry, `Missing Regularization child topic: ${id}`);
  assert.equal(entry.category, "Regularization", `${id} should use Regularization category.`);
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === "part-of" && relation.targetId === "regularization-strategy-core"),
    `${id} should be marked as part of Regularization Strategy Core.`,
  );
  assert.ok(
    (parent.relations ?? []).some((relation) => relation.targetId === id),
    `Regularization Strategy Core should connect to ${id}.`,
  );
}

const l2 = formulaHubEntriesById["l2-regularized-cost"];
assert.equal(l2.title, "L2 Regularization Flow");
assert.ok(l2.steps?.some((step) => step.id === "l2-gradient-term"));
assert.ok(l2.steps?.some((step) => step.latex.includes("\\frac{\\lambda}{m}W^{[l]}")));
assert.ok(l2.steps?.some((step) => step.id === "l2-weight-decay-shrinkage"));
assert.ok(
  (l2.relations ?? []).some((relation) => relation.targetId === "gradient-descent-update" || relation.targetId === "optimizer-family-core"),
  "L2 should connect to optimizer updates.",
);
assert.ok(
  (l2.relations ?? []).some((relation) => relation.type === "compare-with" && relation.targetId === "dropout-mask"),
  "L2 should compare with dropout.",
);

const dropout = formulaHubEntriesById["dropout-mask"];
assert.equal(dropout.title, "Dropout Training Flow");
assert.ok(dropout.steps?.some((step) => step.id === "dropout-training-scaling"));
assert.ok(dropout.steps?.some((step) => step.id === "dropout-inference-convention"));
assert.ok(dropout.steps?.some((step) => step.latex.includes("p_{keep}")));
assert.ok(
  (dropout.relations ?? []).some((relation) => relation.targetId === "dense-layer-forward"),
  "Dropout should connect back to dense-layer activations.",
);
assert.ok(
  (dropout.relations ?? []).some((relation) => relation.type === "compare-with" && relation.targetId === "l2-regularized-cost"),
  "Dropout should compare with L2.",
);

const earlyStopping = formulaHubEntriesById["early-stopping-rule"];
assert.ok(earlyStopping.latex.includes("\\arg\\min"));
assert.ok(
  (earlyStopping.relations ?? []).some((relation) => relation.targetId === "bias-variance-decomposition"),
  "Early stopping should connect to bias/variance diagnosis.",
);

const dataAugmentation = formulaHubEntriesById["data-augmentation-transform"];
assert.ok(dataAugmentation.latex.includes("T(x)"));
assert.ok(
  (dataAugmentation.relations ?? []).some((relation) => relation.targetId === "bias-variance-decomposition"),
  "Data augmentation should connect to bias/variance diagnosis.",
);

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !formulaHubEntriesById[relation.targetId])
    .map((relation) => `${entry.id}->${relation.targetId}`),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `Regularization pass should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
);

console.log("Formula Hub Batch B2 Regularization verification passed.");
