import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const require = createRequire(import.meta.url);

export function loadFormulaHubModel() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const topicModelPath = path.join(root, "data", "formulaHub.ts");
  const rawEntriesPath = path.join(root, "data", "formulaHubEntries.json");

  assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");
  assert.ok(existsSync(rawEntriesPath), "Formula Hub source entry file is missing.");

  const rawEntries = require(rawEntriesPath);
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

  return {
    ...sandbox.exports,
    rawEntries,
    rawEntriesById: Object.fromEntries(rawEntries.map((entry) => [entry.id, entry])),
  };
}

export function assertRequiredRawIds(rawEntriesById, ids, label) {
  for (const id of ids) {
    assert.ok(rawEntriesById[id], `Missing ${label} source formula block: ${id}`);
  }
}

export function assertNoBrokenRelations(formulaHubEntries, formulaHubEntriesById, label) {
  const missingRelationTargets = formulaHubEntries.flatMap((entry) =>
    (entry.relations ?? [])
      .filter((relation) => !formulaHubEntriesById[relation.targetId])
      .map((relation) => `${entry.id}->${relation.targetId}`),
  );

  assert.equal(
    missingRelationTargets.length,
    0,
    `${label} should not leave broken relation targets: ${missingRelationTargets.join(", ")}`,
  );
}

export function assertHasRelation(entry, type, targetId, message) {
  assert.ok(
    (entry.relations ?? []).some((relation) => relation.type === type && relation.targetId === targetId),
    message,
  );
}
