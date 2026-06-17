import rawFormulaHubEntries from "@/data/formulaHubEntries.json";
import { blogPostsBySlug } from "@/data/blogPosts";
import { topicsBySlug } from "@/data/topics";

export type FormulaCategory =
  | "Foundations"
  | "Backpropagation"
  | "Optimization"
  | "Initialization"
  | "Regularization"
  | "CNN"
  | "RNN / LSTM"
  | "Transformer"
  | "Evaluation"
  | "Practice"
  | "Shapes & Dimensions";

export type FormulaEntryType =
  | "derivative"
  | "formula"
  | "loss"
  | "metric"
  | "pipeline"
  | "shape"
  | "statement"
  | "update-rule";

export type FormulaSymbol = {
  symbol: string;
  meaning: string;
  shape?: string;
  aliases?: string[];
};

export type FormulaShapeCheck = {
  input?: string[];
  output?: string;
  explanation?: string;
};

export type FormulaRelationType =
  | "appears-in"
  | "backward-pair"
  | "compare-with"
  | "extends"
  | "next-step"
  | "part-of"
  | "paired-with"
  | "prerequisite"
  | "sibling"
  | "used-in"
  | "uses";

export type FormulaRelation = {
  type: FormulaRelationType;
  targetId: string;
  label?: string;
  note?: string;
};

export type FormulaTopicStep = {
  id: string;
  title: string;
  latex: string;
  plainTextFormula: string;
  description: string;
  symbols?: FormulaSymbol[];
  shape?: FormulaShapeCheck;
  sourceFormulaId?: string;
};

export type FormulaHubEntry = {
  id: string;
  title: string;
  category: FormulaCategory;
  type: FormulaEntryType;
  useCase: string;
  latex: string;
  plainTextFormula: string;
  description: string;
  aliases: string[];
  symbols: FormulaSymbol[];
  shape?: FormulaShapeCheck;
  topicSlugs: string[];
  blogSlugs: string[];
  pdfSection: string;
  pdfPage?: number;
  relatedFormulaIds: string[];
  relations?: FormulaRelation[];
  nodeLabel?: string;
  sourceFormulaIds?: string[];
  steps?: FormulaTopicStep[];
};

export type FormulaCategorySummary = {
  id: FormulaCategory;
  label: FormulaCategory;
  count: number;
};

type FormulaTopicDefinition = {
  id: string;
  sourceIds: string[];
  aliases?: string[];
  blogSlugs?: string[];
  category?: FormulaCategory;
  description?: string;
  extraSteps?: FormulaTopicStep[];
  latex?: string;
  nodeLabel?: string;
  pdfPage?: number;
  pdfSection?: string;
  relatedFormulaIds?: string[];
  relations?: FormulaRelation[];
  shape?: FormulaShapeCheck;
  steps?: FormulaTopicStep[];
  title?: string;
  topicSlugs?: string[];
  type?: FormulaEntryType;
  useCase?: string;
};

export type FormulaRelationGroup = {
  label: string;
  relations: Array<FormulaRelation & { target: FormulaHubEntry }>;
  type: FormulaRelationType;
};

const formulaBlockEntries = rawFormulaHubEntries as FormulaHubEntry[];
const formulaBlockEntriesById = Object.fromEntries(
  formulaBlockEntries.map((entry) => [entry.id, entry]),
) as Record<string, FormulaHubEntry>;

