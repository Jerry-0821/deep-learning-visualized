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
      return require(rawEntriesPath);
    }
    return require(request);
  },
};

vm.runInNewContext(outputText, sandbox, { filename: "formulaHub.transpiled.cjs" });

const { formulaHubEntries, formulaHubEntriesById } = sandbox.exports;

const optimizerFamily = formulaHubEntriesById["optimizer-family-core"];
assert.ok(optimizerFamily, "Batch A.4 needs an Optimizer Family Core parent topic.");
assert.equal(optimizerFamily.title, "Optimizer Family Core");
assert.equal(optimizerFamily.category, "Optimization");

const optimizerChildren = [
  "gradient-descent-update",
  "sgd-update",
  "momentum-update-rule",
  "rmsprop-update-rule",
  "adam-update-rule",
];

for (const id of optimizerChildren) {
  const entry = formulaHubEntriesById[id];
  assert.ok(entry, `Missing optimizer child topic: ${id}`);
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === "part-of" && relation.targetId === "optimizer-family-core"),
    `${id} should be marked as part of Optimizer Family Core.`,
  );
  assert.ok(
    (optimizerFamily.relations ?? []).some((relation) => relation.targetId === id),
    `Optimizer Family Core should connect to ${id}.`,
  );
}

const adam = formulaHubEntriesById["adam-update-rule"];
assert.ok(adam, "Adam topic is missing.");

const expectedAdamStepOrder = [
  "adam-current-mini-batch-gradient",
  "adam-first-moment",
  "adam-second-moment",
  "adam-first-moment-bias-correction",
  "adam-second-moment-bias-correction",
  "adam-parameter-update",
];
assert.equal(
  JSON.stringify(adam.steps?.map((step) => step.id)),
  JSON.stringify(expectedAdamStepOrder),
  "Adam should read as gradient -> first moment -> second moment -> bias corrections -> final update.",
);

const adamLatex = adam.steps?.map((step) => step.latex).join("\n") ?? "";
const requiredAdamFragments = [
  "g_t=\\frac{1}{B}\\sum_{i\\in\\mathcal{B}_t}",
  "m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t",
  "v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2",
  "\\hat{m}_t=\\frac{m_t}{1-\\beta_1^t}",
  "\\hat{v}_t=\\frac{v_t}{1-\\beta_2^t}",
  "\\theta_t\\leftarrow\\theta_{t-1}-\\alpha\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}",
];

for (const fragment of requiredAdamFragments) {
  assert.ok(adamLatex.includes(fragment), `Adam flow is missing formula fragment: ${fragment}`);
}

const adamRelations = adam.relations ?? [];
for (const [type, targetId] of [
  ["part-of", "optimizer-family-core"],
  ["prerequisite", "sgd-update"],
  ["extends", "momentum-update-rule"],
  ["extends", "rmsprop-update-rule"],
  ["compare-with", "gradient-descent-update"],
]) {
  assert.ok(
    adamRelations.some((relation) => relation.type === type && relation.targetId === targetId),
    `Adam should have ${type} relation to ${targetId}.`,
  );
}

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !formulaHubEntriesById[relation.targetId])
    .map((relation) => `${entry.id}->${relation.targetId}`),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `Optimizer pass should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
);

console.log("Formula Hub Batch A.4 Optimizer verification passed.");
