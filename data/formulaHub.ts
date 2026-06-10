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
    sourceIds: ["batchnorm-mini-batch-statistics", "batchnorm-normalize-scale-shift", "batchnorm-inference-transform"],
    latex: "\\mu_B,\\sigma_B^2\\rightarrow\\hat{x}^{(i)}=\\frac{x^{(i)}-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}}\\rightarrow y^{(i)}=\\gamma\\hat{x}^{(i)}+\\beta",
    relatedFormulaIds: ["layer-normalization", "dense-layer-forward", "adam-update-rule"],
    description:
      "BatchNorm computes mini-batch statistics, normalizes activations, learns scale and shift, and uses running statistics at inference time.",
    aliases: ["batch norm", "batchnorm", "normalize scale shift", "running mean", "running variance"],
    relations: [
      relation("compare-with", "regularization-strategy-core", "Normalization can help training stability; regularization directly controls overfitting"),
      relation("used-in", "dense-layer-forward", "Often placed around dense or convolutional activations"),
      relation("next-step", "adam-update-rule", "Stabilized activations can make optimization easier"),
    ],
  },
  {
    id: "cnn-output-size",
    nodeLabel: "11.2",
    sourceIds: ["cnn-output-size"],
    relatedFormulaIds: ["convolution-operation", "pooling-output-size"],
  },
  {
    id: "convolution-operation",
    nodeLabel: "11.3",
    title: "Convolution Operation and Feature Map",
    sourceIds: ["convolution-operation", "feature-map-activation"],
    relatedFormulaIds: ["cnn-output-size", "convolution-parameter-count"],
  },
  {
    id: "feature-map-activation",
    nodeLabel: "11.3",
    title: "Feature Map Activation",
    sourceIds: ["feature-map-activation"],
    relatedFormulaIds: ["convolution-operation", "neural-style-style-cost"],
  },
  {
    id: "convolution-parameter-count",
    nodeLabel: "11.4",
    sourceIds: ["convolution-parameter-count"],
    relatedFormulaIds: ["convolution-operation", "cnn-output-size"],
  },
  {
    id: "pooling-output-size",
    nodeLabel: "11.6-11.7",
    title: "Pooling Output and Max Pooling",
    sourceIds: ["pooling-output-size", "max-pooling"],
    relatedFormulaIds: ["cnn-output-size", "convolution-operation"],
  },
  {
    id: "residual-block-forward",
    nodeLabel: "12",
    title: "Residual Block Forward Pass",
    sourceIds: ["residual-block-forward", "residual-projection-shortcut"],
    relatedFormulaIds: ["convolution-operation", "batchnorm-normalize-scale-shift"],
  },
  {
    id: "yolo-grid-output-shape",
    nodeLabel: "13",
    title: "YOLO Detection Head and Box Decoding",
    sourceIds: ["yolo-grid-output-shape", "yolo-box-parameterization"],
    relatedFormulaIds: ["intersection-over-union", "non-max-suppression-rule", "cnn-output-size"],
  },
  {
    id: "face-verification-distance",
    nodeLabel: "14.1",
    title: "Face Verification and Triplet Loss",
    sourceIds: ["face-verification-distance", "triplet-loss"],
    relatedFormulaIds: ["cosine-similarity", "transfer-learning-head"],
  },
  {
    id: "neural-style-style-cost",
    nodeLabel: "14.2",
    title: "Neural Style Transfer Costs",
    sourceIds: ["neural-style-content-cost", "neural-style-gram-matrix", "neural-style-style-cost"],
    relatedFormulaIds: ["convolution-operation", "feature-map-activation"],
  },
  {
    id: "rnn-hidden-state",
    nodeLabel: "15.2-15.3",
    title: "Vanilla RNN Forward Pipeline",
    sourceIds: ["rnn-hidden-state", "rnn-output-prediction"],
    relatedFormulaIds: ["lstm-gates", "seq2seq-decoder-probability"],
  },
  {
    id: "lstm-gates",
    nodeLabel: "15.7",
    sourceIds: ["lstm-gates"],
    relatedFormulaIds: ["rnn-hidden-state", "attention-context-vector"],
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
    id: "seq2seq-decoder-probability",
    nodeLabel: "17.1-17.3",
    title: "Seq2Seq Decoder and Attention Context",
    sourceIds: ["seq2seq-decoder-probability", "attention-context-vector"],
    relatedFormulaIds: ["beam-search-log-score", "rnn-hidden-state", "scaled-dot-product-attention"],
  },
  {
    id: "attention-context-vector",
    nodeLabel: "17.2",
    title: "Attention Context Vector",
    sourceIds: ["attention-context-vector"],
    relatedFormulaIds: ["seq2seq-decoder-probability", "lstm-gates", "scaled-dot-product-attention"],
  },
  {
    id: "beam-search-log-score",
    nodeLabel: "17.2",
    title: "Beam Search Scoring",
    sourceIds: ["beam-search-log-score", "length-normalized-beam-score"],
    relatedFormulaIds: ["seq2seq-decoder-probability"],
  },
  {
    id: "scaled-dot-product-attention",
    nodeLabel: "18.1-18.2",
    title: "Q/K/V and Scaled Dot-Product Attention",
    sourceIds: ["qkv-projections", "scaled-dot-product-attention"],
    relatedFormulaIds: ["multi-head-attention", "transformer-block-pipeline", "softmax-activation"],
  },
  {
    id: "multi-head-attention",
    nodeLabel: "18.5",
    sourceIds: ["multi-head-attention"],
    relatedFormulaIds: ["scaled-dot-product-attention", "transformer-block-pipeline"],
  },
  {
    id: "sinusoidal-positional-encoding",
    nodeLabel: "18",
    sourceIds: ["sinusoidal-positional-encoding"],
    relatedFormulaIds: ["scaled-dot-product-attention", "transformer-block-pipeline"],
  },
  {
    id: "layer-normalization",
    nodeLabel: "18",
    sourceIds: ["layer-normalization"],
    relatedFormulaIds: ["batchnorm-normalize-scale-shift", "transformer-add-norm"],
  },
  {
    id: "transformer-add-norm",
    nodeLabel: "18",
    sourceIds: ["transformer-add-norm"],
    relatedFormulaIds: ["layer-normalization", "transformer-block-pipeline"],
  },
  {
    id: "transformer-feed-forward-network",
    nodeLabel: "18",
    sourceIds: ["transformer-feed-forward-network"],
    relatedFormulaIds: ["transformer-block-pipeline", "multi-head-attention"],
  },
  {
    id: "masked-self-attention",
    nodeLabel: "18",
    sourceIds: ["masked-self-attention"],
    relatedFormulaIds: ["scaled-dot-product-attention", "transformer-block-pipeline"],
  },
  {
    id: "transformer-block-pipeline",
    nodeLabel: "18.10",
    title: "Transformer Block Formula Pipeline",
    sourceIds: [
      "sinusoidal-positional-encoding",
      "scaled-dot-product-attention",
      "multi-head-attention",
      "transformer-add-norm",
      "layer-normalization",
      "transformer-feed-forward-network",
      "masked-self-attention",
      "transformer-block-pipeline",
    ],
    relatedFormulaIds: ["scaled-dot-product-attention", "multi-head-attention", "layer-normalization"],
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

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[{}\\()[\],]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesNormalized(value: string, query: string) {
  return normalize(value).includes(normalize(query));
}

function textFields(entry: FormulaHubEntry) {
  return [
    entry.nodeLabel,
    entry.title,
    entry.latex,
    entry.plainTextFormula,
    entry.description,
    entry.category,
    entry.type,
    entry.useCase,
    entry.shape?.output,
    entry.pdfSection,
    ...entry.aliases,
    ...entry.symbols.flatMap((symbol) => [
      symbol.symbol,
      symbol.meaning,
      symbol.shape,
      ...(symbol.aliases ?? []),
    ]),
    ...(entry.steps ?? []).flatMap((step) => [
      step.title,
      step.latex,
      step.plainTextFormula,
      step.description,
      step.shape?.output,
      ...(step.shape?.input ?? []),
      ...(step.symbols ?? []).flatMap((symbol) => [
        symbol.symbol,
        symbol.meaning,
        symbol.shape,
        ...(symbol.aliases ?? []),
      ]),
    ]),
    ...(entry.relations ?? []).flatMap((relation) => [
      relation.type,
      getFormulaRelationLabel(relation.type),
      relation.label,
      relation.note,
      relation.targetId,
      formulaHubEntriesById[relation.targetId]?.title,
      formulaHubEntriesById[relation.targetId]?.nodeLabel,
      formulaHubEntriesById[relation.targetId]?.category,
    ]),
  ]
    .filter(Boolean)
    .join(" ");
}

export function scoreFormulaEntry(entry: FormulaHubEntry, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return 1;
  }

  const normalized = normalize(trimmedQuery);
  const title = normalize(entry.title);
  const aliases = entry.aliases.map(normalize);
  const symbols = entry.symbols.flatMap((symbol) => [symbol.symbol, ...(symbol.aliases ?? [])]).map(normalize);
  const stepTitles = (entry.steps ?? []).map((step) => normalize(step.title));
  const haystack = normalize(textFields(entry));

  let value = 0;

  if (title === normalized) value += 220;
  if (title.includes(normalized)) value += 130;
  if (entry.nodeLabel && normalize(entry.nodeLabel) === normalized) value += 115;
  if (aliases.some((alias) => alias === normalized)) value += 110;
  if (aliases.some((alias) => alias.includes(normalized))) value += 80;
  if (stepTitles.some((stepTitle) => stepTitle.includes(normalized))) value += 75;
  if (symbols.some((symbol) => symbol === normalized)) value += 95;
  if (symbols.some((symbol) => symbol.includes(normalized))) value += 65;
  if (includesNormalized(entry.category, trimmedQuery)) value += 40;
  if (entry.shape?.output && includesNormalized(entry.shape.output, trimmedQuery)) value += 35;
  if (haystack.includes(normalized)) value += 20;

  for (const token of normalized.split(/\s+/).filter(Boolean)) {
    if (haystack.includes(token)) {
      value += 4;
    }
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