function getBlock(id: string) {
  const entry = formulaBlockEntriesById[id];
  if (!entry) {
    throw new Error(`Missing Formula Hub source block: ${id}`);
  }
  return entry;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function mergeSymbols(entries: FormulaTopicStep[], primary: FormulaHubEntry) {
  const symbols = new Map<string, FormulaSymbol>();

  for (const symbol of [...primary.symbols, ...entries.flatMap((entry) => entry.symbols ?? [])]) {
    const key = symbol.symbol;
    const existing = symbols.get(key);
    if (!existing) {
      symbols.set(key, symbol);
      continue;
    }

    symbols.set(key, {
      ...existing,
      aliases: unique([...(existing.aliases ?? []), ...(symbol.aliases ?? [])]),
      meaning: existing.meaning || symbol.meaning,
      shape: existing.shape || symbol.shape,
    });
  }

  return Array.from(symbols.values());
}

function stepFromEntry(entry: FormulaHubEntry): FormulaTopicStep {
  return {
    id: entry.id,
    title: entry.title,
    latex: entry.latex,
    plainTextFormula: entry.plainTextFormula,
    description: entry.description,
    symbols: entry.symbols,
    shape: entry.shape,
    sourceFormulaId: entry.id,
  };
}

function buildTopic(definition: FormulaTopicDefinition): FormulaHubEntry {
  const sourceEntries = definition.sourceIds.map(getBlock);
  const primary = sourceEntries.find((entry) => entry.id === definition.id) ?? sourceEntries[0];
  const steps = definition.steps ?? [...sourceEntries.map(stepFromEntry), ...(definition.extraSteps ?? [])];
  const topicSlugs = unique([
    ...(definition.topicSlugs ?? []),
    ...sourceEntries.flatMap((entry) => entry.topicSlugs),
  ]);
  const blogSlugs = unique([
    ...(definition.blogSlugs ?? []),
    ...sourceEntries.flatMap((entry) => entry.blogSlugs),
  ]);
  const aliases = unique([
    definition.nodeLabel ?? "",
    ...(definition.aliases ?? []),
    ...sourceEntries.flatMap((entry) => entry.aliases),
    ...sourceEntries.map((entry) => entry.title),
  ]);

  return {
    ...primary,
    id: definition.id,
    title: definition.title ?? primary.title,
    category: definition.category ?? primary.category,
    type: definition.type ?? primary.type,
    useCase: definition.useCase ?? primary.useCase,
    latex: definition.latex ?? primary.latex,
    plainTextFormula: definition.latex ?? primary.plainTextFormula,
    description: definition.description ?? primary.description,
    aliases,
    symbols: mergeSymbols(steps, primary),
    shape: definition.shape ?? primary.shape,
    topicSlugs,
    blogSlugs,
    pdfSection: definition.pdfSection ?? primary.pdfSection,
    pdfPage: definition.pdfPage ?? primary.pdfPage,
    relatedFormulaIds: unique([
      ...(definition.relatedFormulaIds ?? []),
      ...(definition.relations ?? []).map((relation) => relation.targetId),
    ]),
    relations:
      definition.relations ??
      (definition.relatedFormulaIds ?? []).map((targetId) => ({
        type: "sibling" as const,
        targetId,
      })),
    nodeLabel: definition.nodeLabel,
    sourceFormulaIds: unique(sourceEntries.map((entry) => entry.id)),
    steps,
  };
}

function relation(type: FormulaRelationType, targetId: string, label?: string, note?: string): FormulaRelation {
  return { type, targetId, label, note };
}

const adamOptimizationSteps: FormulaTopicStep[] = [
  {
    id: "adam-current-mini-batch-gradient",
    title: "Current Mini-batch Gradient",
    latex: "g_t=\\frac{1}{B}\\sum_{i\\in\\mathcal{B}_t}\\nabla_{\\theta}\\ell_i(\\theta_t)",
    plainTextFormula: "g_t = 1/B sum over mini-batch gradients",
    description: "Adam starts from the same mini-batch gradient estimate used by SGD.",
    symbols: [
      { symbol: "g_t", meaning: "Gradient estimate at optimizer step t", shape: "same shape as \\theta" },
      { symbol: "B", meaning: "Mini-batch size", shape: "scalar" },
      { symbol: "\\mathcal{B}_t", meaning: "Mini-batch at step t", shape: "set of examples" },
      { symbol: "\\theta", meaning: "Model parameters", shape: "parameter shape" },
    ],
    shape: {
      input: ["per-example gradients: same shape as \\theta"],
      output: "g_t: same shape as \\theta",
      explanation: "Averaging gradients preserves the shape of the parameter tensor being optimized.",
    },
    sourceFormulaId: "mini-batch-gradient",
  },
  {
    id: "adam-first-moment",
    title: "First Moment from Momentum",
    latex: "m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t",
    plainTextFormula: "m_t = beta1 m_{t-1} + (1 - beta1) g_t",
    description: "Keeps a momentum-style moving average of recent gradients.",
    symbols: [
      { symbol: "m_t", meaning: "First-moment moving average", shape: "same shape as \\theta" },
      { symbol: "\\beta_1", meaning: "First-moment decay rate", shape: "scalar" },
      { symbol: "g_t", meaning: "Current mini-batch gradient", shape: "same shape as \\theta" },
    ],
    shape: {
      input: ["m_{t-1}: parameter shape", "g_t: parameter shape"],
      output: "m_t: same shape as \\theta",
      explanation: "Adam stores one first-moment accumulator per parameter.",
    },
    sourceFormulaId: "adam-update-rule",
  },
  {
    id: "adam-second-moment",
    title: "Second Moment from RMSProp",
    latex: "v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2",
    plainTextFormula: "v_t = beta2 v_{t-1} + (1 - beta2) g_t^2",
    description: "Tracks a RMSProp-style moving average of squared gradients for adaptive scaling.",
    symbols: [
      { symbol: "v_t", meaning: "Second-moment moving average", shape: "same shape as \\theta" },
      { symbol: "\\beta_2", meaning: "Second-moment decay rate", shape: "scalar" },
      { symbol: "g_t^2", meaning: "Elementwise squared gradient", shape: "same shape as \\theta" },
    ],
    shape: {
      input: ["v_{t-1}: parameter shape", "g_t^2: parameter shape"],
      output: "v_t: same shape as \\theta",
      explanation: "The squared-gradient accumulator has the same shape as the parameter tensor.",
    },
    sourceFormulaId: "adam-update-rule",
  },
  {
    id: "adam-first-moment-bias-correction",
    title: "First-moment Bias Correction",
    latex: "\\hat{m}_t=\\frac{m_t}{1-\\beta_1^t}",
    plainTextFormula: "m_hat_t = m_t / (1 - beta_1^t)",
    description: "Corrects the early-step bias caused by initializing the first-moment estimate at zero.",
    symbols: [
      { symbol: "\\hat{m}_t", meaning: "Bias-corrected first moment", shape: "same shape as \\theta" },
      { symbol: "\\beta_1", meaning: "First-moment decay rate" },
    ],
    sourceFormulaId: "adam-update-rule",
  },
  {
    id: "adam-second-moment-bias-correction",
    title: "Second-moment Bias Correction",
    latex: "\\hat{v}_t=\\frac{v_t}{1-\\beta_2^t}",
    plainTextFormula: "v_hat_t = v_t / (1 - beta_2^t)",
    description: "Corrects the early-step bias in the RMSProp-style second-moment estimate.",
    symbols: [
      { symbol: "\\hat{v}_t", meaning: "Bias-corrected second moment", shape: "same shape as \\theta" },
      { symbol: "\\beta_2", meaning: "Second-moment decay rate" },
    ],
    sourceFormulaId: "adam-update-rule",
  },
  {
    id: "adam-parameter-update",
    title: "Adaptive Parameter Update",
    latex: "\\theta_t\\leftarrow\\theta_{t-1}-\\alpha\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}",
    plainTextFormula: "theta_t <- theta_{t-1} - alpha m_hat_t / (sqrt(v_hat_t) + epsilon)",
    description: "Moves parameters using the bias-corrected first moment scaled by the bias-corrected second moment.",
    symbols: [
      { symbol: "\\theta_t", meaning: "Updated parameter", shape: "same shape as \\theta_{t-1}" },
      { symbol: "\\alpha", meaning: "Learning rate", shape: "scalar" },
      { symbol: "\\epsilon", meaning: "Numerical stability constant", shape: "scalar" },
    ],
    shape: {
      input: ["\\hat{m}_t: parameter shape", "\\hat{v}_t: parameter shape"],
      output: "\\theta_t: same shape as \\theta_{t-1}",
      explanation: "Adam changes parameter values, not parameter dimensions.",
    },
    sourceFormulaId: "adam-update-rule",
  },
];

const logisticRegressionSteps: FormulaTopicStep[] = [
  {
    id: "logistic-vectorized-forward",
    title: "Vectorized Forward Pass",
    latex: "Z=w^TX+b,\\quad A=\\sigma(Z)",
    plainTextFormula: "Z = w^T X + b, A = sigma(Z)",
    description: "Computes logits and sigmoid probabilities for all m examples in one matrix expression.",
    symbols: [
      { symbol: "X", meaning: "Input batch", shape: "n_x \\times m" },
      { symbol: "w", meaning: "Logistic regression weights", shape: "n_x \\times 1" },
      { symbol: "b", meaning: "Bias scalar", shape: "scalar" },
      { symbol: "Z", meaning: "Vectorized logits", shape: "1 \\times m" },
      { symbol: "A", meaning: "Predicted probabilities", shape: "1 \\times m" },
    ],
    shape: {
      input: ["w^T: 1 \\times n_x", "X: n_x \\times m", "b: scalar"],
      output: "Z,A: 1 \\times m",
      explanation: "The dot product scores every example column; b is broadcast across the batch.",
    },
  },
  {
    id: "logistic-batch-cost",
    title: "Average Binary Cross-Entropy Cost",
    latex: "J(w,b)=\\frac{1}{m}\\sum_{i=1}^{m}L(a^{(i)},y^{(i)})",
    plainTextFormula: "J(w,b) = (1/m) sum_i L(a_i, y_i)",
    description: "Averages the binary cross-entropy losses over the batch.",
    symbols: [
      { symbol: "J", meaning: "Average cost", shape: "scalar" },
      { symbol: "L", meaning: "Single-example binary cross-entropy loss", shape: "scalar" },
      { symbol: "m", meaning: "Number of examples" },
    ],
    shape: {
      input: ["A,Y: 1 \\times m"],
      output: "J: scalar",
      explanation: "A batch cost collapses all example losses into one scalar objective.",
    },
  },
  {
    id: "logistic-dw-db",
    title: "Vectorized Gradients",
    latex: "dZ=A-Y,\\quad dw=\\frac{1}{m}XdZ^T,\\quad db=\\frac{1}{m}\\sum_{i=1}^{m}dZ^{(i)}",
    plainTextFormula: "dZ = A - Y, dw = (1/m) X dZ^T, db = (1/m) sum_i dZ_i",
    description: "Computes the logit gradient and the parameter gradients for w and b.",
    symbols: [
      { symbol: "dZ", meaning: "Logit gradient", shape: "1 \\times m" },
      { symbol: "dw", meaning: "Weight gradient", shape: "n_x \\times 1" },
      { symbol: "db", meaning: "Bias gradient", shape: "scalar" },
    ],
    shape: {
      input: ["X: n_x \\times m", "dZ^T: m \\times 1"],
      output: "dw: n_x \\times 1",
      explanation: "The matrix product accumulates feature-wise gradient contributions across the batch.",
    },
  },
  {
    id: "logistic-parameter-update",
    title: "Gradient Descent Parameter Update",
    latex: "w\\leftarrow w-\\alpha dw,\\quad b\\leftarrow b-\\alpha db",
    plainTextFormula: "w <- w - alpha dw, b <- b - alpha db",
    description: "Updates the logistic regression parameters using the computed gradients.",
    symbols: [
      { symbol: "\\alpha", meaning: "Learning rate" },
      { symbol: "w", meaning: "Weights", shape: "n_x \\times 1" },
      { symbol: "b", meaning: "Bias scalar", shape: "scalar" },
    ],
    shape: {
      input: ["w,dw: n_x \\times 1", "b,db: scalar"],
      output: "updated w,b: same shape",
      explanation: "Each parameter update preserves the parameter's original shape.",
    },
  },
];

const formulaTopicDefinitions: FormulaTopicDefinition[] = [
  {
    id: "logistic-regression-training-pipeline",
    nodeLabel: "2",
    title: "Logistic Regression Training Pipeline",
    category: "Foundations",
    type: "pipeline",
    useCase: "Binary classification",
    sourceIds: ["neuron-weighted-sum", "sigmoid-activation", "binary-cross-entropy", "logistic-gradient-shortcut", "gradient-descent-update"],
    extraSteps: logisticRegressionSteps,
    latex: "Z=w^TX+b,\\quad A=\\sigma(Z),\\quad dZ=A-Y,\\quad w\\leftarrow w-\\alpha dw",
    pdfSection: "2 Logistic Regression and Binary Classification",
    pdfPage: 3,
    description:
      "The complete logistic regression loop from vectorized forward probabilities to binary cross-entropy, gradients, and the parameter update.",
    aliases: [
      "logistic regression",
      "binary classification pipeline",
      "vectorized logistic regression",
      "dw db logistic",
      "sigmoid binary cross entropy training",
    ],
    relations: [
      relation("uses", "activation-functions-core", "Sigmoid is the binary output activation inside this loop"),
      relation("uses", "sigmoid-activation", "Turns logits into binary probabilities"),
      relation("paired-with", "binary-cross-entropy", "Binary classification loss"),
      relation("uses", "output-loss-shortcuts", "The output shortcut gives dZ = A - Y"),
      relation("backward-pair", "logistic-gradient-shortcut", "Sigmoid plus BCE gives dZ = A - Y"),
      relation("next-step", "gradient-descent-update", "w and b are updated by gradient descent"),
      relation("compare-with", "dense-layer-forward", "A single-output dense layer is the neural-network generalization"),
      relation("next-step", "dense-layer-weight-gradient", "Dense backprop generalizes dw and db to deep layers"),
    ],
  },
  {
    id: "neuron-weighted-sum",
    nodeLabel: "2.2",
    title: "Single Neuron Forward Pass",
    sourceIds: ["neuron-weighted-sum", "neuron-activation-output"],
    relatedFormulaIds: ["dense-layer-forward", "sigmoid-activation", "relu-activation"],
    relations: [
      relation("next-step", "activation-functions-core", "The affine score is passed through an activation function"),
      relation("next-step", "dense-layer-forward", "Vectorized layer version"),
      relation("used-in", "logistic-regression-training-pipeline", "Single-example form of logistic regression forward pass"),
      relation("uses", "sigmoid-activation", "Possible output or hidden activation"),
      relation("uses", "relu-activation", "Common hidden-layer activation"),
    ],
    description: "A neuron first computes an affine score and then passes it through an activation function.",
  },
  {
    id: "dense-layer-forward",
    nodeLabel: "3.2",
    title: "Dense Layer Forward Pipeline",
    sourceIds: ["dense-layer-forward", "dense-layer-activation-shape"],
    relatedFormulaIds: ["dense-layer-weight-gradient", "matrix-multiplication-shape", "dense-bias-broadcast-shape"],
    relations: [
      relation("prerequisite", "neuron-weighted-sum", "Single-neuron version"),
      relation("uses", "activation-functions-core", "Every dense layer ends with A = g(Z)"),
      relation("uses", "sigmoid-activation", "Elementwise activation choice"),
      relation("uses", "relu-activation", "Elementwise activation choice"),
      relation("uses", "softmax-activation", "Output activation choice"),
      relation("next-step", "dense-layer-weight-gradient", "Reverse-mode counterpart"),
      relation("used-in", "binary-cross-entropy", "Produces sigmoid probabilities for BCE"),
      relation("used-in", "categorical-cross-entropy", "Produces softmax probabilities for CE"),
      relation("used-in", "mean-squared-error", "Produces regression predictions for MSE"),
    ],
  },
  {
    id: "activation-functions-core",
    nodeLabel: "4",
    title: "Activation Functions Core",
    category: "Foundations",
    type: "formula",
    useCase: "Nonlinear forward choices",
    sourceIds: ["neuron-activation-output", "sigmoid-activation", "sigmoid-derivative", "relu-activation", "softmax-activation"],
    latex: "a=g(z),\\quad g\\in\\{\\sigma,\\operatorname{ReLU},\\operatorname{softmax}\\}",
    pdfSection: "4 Activation Functions",
    description:
      "The activation family turns affine scores into nonlinear hidden activations or output probabilities, and its derivative determines how gradients pass backward.",
    aliases: [
      "activation functions",
      "activation family",
      "nonlinear activation",
      "sigmoid relu softmax",
      "activation comparison",
    ],
    relatedFormulaIds: ["sigmoid-activation", "relu-activation", "softmax-activation", "dense-layer-forward", "dense-layer-weight-gradient"],
    relations: [
      relation("prerequisite", "neuron-weighted-sum", "Activations consume the affine score z"),
      relation("used-in", "dense-layer-forward", "Dense layers apply A = g(Z) after the affine step"),
      relation("used-in", "dense-layer-weight-gradient", "Activation derivatives shape dZ during backpropagation"),
      relation("uses", "sigmoid-activation", "Binary probability output and smooth gating"),
      relation("uses", "relu-activation", "Common hidden-layer nonlinearity"),
      relation("uses", "softmax-activation", "Multiclass probability output"),
      relation("appears-in", "lstm-gates", "Sigmoid gates are a recurrent activation use case"),
      relation("appears-in", "scaled-dot-product-attention", "Softmax normalizes attention scores"),
    ],
  },
  {
    id: "sigmoid-activation",
    nodeLabel: "4.1",
    title: "Sigmoid Activation and Derivative",
    sourceIds: ["sigmoid-activation", "sigmoid-derivative"],
    relatedFormulaIds: ["binary-cross-entropy", "logistic-gradient-shortcut"],
    relations: [
      relation("part-of", "activation-functions-core", "One member of the activation family"),
      relation("used-in", "output-loss-shortcuts", "The sigmoid + BCE pair simplifies the output gradient"),
      relation("used-in", "neuron-weighted-sum", "Turns a scalar score into a probability-like activation"),
      relation("used-in", "logistic-regression-training-pipeline", "Binary classifier output activation"),
      relation("used-in", "dense-layer-forward", "Possible hidden or output activation"),
      relation("paired-with", "binary-cross-entropy", "Binary classification output pair"),
      relation("backward-pair", "logistic-gradient-shortcut", "Sigmoid plus BCE gives dZ = A - Y"),
      relation("appears-in", "lstm-gates", "Gate activations use sigmoid"),
    ],
  },
  {
    id: "relu-activation",
    nodeLabel: "4.1",
    sourceIds: ["relu-activation"],
    relatedFormulaIds: ["dense-layer-forward", "dense-layer-weight-gradient"],
    relations: [
      relation("part-of", "activation-functions-core", "One member of the activation family"),
      relation("used-in", "dense-layer-forward", "Common hidden-layer activation"),
      relation("backward-pair", "dense-layer-weight-gradient", "Its derivative participates in hidden-layer dZ"),
      relation("sibling", "sigmoid-activation", "Elementwise hidden activation alternative"),
    ],
  },
  {
    id: "softmax-activation",
    nodeLabel: "4.2",
    sourceIds: ["softmax-activation"],
    relatedFormulaIds: ["categorical-cross-entropy", "softmax-cross-entropy-shortcut", "scaled-dot-product-attention"],
    relations: [
      relation("part-of", "activation-functions-core", "One member of the activation family"),
      relation("used-in", "output-loss-shortcuts", "The softmax + CE pair simplifies the output gradient"),
      relation("used-in", "dense-layer-forward", "Multiclass output activation"),
      relation("paired-with", "categorical-cross-entropy", "Multiclass classification output pair"),
      relation("backward-pair", "softmax-cross-entropy-shortcut", "Softmax plus CE gives dZ = A - Y"),
      relation("appears-in", "scaled-dot-product-attention", "Normalizes attention scores into weights"),
      relation("appears-in", "skipgram-softmax", "Normalizes vocabulary logits"),
    ],
  },
  {
    id: "output-loss-shortcuts",
    nodeLabel: "5-6",
    title: "Output Activation Loss Shortcuts",
    category: "Backpropagation",
    type: "pipeline",
    useCase: "Output-layer gradient starts",
    sourceIds: [
      "sigmoid-activation",
      "binary-cross-entropy",
      "logistic-gradient-shortcut",
      "softmax-activation",
      "categorical-cross-entropy",
      "softmax-cross-entropy-shortcut",
      "mean-squared-error",
    ],
    latex: "\\sigma+BCE\\Rightarrow dZ=A-Y,\\quad \\operatorname{softmax}+CE\\Rightarrow dZ=A-Y",
    pdfSection: "5 Loss Functions and 6 Backpropagation",
    description:
      "Output activations pair with task losses; for sigmoid+BCE and softmax+cross-entropy, the output-layer logit gradient simplifies to A - Y.",
    aliases: [
      "output loss shortcuts",
      "activation loss pair",
      "sigmoid bce shortcut",
      "softmax cross entropy shortcut",
      "dZ equals A minus Y",
    ],
    relatedFormulaIds: [
      "sigmoid-activation",
      "binary-cross-entropy",
      "logistic-gradient-shortcut",
      "softmax-activation",
      "categorical-cross-entropy",
      "softmax-cross-entropy-shortcut",
      "dense-layer-weight-gradient",
    ],
    relations: [
      relation("prerequisite", "activation-functions-core", "Shortcut pairs start from an output activation"),
      relation("paired-with", "sigmoid-activation", "Binary output activation"),
      relation("paired-with", "binary-cross-entropy", "Binary classification loss"),
      relation("backward-pair", "logistic-gradient-shortcut", "Sigmoid plus BCE gives dZ = A - Y"),
      relation("paired-with", "softmax-activation", "Multiclass output activation"),
      relation("paired-with", "categorical-cross-entropy", "Multiclass classification loss"),
      relation("backward-pair", "softmax-cross-entropy-shortcut", "Softmax plus CE gives dZ = A - Y"),
      relation("compare-with", "mean-squared-error", "Regression loss does not use the same classification shortcut"),
      relation("used-in", "logistic-regression-training-pipeline", "Binary classifier backward shortcut"),
      relation("next-step", "dense-layer-weight-gradient", "Once dZ is known, backprop computes dW, db, and dA_prev"),
    ],
  },
  {
    id: "binary-cross-entropy",
    nodeLabel: "5.1",
    sourceIds: ["binary-cross-entropy"],
    relatedFormulaIds: ["logistic-gradient-shortcut", "sigmoid-activation"],
    relations: [
      relation("part-of", "output-loss-shortcuts", "One output-loss pair in the shortcut topic"),
      relation("prerequisite", "sigmoid-activation", "Consumes sigmoid probability outputs"),
      relation("paired-with", "sigmoid-activation", "Binary output-loss pair"),
      relation("backward-pair", "logistic-gradient-shortcut", "Output-layer gradient shortcut"),
      relation("used-in", "logistic-regression-training-pipeline", "Loss term in binary classifier training"),
      relation("used-in", "dense-layer-forward", "Forward pass supplies A or y-hat"),
    ],
  },
  {
    id: "categorical-cross-entropy",
    nodeLabel: "5.2",
    sourceIds: ["categorical-cross-entropy"],
    relatedFormulaIds: ["softmax-cross-entropy-shortcut", "softmax-activation"],
    relations: [
      relation("part-of", "output-loss-shortcuts", "One output-loss pair in the shortcut topic"),
      relation("prerequisite", "softmax-activation", "Consumes class probability outputs"),
      relation("paired-with", "softmax-activation", "Multiclass output-loss pair"),
      relation("backward-pair", "softmax-cross-entropy-shortcut", "Output-layer gradient shortcut"),
      relation("used-in", "dense-layer-forward", "Forward pass supplies class probabilities"),
    ],
  },
  {
    id: "mean-squared-error",
    nodeLabel: "5.3",
    sourceIds: ["mean-squared-error"],
    relatedFormulaIds: ["gradient-descent-update"],
    relations: [
      relation("part-of", "output-loss-shortcuts", "Regression contrast inside the output-loss family"),
      relation("prerequisite", "dense-layer-forward", "Regression head supplies predictions"),
      relation("next-step", "gradient-descent-update", "Loss gradients are consumed by optimizer updates"),
      relation("sibling", "binary-cross-entropy", "Different task family: regression vs binary classification"),
    ],
  },
  {
    id: "dense-layer-weight-gradient",
    nodeLabel: "6.3-6.4",
    title: "Dense Layer Backpropagation Pipeline",
    sourceIds: ["dense-layer-dz", "dense-layer-da-prev", "dense-layer-weight-gradient", "dense-layer-bias-gradient"],
    latex: "dZ^{[l]}=dA^{[l]}\\odot g'^{[l]}(Z^{[l]}),\\quad dW^{[l]}=\\frac{1}{m}dZ^{[l]}(A^{[l-1]})^T",
    relatedFormulaIds: ["dense-layer-forward", "logistic-gradient-shortcut", "softmax-cross-entropy-shortcut"],
    relations: [
      relation("prerequisite", "output-loss-shortcuts", "Output-layer shortcut supplies the starting dZ"),
      relation("uses", "dense-layer-forward", "Reverse path of the affine-activation forward block"),
      relation("uses", "activation-functions-core", "Hidden-layer dZ uses activation derivatives"),
      relation("uses", "sigmoid-activation", "Activation derivative can appear inside dZ"),
      relation("uses", "relu-activation", "Activation derivative can appear inside dZ"),
      relation("backward-pair", "logistic-gradient-shortcut", "Binary output-layer start case"),
      relation("backward-pair", "softmax-cross-entropy-shortcut", "Multiclass output-layer start case"),
      relation("next-step", "gradient-descent-update", "dW and db feed parameter updates"),
      relation("next-step", "adam-update-rule", "Gradients can feed adaptive optimizers"),
    ],
    description: "The full reverse flow for a dense layer: activation gradient, previous activation gradient, weight gradient, and bias gradient.",
  },
  {
    id: "logistic-gradient-shortcut",
    nodeLabel: "6.2",
    title: "Sigmoid BCE Output Gradient",
    sourceIds: ["logistic-gradient-shortcut"],
    relatedFormulaIds: ["binary-cross-entropy", "sigmoid-activation"],
    relations: [
      relation("part-of", "output-loss-shortcuts", "One classification shortcut in the output-loss topic"),
      relation("paired-with", "sigmoid-activation", "Sigmoid output activation"),
      relation("paired-with", "binary-cross-entropy", "Binary cross-entropy loss"),
      relation("used-in", "logistic-regression-training-pipeline", "Backward shortcut for logistic regression"),
      relation("next-step", "dense-layer-weight-gradient", "Starts the dense backprop chain"),
    ],
  },
  {
    id: "softmax-cross-entropy-shortcut",
    nodeLabel: "6.2",
    title: "Softmax Cross-Entropy Output Gradient",
    sourceIds: ["softmax-cross-entropy-shortcut"],
    relatedFormulaIds: ["categorical-cross-entropy", "softmax-activation"],
    relations: [
      relation("part-of", "output-loss-shortcuts", "One classification shortcut in the output-loss topic"),
      relation("paired-with", "softmax-activation", "Softmax output activation"),
      relation("paired-with", "categorical-cross-entropy", "Categorical cross-entropy loss"),
      relation("next-step", "dense-layer-weight-gradient", "Starts the dense backprop chain"),
    ],
  },
  {
    id: "optimizer-family-core",
    nodeLabel: "7",
    title: "Optimizer Family Core",
    category: "Optimization",
    type: "pipeline",
    useCase: "Parameter update strategies",
    sourceIds: [
      "gradient-descent-update",
      "mini-batch-gradient",
      "sgd-update",
      "momentum-update-rule",
      "rmsprop-update-rule",
      "adam-update-rule",
    ],
    latex: "g_t\\rightarrow\\theta_{t+1}=\\theta_t-\\eta g_t\\rightarrow m_t,s_t\\rightarrow Adam",
    pdfSection: "7 Optimization Algorithms",
    description:
      "The optimizer family starts with gradient descent, moves to mini-batch SGD, then adds momentum, squared-gradient scaling, and Adam's combined adaptive update.",
    aliases: [
      "optimizer family",
      "optimization algorithms",
      "gradient descent sgd momentum rmsprop adam",
      "adam optimizer pipeline",
    ],
    relatedFormulaIds: [
      "gradient-descent-update",
      "sgd-update",
      "momentum-update-rule",
      "rmsprop-update-rule",
      "adam-update-rule",
      "dense-layer-weight-gradient",
    ],
    relations: [
      relation("prerequisite", "dense-layer-weight-gradient", "Optimizers consume gradients produced by backpropagation"),
      relation("uses", "gradient-descent-update", "Base first-order update"),
      relation("uses", "sgd-update", "Mini-batch update version"),
      relation("uses", "momentum-update-rule", "First-moment smoothing"),
      relation("uses", "rmsprop-update-rule", "Squared-gradient adaptive scaling"),
      relation("uses", "adam-update-rule", "Combines first and second moments with bias correction"),
      relation("used-in", "logistic-regression-training-pipeline", "Logistic regression uses the simplest optimizer case"),
    ],
  },
  {
    id: "gradient-descent-update",
    nodeLabel: "7.1",
    sourceIds: ["gradient-descent-update"],
    relatedFormulaIds: ["sgd-update", "momentum-update-rule", "adam-update-rule"],
    relations: [
      relation("part-of", "optimizer-family-core", "Base member of the optimizer family"),
      relation("prerequisite", "dense-layer-weight-gradient", "Uses gradients from backpropagation"),
      relation("prerequisite", "logistic-regression-training-pipeline", "The binary classifier update is the simplest case"),
      relation("next-step", "sgd-update", "Mini-batch version"),
      relation("compare-with", "momentum-update-rule", "Momentum smooths gradient updates"),
      relation("compare-with", "adam-update-rule", "Adam adapts step sizes per parameter"),
    ],
  },
  {
    id: "sgd-update",
    nodeLabel: "7.2",
    title: "Mini-batch SGD Update",
    sourceIds: ["mini-batch-gradient", "sgd-update"],
    relatedFormulaIds: ["gradient-descent-update", "momentum-update-rule", "adam-update-rule"],
    relations: [
      relation("part-of", "optimizer-family-core", "Mini-batch member of the optimizer family"),
      relation("prerequisite", "gradient-descent-update", "Same update idea on a mini-batch gradient estimate"),
      relation("next-step", "momentum-update-rule", "Adds a first-moment moving average"),
      relation("next-step", "rmsprop-update-rule", "Adds squared-gradient scaling"),
      relation("next-step", "adam-update-rule", "Combines momentum and RMSProp-style scaling"),
    ],
  },
  {
    id: "momentum-update-rule",
    nodeLabel: "7.4",
    sourceIds: ["momentum-update-rule"],
    relatedFormulaIds: ["sgd-update", "rmsprop-update-rule", "adam-update-rule"],
    relations: [
      relation("part-of", "optimizer-family-core", "First-moment member of the optimizer family"),
      relation("prerequisite", "sgd-update", "Momentum builds on mini-batch gradients"),
      relation("extends", "gradient-descent-update", "Adds a velocity or first-moment average"),
      relation("used-in", "adam-update-rule", "Adam reuses this first-moment idea"),
      relation("compare-with", "rmsprop-update-rule", "First moment vs second moment"),
    ],
  },
  {
    id: "rmsprop-update-rule",
    nodeLabel: "7.5",
    sourceIds: ["rmsprop-update-rule"],
    relatedFormulaIds: ["momentum-update-rule", "adam-update-rule"],
    relations: [
      relation("part-of", "optimizer-family-core", "Second-moment scaling member of the optimizer family"),
      relation("prerequisite", "sgd-update", "RMSProp builds on mini-batch gradients"),
      relation("extends", "gradient-descent-update", "Scales updates by recent squared gradients"),
      relation("used-in", "adam-update-rule", "Adam reuses this second-moment scaling idea"),
      relation("compare-with", "momentum-update-rule", "Second moment vs first moment"),
    ],
  },
  {
    id: "adam-update-rule",
    nodeLabel: "7.6",
    title: "Adam Optimization Flow",
    sourceIds: ["mini-batch-gradient", "momentum-update-rule", "rmsprop-update-rule", "adam-update-rule"],
    steps: adamOptimizationSteps,
    latex: "\\theta_t\\leftarrow\\theta_{t-1}-\\alpha\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}",
    description:
      "Adam combines Momentum's first-moment averaging, RMSProp's second-moment scaling, bias correction, and a final adaptive parameter update.",
    aliases: ["Adam", "Adam optimizer", "bias correction", "m hat", "v hat"],
    relatedFormulaIds: ["momentum-update-rule", "rmsprop-update-rule", "sgd-update"],
    relations: [
      relation("part-of", "optimizer-family-core", "Combined adaptive member of the optimizer family"),
      relation("prerequisite", "sgd-update", "Adam still begins from mini-batch gradients"),
      relation("extends", "momentum-update-rule", "First-moment estimate"),
      relation("extends", "rmsprop-update-rule", "Second-moment estimate"),
      relation("compare-with", "gradient-descent-update", "Adaptive update vs fixed learning-rate update"),
      relation("used-in", "dense-layer-weight-gradient", "Consumes gradients produced by backpropagation"),
    ],
  },
  {
    id: "initialization-strategy-core",
    nodeLabel: "8",
    title: "Initialization Strategy Core",
    category: "Initialization",
    type: "pipeline",
    useCase: "Training setup",
    sourceIds: [
      "initialization-parameter-shapes",
      "zero-initialization",
      "small-random-initialization",
      "xavier-glorot-variance",
      "xavier-normal-initialization",
      "xavier-uniform-initialization",
      "xavier-simplified-variance",
      "he-variance",
      "he-normal-initialization",
      "he-scaled-random-matrix",
      "bias-initialization",
    ],
    latex:
      "W^{[l]}\\in\\mathbb{R}^{n^{[l]}\\times n^{[l-1]}}\\rightarrow W^{[l]}\\sim\\mathcal{N}(0,\\sigma^2)\\rightarrow Xavier/He",
    pdfSection: "8 Initialization",
    pdfPage: 15,
    description:
      "The initialization flow sets parameter shapes, avoids zero-weight symmetry, chooses Xavier or He variance by activation family, and keeps biases at zero.",
    aliases: [
      "initialization",
      "weight initialization",
      "parameter initialization",
      "xavier he initialization",
      "zero initialization",
      "fan in fan out",
    ],
    relatedFormulaIds: [
      "initialization-parameter-shape-contract",
      "zero-initialization",
      "small-random-initialization",
      "xavier-glorot-initialization",
      "he-initialization",
      "bias-initialization",
      "dense-layer-forward",
    ],
    relations: [
      relation("uses", "initialization-parameter-shape-contract", "Defines W, b, fan-in, and fan-out"),
      relation("uses", "zero-initialization", "Reference case and symmetry warning"),
      relation("uses", "small-random-initialization", "Simple symmetry-breaking baseline"),
      relation("uses", "xavier-glorot-initialization", "Tanh or sigmoid-style variance scaling"),
      relation("uses", "he-initialization", "ReLU-style variance scaling"),
      relation("uses", "bias-initialization", "Bias column setup"),
      relation("next-step", "dense-layer-forward", "Initialized parameters feed the first forward pass"),
      relation("next-step", "optimizer-family-core", "Training then updates initialized parameters"),
    ],
  },
  {
    id: "initialization-parameter-shape-contract",
    nodeLabel: "8.1",
    title: "Initialization Parameter Shape Contract",
    category: "Initialization",
    sourceIds: ["initialization-parameter-shapes"],
    relatedFormulaIds: ["dense-parameter-count", "small-random-initialization"],
    relations: [
      relation("part-of", "initialization-strategy-core", "First step of initialization"),
      relation("used-in", "small-random-initialization", "Random samples must match W and b shapes"),
      relation("used-in", "xavier-glorot-initialization", "Fan-in and fan-out come from parameter shapes"),
      relation("used-in", "he-initialization", "Fan-in comes from the previous layer width"),
      relation("used-in", "bias-initialization", "Bias shape is n[l] x 1"),
      relation("compare-with", "dense-parameter-count", "Same W and b dimensions, different question"),
    ],
  },
  {
    id: "zero-initialization",
    nodeLabel: "8.2",
    category: "Initialization",
    sourceIds: ["zero-initialization"],
    relatedFormulaIds: ["small-random-initialization", "bias-initialization"],
    relations: [
      relation("part-of", "initialization-strategy-core", "Reference case and warning"),
      relation("compare-with", "small-random-initialization", "Random weights break hidden-unit symmetry"),
      relation("paired-with", "bias-initialization", "Biases can still start at zero"),
      relation("used-in", "neuron-weighted-sum", "Shows why identical hidden units are a problem"),
    ],
  },
  {
    id: "small-random-initialization",
    nodeLabel: "8.3",
    category: "Initialization",
    sourceIds: ["small-random-initialization"],
    relatedFormulaIds: ["zero-initialization", "xavier-glorot-initialization", "he-initialization"],
    relations: [
      relation("part-of", "initialization-strategy-core", "Simple symmetry-breaking baseline"),
      relation("prerequisite", "initialization-parameter-shape-contract", "Samples must match W and b shapes"),
      relation("compare-with", "zero-initialization", "Random W avoids identical hidden-unit updates"),
      relation("next-step", "xavier-glorot-initialization", "More principled variance choice for sigmoid or tanh-style networks"),
      relation("next-step", "he-initialization", "More principled variance choice for ReLU-style networks"),
      relation("used-in", "dense-layer-forward", "Initial W and b feed the first forward pass"),
    ],
  },
  {
    id: "xavier-glorot-initialization",
    nodeLabel: "8.4",
    title: "Xavier / Glorot Initialization",
    category: "Initialization",
    type: "pipeline",
    useCase: "Tanh or sigmoid-style initialization",
    sourceIds: [
      "xavier-glorot-variance",
      "xavier-normal-initialization",
      "xavier-uniform-initialization",
      "xavier-simplified-variance",
    ],
    latex: "\\operatorname{Var}(W^{[l]})=\\frac{2}{fan_{in}+fan_{out}}",
    description:
      "Xavier / Glorot initialization chooses weight variance from fan-in and fan-out to stabilize tanh or sigmoid-style networks.",
    aliases: ["xavier", "glorot", "xavier normal", "xavier uniform", "sigmoid initialization"],
    relatedFormulaIds: ["he-initialization", "activation-functions-core", "sigmoid-activation"],
    relations: [
      relation("part-of", "initialization-strategy-core", "Activation-aware variance choice"),
      relation("prerequisite", "initialization-parameter-shape-contract", "Needs fan-in and fan-out"),
      relation("extends", "small-random-initialization", "Adds a principled variance scale"),
      relation("paired-with", "activation-functions-core", "Matches smoother tanh or sigmoid-style activations"),
      relation("used-in", "sigmoid-activation", "Common for sigmoid-style networks"),
      relation("compare-with", "he-initialization", "He uses fan-in scaling for ReLU-style networks"),
      relation("used-in", "dense-layer-forward", "Provides initial dense-layer weights"),
    ],
  },
  {
    id: "he-initialization",
    nodeLabel: "8.5",
    title: "He Initialization",
    category: "Initialization",
    type: "pipeline",
    useCase: "ReLU-style initialization",
    sourceIds: ["he-variance", "he-normal-initialization", "he-scaled-random-matrix"],
    latex: "\\operatorname{Var}(W^{[l]})=\\frac{2}{fan_{in}}",
    description:
      "He initialization uses fan-in scaling to keep ReLU-style hidden layers from shrinking activation variance too aggressively.",
    aliases: ["he initialization", "kaiming initialization", "relu initialization", "he normal"],
    relatedFormulaIds: ["xavier-glorot-initialization", "relu-activation", "residual-block-forward"],
    relations: [
      relation("part-of", "initialization-strategy-core", "ReLU-style variance choice"),
      relation("prerequisite", "initialization-parameter-shape-contract", "Needs fan-in from W shape"),
      relation("extends", "small-random-initialization", "Adds a principled ReLU variance scale"),
      relation("paired-with", "relu-activation", "Designed for ReLU-style hidden layers"),
      relation("compare-with", "xavier-glorot-initialization", "Xavier uses fan-in and fan-out for smoother activations"),
      relation("used-in", "dense-layer-forward", "Provides initial dense-layer weights"),
      relation("appears-in", "residual-block-forward", "ReLU-heavy CNN families commonly use He-style initialization"),
    ],
  },
  {
    id: "bias-initialization",
    nodeLabel: "8.6",
    category: "Initialization",
    sourceIds: ["bias-initialization"],
    relatedFormulaIds: ["zero-initialization", "small-random-initialization", "dense-bias-broadcast-shape"],
    relations: [
      relation("part-of", "initialization-strategy-core", "Final parameter setup step"),
      relation("prerequisite", "initialization-parameter-shape-contract", "Bias shape is n[l] x 1"),
      relation("paired-with", "small-random-initialization", "Random weights break symmetry while b starts at zero"),
      relation("compare-with", "zero-initialization", "Zero bias is safe when weights are random"),
      relation("used-in", "dense-layer-forward", "Bias participates in Z = WA + b"),
      relation("used-in", "dense-bias-broadcast-shape", "Bias column broadcasts across the batch"),
    ],
  },
  {
    id: "regularization-strategy-core",
    nodeLabel: "9",
    title: "Regularization Strategy Core",
    category: "Regularization",
    type: "pipeline",
    useCase: "Generalization control",
    sourceIds: [
      "l2-regularized-cost",
      "l2-gradient-term",
      "l2-weight-decay-update",
      "l2-weight-decay-shrinkage",
      "dropout-mask",
      "inverted-dropout-forward",
      "dropout-training-scaling",
      "dropout-inference-convention",
      "early-stopping-rule",
      "data-augmentation-transform",
    ],
    latex:
      "J_{reg}=J+\\frac{\\lambda}{2m}\\sum_l\\lVert W^{[l]}\\rVert_F^2\\quad\\text{or}\\quad A^{[l]}\\leftarrow\\frac{D^{[l]}\\odot A^{[l]}}{p_{keep}}",
    pdfSection: "9 Regularization",
    pdfPage: 17,
    description:
      "Regularization reduces overfitting by penalizing large weights, randomly thinning activations during training, selecting a dev-set stopping point, or expanding data with label-preserving transforms.",
    aliases: [
      "regularization",
      "L2 regularization",
      "dropout",
      "weight decay",
      "early stopping",
      "data augmentation",
      "overfitting control",
    ],
    relatedFormulaIds: [
      "l2-regularized-cost",
      "dropout-mask",
      "early-stopping-rule",
      "data-augmentation-transform",
      "bias-variance-decomposition",
      "optimizer-family-core",
    ],
    relations: [
      relation("uses", "l2-regularized-cost", "Weight-size penalty and weight decay view"),
      relation("uses", "dropout-mask", "Activation masking and inverted dropout scaling"),
      relation("uses", "early-stopping-rule", "Dev-set stopping rule"),
      relation("uses", "data-augmentation-transform", "Label-preserving data expansion"),
      relation("prerequisite", "bias-variance-decomposition", "Regularization decisions are guided by overfitting diagnosis"),
      relation("prerequisite", "dense-layer-forward", "Dropout acts on layer activations"),
      relation("next-step", "optimizer-family-core", "L2 changes the gradient/update used by optimizers"),
      relation("compare-with", "batchnorm-normalize-scale-shift", "BatchNorm can add training noise but is primarily normalization"),
    ],
  },
  {
    id: "l2-regularized-cost",
    nodeLabel: "9.1-9.3",
    title: "L2 Regularization Flow",
    category: "Regularization",
    type: "pipeline",
    useCase: "Weight decay",
    sourceIds: [
      "l2-regularized-cost",
      "l2-gradient-term",
      "l2-weight-decay-update",
      "l2-weight-decay-shrinkage",
    ],
    latex: "dW^{[l]}_{reg}=dW^{[l]}+\\frac{\\lambda}{m}W^{[l]}",
    description:
      "L2 regularization adds a weight-norm penalty to the cost, turns into a lambda-over-m weight term in dW, and appears in the update as weight decay.",
    aliases: ["L2 regularization", "weight decay", "regularized gradient", "lambda over m W", "Frobenius norm penalty"],
    relatedFormulaIds: ["dropout-mask", "gradient-descent-update", "optimizer-family-core", "bias-variance-decomposition"],
    relations: [
      relation("part-of", "regularization-strategy-core", "Weight-penalty branch"),
      relation("prerequisite", "dense-layer-weight-gradient", "Starts from the ordinary dW produced by backpropagation"),
      relation("extends", "gradient-descent-update", "Adds lambda-over-m W to the update direction"),
      relation("used-in", "optimizer-family-core", "Optimizers consume the regularized gradient or equivalent weight-decay update"),
      relation("compare-with", "dropout-mask", "Weight penalty vs activation masking"),
      relation("used-in", "bias-variance-decomposition", "A tool for reducing high variance / overfitting"),
    ],
  },
  {
    id: "dropout-mask",
    nodeLabel: "9.4-9.6",
    title: "Dropout Training Flow",
    category: "Regularization",
    type: "pipeline",
    useCase: "Activation regularization",
    sourceIds: ["dropout-mask", "inverted-dropout-forward", "dropout-training-scaling", "dropout-inference-convention"],
    latex: "A^{[l]}\\leftarrow\\frac{D^{[l]}\\odot A^{[l]}}{p_{keep}},\\quad A^{[l]}_{test}=A^{[l]}",
    description:
      "Dropout samples a Bernoulli keep mask, applies inverted scaling during training, and turns masking off at inference time.",
    aliases: ["dropout", "inverted dropout", "keep probability", "dropout train test convention", "activation masking"],
    relatedFormulaIds: ["l2-regularized-cost", "dense-layer-forward", "activation-functions-core", "bias-variance-decomposition"],
    relations: [
      relation("part-of", "regularization-strategy-core", "Activation-masking branch"),
      relation("prerequisite", "dense-layer-forward", "Dropout is applied to layer activations"),
      relation("used-in", "activation-functions-core", "Masks activation values after a layer nonlinearity"),
      relation("compare-with", "l2-regularized-cost", "Activation noise vs weight penalty"),
      relation("used-in", "bias-variance-decomposition", "A tool for reducing high variance / overfitting"),
      relation("next-step", "early-stopping-rule", "Both require train/evaluation mode discipline"),
    ],
  },
  {
    id: "early-stopping-rule",
    nodeLabel: "9.7",
    category: "Regularization",
    sourceIds: ["early-stopping-rule"],
    relatedFormulaIds: ["bias-variance-decomposition", "l2-regularized-cost", "dropout-mask"],
    relations: [
      relation("part-of", "regularization-strategy-core", "Dev-set selection rule"),
      relation("prerequisite", "bias-variance-decomposition", "Needs train/dev diagnosis to know when validation starts worsening"),
      relation("used-in", "bias-variance-decomposition", "Dev-set behavior helps diagnose overfitting and underfitting"),
      relation("compare-with", "l2-regularized-cost", "Selection-time regularization vs objective penalty"),
      relation("compare-with", "dropout-mask", "Stopping rule vs train-time activation noise"),
    ],
  },
  {
    id: "data-augmentation-transform",
    nodeLabel: "9.7",
    category: "Regularization",
    sourceIds: ["data-augmentation-transform"],
    relatedFormulaIds: ["bias-variance-decomposition", "early-stopping-rule", "l2-regularized-cost"],
    relations: [
      relation("part-of", "regularization-strategy-core", "Label-preserving data expansion"),
      relation("prerequisite", "bias-variance-decomposition", "Most useful when variance is high and labels remain valid under the transform"),
      relation("compare-with", "l2-regularized-cost", "Data-side regularization vs parameter penalty"),
      relation("compare-with", "dropout-mask", "Input variation vs hidden activation masking"),
      relation("used-in", "early-stopping-rule", "Augmented data changes the training curve that early stopping observes"),
    ],
  },
  {
    id: "batchnorm-normalize-scale-shift",
    nodeLabel: "10",
    title: "Batch Normalization Forward Pipeline",
    category: "Optimization",
    type: "pipeline",
    useCase: "Training stability",
    sourceIds: [
      "batchnorm-mini-batch-statistics",
      "batchnorm-single-example-normalization",
      "batchnorm-vectorized-normalization",
      "batchnorm-scale-shift",
      "batchnorm-forward-pipeline",
      "batchnorm-running-statistics",
      "batchnorm-training-normalization",
      "batchnorm-training-scale-shift",
      "batchnorm-inference-normalization",
      "batchnorm-inference-transform",
      "batchnorm-parameter-shapes",
    ],
    latex: "Z^{[l]}\\rightarrow\\mu_B^{[l]},(\\sigma_B^2)^{[l]}\\rightarrow\\hat{Z}^{[l]}\\rightarrow\\tilde{Z}^{[l]}\\rightarrow A^{[l]}=g^{[l]}(\\tilde{Z}^{[l]})",
    pdfSection: "10 Batch Normalization",
    pdfPage: 19,
    relatedFormulaIds: [
      "batchnorm-mini-batch-statistics",
      "batchnorm-normalization-step",
      "batchnorm-scale-shift-step",
      "batchnorm-running-statistics",
      "batchnorm-inference-transform",
      "batchnorm-parameter-shape-reference",
      "layer-normalization",
      "dense-layer-forward",
      "optimizer-family-core",
      "initialization-strategy-core",
      "regularization-strategy-core",
    ],
    description:
      "BatchNorm normalizes dense-layer pre-activations with mini-batch statistics, learns gamma and beta, tracks running statistics, and switches to those running statistics at inference time.",
    aliases: [
      "batch norm",
      "batchnorm",
      "normalize scale shift",
      "running mean",
      "running variance",
      "training inference batchnorm",
      "gamma beta",
    ],
    relations: [
      relation("uses", "batchnorm-mini-batch-statistics", "Compute per-unit batch mean and variance"),
      relation("uses", "batchnorm-normalization-step", "Normalize Z using mini-batch statistics"),
      relation("uses", "batchnorm-scale-shift-step", "Learn gamma and beta after normalization"),
      relation("uses", "batchnorm-running-statistics", "Maintain running estimates for inference"),
      relation("uses", "batchnorm-inference-transform", "Switch from batch statistics to running statistics at test time"),
      relation("uses", "batchnorm-parameter-shape-reference", "Keep the n[l] x m and n[l] x 1 shape contract clear"),
      relation("used-in", "dense-layer-forward", "Usually inserted around dense-layer pre-activations before g(Z)"),
      relation("next-step", "optimizer-family-core", "Stabilized activations can make optimization easier"),
      relation("compare-with", "layer-normalization", "Batch statistics across examples vs feature statistics within an example/token"),
      relation("compare-with", "regularization-strategy-core", "BatchNorm may add training noise, but its core role here is normalization"),
      relation("compare-with", "initialization-strategy-core", "BatchNorm lowers sensitivity to scale, but still benefits from sensible initialization"),
      relation("appears-in", "residual-block-forward", "Modern CNN blocks often combine convolution, BatchNorm, activation, and residual paths"),
    ],
  },
  {
    id: "batchnorm-mini-batch-statistics",
    nodeLabel: "10.1",
    category: "Optimization",
    sourceIds: ["batchnorm-mini-batch-statistics"],
    relatedFormulaIds: ["batchnorm-normalization-step", "batchnorm-running-statistics", "optimizer-family-core"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "First BatchNorm computation"),
      relation("prerequisite", "optimizer-family-core", "Both rely on mini-batch training notation"),
      relation("next-step", "batchnorm-normalization-step", "Statistics feed the normalization step"),
      relation("used-in", "batchnorm-running-statistics", "Running estimates are updated from batch statistics"),
      relation("compare-with", "layer-normalization", "BatchNorm statistics depend on the mini-batch"),
    ],
  },
  {
    id: "batchnorm-normalization-step",
    nodeLabel: "10.2",
    title: "BatchNorm Normalization Step",
    category: "Optimization",
    type: "pipeline",
    useCase: "Training stability",
    sourceIds: ["batchnorm-single-example-normalization", "batchnorm-vectorized-normalization"],
    latex: "\\hat{Z}^{[l]}=\\frac{Z^{[l]}-\\mu_B^{[l]}}{\\sqrt{(\\sigma_B^2)^{[l]}+\\epsilon}}",
    description:
      "The normalization step centers and scales pre-activations using mini-batch statistics; the vectorized form broadcasts column statistics across examples.",
    aliases: ["batchnorm normalize", "Z hat", "batch norm normalization", "epsilon"],
    relatedFormulaIds: ["batchnorm-mini-batch-statistics", "batchnorm-scale-shift-step", "dense-layer-forward"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "Normalize pre-activations before learned scale and shift"),
      relation("prerequisite", "batchnorm-mini-batch-statistics", "Needs batch mean and variance"),
      relation("used-in", "batchnorm-scale-shift-step", "The normalized Z is the input to gamma and beta"),
      relation("used-in", "dense-layer-forward", "Normalizes Z before the layer activation"),
    ],
  },
  {
    id: "batchnorm-scale-shift-step",
    nodeLabel: "10.3",
    title: "BatchNorm Scale and Shift",
    category: "Optimization",
    sourceIds: ["batchnorm-scale-shift"],
    relatedFormulaIds: ["batchnorm-normalization-step", "dense-layer-forward", "layer-normalization"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "Learned affine transform after normalization"),
      relation("prerequisite", "batchnorm-normalization-step", "Applies to normalized pre-activations"),
      relation("next-step", "dense-layer-forward", "The scaled value feeds the layer activation"),
      relation("compare-with", "layer-normalization", "Both use learned gamma and beta after normalization"),
    ],
  },
  {
    id: "batchnorm-running-statistics",
    nodeLabel: "10.5",
    category: "Optimization",
    sourceIds: ["batchnorm-running-statistics"],
    relatedFormulaIds: ["batchnorm-mini-batch-statistics", "batchnorm-inference-transform"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "Population estimate branch"),
      relation("prerequisite", "batchnorm-mini-batch-statistics", "Updates from each mini-batch mean and variance"),
      relation("used-in", "batchnorm-inference-transform", "Inference uses running rather than current-batch statistics"),
      relation("compare-with", "dropout-mask", "Both require train/eval mode discipline"),
    ],
  },
  {
    id: "batchnorm-inference-transform",
    nodeLabel: "10.6",
    title: "BatchNorm Training vs Inference",
    category: "Optimization",
    type: "pipeline",
    useCase: "Inference mode",
    sourceIds: [
      "batchnorm-training-normalization",
      "batchnorm-training-scale-shift",
      "batchnorm-inference-normalization",
      "batchnorm-inference-transform",
    ],
    latex: "\\hat{Z}^{[l]}_{test}=\\frac{Z^{[l]}-\\mu_{run}^{[l]}}{\\sqrt{(\\sigma_{run}^2)^{[l]}+\\epsilon}},\\quad \\tilde{Z}^{[l]}_{test}=\\gamma^{[l]}\\odot\\hat{Z}^{[l]}_{test}+\\beta^{[l]}",
    description:
      "Training uses current mini-batch statistics; inference uses running mean and variance, then applies the same learned gamma and beta.",
    aliases: ["batch norm inference", "training vs inference", "running statistics", "test batchnorm"],
    relatedFormulaIds: ["batchnorm-running-statistics", "batchnorm-normalize-scale-shift", "dropout-mask"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "Train/test convention"),
      relation("prerequisite", "batchnorm-running-statistics", "Inference needs running statistics"),
      relation("compare-with", "dropout-mask", "Both change behavior between training and inference"),
      relation("used-in", "dense-layer-forward", "Produces the normalized pre-activation passed to the layer activation"),
    ],
  },
  {
    id: "batchnorm-parameter-shape-reference",
    nodeLabel: "10.7",
    title: "BatchNorm Shape Reference",
    category: "Optimization",
    sourceIds: ["batchnorm-parameter-shapes"],
    relatedFormulaIds: ["batchnorm-normalize-scale-shift", "dense-layer-activation-shape"],
    relations: [
      relation("part-of", "batchnorm-normalize-scale-shift", "Shape contract for BatchNorm"),
      relation("compare-with", "dense-layer-activation-shape", "BatchNorm preserves the n[l] x m batch matrix shape"),
      relation("used-in", "batchnorm-mini-batch-statistics", "Statistics are n[l] x 1 columns"),
      relation("used-in", "batchnorm-scale-shift-step", "Gamma and beta are n[l] x 1 columns"),
    ],
  },
  {
    id: "cnn-basics-core",
    nodeLabel: "11.1-11.9",
    title: "CNN Basics Core",
    category: "CNN",
    type: "pipeline",
    useCase: "Convolution and pooling foundations",
    sourceIds: [
      "cnn-tensor-convention",
      "cnn-output-size",
      "convolution-operation",
      "convolution-parameter-count",
      "cnn-padding-conventions",
      "pooling-output-size",
      "max-pooling",
      "average-pooling",
      "pointwise-convolution",
      "depthwise-separable-convolution",
    ],
    latex:
      "A^{[l]}\\in\\mathbb{R}^{m\\times n_H^{[l]}\\times n_W^{[l]}\\times n_C^{[l]}},\\quad n_H^{[l]}=\\left\\lfloor\\frac{n_H^{[l-1]}+2p^{[l]}-f^{[l]}}{s^{[l]}}\\right\\rfloor+1",
    description:
      "Collects the PDF section 11 CNN basics: activation tensor convention, convolution output shape, multi-channel convolution, parameter count, padding, pooling, 1x1 channel projection, and depthwise separable efficiency.",
    aliases: ["CNN basics", "convolution basics", "pooling basics", "section 11 CNN"],
    relatedFormulaIds: [
      "cnn-tensor-convention",
      "cnn-output-size",
      "convolution-operation",
      "convolution-parameter-count",
      "cnn-padding-conventions",
      "pooling-output-size",
      "pointwise-convolution",
      "depthwise-separable-convolution",
      "residual-block-forward",
      "yolo-grid-output-shape",
    ],
    relations: [
      relation("uses", "cnn-tensor-convention", "Start with the NHWC shape contract"),
      relation("uses", "cnn-output-size", "Compute convolution height, width, and channels"),
      relation("uses", "convolution-operation", "Apply a filter to local spatial windows and input channels"),
      relation("uses", "convolution-parameter-count", "Count weights and biases per layer"),
      relation("uses", "cnn-padding-conventions", "Choose valid or same padding"),
      relation("uses", "pooling-output-size", "Compute downsampled spatial sizes"),
      relation("uses", "pointwise-convolution", "Project channel width with 1x1 filters"),
      relation("uses", "depthwise-separable-convolution", "Compare efficient convolution parameter counts"),
      relation("next-step", "residual-block-forward", "Residual CNN blocks build on convolution, projection, and activation"),
      relation("next-step", "yolo-grid-output-shape", "Detection heads reuse CNN feature map dimensions"),
      relation("appears-in", "neural-style-style-cost", "Style transfer uses CNN feature maps and Gram matrices"),
    ],
  },
  {
    id: "cnn-tensor-convention",
    nodeLabel: "11.1",
    title: "CNN Tensor Convention",
    sourceIds: ["cnn-tensor-convention"],
    relatedFormulaIds: ["cnn-basics-core", "cnn-output-size", "convolution-operation"],
    relations: [
      relation("part-of", "cnn-basics-core", "Shape contract for the CNN basics sequence"),
      relation("used-in", "cnn-output-size", "Defines the height, width, channel, and batch symbols"),
      relation("used-in", "convolution-operation", "Convolution reads from the previous activation tensor"),
      relation("used-in", "pooling-output-size", "Pooling preserves the channel axis under the same convention"),
    ],
  },
  {
    id: "cnn-output-size",
    nodeLabel: "11.2",
    sourceIds: ["cnn-output-size"],
    relatedFormulaIds: ["cnn-basics-core", "cnn-padding-conventions", "convolution-operation", "pooling-output-size"],
    relations: [
      relation("part-of", "cnn-basics-core", "Spatial shape step"),
      relation("prerequisite", "cnn-tensor-convention", "Uses the NHWC layer dimensions"),
      relation("uses", "cnn-padding-conventions", "Padding changes the numerator in the output-size formula"),
      relation("next-step", "convolution-operation", "Once the output grid is known, each location is computed by the convolution sum"),
      relation("compare-with", "pooling-output-size", "Pooling has a similar spatial formula but no learned filters"),
    ],
  },
  {
    id: "convolution-operation",
    nodeLabel: "11.3",
    title: "Convolution Operation and Feature Map",
    sourceIds: ["convolution-operation", "feature-map-activation"],
    relatedFormulaIds: ["cnn-basics-core", "cnn-output-size", "convolution-parameter-count", "feature-map-activation"],
    relations: [
      relation("part-of", "cnn-basics-core", "Core learned CNN operation"),
      relation("prerequisite", "cnn-output-size", "The output grid tells how many positions the filter visits"),
      relation("uses", "cnn-tensor-convention", "Reads an NHWC activation tensor"),
      relation("used-in", "feature-map-activation", "Filter responses become feature maps after the nonlinearity"),
      relation("next-step", "convolution-parameter-count", "The same filter bank determines parameter count"),
      relation("appears-in", "residual-block-forward", "Residual blocks stack convolutional transformations"),
    ],
  },
  {
    id: "feature-map-activation",
    nodeLabel: "11.3 bridge",
    title: "Feature Map Activation",
    sourceIds: ["feature-map-activation"],
    relatedFormulaIds: ["convolution-operation", "cnn-basics-core", "neural-style-style-cost"],
    relations: [
      relation("part-of", "cnn-basics-core", "Bridge from convolution scores to activated feature maps"),
      relation("prerequisite", "convolution-operation", "Feature maps are produced from convolution responses"),
      relation("used-in", "neural-style-style-cost", "Neural style transfer compares feature activations"),
      relation("compare-with", "dense-layer-forward", "CNN feature maps are the spatial analogue of dense activations"),
    ],
  },
  {
    id: "convolution-parameter-count",
    nodeLabel: "11.4",
    sourceIds: ["convolution-parameter-count"],
    relatedFormulaIds: ["cnn-basics-core", "convolution-operation", "pointwise-convolution", "depthwise-separable-convolution"],
    relations: [
      relation("part-of", "cnn-basics-core", "Parameter sizing step"),
      relation("prerequisite", "convolution-operation", "Counts the learned filter bank used by the convolution operation"),
      relation("compare-with", "pointwise-convolution", "1x1 convolution is the f = 1 channel-projection special case"),
      relation("compare-with", "depthwise-separable-convolution", "Depthwise separable convolution reduces the standard parameter count"),
    ],
  },
  {
    id: "cnn-padding-conventions",
    nodeLabel: "11.5",
    title: "CNN Padding Conventions",
    sourceIds: ["cnn-padding-conventions"],
    relatedFormulaIds: ["cnn-basics-core", "cnn-output-size", "convolution-operation"],
    relations: [
      relation("part-of", "cnn-basics-core", "Padding convention step"),
      relation("used-in", "cnn-output-size", "Padding enters the spatial output-size formula"),
      relation("compare-with", "pooling-output-size", "Pooling usually uses no padding in the course convention"),
    ],
  },
  {
    id: "pooling-output-size",
    nodeLabel: "11.6-11.7",
    title: "Pooling Output and Operations",
    sourceIds: ["pooling-output-size", "max-pooling", "average-pooling"],
    relatedFormulaIds: ["cnn-basics-core", "cnn-output-size", "max-pooling", "average-pooling"],
    relations: [
      relation("part-of", "cnn-basics-core", "Downsampling step"),
      relation("prerequisite", "cnn-tensor-convention", "Pooling keeps the channel convention"),
      relation("uses", "max-pooling", "Max pooling keeps the strongest response in each window"),
      relation("uses", "average-pooling", "Average pooling keeps the mean response in each window"),
      relation("compare-with", "cnn-output-size", "Pooling changes spatial size without learned filters"),
    ],
  },
  {
    id: "max-pooling",
    nodeLabel: "11.7",
    title: "Max Pooling",
    sourceIds: ["max-pooling"],
    relatedFormulaIds: ["pooling-output-size", "average-pooling", "cnn-basics-core"],
    relations: [
      relation("part-of", "pooling-output-size", "One pooling operation inside the pooling topic"),
      relation("part-of", "cnn-basics-core", "Pooling operation in section 11"),
      relation("compare-with", "average-pooling", "Maximum response vs mean response"),
    ],
  },
  {
    id: "average-pooling",
    nodeLabel: "11.7",
    title: "Average Pooling",
    sourceIds: ["average-pooling"],
    relatedFormulaIds: ["pooling-output-size", "max-pooling", "cnn-basics-core"],
    relations: [
      relation("part-of", "pooling-output-size", "One pooling operation inside the pooling topic"),
      relation("part-of", "cnn-basics-core", "Pooling operation in section 11"),
      relation("compare-with", "max-pooling", "Mean response vs maximum response"),
    ],
  },
  {
    id: "pointwise-convolution",
    nodeLabel: "11.8",
    title: "1x1 Convolution Channel Projection",
    sourceIds: ["pointwise-convolution"],
    relatedFormulaIds: ["cnn-basics-core", "convolution-parameter-count", "residual-projection-shortcut"],
    relations: [
      relation("part-of", "cnn-basics-core", "Channel projection step"),
      relation("extends", "convolution-operation", "A 1x1 convolution is still a convolution, but only mixes channels at each spatial location"),
      relation("compare-with", "convolution-parameter-count", "Uses the standard count with f = 1"),
      relation("used-in", "residual-projection-shortcut", "Projection shortcuts often use 1x1 convolutions to match channels or stride"),
    ],
  },
  {
    id: "depthwise-separable-convolution",
    nodeLabel: "11.9",
    title: "Depthwise Separable Convolution",
    sourceIds: ["depthwise-separable-convolution"],
    relatedFormulaIds: ["cnn-basics-core", "pointwise-convolution", "convolution-parameter-count"],
    relations: [
      relation("part-of", "cnn-basics-core", "Efficient convolution comparison"),
      relation("uses", "pointwise-convolution", "Depthwise separable convolution ends with pointwise channel mixing"),
      relation("compare-with", "convolution-parameter-count", "Contrasts k^2 C_in C_out with k^2 C_in + C_in C_out"),
    ],
  },
  {
    id: "cnn-advanced-core",
    nodeLabel: "12-14",
    title: "CNN Advanced Core",
    category: "CNN",
    type: "pipeline",
    useCase: "Modern CNN applications",
    sourceIds: [
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
    ],
    latex:
      "y=F(x)+x,\\quad Y\\in\\mathbb{R}^{S\\times S\\times(B\\cdot5+C)},\\quad J_{NST}=\\alpha J_{content}+\\beta J_{style}",
    description:
      "Collects the advanced CNN formula families from the PDF: architecture motifs, ResNet shortcuts, YOLO detection, face-recognition metric learning, and neural style transfer costs.",
    aliases: ["advanced CNN", "ResNet YOLO style transfer", "CNN applications", "section 12 13 14"],
    relatedFormulaIds: [
      "cnn-architecture-motifs",
      "resnet-residual-blocks",
      "yolo-detection-pipeline",
      "face-recognition-metric-learning",
      "neural-style-transfer-costs",
      "cnn-basics-core",
    ],
    relations: [
      relation("prerequisite", "cnn-basics-core", "Advanced CNN topics build on convolution, pooling, and channel-shape basics"),
      relation("uses", "cnn-architecture-motifs", "Classic architecture patterns"),
      relation("uses", "resnet-residual-blocks", "Residual shortcuts for very deep CNNs"),
      relation("uses", "yolo-detection-pipeline", "Detection-head formulas and filtering"),
      relation("uses", "face-recognition-metric-learning", "Embedding-distance learning"),
      relation("uses", "neural-style-transfer-costs", "Feature-map and Gram-matrix objectives"),
    ],
  },
  {
    id: "cnn-architecture-motifs",
    nodeLabel: "12.1-12.5",
    title: "CNN Architecture Motifs",
    category: "CNN",
    type: "pipeline",
    useCase: "CNN architecture design",
    sourceIds: ["vgg-conv-block", "inception-channel-concat", "bottleneck-parameter-reduction"],
    relatedFormulaIds: ["cnn-advanced-core", "pointwise-convolution", "convolution-parameter-count"],
    relations: [
      relation("part-of", "cnn-advanced-core", "Classic architecture patterns inside the advanced CNN group"),
      relation("uses", "vgg-conv-block", "Small-filter convolution stacks"),
      relation("uses", "inception-channel-concat", "Parallel branches joined by channel concatenation"),
      relation("uses", "bottleneck-parameter-reduction", "1x1 reductions for efficient spatial convolution"),
      relation("prerequisite", "cnn-basics-core", "Requires convolution, pooling, and channel-shape basics"),
    ],
  },
  {
    id: "vgg-conv-block",
    nodeLabel: "12.1",
    title: "VGG-style Convolution Block",
    sourceIds: ["vgg-conv-block"],
    relatedFormulaIds: ["cnn-architecture-motifs", "convolution-operation", "max-pooling"],
    relations: [
      relation("part-of", "cnn-architecture-motifs", "A simple repeated-convolution architecture pattern"),
      relation("uses", "convolution-operation", "Built from repeated learned convolution operations"),
      relation("uses", "max-pooling", "Usually ends a stage with max pooling"),
    ],
  },
  {
    id: "inception-channel-concat",
    nodeLabel: "12.4",
    title: "Inception Channel Concatenation",
    sourceIds: ["inception-channel-concat"],
    relatedFormulaIds: ["cnn-architecture-motifs", "pointwise-convolution", "cnn-output-size"],
    relations: [
      relation("part-of", "cnn-architecture-motifs", "Parallel-branch architecture pattern"),
      relation("uses", "pointwise-convolution", "1x1 branches can reduce channel cost before larger filters"),
      relation("prerequisite", "cnn-output-size", "Branch spatial dimensions must match before concatenation"),
    ],
  },
  {
    id: "bottleneck-parameter-reduction",
    nodeLabel: "12.5",
    title: "Bottleneck Parameter Reduction",
    sourceIds: ["bottleneck-parameter-reduction"],
    relatedFormulaIds: ["cnn-architecture-motifs", "pointwise-convolution", "convolution-parameter-count"],
    relations: [
      relation("part-of", "cnn-architecture-motifs", "Efficiency pattern inside modern CNNs"),
      relation("uses", "pointwise-convolution", "1x1 convolution creates the reduced channel width"),
      relation("compare-with", "convolution-parameter-count", "Shows why reducing C_mid lowers the expensive k by k convolution"),
      relation("appears-in", "resnet-residual-blocks", "Bottleneck residual blocks use the same idea"),
    ],
  },
  {
    id: "resnet-residual-blocks",
    nodeLabel: "12.2-12.3",
    title: "ResNet Residual Blocks",
    category: "CNN",
    type: "pipeline",
    useCase: "Deep CNN architecture",
    sourceIds: ["residual-block-forward", "residual-projection-shortcut"],
    relatedFormulaIds: ["cnn-advanced-core", "pointwise-convolution", "batchnorm-normalize-scale-shift"],
    relations: [
      relation("appears-in", "cnn-advanced-core", "Residual networks are one major advanced CNN family"),
      relation("uses", "residual-block-forward", "Identity shortcut case"),
      relation("uses", "residual-projection-shortcut", "Projection shortcut when dimensions differ"),
      relation("uses", "pointwise-convolution", "Projection shortcuts often use 1x1 convolutions"),
      relation("uses", "batchnorm-normalize-scale-shift", "Modern residual blocks commonly pair convolution with BatchNorm"),
      relation("prerequisite", "cnn-basics-core", "Requires convolution and activation tensor shapes"),
    ],
  },
  {
    id: "residual-block-forward",
    nodeLabel: "12.2",
    title: "Residual Block Forward Pass",
    sourceIds: ["residual-block-forward"],
    relatedFormulaIds: ["resnet-residual-blocks", "convolution-operation", "batchnorm-normalize-scale-shift"],
    relations: [
      relation("part-of", "resnet-residual-blocks", "Identity shortcut formula"),
      relation("prerequisite", "convolution-operation", "F(x) is usually a stack of convolutional layers"),
      relation("compare-with", "residual-projection-shortcut", "Identity shortcut vs learned projection shortcut"),
    ],
  },
  {
    id: "residual-projection-shortcut",
    nodeLabel: "12.3",
    title: "Residual Projection Shortcut",
    sourceIds: ["residual-projection-shortcut"],
    relatedFormulaIds: ["resnet-residual-blocks", "pointwise-convolution", "cnn-output-size"],
    relations: [
      relation("part-of", "resnet-residual-blocks", "Projection branch for residual blocks when shapes differ"),
      relation("uses", "pointwise-convolution", "Projection shortcuts often use 1x1 convolutions"),
      relation("prerequisite", "cnn-output-size", "Projection is needed when spatial or channel shapes do not match"),
      relation("compare-with", "residual-block-forward", "Projection shortcut vs identity shortcut"),
    ],
  },
  {
    id: "yolo-detection-pipeline",
    nodeLabel: "13.1-13.6",
    title: "YOLO Detection Pipeline",
    category: "CNN",
    type: "pipeline",
    useCase: "Object detection",
    sourceIds: [
      "yolo-grid-output-shape",
      "yolo-box-representation",
      "intersection-over-union",
      "yolo-anchor-assignment",
      "non-max-suppression-rule",
    ],
    relatedFormulaIds: ["cnn-advanced-core", "cnn-output-size", "convolution-operation"],
    relations: [
      relation("part-of", "cnn-advanced-core", "Object-detection branch of advanced CNNs"),
      relation("prerequisite", "cnn-output-size", "YOLO heads sit on CNN feature grids"),
      relation("uses", "yolo-grid-output-shape", "Detection tensor shape"),
      relation("uses", "yolo-box-representation", "Per-box prediction vector"),
      relation("uses", "intersection-over-union", "Overlap metric for assignment and filtering"),
      relation("uses", "yolo-anchor-assignment", "Assigns objects to responsible anchors"),
      relation("uses", "non-max-suppression-rule", "Removes duplicate high-overlap boxes"),
    ],
  },
  {
    id: "yolo-grid-output-shape",
    nodeLabel: "13.2",
    title: "YOLO Grid Output Shape",
    sourceIds: ["yolo-grid-output-shape"],
    relatedFormulaIds: ["yolo-detection-pipeline", "yolo-box-representation", "cnn-output-size"],
    relations: [
      relation("part-of", "yolo-detection-pipeline", "Detection-head tensor shape"),
      relation("prerequisite", "cnn-output-size", "Grid predictions are built from CNN feature maps"),
      relation("next-step", "yolo-box-representation", "Each grid-cell prediction contains box and class values"),
    ],
  },
  {
    id: "yolo-box-representation",
    nodeLabel: "13.1",
    title: "YOLO Box Representation",
    sourceIds: ["yolo-box-representation", "yolo-box-parameterization"],
    relatedFormulaIds: ["yolo-detection-pipeline", "intersection-over-union"],
    relations: [
      relation("part-of", "yolo-detection-pipeline", "Per-box output interpretation"),
      relation("next-step", "intersection-over-union", "Decoded boxes are compared with IoU"),
      relation("compare-with", "face-verification-distance", "Detection uses box geometry; face recognition uses embedding distance"),
    ],
  },
  {
    id: "yolo-anchor-assignment",
    nodeLabel: "13.5",
    title: "YOLO Anchor Assignment",
    sourceIds: ["yolo-anchor-assignment"],
    relatedFormulaIds: ["yolo-detection-pipeline", "intersection-over-union"],
    relations: [
      relation("part-of", "yolo-detection-pipeline", "Responsible-anchor matching rule"),
      relation("uses", "intersection-over-union", "Best anchor is chosen by maximum IoU"),
      relation("prerequisite", "yolo-box-representation", "Anchors describe candidate box shapes"),
    ],
  },
  {
    id: "face-recognition-metric-learning",
    nodeLabel: "14.1",
    title: "Face Recognition Metric Learning",
    category: "CNN",
    type: "pipeline",
    useCase: "Face recognition",
    sourceIds: ["face-verification-distance", "triplet-loss"],
    relatedFormulaIds: ["cnn-advanced-core", "cosine-similarity", "transfer-learning-head"],
    relations: [
      relation("part-of", "cnn-advanced-core", "Metric-learning branch of advanced CNNs"),
      relation("uses", "face-verification-distance", "Compare embeddings at inference time"),
      relation("uses", "triplet-loss", "Train embeddings with anchor-positive-negative constraints"),
      relation("compare-with", "cosine-similarity", "Alternative embedding similarity measure"),
      relation("appears-in", "transfer-learning-head", "Face models often reuse pretrained convolutional encoders"),
    ],
  },
  {
    id: "face-verification-distance",
    nodeLabel: "14.1",
    title: "Face Verification Distance",
    sourceIds: ["face-verification-distance"],
    relatedFormulaIds: ["face-recognition-metric-learning", "triplet-loss", "cosine-similarity"],
    relations: [
      relation("part-of", "face-recognition-metric-learning", "Inference-time embedding comparison"),
      relation("paired-with", "triplet-loss", "Triplet loss trains the embedding space used by this distance"),
      relation("compare-with", "cosine-similarity", "Both compare embeddings"),
    ],
  },
  {
    id: "triplet-loss",
    nodeLabel: "14.1",
    title: "Triplet Loss",
    sourceIds: ["triplet-loss"],
    relatedFormulaIds: ["face-recognition-metric-learning", "face-verification-distance"],
    relations: [
      relation("part-of", "face-recognition-metric-learning", "Training objective for face embeddings"),
      relation("paired-with", "face-verification-distance", "Uses the same embedding distances that verification thresholds"),
    ],
  },
  {
    id: "neural-style-transfer-costs",
    nodeLabel: "14.2-14.4",
    title: "Neural Style Transfer Costs",
    category: "CNN",
    type: "pipeline",
    useCase: "Neural style transfer",
    sourceIds: [
      "neural-style-content-cost",
      "neural-style-gram-matrix",
      "neural-style-style-cost",
      "neural-style-total-cost",
    ],
    relatedFormulaIds: ["cnn-advanced-core", "feature-map-activation", "convolution-operation"],
    relations: [
      relation("part-of", "cnn-advanced-core", "Feature-objective branch of advanced CNNs"),
      relation("prerequisite", "feature-map-activation", "Content and style costs compare CNN activations"),
      relation("prerequisite", "convolution-operation", "A pretrained CNN supplies the feature maps"),
      relation("uses", "neural-style-content-cost", "Preserves content structure"),
      relation("uses", "neural-style-gram-matrix", "Captures feature-channel correlations"),
      relation("uses", "neural-style-style-cost", "Matches style-image Gram statistics"),
      relation("uses", "neural-style-total-cost", "Balances content and style objectives"),
    ],
  },
  {
    id: "neural-style-style-cost",
    nodeLabel: "14.3",
    title: "Neural Style Cost",
    sourceIds: ["neural-style-style-cost"],
    relatedFormulaIds: ["neural-style-transfer-costs", "neural-style-gram-matrix", "neural-style-total-cost"],
    relations: [
      relation("part-of", "neural-style-transfer-costs", "Style component of NST"),
      relation("prerequisite", "neural-style-gram-matrix", "Style cost compares Gram matrices"),
      relation("used-in", "neural-style-total-cost", "Total NST objective weights the style term"),
    ],
  },
  {
    id: "neural-style-content-cost",
    nodeLabel: "14.2",
    title: "Neural Style Content Cost",
    sourceIds: ["neural-style-content-cost"],
    relatedFormulaIds: ["neural-style-transfer-costs", "feature-map-activation", "neural-style-total-cost"],
    relations: [
      relation("part-of", "neural-style-transfer-costs", "Content component of NST"),
      relation("prerequisite", "feature-map-activation", "Compares hidden-layer activations"),
      relation("used-in", "neural-style-total-cost", "Total NST objective weights the content term"),
    ],
  },
  {
    id: "neural-style-gram-matrix",
    nodeLabel: "14.3",
    title: "Neural Style Gram Matrix",
    sourceIds: ["neural-style-gram-matrix"],
    relatedFormulaIds: ["neural-style-transfer-costs", "neural-style-style-cost"],
    relations: [
      relation("part-of", "neural-style-transfer-costs", "Style representation"),
      relation("used-in", "neural-style-style-cost", "Style cost compares Gram matrices"),
      relation("prerequisite", "feature-map-activation", "Gram matrices are built from feature maps"),
    ],
  },
  {
    id: "neural-style-total-cost",
    nodeLabel: "14.4",
    title: "Neural Style Transfer Total Cost",
    sourceIds: ["neural-style-total-cost"],
    relatedFormulaIds: ["neural-style-transfer-costs", "neural-style-content-cost", "neural-style-style-cost"],
    relations: [
      relation("part-of", "neural-style-transfer-costs", "Combined optimization objective"),
      relation("uses", "neural-style-content-cost", "Content term"),
      relation("uses", "neural-style-style-cost", "Style term"),
    ],
  },
  {
    id: "rnn-lstm-core",
    nodeLabel: "15.1-15.8",
    title: "RNN/LSTM Core",
    category: "RNN / LSTM",
    type: "pipeline",
    useCase: "Sequence memory",
    sourceIds: [
      "sequence-tensor-convention",
      "rnn-hidden-state",
      "rnn-output-prediction",
      "rnn-sequence-loss",
      "bptt-gradient-flow",
      "gru-gates",
      "lstm-gates",
      "lstm-cell-update",
      "bidirectional-rnn-context",
    ],
    latex:
      "a^{\\langle t\\rangle}=g(W_{aa}a^{\\langle t-1\\rangle}+W_{ax}x^{\\langle t\\rangle}+b_a),\\quad c^{\\langle t\\rangle}=f_t*c^{\\langle t-1\\rangle}+i_t*\\tilde{c}^{\\langle t\\rangle}",
    description:
      "Collects the sequence notation, vanilla RNN forward pass, sequence loss, BPTT, GRU gates, LSTM memory updates, and bidirectional recurrent context.",
    aliases: ["RNN core", "LSTM core", "sequence models", "recurrent neural networks"],
    relatedFormulaIds: [
      "vanilla-rnn-forward",
      "gru-update-flow",
      "lstm-memory-flow",
      "bidirectional-rnn-context",
      "seq2seq-decoder-probability",
    ],
    relations: [
      relation("uses", "sequence-tensor-convention", "Time-step and batch notation"),
      relation("uses", "vanilla-rnn-forward", "Baseline recurrent forward pass"),
      relation("uses", "gru-update-flow", "Simpler gated memory cell"),
      relation("uses", "lstm-memory-flow", "Full gated cell-state memory"),
      relation("uses", "bidirectional-rnn-context", "Forward/backward context extension"),
      relation("next-step", "seq2seq-decoder-probability", "Encoder-decoder models build on recurrent states"),
      relation("next-step", "attention-context-vector", "Attention consumes encoder hidden states"),
    ],
  },
  {
    id: "sequence-tensor-convention",
    nodeLabel: "15.1",
    title: "Sequence Tensor Convention",
    sourceIds: ["sequence-tensor-convention"],
    relatedFormulaIds: ["rnn-lstm-core", "rnn-hidden-state", "seq2seq-decoder-probability"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Notation base for recurrent formulas"),
      relation("used-in", "vanilla-rnn-forward", "Each recurrent step consumes x<t>"),
      relation("used-in", "seq2seq-decoder-probability", "Decoder probabilities are indexed by output time"),
    ],
  },
  {
    id: "vanilla-rnn-forward",
    nodeLabel: "15.2-15.4",
    title: "Vanilla RNN Forward Pipeline",
    category: "RNN / LSTM",
    type: "pipeline",
    useCase: "Sequence modeling",
    sourceIds: ["rnn-hidden-state", "rnn-output-prediction", "rnn-sequence-loss"],
    relatedFormulaIds: ["rnn-lstm-core", "bptt-gradient-flow", "lstm-memory-flow"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Baseline recurrent model"),
      relation("prerequisite", "sequence-tensor-convention", "Uses time-step notation"),
      relation("uses", "rnn-hidden-state", "Hidden-state recurrence"),
      relation("uses", "rnn-output-prediction", "Per-step output prediction"),
      relation("uses", "rnn-sequence-loss", "Training objective across time"),
      relation("next-step", "bptt-gradient-flow", "Backward pass through the unrolled sequence"),
      relation("compare-with", "lstm-memory-flow", "Vanilla recurrence vs gated memory"),
    ],
  },
  {
    id: "rnn-hidden-state",
    nodeLabel: "15.2",
    title: "Vanilla RNN Hidden State",
    sourceIds: ["rnn-hidden-state"],
    relatedFormulaIds: ["vanilla-rnn-forward", "rnn-output-prediction", "lstm-gates"],
    relations: [
      relation("part-of", "vanilla-rnn-forward", "State update step"),
      relation("prerequisite", "sequence-tensor-convention", "Uses x<t> and a<t-1> notation"),
      relation("next-step", "rnn-output-prediction", "Hidden state feeds output prediction"),
      relation("compare-with", "gru-gates", "GRU adds gates to the recurrent state"),
      relation("compare-with", "lstm-gates", "LSTM adds gates and a separate cell state"),
    ],
  },
  {
    id: "rnn-output-prediction",
    nodeLabel: "15.3",
    title: "RNN Output Prediction",
    sourceIds: ["rnn-output-prediction"],
    relatedFormulaIds: ["vanilla-rnn-forward", "rnn-sequence-loss"],
    relations: [
      relation("part-of", "vanilla-rnn-forward", "Output projection step"),
      relation("prerequisite", "rnn-hidden-state", "Consumes the current hidden state"),
      relation("next-step", "rnn-sequence-loss", "Predictions are scored by the sequence loss"),
    ],
  },
  {
    id: "rnn-sequence-loss",
    nodeLabel: "15.4",
    title: "RNN Sequence Loss",
    sourceIds: ["rnn-sequence-loss"],
    relatedFormulaIds: ["vanilla-rnn-forward", "bptt-gradient-flow"],
    relations: [
      relation("part-of", "vanilla-rnn-forward", "Training loss over emitted sequence"),
      relation("prerequisite", "rnn-output-prediction", "Loss compares predictions with target outputs"),
      relation("next-step", "bptt-gradient-flow", "The sequence loss is differentiated through time"),
    ],
  },
  {
    id: "bptt-gradient-flow",
    nodeLabel: "15.5",
    title: "Backpropagation Through Time",
    sourceIds: ["bptt-gradient-flow"],
    relatedFormulaIds: ["vanilla-rnn-forward", "dense-layer-weight-gradient"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Backward pass for recurrent models"),
      relation("prerequisite", "rnn-sequence-loss", "Differentiates the summed sequence objective"),
      relation("compare-with", "dense-layer-weight-gradient", "Same gradient idea, but parameters are shared across time"),
      relation("next-step", "optimizer-family-core", "BPTT gradients feed optimizer updates"),
    ],
  },
  {
    id: "gru-update-flow",
    nodeLabel: "15.6",
    title: "GRU Update Flow",
    category: "RNN / LSTM",
    type: "pipeline",
    useCase: "Long sequence memory",
    sourceIds: ["gru-gates"],
    relatedFormulaIds: ["rnn-lstm-core", "lstm-memory-flow", "rnn-hidden-state"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Gated recurrent variant"),
      relation("uses", "gru-gates", "Update and reset gates"),
      relation("uses", "sigmoid-activation", "GRU gates are sigmoid masks"),
      relation("compare-with", "lstm-memory-flow", "GRU has fewer gates and no separate exposed cell-state formula"),
      relation("extends", "rnn-hidden-state", "Adds gates to the vanilla recurrent update"),
    ],
  },
  {
    id: "gru-gates",
    nodeLabel: "15.6",
    title: "GRU Gate Equations",
    sourceIds: ["gru-gates"],
    relatedFormulaIds: ["gru-update-flow", "lstm-gates", "rnn-hidden-state"],
    relations: [
      relation("part-of", "gru-update-flow", "Gate equations for GRU"),
      relation("uses", "sigmoid-activation", "Update and reset gates use sigmoid"),
      relation("uses", "activation-functions-core", "Candidate memory uses a nonlinear activation"),
      relation("compare-with", "lstm-gates", "GRU has update/reset gates; LSTM has forget/input/output gates"),
    ],
  },
  {
    id: "lstm-memory-flow",
    nodeLabel: "15.7",
    title: "LSTM Memory Flow",
    category: "RNN / LSTM",
    type: "pipeline",
    useCase: "Long sequence memory",
    sourceIds: ["lstm-gates", "lstm-cell-update"],
    relatedFormulaIds: ["rnn-lstm-core", "gru-update-flow", "attention-context-vector"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Full gated memory model"),
      relation("uses", "lstm-gates", "Forget, input, and output gates"),
      relation("uses", "lstm-cell-update", "Candidate, cell, and hidden updates"),
      relation("uses", "sigmoid-activation", "LSTM gates are sigmoid masks"),
      relation("uses", "activation-functions-core", "Candidate and exposed memory use tanh-style nonlinearities"),
      relation("compare-with", "gru-update-flow", "LSTM has a separate cell state; GRU merges memory and hidden state"),
      relation("next-step", "attention-context-vector", "Seq2Seq attention often reads LSTM encoder states"),
    ],
  },
  {
    id: "lstm-gates",
    nodeLabel: "15.7",
    title: "LSTM Gate Equations",
    sourceIds: ["lstm-gates"],
    relatedFormulaIds: ["lstm-memory-flow", "lstm-cell-update", "sigmoid-activation"],
    relations: [
      relation("part-of", "lstm-memory-flow", "Gate masks for the memory update"),
      relation("uses", "sigmoid-activation", "Forget, input, and output gates use sigmoid"),
      relation("next-step", "lstm-cell-update", "Gate values control the cell update"),
    ],
  },
  {
    id: "lstm-cell-update",
    nodeLabel: "15.7",
    title: "LSTM Cell and Hidden Update",
    sourceIds: ["lstm-cell-update"],
    relatedFormulaIds: ["lstm-memory-flow", "lstm-gates", "attention-context-vector"],
    relations: [
      relation("part-of", "lstm-memory-flow", "Memory write and hidden-output step"),
      relation("prerequisite", "lstm-gates", "Uses forget, input, and output gates"),
      relation("next-step", "attention-context-vector", "Encoder hidden states can be attended over"),
    ],
  },
  {
    id: "bidirectional-rnn-context",
    nodeLabel: "15.8",
    title: "Bidirectional RNN Context",
    sourceIds: ["bidirectional-rnn-context"],
    relatedFormulaIds: ["rnn-lstm-core", "vanilla-rnn-forward", "attention-context-vector"],
    relations: [
      relation("part-of", "rnn-lstm-core", "Direction-extension of recurrent context"),
      relation("extends", "vanilla-rnn-forward", "Runs recurrence in both sequence directions"),
      relation("used-in", "attention-context-vector", "Encoder states can include both forward and backward context"),
    ],
  },
  {
    id: "embedding-lookup",
    nodeLabel: "16.1",
    sourceIds: ["embedding-lookup"],
    relatedFormulaIds: ["skipgram-softmax", "cosine-similarity"],
  },
  {
    id: "skipgram-softmax",
    nodeLabel: "16.3",
    title: "Skip-gram Language Model Objective",
    sourceIds: ["skipgram-softmax"],
    relatedFormulaIds: ["embedding-lookup", "negative-sampling-loss", "softmax-activation"],
  },
  {
    id: "negative-sampling-loss",
    nodeLabel: "16.4",
    sourceIds: ["negative-sampling-loss"],
    relatedFormulaIds: ["skipgram-softmax", "embedding-lookup"],
  },
  {
    id: "attention-transformer-core",
    nodeLabel: "17-18",
    title: "Attention/Transformer Core",
    category: "Transformer",
    type: "pipeline",
    useCase: "Attention and Transformer modeling",
    sourceIds: [
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
    ],
    latex:
      "c_t=\\sum_s\\alpha_{t,s}h_s,\\quad \\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
    description:
      "Connects seq2seq attention and decoding with Q/K/V self-attention, masked attention, multi-head attention, positional encoding, Add & Norm, LayerNorm, FFN, and the Transformer block pipeline.",
    aliases: ["attention core", "transformer core", "seq2seq attention", "self attention"],
    relatedFormulaIds: [
      "seq2seq-attention-core",
      "scaled-dot-product-attention",
      "multi-head-attention",
      "transformer-block-pipeline",
      "rnn-lstm-core",
    ],
    relations: [
      relation("prerequisite", "rnn-lstm-core", "Seq2Seq attention starts from recurrent encoder/decoder states"),
      relation("uses", "seq2seq-attention-core", "Additive attention and context vectors"),
      relation("uses", "beam-search-log-score", "Decoding candidate scoring"),
      relation("uses", "qkv-projections", "Token projections for self-attention"),
      relation("uses", "scaled-dot-product-attention", "Core Transformer attention primitive"),
      relation("uses", "multi-head-attention", "Parallel attention heads"),
      relation("uses", "transformer-block-pipeline", "Full block-level formula flow"),
    ],
  },
  {
    id: "seq2seq-attention-core",
    nodeLabel: "17.1-17.7",
    title: "Seq2Seq Attention Core",
    category: "RNN / LSTM",
    type: "pipeline",
    useCase: "Sequence attention",
    sourceIds: ["seq2seq-decoder-probability", "attention-alignment-scores", "attention-context-vector"],
    relatedFormulaIds: ["attention-transformer-core", "lstm-memory-flow", "scaled-dot-product-attention"],
    relations: [
      relation("part-of", "attention-transformer-core", "Recurrent attention branch"),
      relation("prerequisite", "lstm-memory-flow", "Encoder and decoder states often come from LSTMs"),
      relation("uses", "seq2seq-decoder-probability", "Decoder next-token distribution"),
      relation("uses", "attention-alignment-scores", "Computes source-position weights"),
      relation("uses", "attention-context-vector", "Mixes encoder states into a context vector"),
      relation("compare-with", "scaled-dot-product-attention", "Additive score network vs QK^T score matrix"),
    ],
  },
  {
    id: "seq2seq-decoder-probability",
    nodeLabel: "17.1",
    title: "Seq2Seq Decoder Probability",
    sourceIds: ["seq2seq-decoder-probability"],
    relatedFormulaIds: ["seq2seq-attention-core", "beam-search-log-score", "softmax-activation"],
    relations: [
      relation("part-of", "seq2seq-attention-core", "Decoder output distribution"),
      relation("prerequisite", "lstm-memory-flow", "Decoder state can be recurrent"),
      relation("uses", "softmax-activation", "Produces a probability distribution over target tokens"),
      relation("next-step", "beam-search-log-score", "Beam search scores repeated decoder probabilities"),
    ],
  },
  {
    id: "attention-alignment-scores",
    nodeLabel: "17.6",
    title: "Additive Attention Alignment Scores",
    sourceIds: ["attention-alignment-scores"],
    relatedFormulaIds: ["seq2seq-attention-core", "attention-context-vector", "softmax-activation"],
    relations: [
      relation("part-of", "seq2seq-attention-core", "Attention scoring step"),
      relation("uses", "softmax-activation", "Normalizes source-position scores"),
      relation("next-step", "attention-context-vector", "Attention weights feed the context vector"),
    ],
  },
  {
    id: "attention-context-vector",
    nodeLabel: "17.7",
    title: "Attention Context Vector",
    sourceIds: ["attention-context-vector"],
    relatedFormulaIds: ["seq2seq-attention-core", "lstm-memory-flow", "scaled-dot-product-attention"],
    relations: [
      relation("part-of", "seq2seq-attention-core", "Weighted encoder-state mixture"),
      relation("prerequisite", "attention-alignment-scores", "Uses normalized attention weights"),
      relation("prerequisite", "lstm-memory-flow", "Encoder hidden states can come from LSTM layers"),
      relation("compare-with", "scaled-dot-product-attention", "Both form weighted mixtures of state/value vectors"),
    ],
  },
  {
    id: "beam-search-log-score",
    nodeLabel: "17.3-17.4",
    title: "Beam Search Scoring",
    sourceIds: ["beam-search-log-score", "length-normalized-beam-score"],
    relatedFormulaIds: ["seq2seq-decoder-probability", "attention-transformer-core"],
    relations: [
      relation("part-of", "attention-transformer-core", "Decoding search utility for sequence models"),
      relation("prerequisite", "seq2seq-decoder-probability", "Scores candidate tokens from decoder probabilities"),
      relation("uses", "length-normalized-beam-score", "Length normalization reduces short-sequence bias"),
    ],
  },
  {
    id: "length-normalized-beam-score",
    nodeLabel: "17.4",
    title: "Length-Normalized Beam Score",
    sourceIds: ["length-normalized-beam-score"],
    relatedFormulaIds: ["beam-search-log-score"],
    relations: [
      relation("part-of", "beam-search-log-score", "Normalized beam-search variant"),
      relation("extends", "beam-search-log-score", "Adds a length penalty to the raw log score"),
    ],
  },
  {
    id: "qkv-projections",
    nodeLabel: "18.1",
    title: "Q/K/V Projections",
    sourceIds: ["qkv-projections"],
    relatedFormulaIds: ["scaled-dot-product-attention", "multi-head-attention"],
    relations: [
      relation("part-of", "attention-transformer-core", "Projection step for self-attention"),
      relation("next-step", "scaled-dot-product-attention", "Q, K, and V feed the attention formula"),
      relation("used-in", "multi-head-attention", "Each head has its own Q/K/V projections"),
    ],
  },
  {
    id: "scaled-dot-product-attention",
    nodeLabel: "18.2-18.3",
    title: "Scaled Dot-Product Attention",
    sourceIds: ["qkv-projections", "scaled-dot-product-attention", "attention-score-shape-check"],
    relatedFormulaIds: ["multi-head-attention", "transformer-block-pipeline", "softmax-activation"],
    relations: [
      relation("part-of", "attention-transformer-core", "Core Transformer attention primitive"),
      relation("prerequisite", "qkv-projections", "Requires query, key, and value matrices"),
      relation("uses", "attention-score-shape-check", "Shape check for QK^T and the value mixture"),
      relation("uses", "softmax-activation", "Normalizes attention scores over key positions"),
      relation("next-step", "multi-head-attention", "Multi-head attention runs this primitive in parallel"),
      relation("compare-with", "attention-context-vector", "Both return weighted mixtures, but from different scoring mechanisms"),
    ],
  },
  {
    id: "attention-score-shape-check",
    nodeLabel: "18.3",
    title: "Scaled Attention Shape Check",
    sourceIds: ["attention-score-shape-check"],
    relatedFormulaIds: ["scaled-dot-product-attention", "matrix-multiplication-shape"],
    relations: [
      relation("part-of", "attention-transformer-core", "Shape check inside Q/K/V attention"),
      relation("used-in", "scaled-dot-product-attention", "Verifies the score matrix and output shape"),
      relation("compare-with", "matrix-multiplication-shape", "Specific application of matrix multiplication shape rules"),
    ],
  },
  {
    id: "masked-self-attention",
    nodeLabel: "18.4",
    title: "Masked Self-Attention",
    sourceIds: ["masked-self-attention"],
    relatedFormulaIds: ["scaled-dot-product-attention", "transformer-block-pipeline"],
    relations: [
      relation("part-of", "attention-transformer-core", "Decoder-side causal attention"),
      relation("extends", "scaled-dot-product-attention", "Adds a mask before softmax"),
      relation("used-in", "transformer-block-pipeline", "Decoder Transformer blocks use causal masking"),
    ],
  },
  {
    id: "multi-head-attention",
    nodeLabel: "18.5",
    title: "Multi-Head Attention",
    sourceIds: ["multi-head-attention"],
    relatedFormulaIds: ["scaled-dot-product-attention", "transformer-block-pipeline"],
    relations: [
      relation("part-of", "attention-transformer-core", "Parallel attention branch"),
      relation("prerequisite", "scaled-dot-product-attention", "Each head is a scaled dot-product attention computation"),
      relation("next-step", "transformer-add-norm", "Attention output feeds residual Add & Norm"),
      relation("used-in", "transformer-block-pipeline", "First sublayer of a Transformer block"),
    ],
  },
  {
    id: "sinusoidal-positional-encoding",
    nodeLabel: "18.6",
    title: "Sinusoidal Positional Encoding",
    sourceIds: ["sinusoidal-positional-encoding"],
    relatedFormulaIds: ["attention-transformer-core", "qkv-projections", "transformer-block-pipeline"],
    relations: [
      relation("part-of", "attention-transformer-core", "Position signal before self-attention"),
      relation("prerequisite", "qkv-projections", "Token representations are position-aware before projection"),
      relation("used-in", "transformer-block-pipeline", "Transformer input representations include position information"),
    ],
  },
  {
    id: "layer-normalization",
    nodeLabel: "18.8",
    title: "Layer Normalization",
    sourceIds: ["layer-normalization"],
    relatedFormulaIds: ["batchnorm-normalize-scale-shift", "transformer-add-norm"],
    relations: [
      relation("part-of", "attention-transformer-core", "Normalization primitive"),
      relation("used-in", "transformer-add-norm", "Add & Norm applies LayerNorm after the residual addition"),
      relation("compare-with", "batchnorm-normalize-scale-shift", "LayerNorm normalizes within a token; BatchNorm normalizes across a batch"),
    ],
  },
  {
    id: "transformer-add-norm",
    nodeLabel: "18.8",
    title: "Transformer Add & Norm",
    sourceIds: ["transformer-add-norm"],
    relatedFormulaIds: ["layer-normalization", "transformer-block-pipeline"],
    relations: [
      relation("part-of", "attention-transformer-core", "Residual normalization step"),
      relation("uses", "layer-normalization", "Normalizes after residual addition"),
      relation("used-in", "transformer-block-pipeline", "Appears after attention and after FFN"),
    ],
  },
  {
    id: "transformer-feed-forward-network",
    nodeLabel: "18.9",
    title: "Transformer Feed-Forward Network",
    sourceIds: ["transformer-feed-forward-network"],
    relatedFormulaIds: ["transformer-block-pipeline", "multi-head-attention"],
    relations: [
      relation("part-of", "attention-transformer-core", "Position-wise MLP step"),
      relation("prerequisite", "transformer-add-norm", "Consumes the normalized attention output"),
      relation("used-in", "transformer-block-pipeline", "Second sublayer of a Transformer block"),
    ],
  },
  {
    id: "transformer-block-pipeline",
    nodeLabel: "18.10",
    title: "Transformer Block Formula Pipeline",
    sourceIds: [
      "sinusoidal-positional-encoding",
      "qkv-projections",
      "scaled-dot-product-attention",
      "attention-score-shape-check",
      "multi-head-attention",
      "transformer-add-norm",
      "layer-normalization",
      "transformer-feed-forward-network",
      "masked-self-attention",
      "transformer-block-pipeline",
    ],
    relatedFormulaIds: ["scaled-dot-product-attention", "multi-head-attention", "layer-normalization"],
    relations: [
      relation("part-of", "attention-transformer-core", "Full Transformer block sequence"),
      relation("uses", "sinusoidal-positional-encoding", "Position signal"),
      relation("uses", "multi-head-attention", "Attention sublayer"),
      relation("uses", "transformer-add-norm", "Residual normalization wrapper"),
      relation("uses", "layer-normalization", "Normalization primitive"),
      relation("uses", "transformer-feed-forward-network", "Position-wise MLP sublayer"),
      relation("uses", "masked-self-attention", "Decoder-side masked variant"),
      relation("prerequisite", "scaled-dot-product-attention", "Multi-head attention is built from scaled dot-product attention"),
    ],
  },
  {
    id: "precision-recall-f1",
    nodeLabel: "19.1-19.2",
    title: "Confusion Matrix Metrics",
    sourceIds: ["confusion-matrix-counts", "precision-recall-f1"],
    relatedFormulaIds: ["bias-variance-decomposition"],
  },
  {
    id: "bias-variance-decomposition",
    nodeLabel: "19.4-19.5",
    title: "Bias / Variance Diagnosis Gaps",
    sourceIds: ["bias-variance-decomposition", "bias-variance-gap-labels", "data-mismatch-gap"],
    relatedFormulaIds: ["train-val-test-roles", "precision-recall-f1"],
  },
  {
    id: "intersection-over-union",
    nodeLabel: "13",
    sourceIds: ["intersection-over-union"],
    relatedFormulaIds: ["yolo-grid-output-shape", "non-max-suppression-rule"],
  },
  {
    id: "non-max-suppression-rule",
    nodeLabel: "13",
    sourceIds: ["non-max-suppression-rule"],
    relatedFormulaIds: ["intersection-over-union", "yolo-grid-output-shape"],
  },
  {
    id: "cosine-similarity",
    nodeLabel: "16",
    sourceIds: ["cosine-similarity"],
    relatedFormulaIds: ["embedding-lookup", "face-verification-distance"],
  },
  {
    id: "train-val-test-roles",
    nodeLabel: "19.7",
    title: "Train / Dev / Test Evaluation Hygiene",
    sourceIds: ["train-val-test-roles", "data-leakage-warning"],
    relatedFormulaIds: ["bias-variance-decomposition", "precision-recall-f1"],
  },
  {
    id: "transfer-learning-head",
    nodeLabel: "14.1",
    title: "Transfer Learning Head and Frozen Parameters",
    sourceIds: ["transfer-learning-head", "frozen-trainable-parameters"],
    relatedFormulaIds: ["face-verification-distance", "gradient-descent-update"],
  },
  {
    id: "dense-layer-activation-shape",
    nodeLabel: "1",
    sourceIds: ["dense-layer-activation-shape"],
    relatedFormulaIds: ["dense-layer-forward", "matrix-multiplication-shape"],
  },
  {
    id: "matrix-multiplication-shape",
    nodeLabel: "20",
    sourceIds: ["matrix-multiplication-shape"],
    relatedFormulaIds: ["dense-layer-forward", "dense-layer-activation-shape"],
  },
  {
    id: "dense-bias-broadcast-shape",
    nodeLabel: "20",
    sourceIds: ["dense-bias-broadcast-shape"],
    relatedFormulaIds: ["dense-layer-forward", "dense-layer-activation-shape"],
  },
  {
    id: "dense-parameter-count",
    nodeLabel: "20",
    sourceIds: ["dense-parameter-count"],
    relatedFormulaIds: ["dense-layer-forward", "convolution-parameter-count"],
  },
];

