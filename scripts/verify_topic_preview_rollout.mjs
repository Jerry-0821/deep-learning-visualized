import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  assert.ok(existsSync(fullPath), `Missing rough preview deliverable: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

const readme = readRequired("topic-design-previews/README.md");
for (const reminder of [
  "Before starting work on each topic, read this note again",
  "Shared Topic Shell Rule:",
  "Back to module",
  "Do not duplicate the existing wrapper",
  "right drawers stay empty in the first rough pass",
  "`backpropagation-intuition`",
  "`convolution-operation`",
  "`dropout`",
  "`gradient-descent-learning-rate`",
]) {
  assert.ok(readme.includes(reminder), `Missing rollout reminder: ${reminder}`);
}

const shellScript = readRequired("topic-design-previews/topic-preview-shell.js");
const shellStyle = readRequired("topic-design-previews/topic-preview-shell.css");

for (const contractMarker of [
  "Back to module",
  "navigation-drawer-toggle",
  "calculation-drawer-toggle",
  "prototype-frame",
  "reservedReading",
  "drawerMode",
  "mirrorBlocks",
  "let frameRefreshInterval",
  "window.setInterval",
  "window.clearInterval",
  "output.dataset.mirrorContent",
  "frame.contentDocument !== frameDocument",
]) {
  assert.ok(shellScript.includes(contractMarker), `Shell omits contract marker: ${contractMarker}`);
}
assert.ok(!shellScript.includes("MutationObserver"), "Shared shell must not observe nested iframe nodes across contexts.");

for (const styleMarker of [
  ".topic-topbar",
  ".navigation-drawer",
  ".calculation-drawer",
  ".reserved-section",
  ".prototype-frame",
]) {
  assert.ok(shellStyle.includes(styleMarker), `Shell stylesheet omits: ${styleMarker}`);
}

const emptyDrawerTopics = [
  "attention-mechanism-intuition",
  "evaluation-metrics-confusion-matrix",
  "bias-vs-variance-diagnosis",
  "transfer-learning-intuition",
];

const reservedReadingTopics = [
  "attention-mechanism-intuition",
  "transfer-learning-intuition",
];

const liveDrawerTopics = [
  "rnn-structure",
  "backpropagation-intuition",
  "convolution-operation",
  "dropout",
  "gradient-descent-learning-rate",
];

function topicConfigBlock(slug) {
  const configsStart = shellScript.indexOf("const topicConfigs = {");
  assert.ok(configsStart >= 0, "Shared shell is missing its topic configuration map.");
  const quotedStart = shellScript.indexOf(`"${slug}": {`, configsStart);
  const bareStart = shellScript.indexOf(`${slug}: {`, configsStart);
  const start = quotedStart >= 0 ? quotedStart : bareStart;
  assert.ok(start >= 0, `Shared shell is missing the ${slug} configuration.`);
  const remainder = shellScript.slice(start + slug.length + 3);
  const nextTopic = remainder.search(/\n    (?:"[\w-]+"|dropout): \{/);
  return shellScript.slice(start, nextTopic >= 0 ? start + slug.length + 3 + nextTopic : shellScript.length);
}

for (const slug of [...emptyDrawerTopics, ...liveDrawerTopics]) {
  const page = readRequired(`topic-design-previews/${slug}.html`);
  assert.ok(
    page.includes(`window.TOPIC_PREVIEW_SLUG = "${slug}"`),
    `${slug} must select its shared-shell configuration.`,
  );
  assert.ok(
    !page.includes("Return to module") && !page.includes("Open prototype only"),
    `${slug} must not repeat the old prototype wrapper actions.`,
  );
}

for (const slug of emptyDrawerTopics) {
  const configBlock = topicConfigBlock(slug);
  assert.ok(
    configBlock.includes(`drawerMode: "empty"`),
    `${slug} needs an empty first-pass drawer configuration.`,
  );
}

for (const slug of reservedReadingTopics) {
  const configBlock = topicConfigBlock(slug);
  assert.ok(
    configBlock.includes("reservedReading: true"),
    `${slug} needs reserved reading-section positions.`,
  );
}

const evaluationConfig = topicConfigBlock("evaluation-metrics-confusion-matrix");
const evaluationPage = readRequired("topic-design-previews/evaluation-metrics-confusion-matrix.html");
assert.ok(
  evaluationPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    evaluationPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Evaluation Metrics must load its approved visual revision without stale shared-shell assets.",
);
for (const approvedMarker of [
  `reservedReading: false`,
  `readingMode: "evaluation-supplement"`,
  `interactionMode: "inline-evaluation"`,
  "Imagine a disease detector testing 1,000 people.",
  "Metrics are different ways to read the same confusion matrix.",
  "The model only finds half of the sick patients.",
  "The best metric depends on which mistake is more expensive.",
  "\\text{Accuracy}",
  "\\text{Precision}",
  "\\text{Recall}",
  "F_1",
]) {
  assert.ok(
    shellScript.includes(approvedMarker),
    `Evaluation Metrics reading content is missing: ${approvedMarker}`,
  );
}
assert.ok(
  !evaluationConfig.includes(`prototype: "../public/prototypes/evaluation-metrics-confusion-matrix.html"`),
  "Evaluation Metrics must no longer render its lesson as an embedded prototype card.",
);
for (const visualizationMarker of [
  "renderEvaluationInteraction",
  "initializeEvaluationInteraction",
  "evaluation-score-strip",
  "evaluation-threshold",
  "evaluation-confusion-matrix",
  "evaluation-insight",
]) {
  assert.ok(
    shellScript.includes(visualizationMarker),
    `Evaluation Metrics inline interaction is missing: ${visualizationMarker}`,
  );
}
for (const flatStyleMarker of [
  ".evaluation-interaction",
  ".evaluation-score-strip",
  ".evaluation-confusion-matrix",
  ".evaluation-metric-grid",
]) {
  assert.ok(shellStyle.includes(flatStyleMarker), `Evaluation flat visual style is missing: ${flatStyleMarker}`);
}
assert.ok(
  !/\.lesson-formula\s*\{[^}]*overflow-x:\s*auto/s.test(shellStyle),
  "Reading formulas must render in normal flow without an internal horizontal scrollbar.",
);

const biasConfig = topicConfigBlock("bias-vs-variance-diagnosis");
const biasPage = readRequired("topic-design-previews/bias-vs-variance-diagnosis.html");
assert.ok(
  biasPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    biasPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Bias vs. Variance must load its approved visual revision without stale shared-shell assets.",
);
for (const configMarker of [
  `reservedReading: false`,
  `readingMode: "bias-variance-supplement"`,
  `interactionMode: "inline-bias-variance"`,
]) {
  assert.ok(biasConfig.includes(configMarker), `Bias vs. Variance configuration is missing: ${configMarker}`);
}
for (const approvedMarker of [
  "Where does the biggest error gap appear?",
  "Avoidable Bias",
  "Data Mismatch",
  "The biggest gap usually tells you what to fix first.",
  "\\text{Avoidable Bias}",
  "\\text{Variance}",
  "\\text{Data Mismatch}",
  "\\text{Dev Overfitting}",
]) {
  assert.ok(shellScript.includes(approvedMarker), `Bias vs. Variance reading content is missing: ${approvedMarker}`);
}
assert.ok(
  !biasConfig.includes(`prototype: "../public/prototypes/bias-vs-variance-diagnosis.html"`),
  "Bias vs. Variance must no longer render its lesson as an embedded prototype card.",
);
for (const visualizationMarker of [
  "renderBiasVarianceInteraction",
  "initializeBiasVarianceInteraction",
  "bias-error-stack",
  "bias-gap-grid",
  "bias-diagnosis-result",
]) {
  assert.ok(shellScript.includes(visualizationMarker), `Bias inline interaction is missing: ${visualizationMarker}`);
}
for (const flatStyleMarker of [".bias-interaction", ".bias-error-stack", ".bias-gap-grid"]) {
  assert.ok(shellStyle.includes(flatStyleMarker), `Bias flat visual style is missing: ${flatStyleMarker}`);
}

const rnnConfig = topicConfigBlock("rnn-structure");
const rnnPage = readRequired("topic-design-previews/rnn-structure.html");
assert.ok(
  rnnPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    rnnPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "RNN must load its approved reading and drawer revision without stale assets.",
);
for (const rnnMarker of [
  `readingMode: "rnn-supplement"`,
  `drawerMode: "mirror"`,
  `frameTreatment: "rnn-editorial"`,
  "renderRnnSupplement",
  "Standard neural networks treat each input independently.",
  "This allows information to flow through the sequence.",
  "Encoder-Decoder",
  "The movie was not good.",
  "same RNN cell reused again and again",
  "step-title",
  "arch-body",
  "core-equations",
  "formula-body",
  "app-body",
]) {
  assert.ok(shellScript.includes(rnnMarker), `RNN revision is missing: ${rnnMarker}`);
}

const gradientConfig = topicConfigBlock("gradient-descent-learning-rate");
const gradientPage = readRequired("topic-design-previews/gradient-descent-learning-rate.html");
assert.ok(
  gradientPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    gradientPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Gradient Descent must load its approved reading and visual revision without stale assets.",
);
for (const gradientMarker of [
  `readingMode: "gradient-supplement"`,
  `frameTreatment: "gradient-editorial"`,
  "renderGradientSupplement",
  "Gradient descent decides",
  "The learning rate decides",
  "\\theta_{t+1}",
  "\\nabla J_B",
  "A bad learning rate can make a good model look bad.",
  "Good training depends on choosing a step size",
]) {
  assert.ok(shellScript.includes(gradientMarker), `Gradient Descent revision is missing: ${gradientMarker}`);
}
for (const treatmentMarker of ["rnn-editorial", "gradient-editorial", ".drawer-math-reading"]) {
  assert.ok(
    shellScript.includes(treatmentMarker) || shellStyle.includes(treatmentMarker),
    `Topic visual/drawer treatment is missing: ${treatmentMarker}`,
  );
}
assert.ok(
  shellScript.includes('frame.style.height = "720px";'),
  "Styled prototype frames must shrink to a measurement baseline before resizing so hidden panels do not leave a blank iframe gap.",
);

const dropoutConfig = topicConfigBlock("dropout");
const dropoutPage = readRequired("topic-design-previews/dropout.html");
assert.ok(
  dropoutPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    dropoutPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Dropout must load its approved reading and flattened visual revision without stale assets.",
);
for (const dropoutMarker of [
  `readingMode: "dropout-supplement"`,
  `frameTreatment: "dropout-editorial"`,
  "renderDropoutSupplement",
  "Deep networks can overfit by relying too heavily",
  "\\tilde{a}_i",
  "Leaving dropout on during inference",
  "Dropout reduces overfitting by randomly removing activations",
]) {
  assert.ok(shellScript.includes(dropoutMarker), `Dropout revision is missing: ${dropoutMarker}`);
}
assert.ok(
  !dropoutConfig.includes("PyTorch Context") && !dropoutConfig.includes(".context-text"),
  "Dropout must not mirror the removed PyTorch-specific explanatory card into the drawer.",
);

const convolutionConfig = topicConfigBlock("convolution-operation");
const convolutionPage = readRequired("topic-design-previews/convolution-operation.html");
assert.ok(
  convolutionPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    convolutionPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Convolution must load its approved reading and flattened visual revision without stale assets.",
);
for (const convolutionMarker of [
  `readingMode: "convolution-supplement"`,
  `frameTreatment: "convolution-editorial"`,
  "renderConvolutionSupplement",
  "Images contain local patterns",
  "Y_{i,j}",
  "How strongly does this local patch match the filter?",
  "Convolution turns an image into a feature map",
]) {
  assert.ok(shellScript.includes(convolutionMarker), `Convolution revision is missing: ${convolutionMarker}`);
}
const convolutionPrototype = readRequired("public/prototypes/convolution-operation.html");
for (const liveCalculationFix of [
  "formulaMain.dataset.drawerLatex",
  "source.dataset.drawerLatex",
  "window.MathJax.typesetPromise([output])",
  "#conv-demo-wrap .mini-field option",
  "background: #ffffff !important",
  "color: #23212c !important",
]) {
  assert.ok(
    convolutionPrototype.includes(liveCalculationFix) || shellScript.includes(liveCalculationFix),
    `Convolution live-detail/select fix is missing: ${liveCalculationFix}`,
  );
}

const backpropConfig = topicConfigBlock("backpropagation-intuition");
const backpropPage = readRequired("topic-design-previews/backpropagation-intuition.html");
assert.ok(
  backpropPage.includes("topic-preview-shell.js?v=shell-safety-3") &&
    backpropPage.includes("topic-preview-shell.css?v=shell-safety-3"),
  "Backpropagation must load its approved reading and derivation drawer revision without stale assets.",
);
for (const backpropMarker of [
  `title: "Backpropagation"`,
  `drawerMode: "backprop-tabs"`,
  `readingMode: "backpropagation-supplement"`,
  `frameTreatment: "backpropagation-editorial"`,
  "renderBackpropagationSupplement",
  "data-drawer-view=\"single-neuron\"",
  "data-drawer-panel=\"multi-layer\"",
  "data-drawer-panel=\"live-detail\"",
  "Backpropagation is not sending the loss backward.",
  "\\frac{\\partial L}{\\partial Z^{[l]}}",
  "The optimizer performs the actual update.",
]) {
  assert.ok(shellScript.includes(backpropMarker), `Backpropagation revision is missing: ${backpropMarker}`);
}
for (const readingStyleMarker of [
  ".explanatory-list",
  ".takeaway-section",
  ".derivation-launchers",
  ".derivation-launcher",
  ".drawer-tabs",
  ".drawer-panel",
  ".derivation-section",
]) {
  assert.ok(shellStyle.includes(readingStyleMarker), `Approved reading/drawer style is missing: ${readingStyleMarker}`);
}

for (const slug of liveDrawerTopics) {
  const configBlock = topicConfigBlock(slug);
  assert.ok(
    configBlock.includes(`drawerMode: "mirror"`) || configBlock.includes(`drawerMode: "backprop-tabs"`),
    `${slug} needs a live mirrored drawer configuration.`,
  );
}

for (const requiredRelocation of [
  "bpCacheFormulaMain",
  "convFormulaMain",
  "convFilterExplain",
  "doMath-87f74045",
  "gd_combo_8d0a9e18_formulaMain",
  "gd_combo_8d0a9e18_momentText",
]) {
  assert.ok(
    shellScript.includes(requiredRelocation),
    `Approved drawer relocation is missing: ${requiredRelocation}`,
  );
}

console.log("Rough topic preview rollout checks passed.");
