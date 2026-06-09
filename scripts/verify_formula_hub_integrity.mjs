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

const { formulaHubEntries } = sandbox.exports;
const ids = new Set(formulaHubEntries.map((entry) => entry.id));
const sourceIds = new Set(require(rawEntriesPath).map((entry) => entry.id));

const duplicateIds = formulaHubEntries
  .map((entry) => entry.id)
  .filter((id, index, allIds) => allIds.indexOf(id) !== index);
assert.equal(duplicateIds.length, 0, `Formula Hub topic ids must be unique: ${JSON.stringify(duplicateIds)}`);

const missingSourceIds = formulaHubEntries.flatMap((entry) =>
  (entry.sourceFormulaIds ?? [])
    .filter((sourceId) => !sourceIds.has(sourceId))
    .map((sourceId) => ({ entry: entry.id, sourceId })),
);
assert.equal(
  missingSourceIds.length,
  0,
  `Formula Hub topics must only reference existing source formula ids: ${JSON.stringify(missingSourceIds)}`,
);

const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
  (entry.relations ?? [])
    .filter((relation) => !ids.has(relation.targetId))
    .map((relation) => ({ entry: entry.id, targetId: relation.targetId })),
);
assert.equal(
  missingRelationTargets.length,
  0,
  `Formula Hub relation targets must point to existing topic ids: ${JSON.stringify(missingRelationTargets)}`,
);

const emptyStepTopics = formulaHubEntries
  .filter((entry) => !entry.steps?.length)
  .map((entry) => entry.id);
assert.equal(
  emptyStepTopics.length,
  0,
  `Formula Hub topics should expose at least one formula flow step: ${JSON.stringify(emptyStepTopics)}`,
);

console.log("Formula Hub integrity verification passed.");