export const formulaHubEntries = formulaTopicDefinitions.map(buildTopic);

export const formulaHubEntriesById = Object.fromEntries(
  formulaHubEntries.map((entry) => [entry.id, entry]),
) as Record<string, FormulaHubEntry>;

const formulaRelationTypeOrder: FormulaRelationType[] = [
  "prerequisite",
  "uses",
  "part-of",
  "paired-with",
  "backward-pair",
  "next-step",
  "extends",
  "used-in",
  "appears-in",
  "compare-with",
  "sibling",
];

const formulaRelationTypeLabels: Record<FormulaRelationType, string> = {
  "appears-in": "Appears In",
  "backward-pair": "Backward Pair",
  "compare-with": "Compare With",
  extends: "Extends",
  "next-step": "Next Step",
  "part-of": "Part Of",
  "paired-with": "Paired With",
  prerequisite: "Prerequisite",
  sibling: "Sibling",
  "used-in": "Used In",
  uses: "Uses",
};

export function getFormulaRelationLabel(type: FormulaRelationType) {
  return formulaRelationTypeLabels[type];
}

export function getFormulaRelationGroups(entry: FormulaHubEntry): FormulaRelationGroup[] {
  const groups = new Map<FormulaRelationType, Array<FormulaRelation & { target: FormulaHubEntry }>>();

  for (const relation of entry.relations ?? []) {
    const target = formulaHubEntriesById[relation.targetId];
    if (!target) continue;

    const current = groups.get(relation.type) ?? [];
    current.push({ ...relation, target });
    groups.set(relation.type, current);
  }

  return formulaRelationTypeOrder
    .filter((type) => groups.has(type))
    .map((type) => ({
      type,
      label: formulaRelationTypeLabels[type],
      relations: groups.get(type) ?? [],
    }));
}

