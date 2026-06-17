import assert from "node:assert/strict";
import {
  assertHasRelation,
  assertNoBrokenRelations,
  assertRequiredRawIds,
  loadFormulaHubModel,
} from "./formula_hub_test_utils.mjs";

const { formulaHubEntries, formulaHubEntriesById, rawEntriesById } = loadFormulaHubModel();

const requiredSourceIds = [
  "seq2seq-decoder-probability",
  "attention-alignment-scores",
  "attention-context-vector",
  "beam-search-log-score",
  "length-normalized-beam-score",
  "qkv-projections",
  "scaled-dot-product-attention",
  "attention-score-shape-check",
  "masked-self-attention",
  "multi-head-attention",
  "sinusoidal-positional-encoding",
  "transformer-add-norm",
  "layer-normalization",
  "transformer-feed-forward-network",
  "transformer-block-pipeline",
];

assertRequiredRawIds(rawEntriesById, requiredSourceIds, "PDF-based attention/Transformer");

const parent = formulaHubEntriesById["attention-transformer-core"];
assert.ok(parent, "Batch G needs an Attention/Transformer Core parent topic.");
assert.equal(parent.title, "Attention/Transformer Core");
assert.equal(parent.category, "Transformer");
assert.equal(parent.type, "pipeline");
assert.ok(parent.steps?.some((step) => step.id === "attention-alignment-scores"), "Attention core should include additive alignment scores.");
assert.ok(parent.steps?.some((step) => step.id === "attention-score-shape-check"), "Attention core should include QK^T shape check.");

const seq2seq = formulaHubEntriesById["seq2seq-attention-core"];
assert.ok(seq2seq, "Batch G needs a seq2seq attention topic.");
assertHasRelation(seq2seq, "uses", "attention-alignment-scores", "Seq2Seq attention should use alignment scores.");
assertHasRelation(seq2seq, "uses", "attention-context-vector", "Seq2Seq attention should use context vectors.");
assertHasRelation(seq2seq, "prerequisite", "lstm-memory-flow", "Seq2Seq attention should connect back to recurrent encoders/decoders.");
assertHasRelation(seq2seq, "compare-with", "scaled-dot-product-attention", "Additive attention should compare with scaled dot-product attention.");

const scaled = formulaHubEntriesById["scaled-dot-product-attention"];
assert.ok(scaled, "Scaled dot-product attention topic should exist.");
assertHasRelation(scaled, "prerequisite", "qkv-projections", "Scaled attention should require Q/K/V projections.");
assertHasRelation(scaled, "uses", "attention-score-shape-check", "Scaled attention should include its score shape check.");
assertHasRelation(scaled, "uses", "softmax-activation", "Scaled attention should connect to softmax.");

const transformer = formulaHubEntriesById["transformer-block-pipeline"];
assert.ok(transformer, "Transformer block pipeline should exist.");
for (const targetId of [
  "multi-head-attention",
  "transformer-add-norm",
  "layer-normalization",
  "transformer-feed-forward-network",
  "masked-self-attention",
]) {
  assert.ok(
    (transformer.relations ?? []).some((relation) => relation.targetId === targetId),
    `Transformer block should connect to ${targetId}.`,
  );
}

assertNoBrokenRelations(formulaHubEntries, formulaHubEntriesById, "Batch G attention/Transformer");

console.log("Formula Hub Batch G attention/Transformer verification passed.");
