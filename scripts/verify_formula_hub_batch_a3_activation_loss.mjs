import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topicModelPath = path.join(root, "data", "formulaHub.ts");

assert.ok(existsSync(topicModelPath), "Formula Hub topic model file is missing.");

const topicModel = readFileSync(topicModelPath, "utf8");

const requiredFragments = [
  'id: "activation-functions-core"',
  'title: "Activation Functions Core"',
  'id: "output-loss-shortcuts"',
  'title: "Output Activation Loss Shortcuts"',
  '| "part-of"',
  '"part-of": "Part Of"',
];

for (const fragment of requiredFragments) {
  assert.ok(topicModel.includes(fragment), `Missing Batch A.3 model fragment: ${fragment}`);
}

const requiredActivationEdges = [
  ['id: "activation-functions-core"', 'relation("uses", "sigmoid-activation"'],
  ['id: "activation-functions-core"', 'relation("uses", "relu-activation"'],
  ['id: "activation-functions-core"', 'relation("uses", "softmax-activation"'],
  ['id: "sigmoid-activation"', 'relation("part-of", "activation-functions-core"'],
  ['id: "relu-activation"', 'relation("part-of", "activation-functions-core"'],
  ['id: "softmax-activation"', 'relation("part-of", "activation-functions-core"'],
  ['id: "dense-layer-forward"', 'relation("uses", "activation-functions-core"'],
];

for (const fragments of requiredActivationEdges) {
  assert.ok(
    fragments.every((fragment) => topicModel.includes(fragment)),
    `Missing Activation family relation edge: ${fragments.join(" / ")}`,
  );
}

const requiredOutputShortcutEdges = [
  ['id: "output-loss-shortcuts"', 'relation("paired-with", "sigmoid-activation"'],
  ['id: "output-loss-shortcuts"', 'relation("paired-with", "binary-cross-entropy"'],
  ['id: "output-loss-shortcuts"', 'relation("backward-pair", "logistic-gradient-shortcut"'],
  ['id: "output-loss-shortcuts"', 'relation("paired-with", "softmax-activation"'],
  ['id: "output-loss-shortcuts"', 'relation("paired-with", "categorical-cross-entropy"'],
  ['id: "output-loss-shortcuts"', 'relation("backward-pair", "softmax-cross-entropy-shortcut"'],
  ['id: "output-loss-shortcuts"', 'relation("next-step", "dense-layer-weight-gradient"'],
  ['id: "logistic-regression-training-pipeline"', 'relation("uses", "output-loss-shortcuts"'],
  ['id: "binary-cross-entropy"', 'relation("part-of", "output-loss-shortcuts"'],
  ['id: "categorical-cross-entropy"', 'relation("part-of", "output-loss-shortcuts"'],
  ['id: "logistic-gradient-shortcut"', 'relation("part-of", "output-loss-shortcuts"'],
  ['id: "softmax-cross-entropy-shortcut"', 'relation("part-of", "output-loss-shortcuts"'],
];

for (const fragments of requiredOutputShortcutEdges) {
  assert.ok(
    fragments.every((fragment) => topicModel.includes(fragment)),
    `Missing Output shortcut relation edge: ${fragments.join(" / ")}`,
  );
}

console.log("Formula Hub Batch A.3 Activation/Loss verification passed.");