export const formulaHubEntryAliasesById = formulaHubEntries.reduce<Record<string, string>>((aliases, entry) => {
  for (const sourceId of entry.sourceFormulaIds ?? []) {
    if (!formulaHubEntriesById[sourceId]) {
      aliases[sourceId] = entry.id;
    }
  }
  return aliases;
}, {});

const featuredFormulaOrder = [
  "dense-layer-weight-gradient",
  "adam-update-rule",
  "batchnorm-normalize-scale-shift",
  "scaled-dot-product-attention",
  "cnn-output-size",
  "precision-recall-f1",
  "rnn-hidden-state",
];

const formulaCategoryOrder: FormulaCategory[] = [
  "Foundations",
  "Backpropagation",
  "Optimization",
  "Initialization",
  "Regularization",
  "CNN",
  "RNN / LSTM",
  "Transformer",
  "Evaluation",
  "Practice",
  "Shapes & Dimensions",
];

export const formulaCategories: FormulaCategorySummary[] = formulaCategoryOrder.map((category) => ({
  id: category,
  label: category,
  count: formulaHubEntries.filter((entry) => entry.category === category).length,
}));

type SearchField = {
  text: string;
  weight: number;
};

type PreparedSearchField = SearchField & {
  compact: string;
  dimensionCompact: string;
  normalized: string;
  tokens: string[];
};

