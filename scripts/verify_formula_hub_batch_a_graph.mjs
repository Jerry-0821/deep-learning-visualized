import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topicModelPath = path.join(root, "data", "formulaHub.ts");
const clientPath = path.join(root, "components", "formula-hub", "FormulaHubClient.tsx");
const detailPath = path.join(root, "app", "formula-hub", "[id]", "page.tsx");

assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");
assert.ok(existsSync(clientPath), "Formula Hub client component is missing.");
assert.ok(existsSync(detailPath), "Formula Hub detail page is missing.");

const topicModel = readFileSync(topicModelPath, "utf8");
const client = readFileSync(clientPath, "utf8");
const detail = readFileSync(detailPath, "utf8");

assert.ok(topicModel.includes("export type FormulaRelationType"), "Batch A needs typed relation edge kinds.");
assert.ok(topicModel.includes("export type FormulaRelation"), "Batch A needs a FormulaRelation data shape.");
assert.ok(topicModel.includes("relations?: FormulaRelation[]"), "Formula topics need relation edges.");
assert.ok(topicModel.includes("getFormulaRelationGroups"), "Formula Hub needs a grouped relation helper for UI.");

const relationTypes = [
  "prerequisite",
  "uses",
  "used-in",
  "paired-with",
  "backward-pair",
  "extends",
  "compare-with",
  "appears-in",
  "next-step",
];

for (const type of relationTypes) {
  assert.ok(topicModel.includes(`"${type}"`), `Missing relation type: ${type}`);
}

const requiredEdges = [
  ['id: "sigmoid-activation"', 'relation("paired-with", "binary-cross-entropy"'],
  ['id: "sigmoid-activation"', 'relation("backward-pair", "logistic-gradient-shortcut"'],
  ['id: "sigmoid-activation"', 'relation("appears-in", "lstm-gates"'],
  ['id: "softmax-activation"', 'relation("paired-with", "categorical-cross-entropy"'],
  ['id: "softmax-activation"', 'relation("backward-pair", "softmax-cross-entropy-shortcut"'],
  ['id: "softmax-activation"', 'relation("appears-in", "scaled-dot-product-attention"'],
  ['id: "dense-layer-forward"', 'relation("uses", "sigmoid-activation"'],
  ['id: "dense-layer-forward"', 'relation("uses", "relu-activation"'],
  ['id: "dense-layer-forward"', 'relation("next-step", "dense-layer-weight-gradient"'],
  ['id: "dense-layer-weight-gradient"', 'relation("uses", "dense-layer-forward"'],
  ['id: "dense-layer-weight-gradient"', 'relation("next-step", "gradient-descent-update"'],
  ['id: "adam-update-rule"', 'relation("extends", "momentum-update-rule"'],
  ['id: "adam-update-rule"', 'relation("extends", "rmsprop-update-rule"'],
  ['id: "adam-update-rule"', 'relation("prerequisite", "sgd-update"'],
];

for (const fragments of requiredEdges) {
  const edgeName = fragments.join(" / ");
  assert.ok(
    fragments.every((fragment) => topicModel.includes(fragment)),
    `Missing Batch A relation edge: ${edgeName}`,
  );
}

assert.ok(
  topicModel.includes("entry.relations") && topicModel.includes("relation.targetId"),
  "Search indexing should include relation labels and linked topic ids.",
);
assert.ok(client.includes("Connection Map"), "Drawer should expose grouped relation edges as a connection map.");
assert.ok(client.includes("getFormulaRelationGroups"), "Drawer should use grouped relation helper.");
assert.ok(detail.includes("Connection Map"), "Detail page should expose grouped relation edges.");
assert.ok(detail.includes("getFormulaRelationGroups"), "Detail page should use grouped relation helper.");

console.log("Formula Hub Batch A graph verification passed.");
