import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topicModelPath = path.join(root, "data", "formulaHub.ts");

assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");

const topicModel = readFileSync(topicModelPath, "utf8");

assert.ok(
  topicModel.includes('id: "logistic-regression-training-pipeline"'),
  "Batch A.2 needs a Logistic Regression Training Pipeline topic.",
);
assert.ok(
  topicModel.includes('title: "Logistic Regression Training Pipeline"'),
  "Logistic Regression topic should be named as a full training pipeline.",
);

const requiredSteps = [
  "logistic-vectorized-forward",
  "logistic-batch-cost",
  "logistic-dw-db",
  "logistic-parameter-update",
];

for (const stepId of requiredSteps) {
  assert.ok(topicModel.includes(`id: "${stepId}"`), `Missing Logistic Regression bridge/source step: ${stepId}`);
}

const requiredFormulas = [
  "Z=w^TX+b",
  "A=\\\\sigma(Z)",
  "J(w,b)=\\\\frac{1}{m}\\\\sum_{i=1}^{m}L(a^{(i)},y^{(i)})",
  "dw=\\\\frac{1}{m}XdZ^T",
  "w\\\\leftarrow w-\\\\alpha dw",
];

for (const formula of requiredFormulas) {
  assert.ok(topicModel.includes(formula), `Missing Logistic Regression PDF-based formula: ${formula}`);
}

const requiredEdges = [
  ['id: "logistic-regression-training-pipeline"', 'relation("uses", "sigmoid-activation"'],
  ['id: "logistic-regression-training-pipeline"', 'relation("paired-with", "binary-cross-entropy"'],
  ['id: "logistic-regression-training-pipeline"', 'relation("backward-pair", "logistic-gradient-shortcut"'],
  ['id: "logistic-regression-training-pipeline"', 'relation("next-step", "gradient-descent-update"'],
  ['id: "logistic-regression-training-pipeline"', 'relation("compare-with", "dense-layer-forward"'],
  ['id: "sigmoid-activation"', 'relation("used-in", "logistic-regression-training-pipeline"'],
  ['id: "binary-cross-entropy"', 'relation("used-in", "logistic-regression-training-pipeline"'],
  ['id: "logistic-gradient-shortcut"', 'relation("used-in", "logistic-regression-training-pipeline"'],
];

for (const fragments of requiredEdges) {
  assert.ok(
    fragments.every((fragment) => topicModel.includes(fragment)),
    `Missing Logistic Regression relation edge: ${fragments.join(" / ")}`,
  );
}

console.log("Formula Hub Batch A.2 Logistic Regression verification passed.");