const latexCommandWords: Array<[RegExp, string]> = [
  [/\\operatorname\s*\{([^}]*)\}/g, " $1 "],
  [/\\mathrm\s*\{([^}]*)\}/g, " $1 "],
  [/\\text\s*\{([^}]*)\}/g, " $1 "],
  [/\\mathbb\s*\{([^}]*)\}/g, " $1 "],
  [/\\alpha/g, " alpha "],
  [/\\beta/g, " beta "],
  [/\\gamma/g, " gamma "],
  [/\\theta/g, " theta "],
  [/\\lambda/g, " lambda "],
  [/\\mu/g, " mu "],
  [/\\sigma/g, " sigma "],
  [/\\epsilon/g, " epsilon "],
  [/\\tau/g, " tau "],
  [/\\hat/g, " hat "],
  [/\\tilde/g, " tilde "],
  [/\\nabla/g, " gradient "],
  [/\\partial/g, " derivative "],
  [/\\times/g, " x times by "],
  [/\\cdot/g, " dot "],
  [/\\odot/g, " elementwise "],
  [/\\circ/g, " compose "],
  [/\\sum/g, " sum "],
  [/\\frac/g, " fraction "],
  [/\\sqrt/g, " sqrt "],
  [/\\max/g, " max "],
  [/\\min/g, " min "],
  [/\\left/g, " "],
  [/\\right/g, " "],
  [/\\langle/g, " "],
  [/\\rangle/g, " "],
  [/\\infty/g, " infinity "],
];

