import assert from "node:assert/strict";
import {
  assertHasRelation,
  assertNoBrokenRelations,
  assertRequiredRawIds,
  loadFormulaHubModel,
} from "./formula_hub_test_utils.mjs";

const { formulaHubEntries, formulaHubEntriesById, rawEntriesById } = loadFormulaHubModel();

const requiredSourceIds = [
  "sequence-tensor-convention",
  "rnn-hidden-state",
  "rnn-output-prediction",
  "rnn-sequence-loss",
  "bptt-gradient-flow",
  "gru-gates",
  "lstm-gates",
  "lstm-cell-update",
  "bidirectional-rnn-context",
];

assertRequiredRawIds(rawEntriesById, requiredSourceIds, "PDF-based RNN/LSTM");

const parent = formulaHubEntriesById["rnn-lstm-core"];
assert.ok(parent, "Batch F needs an RNN/LSTM Core parent topic.");
assert.equal(parent.title, "RNN/LSTM Core");
assert.equal(parent.category, "RNN / LSTM");
assert.equal(parent.type, "pipeline");
assert.equal(JSON.stringify(parent.steps?.map((step) => step.id)), JSON.stringify(requiredSourceIds));
assert.ok(parent.steps?.some((step) => step.latex.includes("\\tilde{c}^{\\langle t\\rangle}")), "RNN/LSTM core should include the LSTM candidate memory update.");
assert.ok(parent.steps?.some((step) => step.latex.includes("\\overrightarrow{a}^{\\langle t\\rangle}")), "RNN/LSTM core should include bidirectional state concatenation.");

const vanilla = formulaHubEntriesById["vanilla-rnn-forward"];
assert.ok(vanilla, "Batch F needs a vanilla RNN forward topic.");
assertHasRelation(vanilla, "part-of", "rnn-lstm-core", "Vanilla RNN should be part of the RNN/LSTM core.");
assertHasRelation(vanilla, "uses", "rnn-hidden-state", "Vanilla RNN should use the hidden-state update.");
assertHasRelation(vanilla, "uses", "rnn-output-prediction", "Vanilla RNN should use the output prediction.");
assertHasRelation(vanilla, "next-step", "bptt-gradient-flow", "Vanilla RNN should connect to BPTT.");

const gru = formulaHubEntriesById["gru-update-flow"];
assert.ok(gru, "Batch F needs a GRU update flow topic.");
assertHasRelation(gru, "part-of", "rnn-lstm-core", "GRU should be part of the RNN/LSTM core.");
assertHasRelation(gru, "compare-with", "lstm-memory-flow", "GRU should compare with LSTM memory flow.");

const lstm = formulaHubEntriesById["lstm-memory-flow"];
assert.ok(lstm, "Batch F needs an LSTM memory flow topic.");
assertHasRelation(lstm, "uses", "lstm-gates", "LSTM topic should use gate equations.");
assertHasRelation(lstm, "uses", "lstm-cell-update", "LSTM topic should use the cell update.");
assertHasRelation(lstm, "uses", "sigmoid-activation", "LSTM gates should connect to sigmoid.");
assertHasRelation(lstm, "next-step", "attention-context-vector", "LSTM should connect forward to attention.");

assertNoBrokenRelations(formulaHubEntries, formulaHubEntriesById, "Batch F RNN/LSTM");

console.log("Formula Hub Batch F RNN/LSTM verification passed.");
