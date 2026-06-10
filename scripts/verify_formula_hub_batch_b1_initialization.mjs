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
  "initialization-parameter-shapes",
  "zero-initialization",
  "small-random-initialization",
  "xavier-glorot-variance",
  "xavier-normal-initialization",
  "xavier-uniform-initialization",
  "xavier-simplified-variance",
  "he-variance",
  "he-normal-initialization",
  "he-scaled-random-matrix",
  "bias-initialization",
];

for (const id of requiredSourceIds) {
  assert.ok(rawIds.has(id), `Missing PDF-based Initialization source formula block: ${id}`);
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
assert.ok(categories.has("Initialization"), "Formula Hub category list should include Initialization.");

const parent = formulaHubEntriesById["initialization-strategy-core"];
assert.ok(parent, "Batch B1 needs an Initialization Strategy Core parent topic.");
assert.equal(parent.title, "Initialization Strategy Core");
assert.equal(parent.category, "Initialization");

const expectedParentStepOrder = [
  "initialization-parameter-shapes",
  "zero-initialization",
  "small-random-initialization",
  "xavier-glorot-variance",
  "xavier-normal-initialization",
  "xavier-uniform-initialization",
  "xavier-simplified-variance",
  "he-variance",
  "he-normal-initialization",
  "he-scaled-random-matrix",
  "bias-initialization",
];
assert.equal(
  JSON.stringify(parent.steps?.map((step) => step.id)),
  JSON.stringify(expectedParentStepOrder),
  "Initialization parent should follow PDF section 8 teaching order.",
);

const childTopicIds = [
  "initialization-parameter-shape-contract",
  "zero-initialization",
  "small-random-initialization",
  "xavier-glorot-initialization",
  "he-initialization",
  "bias-initialization",
];

for (const id of childTopicIds) {
  const entry = formulaHubEntriesById[id];
  assert.ok(entry, `Missing Initialization child topic: ${id}`);
  assert.equal(entry.category, "Initialization", `${id} should use Initialization category.`);
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === "part-of" && relation.targetId === "initialization-strategy-core"),
    `${id} should be marked as part of Initialization Strategy Core.`,
  );
  assert.ok(
    (parent.relations ?? []).some((relation) => relation.targetId === id),
    `Initialization Strategy Core should connect to ${id}.`,
  );
}

const xavier = formulaHubEntriesById["xavier-glorot-initialization"];
assert.ok(xavier.steps?.some((step) => step.latex.includes("\\operatorname{Var}(W^{[l]})=\\frac{2}{fan_{in}+fan_{out}}")));
assert.ok(xavier.steps?.some((step) => step.latex.includes("\\mathcal{U}")));
assert.ok(
  (xavier.relations ?? []).some((relation) => relation.type === "compare-with" && relation.targetId === "he-initialization"),
  "Xavier should compare with He initialization.",
);
assert.ok(
  (xavier.relations ?? []).some((relation) => relation.targetId === "activation-functions-core"),
  "Xavier should connect back to activation choices.",
);

const he = formulaHubEntriesById["he-initialization"];
assert.ok(he.steps?.some((step) => step.latex.includes("\\operatorname{Var}(W^{[l]})=\\frac{2}{fan_{in}}")));
assert.ok(
  (he.relations ?? []).some((relation) => relation.targetId === "relu-activation"),
  "He initialization should connect to ReLU.",
);
assert.ok(
  (he.relations ?? []).some((relation) => relation.type === "compare-with" && relation.targetId === "xavier-glorot-initialization"),
  "He should compare with Xavier initialization.",
);

const zero = formulaHubEntriesById["zero-initialization"];
assert.ok(
  zero.description.toLowerCase().includes("symmetry"),
  "Zero initialization topic should explicitly teach the hidden-unit symmetry problem.",
);

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !formulaHubEntriesById[relation.targetId])
    .map((relation) => `${entry.id}->${relation.targetId}`),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `Initialization pass should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
);

console.log("Formula Hub Batch B1 Initialization verification passed.");
