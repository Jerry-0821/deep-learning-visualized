const redesignedTopicPreviewPaths: Record<string, string> = {
  "neuron-structure": "/topic-design-previews/single-neuron.html",
  "activation-functions-comparison": "/topic-design-previews/activation-functions-comparison.html",
  "attention-mechanism-intuition": "/topic-design-previews/attention-mechanism-intuition.html",
  "evaluation-metrics-confusion-matrix": "/topic-design-previews/evaluation-metrics-confusion-matrix.html",
  "bias-vs-variance-diagnosis": "/topic-design-previews/bias-vs-variance-diagnosis.html",
  "train-val-test-split": "/topic-design-previews/train-val-test-split.html",
  "transfer-learning-intuition": "/topic-design-previews/transfer-learning-intuition.html",
  "loss-functions": "/topic-design-previews/loss-functions.html",
  "overfitting-vs-underfitting": "/topic-design-previews/overfitting-vs-underfitting.html",
  "adam-vs-sgd": "/topic-design-previews/adam-vs-sgd.html",
  "mini-batch-training-batch-size": "/topic-design-previews/mini-batch-training-batch-size.html",
  "rnn-structure": "/topic-design-previews/rnn-structure.html",
  "backpropagation-intuition": "/topic-design-previews/backpropagation-intuition.html",
  "convolution-operation": "/topic-design-previews/convolution-operation.html",
  "feature-map-visualization": "/topic-design-previews/feature-map-visualization.html",
  "dropout": "/topic-design-previews/dropout.html",
  "gradient-descent-learning-rate": "/topic-design-previews/gradient-descent-learning-rate.html",
};

export function getRedesignedTopicPreviewPath(slug: string) {
  return redesignedTopicPreviewPaths[slug];
}
