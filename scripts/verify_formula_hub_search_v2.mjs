import assert from "node:assert/strict";
import { loadFormulaHubModel } from "./formula_hub_test_utils.mjs";

const { searchFormulaEntries } = loadFormulaHubModel();

function topIds(query, limit = 8) {
  return searchFormulaEntries({ query }).slice(0, limit).map((entry) => entry.id);
}

function assertTopIncludes(query, expectedId, limit = 5) {
  const ids = topIds(query, limit);
  assert.ok(
    ids.includes(expectedId),
    `Expected "${query}" to include ${expectedId} in top ${limit}. Got: ${ids.join(", ")}`,
  );
}

function assertRanksBefore(query, firstId, secondId, limit = 8) {
  const ids = topIds(query, limit);
  const firstIndex = ids.indexOf(firstId);
  const secondIndex = ids.indexOf(secondId);
  assert.ok(firstIndex !== -1, `Expected "${query}" to include ${firstId}. Got: ${ids.join(", ")}`);
  assert.ok(secondIndex !== -1, `Expected "${query}" to include ${secondId}. Got: ${ids.join(", ")}`);
  assert.ok(
    firstIndex < secondIndex,
    `Expected "${query}" to rank ${firstId} before ${secondId}. Got: ${ids.join(", ")}`,
  );
}

assertTopIncludes("QK^T", "scaled-dot-product-attention", 3);
assertTopIncludes("qkt", "scaled-dot-product-attention", 3);
assertTopIncludes("query key transpose", "scaled-dot-product-attention", 5);
assertTopIncludes("attention score shape", "attention-score-shape-check", 3);

assertTopIncludes("n[l] x m", "dense-layer-activation-shape", 5);
assertTopIncludes("n_l by m", "dense-layer-activation-shape", 5);
assertTopIncludes("gamma beta", "batchnorm-normalize-scale-shift", 5);

assertTopIncludes("BN", "batchnorm-normalize-scale-shift", 5);
assertTopIncludes("batchnorm", "batchnorm-normalize-scale-shift", 3);
assertTopIncludes("rmspropr", "rmsprop-update-rule", 3);
assertTopIncludes("soft max", "softmax-activation", 3);
assertTopIncludes("transfomer", "attention-transformer-core", 5);

assertTopIncludes("anchor assignment", "yolo-anchor-assignment", 3);
assertTopIncludes("cell state", "lstm-cell-update", 3);
assertTopIncludes("gram matrix", "neural-style-gram-matrix", 3);
assertTopIncludes("bias correction", "adam-update-rule", 3);

assertRanksBefore("adam momentum rmsprop bias correction", "adam-update-rule", "momentum-update-rule");
assertRanksBefore("adam momentum rmsprop bias correction", "adam-update-rule", "rmsprop-update-rule");

console.log("Formula Hub Search v2 quality verification passed.");
