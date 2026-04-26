import type { ReactNode } from "react";
import { LandingDotIcon, LandingGridIcon, LandingWaveIcon } from "@/components/icons";

export type ModuleTopic = {
  numberLabel: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  slug: string;
  pageTitle?: string;
  featured?: boolean;
  wide?: boolean;
  preview?: {
    leftLabel: string;
    leftValue: string;
    leftSub: string;
    rightLabel: string;
    rightValue: string;
    rightSub: string;
  };
};

export type ModuleData = {
  id: string;
  badge: string;
  title: string;
  titleAccent: string;
  fullTitle: string;
  description: string;
  estimated: string;
  completed: string;
  progressWidth?: string;
  heroPanelLabel: string;
  heroPanelTitle: string;
  heroPoints: {
    title: string;
    body: string;
  }[];
  topics: ModuleTopic[];
  footerStrip: string;
  landing: {
    cardClassName: string;
    title: string;
    description: string;
    icon: ReactNode;
    wide?: boolean;
    panels?: {
      label: string;
      text: string;
    }[];
  };
};

export const modules: ModuleData[] = [
  {
    id: "1",
    badge: "Module 01",
    title: "Deep Learning",
    titleAccent: "Foundations & Training",
    fullTitle: "Deep Learning Foundations & Training",
    description:
      "Build the core learning loop from single-neuron intuition through activations, loss, backpropagation, optimization, regularization, and training stability.",
    estimated: "~4.5 hrs",
    completed: "1",
    progressWidth: "10%",
    heroPanelLabel: "What this group builds",
    heroPanelTitle: "From forward signal to reliable training.",
    heroPoints: [
      {
        title: "Core building blocks",
        body: "Understand how neurons, activations, loss, and backpropagation connect into one learning system.",
      },
      {
        title: "Optimization behavior",
        body: "See how learning rate and optimizer choices change the path through a loss landscape.",
      },
      {
        title: "Training reliability",
        body: "Use optimizer and regularization ideas to make training more stable and generalization stronger.",
      },
    ],
    topics: [
      {
        numberLabel: "01 - COMPLETED",
        title: "Single Neuron Forward Pass",
        subtitle:
          "Input -> weights -> bias -> activation -> output. See how one neuron turns features into a prediction signal.",
        tag: "Foundation",
        icon: "m1-neuron",
        slug: "neuron-structure",
        featured: true,
      },
      {
        numberLabel: "02",
        title: "Activation Functions Comparison",
        subtitle:
          "Compare ReLU, Leaky ReLU, Sigmoid, and Tanh to see how nonlinearities shape a neuron response.",
        tag: "Visualisation",
        icon: "m1-activation",
        slug: "activation-functions-comparison",
      },
      {
        numberLabel: "03",
        title: "Loss Functions",
        subtitle:
          "Compare prediction with truth, convert error into a scalar loss, and understand how loss becomes the training signal.",
        tag: "Maths",
        icon: "m1-loss",
        slug: "loss-functions",
      },
      {
        numberLabel: "04",
        title: "Backpropagation Intuition",
        subtitle: "Follow the error signal backward through cached forward values, gradients, and parameter updates.",
        tag: "Core concept",
        icon: "m1-backprop",
        slug: "backpropagation-intuition",
        wide: true,
        preview: {
          leftLabel: "Forward",
          leftValue: "Prediction first",
          leftSub: "The network produces an output by applying weights and activations layer by layer.",
          rightLabel: "Backward",
          rightValue: "Error guides update",
          rightSub: "Loss sends a correction signal back so parameters can move in a better direction.",
        },
      },
      {
        numberLabel: "05",
        title: "Gradient Descent & Learning Rate",
        subtitle: "Watch parameters move across a loss surface and see how learning rate changes the descent path.",
        tag: "Optimisation",
        icon: "m2-gradient",
        slug: "gradient-descent-learning-rate",
      },
      {
        numberLabel: "06",
        title: "Overfitting vs. Underfitting",
        subtitle:
          "Adjust model complexity, data size, noise, and regularization to diagnose underfit, good fit, and overfit behavior.",
        tag: "Generalisation",
        icon: "m2-fit",
        slug: "overfitting-vs-underfitting",
      },
      {
        numberLabel: "07",
        title: "Dropout",
        subtitle: "See how random neuron masking and inverted dropout scaling reduce co-adaptation during training.",
        tag: "Regularisation",
        icon: "m2-dropout",
        slug: "dropout",
      },
      {
        numberLabel: "08",
        title: "Adam Optimizer vs. SGD",
        subtitle: "Compare SGD, momentum, and Adam on a 3D loss surface to see how optimizer dynamics differ.",
        tag: "Comparison",
        icon: "m2-adam",
        slug: "adam-vs-sgd",
        wide: true,
        preview: {
          leftLabel: "SGD",
          leftValue: "Consistent, simple steps",
          leftSub: "Easier to reason about, but can zig-zag and require more tuning.",
          rightLabel: "Adam",
          rightValue: "Adaptive step sizes",
          rightSub: "Usually reaches useful regions faster, especially early in training.",
        },
      },
    ],
    footerStrip: "Foundation · Nonlinearity · Loss · Backpropagation · Optimization · Regularization",
    landing: {
      cardClassName: "black",
      title: "Deep Learning Foundations & Training",
      description:
        "From a single neuron to backpropagation, optimization, regularization, and training behavior.",
      icon: <LandingDotIcon />,
    },
  },
  {
    id: "2",
    badge: "Module 02",
    title: "Vision & Sequence",
    titleAccent: "Models",
    fullTitle: "Vision & Sequence Models",
    description:
      "Understand how models read images and ordered data through convolution, pooling, feature maps, recurrence, and attention.",
    estimated: "~5 hrs",
    completed: "0",
    progressWidth: "0%",
    heroPanelLabel: "What this group connects",
    heroPanelTitle: "From local patterns to long-range context.",
    heroPoints: [
      {
        title: "Vision intuition",
        body: "See how filters, pooling, and feature maps let CNNs build spatial understanding.",
      },
      {
        title: "Sequence flow",
        body: "Follow how RNNs and related models carry information through ordered inputs.",
      },
      {
        title: "Context selection",
        body: "Connect recurrent flow and attention to the problem of choosing relevant information.",
      },
    ],
    topics: [
      {
        numberLabel: "01 - START HERE",
        title: "Convolution Operation",
        subtitle: "Watch a filter slide across an input image, multiply local patches, and produce an output feature map.",
        tag: "Core operation",
        icon: "m4-conv",
        slug: "convolution-operation",
        featured: true,
      },
      {
        numberLabel: "02",
        title: "Pooling and Downsampling",
        subtitle:
          "Compare max pooling and average pooling as a window slides across a feature map and reduces spatial size.",
        tag: "Compression",
        icon: "m4-pooling",
        slug: "pooling",
      },
      {
        numberLabel: "03",
        title: "Feature Map Visualization",
        subtitle:
          "See how different filters and CNN layers produce different activation maps that highlight edges, textures, and patterns.",
        tag: "Visualisation",
        icon: "m4-featuremap",
        slug: "feature-map-visualization",
      },
      {
        numberLabel: "04",
        title: "RNN Structure",
        subtitle: "Compare one-to-one, one-to-many, many-to-one, and many-to-many RNN layouts for sequence tasks.",
        tag: "Sequence",
        icon: "m5-rnn",
        slug: "rnn-structure",
      },
      {
        numberLabel: "05",
        title: "Attention Mechanism Intuition",
        pageTitle: "Attention Mechanism Inside a Transformer",
        subtitle:
          "Follow tokens through embeddings, Query/Key/Value projections, attention scores, softmax weights, and context vectors.",
        tag: "Attention",
        icon: "m5-attention",
        slug: "attention-mechanism-intuition",
        wide: true,
        preview: {
          leftLabel: "Hidden state only",
          leftValue: "One compressed summary",
          leftSub: "A single running state can struggle to carry all the detail needed from earlier steps.",
          rightLabel: "Attention-guided",
          rightValue: "Relevant tokens stay visible",
          rightSub: "The model can revisit the most useful positions instead of depending on one bottleneck state.",
        },
      },
    ],
    footerStrip: "Convolution · Pooling · Feature Maps · Recurrence · Attention",
    landing: {
      cardClassName: "blue",
      title: "Vision & Sequence Models",
      description: "Connect CNN visual intuition with sequence models and attention.",
      icon: <LandingWaveIcon />,
    },
  },
  {
    id: "3",
    badge: "Module 03",
    title: "Model Development",
    titleAccent: "Toolkit",
    fullTitle: "Model Development Toolkit",
    description:
      "Learn how to diagnose performance, choose better next steps, and reason more clearly about evaluation, error sources, and transferability during real-world ML development.",
    estimated: "~2 hrs",
    completed: "0",
    progressWidth: "0%",
    heroPanelLabel: "What this group clarifies",
    heroPanelTitle: "Diagnose before you scale.",
    heroPoints: [
      {
        title: "Reliable evaluation",
        body: "Use train, validation, and test splits to measure progress without fooling yourself.",
      },
      {
        title: "Better decisions",
        body: "Separate bias, variance, and mismatch so each next experiment solves the right problem.",
      },
      {
        title: "Reusable progress",
        body: "See when prior knowledge can accelerate a new task through transfer learning.",
      },
    ],
    topics: [
      {
        numberLabel: "01 - START HERE",
        title: "Train / Val / Test Split",
        subtitle: "Understand how data is split for training, tuning, and final evaluation while avoiding leakage.",
        tag: "Evaluation",
        icon: "m3-split",
        slug: "train-val-test-split",
        featured: true,
      },
      {
        numberLabel: "02",
        title: "Evaluation Metrics & Confusion Matrix",
        subtitle:
          "Move a classification threshold and see how TP, FP, TN, FN, accuracy, precision, recall, and F1 change.",
        tag: "Evaluation",
        icon: "m3-bias",
        slug: "evaluation-metrics-confusion-matrix",
      },
      {
        numberLabel: "03",
        title: "Bias vs. Variance Diagnosis",
        subtitle:
          "Compare human-level, training, train-dev, dev, and test errors to diagnose bias, variance, mismatch, and dev-set overfitting.",
        tag: "Diagnosis",
        icon: "m3-bias",
        slug: "bias-vs-variance-diagnosis",
      },
      {
        numberLabel: "04",
        title: "Mini-batch Training & Batch Size",
        subtitle:
          "Compare full-batch, mini-batch, and SGD updates to understand why training paths can be smooth or noisy.",
        tag: "Training",
        icon: "m2-gradient",
        slug: "mini-batch-training-batch-size",
      },
      {
        numberLabel: "05",
        title: "Transfer Learning Intuition",
        subtitle:
          "See how a model pretrained on Task A can reuse learned features, replace the head, and adapt to a smaller Task B.",
        tag: "Transfer",
        icon: "m3-transfer",
        slug: "transfer-learning-intuition",
        wide: true,
        preview: {
          leftLabel: "Source knowledge",
          leftValue: "Learned visual or feature priors",
          leftSub: "Earlier tasks provide reusable patterns that do not need to be learned from zero again.",
          rightLabel: "Target task",
          rightValue: "Adapt with fewer new examples",
          rightSub: "A smaller task-specific layer can build on those priors and converge more efficiently.",
        },
      },
    ],
    footerStrip: "Evaluation · Metrics · Diagnosis · Mini-batches · Transfer",
    landing: {
      cardClassName: "",
      title: "Model Development Toolkit",
      description: "Diagnose data splits, metrics, bias, variance, mini-batches, and transfer decisions.",
      icon: <LandingGridIcon className="landing-card-icon-grid" />,
      wide: true,
      panels: [
        {
          label: "High bias?",
          text: "Try a larger network, better features, or longer training.",
        },
        {
          label: "High variance?",
          text: "Use regularization, collect more data, or simplify the model.",
        },
        {
          label: "Not improving?",
          text: "Check the data pipeline before chasing more architectural complexity.",
        },
      ],
    },
  },
];

const moduleAliases = {
  "4": modules[1],
  "5": modules[1],
};

export const modulesById = {
  ...Object.fromEntries(modules.map((module) => [module.id, module])),
  ...moduleAliases,
} as Record<string, ModuleData>;

export const moduleIds = modules.map((module) => module.id);
