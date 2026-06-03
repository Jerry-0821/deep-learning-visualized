import rawFormulaHubEntries from "@/data/formulaHubEntries.json";
import { blogPostsBySlug } from "@/data/blogPosts";
import { topicsBySlug } from "@/data/topics";

export type FormulaCategory =
  | "Foundations"
  | "Backpropagation"
  | "Optimization"
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
  shape?: FormulaShapeCheck;
  title?: string;
  topicSlugs?: string[];
  type?: FormulaEntryType;
  useCase?: string;
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
  const steps = [...sourceEntries.map(stepFromEntry), ...(definition.extraSteps ?? [])];
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
    relatedFormulaIds: definition.relatedFormulaIds ?? [],
    nodeLabel: definition.nodeLabel,
    sourceFormulaIds: unique(sourceEntries.map((entry) => entry.id)),
    steps,
  };
}

const adamBiasCorrectionSteps: FormulaTopicStep[] = [
  {
    id: "adam-gradient",
    title: "Current Mini-batch Gradient",
    latex: "g_t=\\nabla_\\theta J(\\theta_{t-1})",
    plainTextFormula: "g_t = grad_theta J(theta_{t-1})",
    description: "Compute the current gradient before updating Adam's first and second moment estimates.",
    symbols: [
      { symbol: "g_t", meaning: "Gradient at optimizer step t", shape: "same shape as \\theta" },
      { symbol: "\\theta", meaning: "Model parameters", shape: "parameter shape" },
    ],
    shape: {
      input: ["\\theta_{t-1}: parameter shape"],
      output: "g_t: same shape as \\theta",
      explanation: "The optimizer update has the same shape as the parameter tensor it modifies.",
    },
  },
  {
    id: "adam-bias-correction-m",
    title: "First-moment Bias Correction",
    latex: "\\hat{m}_t=\\frac{m_t}{1-\\beta_1^t}",
    plainTextFormula: "m_hat_t = m_t / (1 - beta_1^t)",
    description: "Corrects the early-step bias caused by initializing the first-moment estimate at zero.",
    symbols: [
      { symbol: "\\hat{m}_t", meaning: "Bias-corrected first moment", shape: "same shape as \\theta" },
      { symbol: "\\beta_1", meaning: "First-moment decay rate" },
    ],
  },
  {
    id: "adam-bias-correction-v",
    title: "Second-moment Bias Correction",
    latex: "\\hat{v}_t=\\frac{v_t}{1-\\beta_2^t}",
    plainTextFormula: "v_hat_t = v_t / (1 - beta_2^t)",
    description: "Corrects the early-step bias in the RMSProp-style second-moment estimate.",
    symbols: [
      { symbol: "\\hat{v}_t", meaning: "Bias-corrected second moment", shape: "same shape as \\theta" },
      { symbol: "\\beta_2", meaning: "Second-moment decay rate" },
    ],
  },
];

