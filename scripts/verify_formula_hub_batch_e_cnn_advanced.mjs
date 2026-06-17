import assert from "node:assert/strict";
import {
  assertHasRelation,
  assertNoBrokenRelations,
  assertRequiredRawIds,
  loadFormulaHubModel,
} from "./formula_hub_test_utils.mjs";

const { formulaHubEntries, formulaHubEntriesById, rawEntriesById } = loadFormulaHubModel();

const requiredSourceIds = [
  "vgg-conv-block",
  "residual-block-forward",
  "residual-projection-shortcut",
  "inception-channel-concat",
  "bottleneck-parameter-reduction",
  "yolo-grid-output-shape",
  "yolo-box-representation",
  "intersection-over-union",
  "yolo-anchor-assignment",
  "non-max-suppression-rule",
  "face-verification-distance",
  "triplet-loss",
  "neural-style-content-cost",
  "neural-style-gram-matrix",
  "neural-style-style-cost",
  "neural-style-total-cost",
];

assertRequiredRawIds(rawEntriesById, requiredSourceIds, "PDF-based CNN advanced");

const parent = formulaHubEntriesById["cnn-advanced-core"];
assert.ok(parent, "Batch E needs a CNN Advanced Core parent topic.");
assert.equal(parent.title, "CNN Advanced Core");
assert.equal(parent.category, "CNN");
assert.equal(parent.type, "pipeline");
assert.ok(parent.steps?.some((step) => step.id === "neural-style-total-cost"), "Advanced CNN should include total style-transfer objective.");
assert.ok(parent.steps?.some((step) => step.latex.includes("\\operatorname{Concat}")), "Advanced CNN should include Inception concatenation.");

const resnet = formulaHubEntriesById["resnet-residual-blocks"];
assert.ok(resnet, "Batch E needs a ResNet residual block topic.");
assertHasRelation(resnet, "uses", "residual-block-forward", "ResNet topic should use the identity shortcut formula.");
assertHasRelation(resnet, "uses", "residual-projection-shortcut", "ResNet topic should use the projection shortcut formula.");
assertHasRelation(resnet, "uses", "pointwise-convolution", "ResNet projection should connect to 1x1 convolution.");
assertHasRelation(resnet, "appears-in", "cnn-advanced-core", "ResNet should appear inside CNN Advanced Core.");

const yolo = formulaHubEntriesById["yolo-detection-pipeline"];
assert.ok(yolo, "Batch E needs a YOLO detection pipeline topic.");
assert.equal(JSON.stringify(yolo.steps?.map((step) => step.id)), JSON.stringify([
  "yolo-grid-output-shape",
  "yolo-box-representation",
  "intersection-over-union",
  "yolo-anchor-assignment",
  "non-max-suppression-rule",
]));
assertHasRelation(yolo, "prerequisite", "cnn-output-size", "YOLO should connect back to CNN output sizes.");
assertHasRelation(yolo, "uses", "intersection-over-union", "YOLO should use IoU.");
assertHasRelation(yolo, "uses", "non-max-suppression-rule", "YOLO should use NMS.");

const style = formulaHubEntriesById["neural-style-transfer-costs"];
assert.ok(style, "Batch E needs a neural style transfer topic.");
assert.ok(style.steps?.some((step) => step.id === "neural-style-gram-matrix"), "Style transfer should include Gram matrix.");
assert.ok(style.steps?.some((step) => step.id === "neural-style-total-cost"), "Style transfer should include total content/style objective.");
assertHasRelation(style, "prerequisite", "feature-map-activation", "Style transfer should connect to CNN feature activations.");
assertHasRelation(style, "uses", "neural-style-style-cost", "Style transfer should use style cost.");

const face = formulaHubEntriesById["face-recognition-metric-learning"];
assert.ok(face, "Batch E needs a face recognition metric learning topic.");
assertHasRelation(face, "uses", "face-verification-distance", "Face recognition should use embedding distance.");
assertHasRelation(face, "uses", "triplet-loss", "Face recognition should use triplet loss.");

assertNoBrokenRelations(formulaHubEntries, formulaHubEntriesById, "Batch E CNN advanced");

console.log("Formula Hub Batch E CNN advanced verification passed.");