const queryExpansions: Array<[RegExp, string]> = [
  [/\bq\s*k\s*\^?\s*t\b/g, " qkt q k transpose query key transpose attention score "],
  [/\bqkt\b/g, " q k transpose query key transpose attention score qk^t "],
  [/\bqkv\b/g, " q k v query key value attention projections "],
  [/\bbn\b/g, " batch normalization batchnorm batch norm gamma beta "],
  [/\bbatch\s*norm\b/g, " batch normalization batchnorm bn gamma beta "],
  [/\bbatchnorm\b/g, " batch normalization batch norm bn gamma beta "],
  [/\brmspropr\b/g, " rmsprop root mean square propagation optimizer "],
  [/\btransfomer\b/g, " transformer attention self attention "],
  [/\bsoft\s*max\b/g, " softmax soft max probability activation "],
  [/\bd\s*w\b/g, " dw weight gradient derivative "],
  [/\bdw\b/g, " d w weight gradient derivative "],
  [/\bd\s*z\b/g, " dz preactivation gradient derivative "],
  [/\bdz\b/g, " d z preactivation gradient derivative "],
  [/\bn\s*\[\s*l\s*\]\s*(x|by|times)\s*m\b/g, " n l m n[l] x m shape matrix tensor activation batch "],
  [/\bn_l\s*(x|by|times)\s*m\b/g, " n l m n[l] x m shape matrix tensor activation batch "],
  [/\bgamma\s*beta\b/g, " gamma beta batch normalization scale shift "],
  [/\bcell\s*state\b/g, " cell state lstm memory c t "],
  [/\bgram\s*matrix\b/g, " gram matrix style transfer channel correlation "],
  [/\banchor\s*assignment\b/g, " anchor assignment yolo iou object detection "],
  [/\bbias\s*correction\b/g, " bias correction adam m hat v hat optimizer "],
];

