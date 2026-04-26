export type BlogTextBlock = {
  type: "text";
  eyebrow?: string;
  heading?: string;
  paragraphs: string[];
};

export type BlogImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  size?: "normal" | "wide";
};

export type BlogFormulaBlock = {
  type: "formula";
  heading?: string;
  formulas: {
    expression: string;
    note?: string;
  }[];
};

export type BlogListBlock = {
  type: "list";
  heading: string;
  items: string[];
  tone?: "default" | "muted";
};

export type BlogTableBlock = {
  type: "table";
  heading: string;
  columns: [string, string];
  rows: [string, string][];
};

export type BlogBlock =
  | BlogTextBlock
  | BlogImageBlock
  | BlogFormulaBlock
  | BlogListBlock
  | BlogTableBlock;

export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  status?: "ready" | "draft";
  blocks: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "batch-normalization",
    title: "Batch Normalization",
    tag: "Training stability",
    description:
      "How normalization, running statistics, gamma, and beta keep deep network activations easier to train.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/batch-normalization/batchnorm-01.png",
        alt: "Without BatchNorm and with BatchNorm activation distributions",
        caption: "Image 1: Without BatchNorm vs. With BatchNorm activation distributions.",
      },
      {
        type: "text",
        eyebrow: "Background",
        heading: "Background",
        paragraphs: [
          "Deep networks do not only process the raw input data. Each hidden layer produces activations, and those activations become the input to the next layer.",
          "During training, earlier layers keep changing, so later layers may receive signals whose scale and distribution keep shifting. This makes optimization harder because each layer is trying to learn from a moving target.",
          "Batch Normalization exists to make these internal signals more stable, which can make training faster, smoother, and less fragile.",
        ],
      },
      {
        type: "text",
        eyebrow: "Idea",
        heading: "Idea",
        paragraphs: [
          "BatchNorm looks at a mini-batch of activations inside the network. It computes the mean and variance of those activations, then normalizes them so the signal becomes more centered and consistently scaled.",
          "But BatchNorm does not simply force every signal to stay fixed forever. After normalization, it gives the model two learnable parameters: gamma for scale and beta for shift.",
          "The mental model is simple: standardize the signal, then let the network adjust it.",
        ],
      },
      {
        type: "image",
        src: "/blog/batch-normalization/batchnorm-02.png",
        alt: "Why Batch Normalization is needed",
        caption: "Image 2: Why Batch Normalization is needed.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "\\hat{x}=\\frac{x-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}}",
            note: "This standardizes the activation using mini-batch statistics.",
          },
          {
            expression: "y=\\gamma\\hat{x}+\\beta",
            note: "This lets the model learn the final scale and shift.",
          },
          {
            expression:
              "y=\\gamma\\frac{x-\\mu_{\\text{running}}}{\\sqrt{\\sigma_{\\text{running}}^2+\\epsilon}}+\\beta",
            note: "During inference, BatchNorm usually uses stored running statistics.",
          },
        ],
      },
      {
        type: "text",
        eyebrow: "Example",
        heading: "Example",
        paragraphs: [
          "Suppose one hidden feature in a mini-batch has activations x = [2, 4, 6, 8]. The mini-batch mean is mu_B = 5, and the mini-batch variance is sigma_B^2 = 5.",
          "After normalization, x-hat is approximately [-1.34, -0.45, 0.45, 1.34]. The original activations were spread around 2, 4, 6, and 8; after normalization, they are centered around 0 and placed on a more consistent scale.",
          "Now suppose BatchNorm has learned gamma = 2 and beta = 0.5. The final output becomes y = 2 x-hat + 0.5, approximately [-2.18, -0.40, 1.40, 3.18]. BatchNorm stabilizes the signal without removing flexibility.",
        ],
      },
      {
        type: "image",
        src: "/blog/batch-normalization/batchnorm-03.png",
        alt: "BatchNorm training versus inference",
        caption: "Image 3: Training vs. inference.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Input activations arrive from a hidden layer.",
          "BatchNorm computes the mini-batch mean.",
          "BatchNorm computes the mini-batch variance.",
          "The activations are normalized by subtracting the mean and dividing by the standard deviation.",
          "The model scales the normalized signal with gamma.",
          "The model shifts the signal with beta.",
          "The next layer receives a more stable signal.",
        ],
      },
      {
        type: "table",
        heading: "Pros",
        columns: ["Pros", "Why it helps"],
        rows: [
          ["More stable training", "Hidden activations stay within a more controlled range."],
          ["Often allows larger learning rates", "The optimizer can take bigger steps without the signal becoming too unstable."],
          ["Helps deep networks train more reliably", "Later layers receive inputs that shift less dramatically during training."],
          ["Mild regularization-like effect", "Mini-batch statistics vary slightly, which can add useful training noise."],
        ],
      },
      {
        type: "table",
        heading: "Cons",
        columns: ["Cons", "Why it matters"],
        rows: [
          ["Depends on reliable batch statistics", "If the mini-batch is not representative, the normalization can be noisy."],
          ["Small batch sizes can be unstable", "With too few examples, the mean and variance estimates may be poor."],
          ["Training and inference behave differently", "Training uses batch statistics, while inference uses stored running statistics."],
          ["Other methods may be better sometimes", "LayerNorm or GroupNorm can work better for small batches or sequence models."],
        ],
      },
      {
        type: "text",
        eyebrow: "Takeaway",
        heading: "Takeaway",
        paragraphs: [
          "BatchNorm is an internal signal stabilizer. It standardizes hidden activations, then learns the best scale and shift using gamma and beta.",
          "The key idea is to make the signal easier to train on without removing the model's flexibility.",
        ],
      },
    ],
  },
  {
    slug: "residual-block-resnet-intuition",
    title: "Residual Block / ResNet Intuition",
    tag: "CNN architecture",
    description:
      "Why skip connections help information and gradients move through deeper networks more reliably.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/residual-block-resnet-intuition/Residual%20Block%20%20ResNet%20Intuition_image1.png",
        alt: "Plain deep network versus ResNet shortcut",
        caption: "Image 1: Plain deep network vs. ResNet shortcut.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "As neural networks get deeper, you might expect them to always perform better, because more layers mean more learning capacity. But in practice, plain deep networks can become harder to train.",
          "After a certain depth, adding more layers can actually make the training error go up, not down. That is the key warning sign.",
          "This problem is called the degradation problem. It is not the same as overfitting. In overfitting, training error is low but test error gets worse. In degradation, even the training process itself becomes worse as depth increases, which tells us the problem is mainly about optimization.",
          "Residual blocks were introduced to make deep networks easier to optimize. Instead of forcing every few layers to learn a complete new transformation, ResNet lets a block learn only the extra change that should be added to the input.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "A normal block tries to learn the full mapping H(x). A residual block changes the question.",
          "Instead of asking what whole output should be created, it asks what correction should be added to the input.",
          "That correction is called F(x). If the block is useful, it learns a meaningful correction. If the block is not useful, it can make F(x) very small and simply pass the input forward.",
          "The shortcut path also gives information and gradients a more direct path through the network. During backpropagation, the gradient can move through the identity shortcut in addition to the main transformation path.",
        ],
      },
      {
        type: "image",
        src: "/blog/residual-block-resnet-intuition/Residual%20Block%20%20ResNet%20Intuition_image2.png",
        alt: "Residual block learns the correction, not the whole mapping",
        caption: "Image 2: Learn the correction, not the whole mapping.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "H(x)",
            note: "The full desired mapping the block would ideally learn.",
          },
          {
            expression: "F(x)=H(x)-x",
            note: "The residual function represents the correction learned by the main path.",
          },
          {
            expression: "y=x+F(x)",
            note: "The residual block adds the shortcut input to the learned correction.",
          },
          {
            expression: "y=W_sx+F(x)",
            note: "If dimensions do not match, a shortcut projection reshapes the input before addition.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "x: input to the residual block.",
          "H(x): the full desired mapping the block would ideally learn.",
          "F(x): the residual correction learned by the main path.",
          "y: final output after adding the shortcut and the residual.",
          "W_s: projection matrix or shortcut transform used when dimensions do not match.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Imagine a block receives the feature representation x = [2.0, 1.5, 0.8]. A normal block would try to directly produce the final desired output H(x) = [2.3, 1.4, 1.0].",
          "The residual block instead learns the difference F(x) = H(x) - x = [0.3, -0.1, 0.2]. Then the output is y = x + F(x) = [2.3, 1.4, 1.0].",
          "This is easier to understand because the block is not rebuilding everything from scratch. It is only increasing the first feature a bit, decreasing the second feature a bit, and increasing the third feature a bit.",
          "If the extra layers are not helping much, the block can learn a very small correction. That means a residual block can behave like a small correction module instead of forcing every block to invent a completely new representation.",
        ],
      },
      {
        type: "image",
        src: "/blog/residual-block-resnet-intuition/Residual%20Block%20%20ResNet%20Intuition_image3.png",
        alt: "Inside one residual block workflow",
        caption: "Image 3: Inside one residual block.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Input arrives: the block receives input x.",
          "Main path works: a few layers on the main path compute the residual function F(x).",
          "Skip path carries the input: the shortcut path keeps x available.",
          "Addition happens: the block adds the two paths together as y = x + F(x).",
          "Output moves forward: the result y is sent to the next block.",
          "If shapes differ: the skip path first transforms the input using W_s, then adds it as y = W_sx + F(x).",
        ],
      },
      {
        type: "list",
        heading: "Pros",
        items: [
          "Enables much deeper networks to train successfully.",
          "Reduces the degradation problem by making optimization easier.",
          "Helps gradient flow through identity shortcuts.",
          "Lets blocks learn corrections instead of full transformations.",
        ],
      },
      {
        type: "list",
        heading: "Cons",
        items: [
          "Does not automatically prevent overfitting.",
          "Deeper is not always better if the overall design is poor.",
          "Dimensions must match before addition, so some blocks need projection shortcuts.",
          "Still needs good architecture, normalization, and optimization to work well.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "ResNet does not mean skip learning. It means make learning easier. Each residual block keeps an identity path for the input and learns only the correction it wants to add.",
          "That simple idea makes very deep networks much more trainable. Instead of rebuilding everything at every block, the network can preserve useful information and refine it step by step.",
        ],
      },
    ],
  },
  {
    slug: "vanishing-gradient-problem",
    title: "Vanishing Gradient Problem",
    tag: "Sequence limits",
    description:
      "Why gradients can shrink across many layers or timesteps, and why long-range learning becomes difficult.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/vanishing-gradient-problem/Vanishing%20Gradient%20Problem_image1.png",
        alt: "Learning signal fades backward through deep layers",
        caption: "Image 1: The learning signal can become smaller as it travels backward.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "Deep networks are powerful because they stack many layers. Each layer transforms the input a little more, helping the model build richer representations.",
          "But learning does not only move forward. During training, the model also sends gradients backward from the loss to earlier layers. These gradients are the learning signals that tell each weight how to change.",
          "In a very deep network, the backward signal must pass through many layers. If each layer shrinks it a little, the signal can become extremely small by the time it reaches the early layers.",
          "That means later layers may keep learning, while early layers receive tiny updates and barely change. This is the vanishing gradient problem.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "The core idea is: the learning signal fades as it travels backward.",
          "During backpropagation, gradients are passed backward using the chain rule. Each step multiplies the gradient by a local derivative.",
          "If many of those derivatives are smaller than 1, the gradient keeps shrinking: small x small x small x small becomes very small.",
          "The problem is not that the model has no gradient anywhere. The problem is that the gradient becomes too small by the time it reaches earlier layers.",
          "Sigmoid and tanh saturation can make this worse, because their derivatives can become very small. This does not mean sigmoid is always bad; the issue is that many small derivatives multiplied together can shrink the backward signal.",
        ],
      },
      {
        type: "image",
        src: "/blog/vanishing-gradient-problem/Vanishing%20Gradient%20Problem_image2.png",
        alt: "Repeated multiplication shrinks gradients",
        caption: "Image 2: Repeated multiplication by small derivatives can make gradients fade.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "w\\leftarrow w-\\eta\\frac{\\partial J}{\\partial w}",
            note: "Gradient descent updates a weight using the gradient of the loss.",
          },
          {
            expression:
              "\\frac{\\partial J}{\\partial h_l}=\\frac{\\partial J}{\\partial h_N}\\prod_{k=l+1}^{N}\\frac{\\partial h_k}{\\partial h_{k-1}}",
            note: "Backpropagation sends gradients backward through repeated multiplication.",
          },
          {
            expression: "0.5^{10}\\approx 0.001",
            note: "Even a moderately small factor can shrink quickly when multiplied many times.",
          },
          {
            expression: "\\sigma'(z)=\\sigma(z)(1-\\sigma(z)),\\quad \\sigma'(z)\\leq 0.25",
            note: "Sigmoid derivatives are at most 0.25, so repeated sigmoid-like derivatives can shrink gradients.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "J: loss function.",
          "w: model weight.",
          "eta: learning rate.",
          "partial J / partial w: gradient of the loss with respect to a weight.",
          "h_l: activation or representation at layer l.",
          "h_N: activation or representation at final layer N.",
          "partial h_k / partial h_{k-1}: local derivative from one layer to the previous layer.",
          "prod: product or repeated multiplication.",
          "sigma(z): sigmoid activation.",
          "sigma'(z): derivative of sigmoid.",
          "N: final layer index.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Imagine a 6-layer network. The output layer starts with a gradient of 1.0.",
          "As the gradient moves backward, each layer multiplies it by a local derivative of 0.25.",
          "Layer 6 starts at 1.0000. Layer 5 receives 1.0 x 0.25 = 0.2500. Layer 4 receives 0.2500 x 0.25 = 0.0625. Layer 3 receives 0.0156. Layer 2 receives 0.0039. Layer 1 receives about 0.0010.",
          "By the time the gradient reaches Layer 1, it is close to zero.",
          "If the learning rate is eta = 0.01, then the update is 0.01 x 0.001 = 0.00001. That is a very small change.",
          "The early layer is technically learning, but it is learning so slowly that progress can feel almost frozen.",
        ],
      },
      {
        type: "image",
        src: "/blog/vanishing-gradient-problem/Vanishing%20Gradient%20Problem_image3.png",
        alt: "Vanishing gradient workflow",
        caption: "Image 3: Gradients move backward, shrink through local derivatives, and leave early layers with tiny updates.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "A deep network makes a prediction.",
          "The loss measures how wrong the prediction is.",
          "Backpropagation sends gradients from the output layer backward.",
          "Each layer multiplies the gradient by its local derivative.",
          "If many local derivatives are smaller than 1, the gradient shrinks.",
          "Early layers receive very small gradients.",
          "Their weights update very little.",
          "The network learns slowly or fails to learn useful early features.",
        ],
      },
      {
        type: "list",
        heading: "Why Understanding It Helps",
        items: [
          "Explains why very deep networks can be hard to train.",
          "Helps beginners understand why activation choice matters.",
          "Explains why good initialization is important.",
          "Shows why residual connections and skip connections help gradients flow.",
          "Helps diagnose why early layers may learn slowly.",
        ],
      },
      {
        type: "list",
        heading: "Limitations of This Explanation",
        items: [
          "Not every training failure is caused by vanishing gradients.",
          "Small gradients can also come from poor learning rates, bad initialization, or saturated activations.",
          "The opposite problem, exploding gradients, can also happen.",
          "ReLU-like activations, normalization, residual connections, and gated architectures can reduce the problem, but they do not make training automatically easy.",
          "This explanation focuses on the problem, not the full set of modern solutions.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "The vanishing gradient problem happens when the learning signal becomes smaller as it travels backward through many layers.",
          "When early layers receive tiny gradients, their weights barely update.",
          "If the backward signal keeps being multiplied by small numbers, learning fades.",
        ],
      },
    ],
  },
  {
    slug: "word-embeddings",
    title: "Word Embeddings",
    tag: "Representation",
    description:
      "How words become vectors that can capture semantic similarity, direction, and reusable language structure.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/word-embeddings/Word%20Embeddings_image1.png",
        alt: "Words represented as vectors in an embedding space",
        caption: "Image 1: Turning symbolic words into learned vectors.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "Neural networks cannot work directly with the word cat as a word. Models expect numbers, but text is symbolic.",
          "A simple one-hot encoding can assign each word an ID, yet that representation makes every term equally distant. There is no reason for the model to know that cat and dog are related while cat and apple are not.",
          "Word embeddings solve this problem by giving each word a dense vector learned from data. In this space, similar words appear closer together, allowing the network to infer meaning from distances.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "The core idea of word embeddings is that every word becomes a point in a multi-dimensional meaning space.",
          "Words used in similar contexts tend to end up near one another. The absolute numbers in a vector are not a dictionary definition; the information lies in the relative positions and directions between vectors.",
          "The embedding layer inside a neural network can be viewed as a learned lookup table mapping token IDs to vectors.",
        ],
      },
      {
        type: "image",
        src: "/blog/word-embeddings/Word%20Embeddings_image2.png",
        alt: "Embedding matrix lookup table",
        caption: "Image 2: The embedding layer maps token IDs to vector rows.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "E\\in\\mathbb{R}^{V\\times d}",
            note: "The embedding matrix has one row per token and d columns for the embedding dimension.",
          },
          {
            expression: "e_i=E[i]",
            note: "To obtain the vector for token ID i, take the i-th row of E.",
          },
          {
            expression: "e_i=x_iE",
            note: "If the token is represented as a one-hot vector, lookup can be written as matrix multiplication.",
          },
          {
            expression: "\\text{sim}(a,b)=\\frac{a\\cdot b}{\\|a\\|\\|b\\|}",
            note: "Cosine similarity is a common way to compare two embedding vectors.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "V: size of the vocabulary.",
          "d: embedding dimension, or the length of each vector.",
          "E: the embedding matrix of shape V by d.",
          "i: token ID or index of a word in the vocabulary.",
          "E[i] or e_i: the embedding vector for token i.",
          "x_i: one-hot vector with a 1 at position i and zeros elsewhere.",
          "a and b: two embedding vectors being compared.",
          "sim(a,b): cosine similarity between vectors a and b.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Consider a tiny vocabulary: cat, dog, king, queen, and apple. Assign token IDs as cat = 0, dog = 1, king = 2, queen = 3, apple = 4.",
          "For illustration, imagine a two-dimensional embedding matrix where cat is [0.20, 0.80], dog is [0.25, 0.75], king is [0.85, 0.20], queen is [0.80, 0.25], and apple is [-0.30, 0.40].",
          "In this simplified space, cat and dog lie close together; king and queen are near each other; apple is far from both groups.",
          "Now take the short sentence cat dog. Tokenising and converting to IDs gives [0, 1]. Looking up each ID yields a 2 by d matrix of vectors, which is what the neural network receives instead of the raw words.",
          "Real embeddings have hundreds of dimensions and are learned from large corpora. This 2D example is a teaching tool, not a trained model.",
        ],
      },
      {
        type: "image",
        src: "/blog/word-embeddings/Word%20Embeddings_image3.png",
        alt: "Word embeddings workflow",
        caption: "Image 3: From vocabulary and token IDs to vectors that feed the model.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Build a vocabulary: collect all distinct tokens from the data and assign each an integer ID.",
          "Convert words to IDs: tokenize a sentence and replace each word with its ID.",
          "Store embeddings in a matrix: initialize or load an embedding matrix E of size V by d.",
          "Look up vectors: for each token ID i, take the row E[i] to get its embedding vector.",
          "Create a matrix for the sentence: a sentence of T tokens becomes a T by d matrix of vectors.",
          "Feed into the model: pass the sequence of vectors into the rest of the neural network.",
          "Train and update: backpropagation updates the embedding matrix so vectors move to more useful positions.",
        ],
      },
      {
        type: "list",
        heading: "Pros",
        items: [
          "Turns symbolic words into numerical vectors a neural network can process.",
          "Dense vectors are much smaller than sparse one-hot vectors.",
          "Words used in similar contexts often acquire similar vectors, enabling the model to generalize.",
          "Pretrained embeddings can transfer language knowledge to new tasks.",
        ],
      },
      {
        type: "list",
        heading: "Cons",
        items: [
          "Classic embeddings assign one vector per word, ignoring multiple meanings.",
          "Rare or unseen words may receive poor vectors.",
          "Embeddings can encode and amplify biases present in training data.",
          "A 2D plot is a projection; real embeddings live in high dimensions.",
          "High similarity in vector space does not mean the model truly understands the concept.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "Word embeddings give each word a learned position in a continuous vector space. By mapping words to numbers, they allow neural networks to compare, combine, and learn from text.",
          "The relative positions and directions among vectors encode semantic relationships, but those numbers are learned approximations, not definitions. Embeddings provide a powerful yet simple bridge between language and computation.",
        ],
      },
    ],
  },
  {
    slug: "attention-mechanism",
    title: "Attention Mechanism",
    tag: "Attention",
    description:
      "How Query, Key, and Value vectors let a model decide which tokens matter most for the current context.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/attention-mechanism/Attention%20Mechanism_image1.png",
        alt: "Why attention matters in a sequence",
        caption: "Image 1: Attention lets a model focus more strongly on the relevant context.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "In sequence tasks like translation, summarization, or language understanding, not every word is equally important at every moment.",
          "A model may need to focus strongly on one word while mostly ignoring another. Without attention, important information can be diluted, especially when the sequence is long.",
          "Attention gives the model a way to dynamically decide which pieces of information matter most for the current token or current step. Instead of treating all inputs equally, it computes relevance scores, turns them into weights, and uses those weights to gather useful context.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "Attention answers one simple question: what should I focus on right now?",
          "The current token creates a query, which represents what it is looking for. Every token has a key, which represents what kind of information it can offer.",
          "The query is compared with the keys to produce attention scores. These scores are turned into attention weights, and the weights are used to combine the values, which contain the information being passed forward.",
          "The result is a context-aware representation. It does not just represent the token alone; it represents the token plus the most relevant surrounding information.",
        ],
      },
      {
        type: "image",
        src: "/blog/attention-mechanism/Attention%20Mechanism_image2.png",
        alt: "Query, key, value and attention weights",
        caption: "Image 2: Query compares with keys, scores become weights, and weights combine values.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "s_{ij}=q_i\\cdot k_j",
            note: "A simple dot product measures how similar a query is to a key.",
          },
          {
            expression: "a_{ij}=\\frac{q_i\\cdot k_j}{\\sqrt{d_k}}",
            note: "Scaled dot-product attention divides by the key dimension scale to keep scores stable.",
          },
          {
            expression: "\\alpha_{ij}=\\frac{\\exp(a_{ij})}{\\sum_m \\exp(a_{im})}",
            note: "Softmax converts scaled scores into attention weights.",
          },
          {
            expression: "c_i=\\sum_j \\alpha_{ij}v_j",
            note: "The final context vector is a weighted combination of value vectors.",
          },
          {
            expression:
              "\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V",
            note: "The matrix form applies the same process to all tokens at once.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "q_i: query vector for token i.",
          "k_j: key vector for token j.",
          "v_j: value vector for token j.",
          "s_ij: raw dot-product score from token i to token j.",
          "a_ij: scaled attention score from token i to token j.",
          "alpha_ij: normalized attention weight from token i to token j.",
          "c_i: output or context vector for token i.",
          "Q, K, V: matrices collecting all queries, keys, and values.",
          "d_k: key dimension used for scaling.",
          "softmax: turns raw scores into weights that sum to 1.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Consider the sentence: The animal did not cross the street because it was tired.",
          "The token it needs context. It should connect more strongly to animal than to less relevant words like the. Attention helps the model build this connection.",
          "First, the token it produces a query vector. Every word in the sentence has a key vector and a value vector. The query for it is compared with the keys of all words, and more relevant words receive larger attention scores.",
          "After softmax, the scores become attention weights. Since animal has a large weight, its information contributes strongly to the new context vector for it.",
        ],
      },
      {
        type: "table",
        heading: "Example Attention Pattern",
        columns: ["Word", "Attention weight for it"],
        rows: [
          ["The", "0.03"],
          ["animal", "0.45"],
          ["did", "0.04"],
          ["not", "0.05"],
          ["cross", "0.06"],
          ["street", "0.12"],
          ["because", "0.06"],
          ["it", "0.10"],
          ["tired", "0.04"],
        ],
      },
      {
        type: "image",
        src: "/blog/attention-mechanism/Attention%20Mechanism_image3.png",
        alt: "Attention mechanism workflow",
        caption: "Image 3: Input vectors become Q/K/V, scores become weights, and values combine into context.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Start with input representations, usually from an embedding layer.",
          "Create query, key, and value vectors for each token.",
          "Compare the query with each key, often using dot products.",
          "Apply softmax so raw scores become attention weights that sum to 1.",
          "Multiply each value vector by its attention weight.",
          "Add the weighted value vectors together to produce a context-aware output.",
          "Pass the result forward to the next layer or computation stage.",
        ],
      },
      {
        type: "list",
        heading: "Pros",
        items: [
          "Focuses on the most relevant information.",
          "Handles long-range relationships better than fixed-context methods.",
          "Produces context-aware representations.",
          "Flexible and widely useful in sequence modeling.",
        ],
      },
      {
        type: "list",
        heading: "Cons",
        items: [
          "Can be computationally expensive for long sequences.",
          "Attention weights do not equal true human understanding.",
          "Poor scoring can still focus on unhelpful information.",
          "The mechanism can look simple but still be hard to interpret fully.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "Attention lets a model decide what matters most right now. It compares relevance, assigns weights, and combines information into a better context-aware representation.",
          "The core idea is simple: score what matters, weight it, then gather the useful information.",
        ],
      },
    ],
  },
  {
    slug: "add-and-norm",
    title: "Add & Norm",
    tag: "Transformer block",
    description:
      "How residual addition and normalization stabilize transformer layers after attention or feed-forward steps.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/add-and-norm/Add%20%26%20Norm_image1.png",
        alt: "Why Add and Norm exists",
        caption: "Image 1: Add keeps information, and Norm keeps the scale stable.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "Deep models transform representations many times.",
          "Each block takes an input, changes it, and passes the result forward. This is powerful, but it also creates a risk: useful signal can gradually become distorted, too large, too small, or harder for later blocks to use.",
          "Add & Norm is a small stabilizing step that helps control this. The Add part brings the original input back through a residual connection, so the model does not have to rely only on the transformed version.",
          "The Norm part applies Layer Normalization, which keeps the combined representation balanced before it moves forward.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "Add & Norm combines two helpful ideas.",
          "Add means the original input is added back to the sublayer output. Instead of replacing the input completely, the block keeps a shortcut path for the original representation.",
          "Norm means the combined vector is normalized using Layer Normalization. This keeps the feature values in a more stable range.",
          "LayerNorm is often preferred in sequence models because it normalizes each token representation across features instead of relying on batch statistics.",
          "The mental picture is simple: original signal plus new transformation becomes a balanced output.",
        ],
      },
      {
        type: "image",
        src: "/blog/add-and-norm/Add%20%26%20Norm_image2.png",
        alt: "Residual addition plus layer normalization",
        caption: "Image 2: The original signal and sublayer output are added, then normalized.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "y=\\mathrm{LayerNorm}\\left(x+\\mathrm{Sublayer}(x)\\right)",
            note: "The main Add & Norm operation adds the residual path and normalizes the result.",
          },
          {
            expression: "z=x+\\mathrm{Sublayer}(x)",
            note: "Residual addition creates a combined vector.",
          },
          {
            expression:
              "\\mathrm{LayerNorm}(z)=\\gamma\\odot\\frac{z-\\mu}{\\sqrt{\\sigma^2+\\epsilon}}+\\beta",
            note: "LayerNorm normalizes the combined vector, then applies learned scale and shift.",
          },
          {
            expression: "\\mu=\\frac{1}{d}\\sum_{k=1}^{d}z_k",
            note: "The mean is computed across the features of the token vector.",
          },
          {
            expression: "\\sigma^2=\\frac{1}{d}\\sum_{k=1}^{d}(z_k-\\mu)^2",
            note: "The variance is also computed across the token features.",
          },
          {
            expression: "\\mathrm{LayerNorm}\\left(x+\\mathrm{Sublayer}(x)\\right)",
            note: "This beginner-friendly version focuses on the post-sublayer Add & Norm step.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "x: original input representation.",
          "Sublayer(x): output of a sublayer, such as attention or feed-forward.",
          "z: combined result after residual addition.",
          "y: final Add & Norm output.",
          "d: number of features in one token vector.",
          "z_k: the k-th feature of z.",
          "mu: mean of the features in z.",
          "sigma^2: variance of the features in z.",
          "epsilon: small constant that avoids division by zero.",
          "gamma: learned scale parameter.",
          "beta: learned shift parameter.",
          "odot: element-wise multiplication.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Suppose one token has this 3-dimensional input vector: x = [1.0, 2.0, 3.0].",
          "The sublayer adds new information: Sublayer(x) = [0.5, -1.0, 1.5].",
          "First, add the original input back: z = x + Sublayer(x), so z = [1.5, 1.0, 4.5].",
          "The mean is approximately 2.33, and the variance is approximately 2.39.",
          "After normalization, (z - mu) / sqrt(sigma^2 + epsilon) is approximately [-0.54, -0.86, 1.40]. If gamma = 1 and beta = 0, the output is y approximately [-0.54, -0.86, 1.40].",
          "The original input is not thrown away. The sublayer adds new information, and LayerNorm keeps the result easier for the next block to process.",
        ],
      },
      {
        type: "image",
        src: "/blog/add-and-norm/Add%20%26%20Norm_image3.png",
        alt: "Add and Norm workflow",
        caption: "Image 3: Input flows through a sublayer, residual addition, LayerNorm, and stable output.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Start with an input representation x.",
          "Pass x through a sublayer, such as attention or feed-forward.",
          "Get the sublayer output Sublayer(x).",
          "Add the original input back: z = x + Sublayer(x).",
          "Normalize z across its feature dimension using LayerNorm.",
          "Apply learned scale and shift using gamma and beta.",
          "Send the stable output y to the next block.",
        ],
      },
      {
        type: "text",
        heading: "Shape Rule",
        paragraphs: [
          "The important shape rule is simple: x and Sublayer(x) must have the same shape, because they are added element by element.",
        ],
      },
      {
        type: "list",
        heading: "Pros",
        items: [
          "Preserves the original input through a residual path.",
          "Helps gradients flow through deep networks.",
          "Makes each block output scale more stable.",
          "Helps Transformer-style blocks stack more reliably.",
          "Reduces the chance that one sublayer completely distorts the representation.",
        ],
      },
      {
        type: "list",
        heading: "Cons",
        items: [
          "Adds extra computation and learned parameters.",
          "Requires matching shapes between x and Sublayer(x).",
          "LayerNorm stabilizes activations, but it does not solve every training problem.",
          "Different models may place normalization before or after the sublayer, which can confuse beginners.",
          "Add & Norm is useful, but it does not explain the full Transformer by itself.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "Add & Norm keeps Transformer-style blocks stable.",
          "The Add step preserves the original signal by adding the input back to the sublayer output. The Norm step keeps the combined representation balanced before it moves forward.",
          "Add keeps the signal; Norm keeps it stable.",
        ],
      },
    ],
  },
  {
    slug: "self-attention-vs-rnn-vs-cnn",
    title: "Self-Attention vs RNN vs CNN",
    tag: "Architecture comparison",
    description:
      "Compare how sequence order, receptive field, parallelism, and context flow differ across the three families.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/self-attention-vs-rnn-vs-cnn/Self-Attention%20vs%20RNN%20vs%20CNN_image1.png",
        alt: "Three ways to move information through a sequence",
        caption: "Image 1: RNNs pass information step by step, CNNs expand from local windows, and self-attention connects tokens directly.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "Natural language, time-series, and other sequential data are not just lists of independent items. The meaning of a word like it in a sentence depends on surrounding words.",
          "Without a way to share information across positions, a model cannot resolve pronouns, capture long-term dependencies, or detect patterns that unfold over time.",
          "RNNs, CNNs, and self-attention all answer the same question: how should information move across a sequence?",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "RNNs use sequential memory. Information moves step by step, and each hidden state carries a running summary of what has been seen so far.",
          "CNNs use local window expansion. Convolutional filters first read nearby tokens, and deeper layers expand the receptive field.",
          "Self-attention uses direct global interaction. Each token compares itself with every other token and decides which positions matter most.",
        ],
      },
      {
        type: "image",
        src: "/blog/self-attention-vs-rnn-vs-cnn/Self-Attention%20vs%20RNN%20vs%20CNN_image2.png",
        alt: "Core formulas and intuitive cards for RNN, CNN and self-attention",
        caption: "Image 2: Each architecture answers the same question: how should information move through a sequence?",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "h_t=f\\left(W_xx_t+W_hh_{t-1}+b\\right)",
            note: "RNNs update a hidden state from the current input and the previous hidden state.",
          },
          {
            expression: "y_t=\\sum_{i=-k}^{k}W_i\\,x_{t+i}",
            note: "CNNs combine tokens inside a local sliding window.",
          },
          {
            expression:
              "\\text{Attention}(Q,K,V)=\\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
            note: "Self-attention compares queries and keys, then combines values using learned weights.",
          },
          {
            expression: "\\alpha_{ij}=\\text{softmax}(q_i\\cdot k_j),\\quad z_i=\\sum_j\\alpha_{ij}v_j",
            note: "For one token, attention weights decide how much each other token contributes to its context vector.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "x_t: input vector at position t.",
          "h_t: hidden state at position t in an RNN.",
          "W_x and W_h: learnable weight matrices for input and hidden state.",
          "y_t: output of a CNN at position t.",
          "W_i: convolution filter weight for offset i.",
          "Q, K, V: query, key, and value matrices.",
          "q_i, k_j, v_j: query for token i and key/value for token j.",
          "d_k: dimension of the key vectors.",
          "alpha_ij: attention weight from token i to token j.",
          "z_i: output context vector at position i.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Consider the sentence: The animal did not cross the street because it was tired. The word it refers to the animal, not the street.",
          "An RNN carries information forward through hidden states. By the time the model reaches it, earlier words influence the hidden state indirectly, but their influence can fade as the sequence grows.",
          "A CNN with a small kernel first sees local neighbours such as because it was. To connect it to animal, the model needs stacked layers or larger receptive fields.",
          "Self-attention lets the token it directly assign high weight to animal and lower weight to unrelated words. This direct link makes long-distance dependencies easier to capture.",
        ],
      },
      {
        type: "image",
        src: "/blog/self-attention-vs-rnn-vs-cnn/Self-Attention%20vs%20RNN%20vs%20CNN_image3.png",
        alt: "Workflows showing context flow for token it in RNN, CNN and self-attention",
        caption: "Image 3: The RNN summarizes the past, the CNN expands its receptive field, and self-attention directly attends to relevant words.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "RNN: read tokens one by one, update the hidden state, and use the accumulated state to contextualize the target token.",
          "CNN: slide a kernel over local windows, compute local combinations in parallel, and stack layers to expand the receptive field.",
          "Self-attention: compute query, key, and value vectors for each token, compare all token pairs, softmax the scores, and combine value vectors into context vectors.",
          "For self-attention, positional information must be added so the model knows which token came first.",
        ],
      },
      {
        type: "table",
        heading: "Pros & Cons",
        columns: ["Method", "Trade-off"],
        rows: [
          [
            "RNN",
            "Natural for ordered and streaming data, but difficult to parallelize and weaker on very long dependencies.",
          ],
          [
            "CNN",
            "Efficient and good at local patterns, but distant dependencies require depth, dilation, or larger kernels.",
          ],
          [
            "Self-attention",
            "Directly links all token pairs and parallelizes well, but has quadratic cost and needs positional encoding.",
          ],
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "RNNs, CNNs, and self-attention are three complementary ways to build context in sequence data.",
          "An RNN carries information step by step, a CNN expands from local windows through depth, and self-attention lets each token look directly at every other token.",
          "The right choice depends on the task, the sequence length, and computational constraints.",
        ],
      },
    ],
  },
  {
    slug: "transfer-learning",
    title: "Transfer Learning",
    tag: "Model reuse",
    description:
      "How pretrained features can be reused, adapted, and fine-tuned for a smaller or more specific target task.",
    status: "ready",
    blocks: [
      {
        type: "image",
        src: "/blog/transfer-learning/Transfer%20Learning_image1.png",
        alt: "Large pretrained model reused for a smaller new task",
        caption: "Image 1: We do not start from zero.",
      },
      {
        type: "text",
        heading: "Background",
        paragraphs: [
          "Training a deep model from scratch usually needs a large labeled dataset, strong compute, and many rounds of tuning.",
          "Many real projects only have a small amount of labeled data, so starting from random weights can be slow and unreliable.",
          "Transfer learning exists because knowledge learned from one large task can often help another related task. Instead of teaching a model from zero, we start with a pretrained model and adapt it to the new problem.",
        ],
      },
      {
        type: "text",
        heading: "Idea",
        paragraphs: [
          "A pretrained model has already learned useful patterns from a large dataset. We reuse most of that model as a feature extractor, then replace the old prediction layer with a new head for our task.",
          "At first, we often freeze the earlier layers so their weights do not change. Then we train only the new head, because it needs to learn the new labels.",
          "Later, we may fine-tune some deeper layers carefully if the new task needs more adaptation. The mental model is simple: reuse general knowledge, learn only what is new.",
        ],
      },
      {
        type: "image",
        src: "/blog/transfer-learning/Transfer%20Learning_image2.png",
        alt: "Frozen pretrained backbone with a new trainable head",
        caption: "Image 2: Reuse general features, learn task-specific output.",
      },
      {
        type: "formula",
        heading: "Formula",
        formulas: [
          {
            expression: "h_{\\text{pretrained}}(x)=\\text{features}",
            note: "The pretrained model turns the input into reusable features.",
          },
          {
            expression: "\\hat{y}=g_{\\text{new}}\\left(h_{\\text{pretrained}}(x)\\right)",
            note: "The new head maps pretrained features to the new task prediction.",
          },
          {
            expression: "\\theta=[\\theta_{\\text{frozen}},\\ \\theta_{\\text{trainable}}]",
            note: "Frozen parameters stay fixed, while trainable parameters are updated for the new task.",
          },
        ],
      },
      {
        type: "list",
        heading: "Symbols",
        items: [
          "x: input example, such as an image.",
          "h_pretrained: pretrained feature extractor.",
          "g_new: new task-specific head.",
          "y-hat: prediction for the new task.",
          "theta_frozen: parameters kept fixed during training.",
          "theta_trainable: parameters updated for the new task.",
        ],
      },
      {
        type: "text",
        heading: "Example",
        paragraphs: [
          "Suppose a beginner wants to build a cat vs dog classifier, but only has 500 labeled images. Training a CNN from scratch with only 500 images may cause the model to memorize the training set instead of learning useful visual patterns.",
          "A better starting point is to use a model pretrained on ImageNet. The model has already seen millions of images and learned general visual features such as edges, textures, fur-like shapes, and object parts.",
          "The old ImageNet head predicts 1,000 classes, so we remove it. We keep the convolutional backbone and add a new binary classification head that predicts only cat or dog.",
          "At first, the backbone is frozen and only the new head is trained. Later, we may unfreeze the last few blocks and fine-tune them with a small learning rate.",
        ],
      },
      {
        type: "image",
        src: "/blog/transfer-learning/Transfer%20Learning_image3.png",
        alt: "Transfer learning workflow",
        caption: "Image 3: Transfer learning is a practical training pipeline.",
      },
      {
        type: "list",
        heading: "Workflow",
        items: [
          "Choose a pretrained model trained on a large dataset.",
          "Remove or ignore the old task head.",
          "Keep the pretrained backbone as a feature extractor.",
          "Add a new head for the new task.",
          "Freeze the backbone first to protect useful pretrained features.",
          "Train the new head.",
          "Fine-tune selected layers if the task needs more adaptation.",
          "Evaluate on validation or test data.",
        ],
      },
      {
        type: "list",
        heading: "Pros",
        items: [
          "Needs less labeled data.",
          "Trains faster than starting from scratch.",
          "Often works better on small datasets.",
          "Reuses general visual features.",
          "Saves compute.",
        ],
      },
      {
        type: "list",
        heading: "Cons",
        items: [
          "Works best when source and target tasks are related.",
          "Can fail when the new domain is very different.",
          "Fine-tuning too much can overfit.",
          "Freezing too much can underfit.",
          "Pretrained models may carry bias.",
        ],
      },
      {
        type: "text",
        heading: "Takeaway",
        paragraphs: [
          "Transfer learning is about reusing useful knowledge instead of starting from zero.",
          "The model keeps general features from a pretrained backbone and learns a new task-specific head. It is especially useful when the new dataset is small but related to what the pretrained model has already learned.",
        ],
      },
    ],
  },
];

export const blogPostsBySlug = Object.fromEntries(blogPosts.map((post) => [post.slug, post])) as Record<
  string,
  BlogPost
>;
