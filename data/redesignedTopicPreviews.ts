const redesignedTopicPreviewPaths: Record<string, string> = {
  "neuron-structure": "/topic-design-previews/single-neuron.html",
  "attention-mechanism-intuition": "/topic-design-previews/attention-mechanism-intuition.html",
  "evaluation-metrics-confusion-matrix": "/topic-design-previews/evaluation-metrics-confusion-matrix.html",
  "bias-vs-variance-diagnosis": "/topic-design-previews/bias-vs-variance-diagnosis.html",
  "transfer-learning-intuition": "/topic-design-previews/transfer-learning-intuition.html",
  "rnn-structure": "/topic-design-previews/rnn-structure.html",
  "backpropagation-intuition": "/topic-design-previews/backpropagation-intuition.html",
  "convolution-operation": "/topic-design-previews/convolution-operation.html",
  "dropout": "/topic-design-previews/dropout.html",
  "gradient-descent-learning-rate": "/topic-design-previews/gradient-descent-learning-rate.html",
};

export function getRedesignedTopicPreviewPath(slug: string) {
  return redesignedTopicPreviewPaths[slug];
}
