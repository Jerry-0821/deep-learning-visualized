export type PrototypeMapping = {
  sourceFile: string;
  publicPath: string;
  iframeHeight: number;
};

export const prototypeMappings: Record<string, PrototypeMapping> = {
  "neuron-structure": {
    sourceFile: "single_neuron.ipynb",
    publicPath: "/prototypes/neuron-structure.html",
    iframeHeight: 1750,
  },
  "activation-functions-comparison": {
    sourceFile: "Activations.ipynb",
    publicPath: "/prototypes/activation-functions-comparison.html",
    iframeHeight: 2500,
  },
  "loss-functions": {
    sourceFile: "loss_functions_style_source.py",
    publicPath: "/prototypes/loss-functions.html",
    iframeHeight: 2600,
  },
  "backpropagation-intuition": {
    sourceFile: "Backpropagation.ipynb",
    publicPath: "/prototypes/backpropagation-intuition.html",
    iframeHeight: 1900,
  },
  "gradient-descent-learning-rate": {
    sourceFile: "Gradient Descent.ipynb",
    publicPath: "/prototypes/gradient-descent-learning-rate.html",
    iframeHeight: 2400,
  },
  "overfitting-vs-underfitting": {
    sourceFile: "overfitting_top_controls_colab.py",
    publicPath: "/prototypes/overfitting-vs-underfitting.html",
    iframeHeight: 2900,
  },
  dropout: {
    sourceFile: "Dropout.ipynb",
    publicPath: "/prototypes/dropout.html",
    iframeHeight: 2400,
  },
  "adam-vs-sgd": {
    sourceFile: "adam_vs_sgd_white_style_source.py",
    publicPath: "/prototypes/adam-vs-sgd.html",
    iframeHeight: 2800,
  },
  "adam-optimizer-vs-sgd": {
    sourceFile: "adam_vs_sgd_white_style_source.py",
    publicPath: "/prototypes/adam-vs-sgd.html",
    iframeHeight: 2800,
  },
  "mini-batch-training-batch-size": {
    sourceFile: "Mini-batch Training and Batch Size Intuition.ipynb",
    publicPath: "/prototypes/mini-batch-training-batch-size.html",
    iframeHeight: 2600,
  },
  "train-val-test-split": {
    sourceFile: "train_val_test_split_visualization.py",
    publicPath: "/prototypes/train-val-test-split.html",
    iframeHeight: 3200,
  },
  "bias-vs-variance-diagnosis": {
    sourceFile: "bias_variance_diagnosis_dashboard.py",
    publicPath: "/prototypes/bias-vs-variance-diagnosis.html",
    iframeHeight: 3200,
  },
  "transfer-learning-intuition": {
    sourceFile: "transfer_learning_intuition_source.py",
    publicPath: "/prototypes/transfer-learning-intuition.html",
    iframeHeight: 3200,
  },
  "convolution-operation": {
    sourceFile: "convolution_operation_stepwise_source.py",
    publicPath: "/prototypes/convolution-operation.html",
    iframeHeight: 1900,
  },
  pooling: {
    sourceFile: "pooling_style_aligned_source.py",
    publicPath: "/prototypes/pooling.html",
    iframeHeight: 2600,
  },
  "feature-map-visualization": {
    sourceFile: "feature_map_visualization_source.py",
    publicPath: "/prototypes/feature-map-visualization.html",
    iframeHeight: 3000,
  },
  "rnn-structure": {
    sourceFile: "rnn_v4_label_fixed_requested_fix.html",
    publicPath: "/prototypes/rnn-structure.html",
    iframeHeight: 2600,
  },
  "attention-mechanism-intuition": {
    sourceFile: "transfomer.ipynb",
    publicPath: "/prototypes/attention-mechanism-intuition.html",
    iframeHeight: 3000,
  },
  "evaluation-metrics-confusion-matrix": {
    sourceFile: "Evaluation Metrics _ Confusion Matrix Intuition.ipynb",
    publicPath: "/prototypes/evaluation-metrics-confusion-matrix.html",
    iframeHeight: 2600,
  },
};

// Intentionally left unmapped for now:
// - "pooling_style_aligned_standalone.py"
//   Standalone duplicate kept out of the live mapping because
//   "pooling_style_aligned_source.py" is the chosen source file.
// - "CNN Convolution Operation (1).ipynb"
//   Backup source for Convolution Operation; the stepwise source is canonical.