function normalize(value: string) {
  let normalized = value
    .toLowerCase()
    .replace(/\^\s*\{?\s*t\s*\}?/g, " transpose ")
    .replace(/[×✕]/g, " x times by ");

  for (const [pattern, replacement] of latexCommandWords) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized
    .replace(/[{}()[\],;:=|]/g, " ")
    .replace(/[_/+\-]/g, " ")
    .replace(/\\/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactSearchText(value: string) {
  return normalize(value).replace(/\s+/g, "");
}

function compactDimensionText(value: string) {
  return normalize(value)
    .replace(/\b(x|times|by)\b/g, " ")
    .replace(/\s+/g, "");
}

function expandQuery(value: string) {
  let expanded = value.toLowerCase();
  for (const [pattern, replacement] of queryExpansions) {
    expanded = expanded.replace(pattern, (match) => `${match} ${replacement}`);
  }
  return expanded;
}

function searchTokens(value: string) {
  return normalize(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function uniqueSearchTokens(values: string[]) {
  return Array.from(new Set(values));
}

function editDistanceWithin(value: string, target: string, maxDistance: number) {
  if (Math.abs(value.length - target.length) > maxDistance) return false;

  const previous = Array.from({ length: target.length + 1 }, (_, index) => index);
  const current = Array.from({ length: target.length + 1 }, () => 0);

  for (let i = 1; i <= value.length; i += 1) {
    current[0] = i;
    let rowBest = current[0];

    for (let j = 1; j <= target.length; j += 1) {
      const cost = value[i - 1] === target[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowBest = Math.min(rowBest, current[j]);
    }

    if (rowBest > maxDistance) return false;
    for (let j = 0; j <= target.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[target.length] <= maxDistance;
}

function makeSearchFields(entry: FormulaHubEntry): SearchField[] {
  const fields: SearchField[] = [
    { text: entry.title, weight: 260 },
    { text: entry.id, weight: 170 },
    { text: entry.nodeLabel ?? "", weight: 120 },
    { text: entry.aliases.join(" "), weight: 165 },
    { text: entry.symbols.flatMap((symbol) => [symbol.symbol, ...(symbol.aliases ?? [])]).join(" "), weight: 170 },
    { text: entry.symbols.flatMap((symbol) => [symbol.meaning, symbol.shape]).filter(Boolean).join(" "), weight: 105 },
    { text: entry.latex, weight: 120 },
    { text: entry.plainTextFormula, weight: 115 },
    { text: entry.description, weight: 65 },
    { text: [entry.category, entry.type, entry.useCase, entry.shape?.output, entry.pdfSection].filter(Boolean).join(" "), weight: 45 },
  ];

  for (const step of entry.steps ?? []) {
    fields.push({ text: step.title, weight: 150 });
    fields.push({ text: step.id, weight: 100 });
    fields.push({ text: step.latex, weight: 95 });
    fields.push({ text: step.plainTextFormula, weight: 95 });
    fields.push({ text: step.description, weight: 60 });
    fields.push({ text: [step.shape?.output, ...(step.shape?.input ?? [])].filter(Boolean).join(" "), weight: 70 });
    fields.push({
      text: (step.symbols ?? [])
        .flatMap((symbol) => [symbol.symbol, symbol.meaning, symbol.shape, ...(symbol.aliases ?? [])])
        .filter(Boolean)
        .join(" "),
      weight: 95,
    });
  }

  fields.push({
    text: (entry.relations ?? [])
      .flatMap((relation) => [
        relation.type,
        getFormulaRelationLabel(relation.type),
        relation.label,
        relation.note,
        relation.targetId,
        formulaHubEntriesById[relation.targetId]?.title,
        formulaHubEntriesById[relation.targetId]?.nodeLabel,
        formulaHubEntriesById[relation.targetId]?.category,
      ])
      .filter(Boolean)
      .join(" "),
    weight: 55,
  });

  return fields.filter((field) => field.text.trim().length > 0);
}

const preparedSearchFieldCache = new WeakMap<FormulaHubEntry, PreparedSearchField[]>();

function prepareSearchField(field: SearchField): PreparedSearchField {
  const normalized = normalize(field.text);
  return {
    ...field,
    compact: normalized.replace(/\s+/g, ""),
    dimensionCompact: compactDimensionText(field.text),
    normalized,
    tokens: uniqueSearchTokens(normalized.split(/\s+/).filter(Boolean)),
  };
}

function getPreparedSearchFields(entry: FormulaHubEntry) {
  const cached = preparedSearchFieldCache.get(entry);
  if (cached) return cached;

  const prepared = makeSearchFields(entry).map(prepareSearchField);
  preparedSearchFieldCache.set(entry, prepared);
  return prepared;
}

function scoreSearchField(
  field: PreparedSearchField,
  normalizedQuery: string,
  queryCompact: string,
  queryDimensionCompact: string,
  queryTokens: string[],
  fuzzyQueryTokens: string[],
) {
  const normalizedField = field.normalized;
  const fieldCompact = field.compact;
  const fieldTokens = field.tokens;
  let score = 0;

  if (!normalizedField) return score;

  if (normalizedField === normalizedQuery) score += field.weight * 1.45;
  if (normalizedField.includes(normalizedQuery)) score += field.weight;
  if (queryCompact.length >= 2 && fieldCompact.includes(queryCompact)) score += field.weight * 0.82;
  if (queryDimensionCompact.length >= 3 && field.dimensionCompact.includes(queryDimensionCompact)) {
    score += field.weight * 0.68;
  }

  const exactTokenMatches = queryTokens.filter((token) => fieldTokens.includes(token));
  const tokenCoverage = queryTokens.length > 0 ? exactTokenMatches.length / queryTokens.length : 0;
  if (tokenCoverage === 1) {
    score += field.weight * 0.72;
  } else if (tokenCoverage > 0) {
    score += field.weight * tokenCoverage * 0.24;
  }

  const fuzzyTokens = fuzzyQueryTokens.filter((token) => {
    if (token.length < 5 || exactTokenMatches.includes(token)) return false;
    const maxDistance = token.length >= 8 ? 2 : 1;
    return fieldTokens.some((fieldToken) => fieldToken.length >= 4 && editDistanceWithin(token, fieldToken, maxDistance));
  });

  if (fuzzyTokens.length > 0) {
    score += field.weight * Math.min(0.42, (fuzzyTokens.length / Math.max(fuzzyQueryTokens.length, 1)) * 0.42);
  }

  return score;
}

export function scoreFormulaEntry(entry: FormulaHubEntry, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return 1;
  }

  const expandedQuery = expandQuery(trimmedQuery);
  const normalizedQuery = normalize(expandedQuery);
  const queryCompact = compactSearchText(expandedQuery);
  const queryDimensionCompact = compactDimensionText(expandedQuery);
  const queryTokens = uniqueSearchTokens(searchTokens(expandedQuery));
  const originalTokens = uniqueSearchTokens(searchTokens(trimmedQuery));
  const fuzzyQueryTokens = originalTokens.filter((token) => token.length >= 5);
  const fields = getPreparedSearchFields(entry);

  let value = fields.reduce(
    (score, field) =>
      score + scoreSearchField(field, normalizedQuery, queryCompact, queryDimensionCompact, queryTokens, fuzzyQueryTokens),
    0,
  );

  const matchedOriginalTokens = originalTokens.filter((token) =>
    fields.some((field) => {
      const normalizedField = field.normalized;
      return (
        normalizedField.split(/\s+/).includes(token) ||
        normalizedField.replace(/\s+/g, "").includes(token) ||
        (token.length >= 5 &&
          normalizedField
            .split(/\s+/)
            .some((fieldToken) => fieldToken.length >= 4 && editDistanceWithin(token, fieldToken, token.length >= 8 ? 2 : 1)))
      );
    }),
  );

  if (originalTokens.length > 1 && matchedOriginalTokens.length === originalTokens.length) {
    value += 160;
  }

  const titleNormalized = normalize(entry.title);
  const titleCompact = compactSearchText(entry.title);
  const aliasCompact = compactSearchText(entry.aliases.join(" "));
  const idCompact = compactSearchText(entry.id);
  for (const token of originalTokens) {
    if (token.length < 2) continue;
    if (titleNormalized.split(/\s+/).includes(token) || titleCompact.includes(token)) value += 180;
    if (idCompact.includes(token)) value += 135;
    if (aliasCompact.includes(token)) value += 120;
  }

  if (
    entry.steps?.some(
      (step) =>
        scoreSearchField(
          prepareSearchField({ text: step.title, weight: 1 }),
          normalizedQuery,
          queryCompact,
          queryDimensionCompact,
          queryTokens,
          fuzzyQueryTokens,
        ) > 0,
    )
  ) {
    value += 75;
  }

  if ((entry.relations ?? []).some((relation) => normalize(relation.targetId).includes(normalizedQuery))) {
    value += 45;
  }

  const looksLikeShapeQuery =
    /\bshape\b/.test(normalizedQuery) || (queryTokens.includes("n") && queryTokens.includes("l") && queryTokens.includes("m"));
  if (looksLikeShapeQuery) {
    if (entry.type === "shape") value += 260;
    if (normalize(entry.title).includes("shape") || normalize(entry.id).includes("shape")) value += 160;
    if (entry.category === "Shapes & Dimensions") value += 150;
    if (entry.type === "pipeline") value *= 0.82;
  }

  return value;
}

export function searchFormulaEntries({
  query = "",
  category = "All",
  sort = "relevance",
}: {
  query?: string;
  category?: FormulaCategory | "All";
  sort?: "category" | "name" | "relevance";
}) {
  const trimmedQuery = query.trim();
  const filtered = formulaHubEntries
    .filter((entry) => category === "All" || entry.category === category)
    .map((entry) => ({ entry, score: scoreFormulaEntry(entry, query) }))
    .filter((result) => trimmedQuery.length === 0 || result.score > 0);

  if (sort === "name") {
    return filtered.map((result) => result.entry).sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "category") {
    return filtered
      .map((result) => result.entry)
      .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  }

  if (trimmedQuery.length === 0) {
    return filtered
      .map((result) => result.entry)
      .sort((a, b) => {
        const aIndex = featuredFormulaOrder.indexOf(a.id);
        const bIndex = featuredFormulaOrder.indexOf(b.id);
        const aRank = aIndex === -1 ? Number.POSITIVE_INFINITY : aIndex;
        const bRank = bIndex === -1 ? Number.POSITIVE_INFINITY : bIndex;
        return aRank - bRank || a.title.localeCompare(b.title);
      });
  }

  return filtered
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map((result) => result.entry);
}

export function getFormulaTopicLinks(entry: FormulaHubEntry) {
  return entry.topicSlugs
    .map((slug) => topicsBySlug[slug])
    .filter(Boolean)
    .map((topic) => ({
      href: `/topic/${topic.slug}`,
      label: topic.pageTitle ?? topic.title,
    }));
}

export function getFormulaBlogLinks(entry: FormulaHubEntry) {
  return entry.blogSlugs
    .map((slug) => blogPostsBySlug[slug])
    .filter(Boolean)
    .map((post) => ({
      href: `/blog/${post.slug}`,
      label: post.title,
    }));
}