const formulaTopicDefinitions: FormulaTopicDefinition[] = [
  {
    id: "neuron-weighted-sum",
    nodeLabel: "2.2",
    title: "Single Neuron Forward Pass",
    sourceIds: ["neuron-weighted-sum", "neuron-activation-output"],
    relatedFormulaIds: ["dense-layer-forward", "sigmoid-activation", "relu-activation"],
    description: "A neuron first computes an affine score and then passes it through an activation function.",
  },
  {
    id: "dense-layer-forward",
    nodeLabel: "3.2",
    title: "Dense Layer Forward Pipeline",
    sourceIds: ["dense-layer-forward", "dense-layer-activation-shape"],
    relatedFormulaIds: ["dense-layer-weight-gradient", "matrix-multiplication-shape", "dense-bias-broadcast-shape"],
  },
  {
    id: "sigmoid-activation",
    nodeLabel: "4.1",
    title: "Sigmoid Activation and Derivative",
    sourceIds: ["sigmoid-activation", "sigmoid-derivative"],
    relatedFormulaIds: ["binary-cross-entropy", "logistic-gradient-shortcut"],
  },
  {
    id: "relu-activation",
    nodeLabel: "4.1",
    sourceIds: ["relu-activation"],
    relatedFormulaIds: ["dense-layer-forward", "dense-layer-weight-gradient"],
  },
  {
    id: "softmax-activation",
    nodeLabel: "4.2",
    sourceIds: ["softmax-activation"],
    relatedFormulaIds: ["categorical-cross-entropy", "softmax-cross-entropy-shortcut", "scaled-dot-product-attention"],
  },
  {
    id: "binary-cross-entropy",
    nodeLabel: "5.1",
    sourceIds: ["binary-cross-entropy"],
    relatedFormulaIds: ["logistic-gradient-shortcut", "sigmoid-activation"],
  },
  {
    id: "categorical-cross-entropy",
    nodeLabel: "5.2",
    sourceIds: ["categorical-cross-entropy"],
    relatedFormulaIds: ["softmax-cross-entropy-shortcut", "softmax-activation"],
  },
  {
    id: "mean-squared-error",
    nodeLabel: "5.3",
    sourceIds: ["mean-squared-error"],
    relatedFormulaIds: ["gradient-descent-update"],
  },
  {
    id: "dense-layer-weight-gradient",
    nodeLabel: "6.3-6.4",
    title: "Dense Layer Backpropagation Pipeline",
    sourceIds: ["dense-layer-dz", "dense-layer-da-prev", "dense-layer-weight-gradient", "dense-layer-bias-gradient"],
    latex: "dZ^{[l]}=dA^{[l]}\\odot g'^{[l]}(Z^{[l]}),\\quad dW^{[l]}=\\frac{1}{m}dZ^{[l]}(A^{[l-1]})^T",
    relatedFormulaIds: ["dense-layer-forward", "logistic-gradient-shortcut", "softmax-cross-entropy-shortcut"],
    description: "The full reverse flow for a dense layer: activation gradient, previous activation gradient, weight gradient, and bias gradient.",
  },
  {
    id: "logistic-gradient-shortcut",
    nodeLabel: "6.2",
    title: "Sigmoid BCE Output Gradient",
    sourceIds: ["logistic-gradient-shortcut"],
    relatedFormulaIds: ["binary-cross-entropy", "sigmoid-activation"],
  },
  {
    id: "softmax-cross-entropy-shortcut",
    nodeLabel: "6.2",
    title: "Softmax Cross-Entropy Output Gradient",
    sourceIds: ["softmax-cross-entropy-shortcut"],
    relatedFormulaIds: ["categorical-cross-entropy", "softmax-activation"],
  },
  {
    id: "gradient-descent-update",
    nodeLabel: "7.1",
    sourceIds: ["gradient-descent-update"],
    relatedFormulaIds: ["sgd-update", "momentum-update-rule", "adam-update-rule"],
  },
  {
    id: "sgd-update",
    nodeLabel: "7.2",
    title: "Mini-batch SGD Update",
    sourceIds: ["mini-batch-gradient", "sgd-update"],
    relatedFormulaIds: ["gradient-descent-update", "momentum-update-rule", "adam-update-rule"],
  },
  {
    id: "momentum-update-rule",
    nodeLabel: "7.4",
    sourceIds: ["momentum-update-rule"],
    relatedFormulaIds: ["sgd-update", "rmsprop-update-rule", "adam-update-rule"],
  },
  {
    id: "rmsprop-update-rule",
    nodeLabel: "7.5",
    sourceIds: ["rmsprop-update-rule"],
    relatedFormulaIds: ["momentum-update-rule", "adam-update-rule"],
  },
  {
    id: "adam-update-rule",
    nodeLabel: "7.6",
    title: "Adam Optimization Flow",
    sourceIds: ["momentum-update-rule", "rmsprop-update-rule", "adam-update-rule"],
    extraSteps: adamBiasCorrectionSteps,
    latex: "\\theta_t\\leftarrow\\theta_{t-1}-\\alpha\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}+\\epsilon}",
    description:
      "Adam combines Momentum's first-moment averaging, RMSProp's second-moment scaling, bias correction, and a final adaptive parameter update.",
    aliases: ["Adam", "Adam optimizer", "bias correction", "m hat", "v hat"],
    relatedFormulaIds: ["momentum-update-rule", "rmsprop-update-rule", "sgd-update"],
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
  },
  {
    id: "l2-regularized-cost",
    nodeLabel: "9.1",
    sourceIds: ["l2-regularized-cost"],
    relatedFormulaIds: ["dropout-mask", "gradient-descent-update"],
  },
  {
    id: "dropout-mask",
    nodeLabel: "9.4-9.5",
    title: "Dropout Forward Pipeline",
    sourceIds: ["dropout-mask", "inverted-dropout-forward"],
    relatedFormulaIds: ["l2-regularized-cost", "dense-layer-forward"],
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
