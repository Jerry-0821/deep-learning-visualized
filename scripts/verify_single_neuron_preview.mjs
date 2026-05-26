import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  assert.ok(existsSync(fullPath), `Missing required preview deliverable: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

const originalPrototype = readRequired("public/prototypes/neuron-structure.html");
const originalNotes = readRequired("data/topicTeachingContent.ts");

const requiredPrototypeIds = [
  "neuronCanvasA",
  "formulaMainA",
  "formulaSubA",
  "formulaFinalA",
  "activationMetaA",
  "activationDescA",
  "activationFormulaA",
  "momentTitleA",
  "momentDescA",
];

for (const id of requiredPrototypeIds) {
  assert.ok(
    originalPrototype.includes(`id="${id}"`),
    `Authoritative interaction no longer includes required dynamic output #${id}.`,
  );
}

assert.ok(
  originalPrototype.indexOf('id="neuronCanvasA"') <
    originalPrototype.indexOf('id="formulaMainA"'),
  "The authoritative calculation formulas must remain below the animation canvas.",
);

for (const phase of ["Inputs light up", "Weighted sum", "Bias enters", "Activation", "Output"]) {
  assert.ok(
    originalPrototype.includes(phase),
    `Authoritative interaction is missing the preserved phase: ${phase}.`,
  );
}

const readme = readRequired("topic-design-previews/README.md");
for (const rule of [
  "Do not change teaching content.",
  "Formula Placement:",
  "public/prototypes/neuron-structure.html",
  "Visual references are styling references only.",
  "Calculation Drawer Rule:",
  "closed by default",
  "resizable right-side reading drawer",
  "lightweight live status",
  "Navigation Drawer Rule:",
  "expanded by default on desktop",
  "closed by default on narrow screens",
  "white outline sidebar icon",
]) {
  assert.ok(readme.includes(rule), `README is missing required reminder: ${rule}`);
}

const preview = readRequired("topic-design-previews/single-neuron.html");
assert.ok(
  preview.includes('fetch("../public/prototypes/neuron-structure.html")'),
  "Preview must load the complete authoritative Single Neuron prototype.",
);
assert.ok(
  preview.includes('class="back-module-link"') &&
    preview.includes("https://deep-learning-visualized.vercel.app/module/1"),
  "Preview must provide the approved topbar Back to module control.",
);
assert.ok(
  !preview.includes('id="formulaMainA"'),
  "Preview should not fork the dynamic interaction DOM; it must load the authoritative file.",
);

for (const requiredDrawerElement of [
  'id="calculation-drawer-toggle"',
  'id="calculation-drawer"',
  'id="drawer-resizer"',
  'id="live-moment-status"',
  'id="drawer-final-formula"',
  'aria-hidden="true"',
]) {
  assert.ok(
    preview.includes(requiredDrawerElement),
    `Preview is missing the approved drawer element or initial state: ${requiredDrawerElement}`,
  );
}

for (const requiredNavigationElement of [
  'id="navigation-drawer-toggle"',
  'id="navigation-drawer"',
  'id="navigation-backdrop"',
  'class="sidebar-icon"',
  'aria-controls="navigation-drawer"',
  'aria-expanded="true"',
  'left: min(312px, calc(100vw - 38px));',
]) {
  assert.ok(
    preview.includes(requiredNavigationElement),
    `Preview is missing approved left navigation behavior: ${requiredNavigationElement}`,
  );
}

for (const stableCalculation of [
  "z = w_1x_1 = 1.2 \\cdot 0.8 = 0.96",
  "z = 0.96 + (-0.48) = 0.48",
  "z = 0.48 + 0.45 = 0.93",
  "z = 0.93 + 0.4 = 1.33",
]) {
  assert.ok(
    preview.includes(stableCalculation),
    `Drawer omitted an original forward-pass calculation step: ${stableCalculation}`,
  );
}

const interactiveIndex = preview.indexOf('id="interactive-prototype"');
const backgroundIndex = preview.indexOf('id="background"');
const formulasIndex = preview.indexOf('id="important-formulas"');

assert.ok(interactiveIndex >= 0, "Preview is missing the interactive prototype section.");
assert.ok(
  backgroundIndex > interactiveIndex,
  "Teaching notes must be presented after the interactive lesson.",
);
assert.ok(
  formulasIndex > interactiveIndex,
  "Structured important formulas must be presented after the interactive lesson.",
);

const preservedPassages = [
  "A single neuron is the fundamental building block of a neural network. It receives one or more input signals, multiplies each by a weight that controls how influential that input is, adds a bias term to shift the result, and then passes the weighted sum through an activation function to produce an output. This forward-pass sequence turns raw input values into an internal representation the network can use.",
  "On its own, a single neuron is still a linear model before the activation is applied. That is why a neuron is simple but important: by stacking many neurons with nonlinear activations, we move from a single weighted sum to a flexible model that can learn much richer patterns.",
  "The neuron first computes a weighted sum of its inputs and adds a bias.",
  "The activation function transforms the weighted sum into the neuron output.",
  "Forms the basic computational unit of feed-forward neural networks and deeper architectures.",
  "Weighted inputs plus bias provide a flexible linear template for learning relative input importance.",
  "When combined with nonlinear activations and multiple layers, neurons support universal function approximation.",
  "A single neuron alone cannot model complex nonlinear relationships.",
  "Without a nonlinear activation, stacking many linear neurons still behaves like one linear transformation.",
  "A small neuron set can underfit complex data, while a large one requires careful initialization and regularization.",
  "Let x1 = 1, x2 = 2, w1 = 0.5, w2 = -1.0, and b = 0.1. The weighted sum becomes z = -1.4, and passing that through a sigmoid gives a value close to 0.20.",
  "Beginners often forget the bias term and treat the neuron as only a weighted input sum. Another common mistake is to ignore the role of nonlinearity: if every activation is linear, stacking neurons does not create a more expressive network.",
];

const normalizedNotes = normalizeWhitespace(originalNotes);
const normalizedPreview = normalizeWhitespace(preview);

for (const passage of preservedPassages) {
  assert.ok(
    normalizedNotes.includes(passage),
    `Expected authoritative notes passage was not found: ${passage}`,
  );
  assert.ok(
    normalizedPreview.includes(passage),
    `Preview omitted or altered a preserved teaching passage: ${passage}`,
  );
}

for (const formula of [
  "\\[ z = \\sum_{i=1}^{n} w_i x_i + b \\]",
  "\\[ a = \\sigma(z) \\]",
]) {
  assert.ok(preview.includes(formula), `Preview omitted required MathJax formula: ${formula}`);
}

console.log("Single Neuron preview preservation checks passed.");
