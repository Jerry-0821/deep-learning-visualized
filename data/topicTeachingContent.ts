export type FormulaNote = {
  expression: string;
  explanation: string;
  tone?: "equation" | "statement";
};

export type TopicTeachingContent = {
  canonicalTitle: string;
  sourceDocument:
    | "deep_learning_visualization_rebuilt_v3.pdf"
    | "deep_learning_content_part2_rewritten.pdf";
  background: string[];
  formulas: FormulaNote[];
  pros: string[];
  cons: string[];
  quickExample: string;
  commonMistake: string;
};

export const topicTeachingContentBySlug: Record<string, TopicTeachingContent> = {
  "neuron-structure": {
    canonicalTitle: "Single Neuron Forward Pass",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "A single neuron is the fundamental building block of a neural network. It receives one or more input signals, multiplies each by a weight that controls how influential that input is, adds a bias term to shift the result, and then passes the weighted sum through an activation function to produce an output. This forward-pass sequence turns raw input values into an internal representation the network can use.",
      "On its own, a single neuron is still a linear model before the activation is applied. That is why a neuron is simple but important: by stacking many neurons with nonlinear activations, we move from a single weighted sum to a flexible model that can learn much richer patterns.",
    ],
    formulas: [
      {
        expression: "z = &sum;<sub>i=1</sub><sup>n</sup> w<sub>i</sub>x<sub>i</sub> + b",
        explanation: "The neuron first computes a weighted sum of its inputs and adds a bias.",
      },
      {
        expression: "a = &sigma;(z)",
        explanation: "The activation function transforms the weighted sum into the neuron output.",
      },
    ],
    pros: [
      "Forms the basic computational unit of feed-forward neural networks and deeper architectures.",
      "Weighted inputs plus bias provide a flexible linear template for learning relative input importance.",
      "When combined with nonlinear activations and multiple layers, neurons support universal function approximation.",
    ],
    cons: [
      "A single neuron alone cannot model complex nonlinear relationships.",
      "Without a nonlinear activation, stacking many linear neurons still behaves like one linear transformation.",
      "A small neuron set can underfit complex data, while a large one requires careful initialization and regularization.",
    ],
    quickExample:
      "Let x1 = 1, x2 = 2, w1 = 0.5, w2 = -1.0, and b = 0.1. The weighted sum becomes z = -1.4, and passing that through a sigmoid gives a value close to 0.20.",
    commonMistake:
      "Beginners often forget the bias term and treat the neuron as only a weighted input sum. Another common mistake is to ignore the role of nonlinearity: if every activation is linear, stacking neurons does not create a more expressive network.",
  },
  "activation-functions-comparison": {
    canonicalTitle: "Activations",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Activation functions introduce nonlinearity into a neural network, allowing it to model complex relationships instead of collapsing into a single linear mapping. After a neuron computes a weighted sum, the activation decides how strongly that signal should pass forward.",
      "Different activations suit different roles. ReLU is common in hidden layers because it is cheap and usually trains well. Sigmoid and tanh are bounded, which can be useful for probabilities or centered outputs, but they can saturate and slow down learning in deep networks.",
    ],
    formulas: [
      {
        expression: "ReLU(x) = max(0, x)",
        explanation: "ReLU outputs zero for negative inputs and returns the input itself for positive inputs.",
      },
      {
        expression: "&sigma;(x) = 1 / (1 + e<sup>-x</sup>)",
        explanation: "Sigmoid maps a real-valued input to the interval (0, 1).",
      },
      {
        expression: "tanh(x) = (e<sup>x</sup> - e<sup>-x</sup>) / (e<sup>x</sup> + e<sup>-x</sup>)",
        explanation: "Hyperbolic tangent maps inputs to the interval (-1, 1) and is zero-centered.",
      },
    ],
    pros: [
      "Introduce nonlinearity so networks can model patterns beyond linear transformations.",
      "ReLU maintains a constant gradient on the positive side, which often speeds up training.",
      "Sigmoid and tanh give bounded outputs that are useful in probability or normalization settings.",
    ],
    cons: [
      "Sigmoid and tanh can saturate, producing vanishing gradients.",
      'ReLU can produce "dead neurons" if units stay inactive for all training examples.',
      "Using the wrong activation in the wrong place can slow or destabilize optimization.",
    ],
    quickExample:
      "For x = -2, ReLU gives 0, sigmoid gives about 0.12, and tanh gives about -0.96. The same weighted sum can therefore produce very different downstream behavior depending on the activation.",
    commonMistake:
      "A common error is to use the same activation everywhere without thinking about the task. For example, using a sigmoid as the final layer for a multi-class problem gives the wrong output structure, while using saturated activations too aggressively can make training slow and unstable.",
  },
  "gradient-descent-learning-rate": {
    canonicalTitle: "Gradient Descent",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Gradient descent is the optimization procedure that updates model parameters so the loss gets smaller over time. After computing predictions and a loss, the algorithm finds the gradient of that loss with respect to each parameter and moves parameters in the opposite direction.",
      "The learning rate controls how large each step is. If it is too large, training can oscillate or diverge; if it is too small, learning becomes painfully slow. Variants such as batch, mini-batch, and stochastic gradient descent change how much data is used to estimate the gradient on each step.",
    ],
    formulas: [
      {
        expression: "&theta;<sup>(t+1)</sup> = &theta;<sup>(t)</sup> - &eta;&nabla;J(&theta;<sup>(t)</sup>)",
        explanation: "This is the standard parameter update rule: subtract the learning-rate-scaled gradient.",
      },
      {
        expression: "w' = w - &eta;(&part;J / &part;w), b' = b - &eta;(&part;J / &part;b)",
        explanation: "For a single neuron, each weight and the bias are updated separately using the same principle.",
      },
    ],
    pros: [
      "Conceptually simple and widely applicable to differentiable learning problems.",
      "Works well as a foundation for mini-batch and stochastic training on large datasets.",
      "Supports scalable neural network training when gradients can be computed efficiently.",
    ],
    cons: [
      "Very sensitive to the learning rate.",
      "Can stall at saddles or poor local regions in non-convex problems.",
      "Requires gradients, which may be expensive for large models or large datasets.",
    ],
    quickExample:
      "Take J(w) = w^2, so the gradient is 2w. Starting from w = 3 with learning rate 0.1, the next update is 3 - 0.1 x 2 x 3 = 2.4. Repeated updates push w toward 0.",
    commonMistake:
      "Many beginners choose a learning rate once and never test alternatives. Another frequent issue is ignoring feature scaling: when inputs differ greatly in magnitude, the optimization path can become inefficient and numerically unstable.",
  },
  "backpropagation-intuition": {
    canonicalTitle: "Backpropagation",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Backpropagation is the algorithm that efficiently computes gradients for every weight in a multi-layer neural network. It performs a forward pass to compute activations and cache intermediate values, then propagates error signals backward using the chain rule.",
      "The key idea is reuse. Instead of recomputing every derivative from scratch, each layer reuses the error term from the layer after it. This makes deep learning practical: without backpropagation, exact training of large neural networks would be prohibitively expensive.",
    ],
    formulas: [
      {
        expression:
          "&delta;<sup>[L]</sup> = &nabla;<sub>a</sub>L &odot; g'(z<sup>[L]</sup>)",
        explanation: "The output-layer error combines the loss derivative with the derivative of the activation.",
      },
      {
        expression:
          "&delta;<sup>[l]</sup> = (W<sup>[l+1]</sup>)<sup>T</sup>&delta;<sup>[l+1]</sup> &odot; g'(z<sup>[l]</sup>)",
        explanation: "Hidden-layer errors are propagated backward from later layers.",
      },
      {
        expression:
          "&part;L / &part;W<sup>[l]</sup> = &delta;<sup>[l]</sup>(a<sup>[l-1]</sup>)<sup>T</sup>",
        explanation: "Once the error term is known, the weight gradient follows directly.",
      },
    ],
    pros: [
      "Computes exact gradients efficiently by reusing cached forward-pass values.",
      "Makes gradient-based training of deep networks feasible.",
      "Adapts well to many network architectures built from differentiable components.",
    ],
    cons: [
      "Can suffer from vanishing or exploding gradients.",
      "Implementation mistakes in caching or derivative flow can create subtle bugs.",
      "Depends on differentiable building blocks or reasonable approximations.",
    ],
    quickExample:
      "In a small network with one hidden layer, the forward pass computes hidden pre-activations, hidden activations, and then the final output. Backpropagation starts from the output error term, pushes that error backward through the output weights, multiplies by the hidden activation derivative, and then forms gradients for both the output weights and the earlier hidden-layer weights.",
    commonMistake:
      "Two common errors are recomputing cached activations instead of storing them during the forward pass, and forgetting to sum gradient contributions at branches where multiple computational paths merge.",
  },
  "loss-functions": {
    canonicalTitle: "Loss Functions",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Loss functions measure how far predictions are from targets and convert that mismatch into a single scalar objective for optimization. Different tasks need different losses: regression often uses mean squared or absolute error, while classification usually uses cross-entropy losses.",
      "The choice of loss changes both the shape of the optimization landscape and the behavior of gradients. That means the loss function is not just a reporting tool; it actively shapes how the model learns.",
    ],
    formulas: [
      {
        expression:
          "L<sub>MSE</sub> = (1 / n) &sum;<sub>i=1</sub><sup>n</sup> (y&#770;<sub>i</sub> - y<sub>i</sub>)<sup>2</sup>",
        explanation: "MSE squares prediction errors, so large mistakes count more heavily.",
      },
      {
        expression:
          "L<sub>MAE</sub> = (1 / n) &sum;<sub>i=1</sub><sup>n</sup> |y&#770;<sub>i</sub> - y<sub>i</sub>|",
        explanation: "MAE measures average absolute error and is more robust to outliers than MSE.",
      },
      {
        expression:
          "L<sub>BCE</sub> = -(1 / n) &sum;<sub>i=1</sub><sup>n</sup> [y<sub>i</sub>ln p<sub>i</sub> + (1 - y<sub>i</sub>)ln(1 - p<sub>i</sub>)]",
        explanation: "Binary cross-entropy is used for binary classification and strongly penalizes confident wrong predictions.",
      },
      {
        expression:
          "L<sub>CCE</sub> = -(1 / n) &sum;<sub>i=1</sub><sup>n</sup> ln p<sub>i,true</sub>",
        explanation: "Categorical cross-entropy extends log loss to multi-class classification.",
      },
    ],
    pros: [
      "Provide differentiable objectives that directly drive training.",
      "MSE gives smooth regression gradients.",
      "Cross-entropy losses are especially effective for classification because they reward confident correct probabilities and punish confident wrong ones.",
    ],
    cons: [
      "MSE is sensitive to outliers.",
      "MAE has a non-differentiable point at zero.",
      "Using the wrong loss for the task can produce badly calibrated outputs or unstable gradients.",
    ],
    quickExample:
      "If a binary classifier predicts p = 0.1 for a positive example, the binary cross-entropy is 2.3026. If the same example is predicted as p = 0.9, the loss falls to 0.1053.",
    commonMistake:
      "A common mistake is to use MSE for classification or cross-entropy for regression without understanding the tradeoff. Another is to compute log loss with probabilities exactly equal to zero or one, which causes numerical instability unless values are clipped.",
  },
  dropout: {
    canonicalTitle: "Dropout",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Dropout is a regularization technique that reduces overfitting by randomly zeroing some activations during training. Each mini-batch effectively trains a slightly different thinned network, which discourages neurons from co-adapting too strongly.",
      "During inference, dropout is turned off and the full network is used. With inverted dropout, activations are scaled during training so no extra scaling is needed at test time.",
    ],
    formulas: [
      {
        expression: "r<sub>i</sub><sup>(l)</sup> ~ Bernoulli(1 - p)",
        explanation: "Each unit is randomly kept with probability 1 - p.",
      },
      {
        expression: "a&#771;<sup>(l)</sup> = r<sup>(l)</sup> &odot; a<sup>(l)</sup> / (1 - p)",
        explanation: "In inverted dropout, the surviving activations are divided by 1 - p to preserve their expected value.",
      },
    ],
    pros: [
      "Reduces overfitting by discouraging reliance on single features or pathways.",
      "Acts like an inexpensive ensemble of many sub-networks.",
      "Simple to apply and often useful alongside other regularization tools.",
    ],
    cons: [
      "Adds stochastic noise during training and can slow convergence.",
      "Needs tuning: too much dropout causes underfitting, too little may do almost nothing.",
      "May give limited benefit when other regularization already works well.",
    ],
    quickExample:
      "Suppose a layer outputs [0.5, 1.0, 0.8] with dropout rate p = 0.5. If the sampled mask is [1, 0, 1], then scaling by 1 / (1 - p) = 2 gives thinned activations [1.0, 0, 1.6].",
    commonMistake:
      "The most common mistake is leaving dropout active during validation or inference. Another is forgetting the inverted-dropout scaling, which makes the train-time and test-time activations inconsistent.",
  },
  "adam-vs-sgd": {
    canonicalTitle: "Adam vs SGD",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Stochastic Gradient Descent (SGD) updates parameters by moving directly in the negative gradient direction, using the same learning rate for every parameter. This makes it simple and memory-efficient, but it can zig-zag badly when the loss surface is steep in one direction and shallow in another.",
      "Momentum improves SGD by carrying part of the previous update forward, which helps smooth oscillation and maintain useful movement through narrow valleys. Adam goes further by combining momentum-like averaging with adaptive scaling based on recent squared gradients, so each parameter can receive a different effective step size. In practice, Adam often looks more stable and faster at the beginning of training, while SGD or SGD with Momentum can still be strong choices when carefully tuned. This topic is not mainly about optimizer history, but about how different update rules create visibly different trajectories on the same loss surface.",
    ],
    formulas: [
      {
        expression: "&theta; &larr; &theta; - &eta;g",
        explanation: "Plain SGD updates the parameters directly using the current gradient g and one global learning rate eta.",
      },
      {
        expression: "v &larr; &beta;v + &eta;g, &theta; &larr; &theta; - v",
        explanation: "Momentum adds a running velocity term, so the update becomes smoother and less sensitive to noisy local direction changes.",
      },
      {
        expression:
          "m<sub>t</sub> = &beta;<sub>1</sub>m<sub>t-1</sub> + (1 - &beta;<sub>1</sub>)g<sub>t</sub><br />v<sub>t</sub> = &beta;<sub>2</sub>v<sub>t-1</sub> + (1 - &beta;<sub>2</sub>)g<sub>t</sub><sup>2</sup>",
        explanation: "Adam keeps a moving average of the gradient and a moving average of squared gradients.",
      },
      {
        expression:
          "m&#770;<sub>t</sub> = m<sub>t</sub> / (1 - &beta;<sub>1</sub><sup>t</sup>), v&#770;<sub>t</sub> = v<sub>t</sub> / (1 - &beta;<sub>2</sub><sup>t</sup>)<br />&theta; &larr; &theta; - &eta;(m&#770;<sub>t</sub> / (sqrt(v&#770;<sub>t</sub>) + &epsilon;))",
        explanation: "Bias correction makes the early estimates more reliable, and the denominator shrinks updates in directions with consistently large gradient magnitude.",
      },
    ],
    pros: [
      "Plain SGD is simple, lightweight, and easy to understand as the most direct gradient-based update rule.",
      "Momentum helps reduce oscillation and usually makes the path through narrow valleys smoother.",
      "Adam often converges faster early in training because it combines directional smoothing with parameter-wise adaptive step scaling.",
    ],
    cons: [
      "Plain SGD can zig-zag badly on ravines or curved valleys, especially when one learning rate must serve every direction.",
      "Momentum adds another hyperparameter and can still overshoot if the update builds too much velocity.",
      "Adam uses more memory and can sometimes be treated as a default without enough tuning or understanding.",
    ],
    quickExample:
      "Imagine a long, narrow valley on a 3D loss surface. Plain SGD may bounce from side to side because the gradient is steep across the valley but weak along it. Momentum smooths that motion, while Adam also shrinks unstable directions automatically, so its path often looks more controlled.",
    commonMistake:
      'A common mistake is to explain Adam only as "a better SGD" without showing what it is actually doing differently. Another is to use one momentum formula in the visualization and a different notation in the notes, which can confuse beginners even if both versions are mathematically valid.',
  },
  "overfitting-vs-underfitting": {
    canonicalTitle: "Overfitting vs Underfitting",
    sourceDocument: "deep_learning_visualization_rebuilt_v3.pdf",
    background: [
      "Underfitting happens when a model is too simple to capture the real structure of the data, so both training error and validation error stay high. Overfitting happens when a model becomes too sensitive to the training set and starts fitting noise instead of signal, which usually leads to very low training error but worse validation error.",
      "These are two opposite failure modes, and the useful region sits between them: the model should be flexible enough to learn the main pattern, but not so flexible that it memorizes random fluctuations. In practice, this topic is easiest to understand by watching how model complexity changes the fitted curve and how train and validation errors move with it. More data often makes overfitting harder, because the model has to explain a broader sample instead of memorizing a few points. Regularization can also tame the fit by discouraging overly sharp or unstable solutions without necessarily changing the nominal model degree.",
    ],
    formulas: [
      {
        expression: "Expected Error = Bias<sup>2</sup> + Variance + Noise",
        explanation: "This decomposition gives the big-picture intuition: high bias is linked to models that are too simple, while high variance is linked to models that are too sensitive to training data.",
      },
      {
        expression: "E<sub>val</sub> &asymp; E<sub>train</sub> + generalization gap",
        explanation: "A small gap usually suggests better generalization, while a large gap often signals overfitting.",
      },
      {
        expression: "Best region &asymp; argmin<sub>complexity</sub> E<sub>val</sub>",
        explanation: "The practical sweet spot is the model complexity where validation error is near its minimum, not necessarily where training error is smallest.",
      },
    ],
    pros: [
      "Gives a clear way to interpret why train and validation performance can behave differently.",
      "Helps explain the role of model complexity, dataset size, and regularization in one framework.",
      "Supports practical decisions such as simplifying a model, adding data, or increasing regularization.",
    ],
    cons: [
      "The exact sweet spot is problem-dependent and often requires experimentation rather than one fixed rule.",
      "Looking only at one metric can hide whether the issue is bias, variance, or both.",
      "People often talk about the bias-variance tradeoff too abstractly and forget to connect it back to the actual train/validation curves.",
    ],
    quickExample:
      "If you fit a polynomial to noisy one-dimensional data, a degree-1 curve may miss the shape completely and underfit. A very high-degree curve may pass through almost every training point and overfit. A moderate degree often gives the lowest validation error, which is the real target.",
    commonMistake:
      'A common mistake is to judge the model only by training error. Another is to think regularization always means "make the model smaller," when in many cases it is better understood as smoothing or constraining the fit so the curve becomes less sensitive to noise.',
  },
  "train-val-test-split": {
    canonicalTitle: "Train / Val / Test Split",
    sourceDocument: "deep_learning_content_part2_rewritten.pdf",
    background: [
      "Train / val / test split is not only about percentages; it is about assigning the right job to each subset and keeping the target honest. Your prototype makes this unusually clear by showing that a split can produce a flattering dev score while still optimizing the wrong world. The training set is where the model learns parameters, but the training distribution alone does not define the final target. The validation or dev set is where you compare ideas, tune hyperparameters, and decide which direction is actually better. The test set is the final honest check and should stay closed until the end.",
      "In this prototype, the most important lesson is distribution matching: dev and test should reflect the future data you care about, even if that makes the intermediate score look worse. A high number only matters if it is both relevant to future users and still trustworthy.",
    ],
    formulas: [
      {
        expression: "Train / validation / test = three distinct roles, not three interchangeable copies of the same job",
        explanation: "The full dataset is partitioned into three subsets with different roles, not three interchangeable copies of the same job.",
        tone: "statement",
      },
      {
        expression: "Validation error vs training error helps reveal whether the model is learning structure or only fitting the training set",
        explanation: "Comparing validation error with training error helps reveal whether the model is learning useful structure or only fitting the training set.",
        tone: "statement",
      },
      {
        expression: "Repeated test peeking biases the final test score",
        explanation: "This is not a numeric law but the core rule of the prototype: repeated test peeking turns the final test score into a biased estimate.",
        tone: "statement",
      },
    ],
    pros: [
      "Separates learning, model selection, and final evaluation into distinct stages with distinct responsibilities.",
      "Helps detect overfitting because training and held-out performance can be compared directly.",
      "Keeps model development aligned with future deployment when dev and test reflect the real target distribution.",
      "Protects the final reported number from bias, as long as the test set is not reused during iteration.",
    ],
    cons: [
      "Poor split design can create a false sense of progress, especially when dev/test do not match future user data.",
      "Holding out validation and test data reduces the number of samples available for training.",
      "Repeatedly tuning on the dev set can still create subtle overfitting to that split.",
      "If the team keeps peeking at test results, the final score stops being an honest final estimate.",
    ],
    quickExample:
      "If web images are cleaner but future users mainly upload noisy mobile-app images, a web-heavy dev set may make the model look stronger than it really is. The prototype shows exactly this trap: the intermediate dev score can rise while the real-world score stays misaligned.",
    commonMistake:
      "A common mistake is to ask only, 'Which split gives the prettiest score?' The better question is, 'Which dev/test split best represents the future data I actually care about?' Another mistake is to keep reopening test during iteration and still call the final test number unbiased.",
  },
  "convolution-operation": {
    canonicalTitle: "Convolution Operation",
    sourceDocument: "deep_learning_content_part2_rewritten.pdf",
    background: [
      "Convolution is the step-by-step pattern-matching operation that gives CNNs their local visual intelligence. In your prototype, the beginner is supposed to watch one filter slide across one local patch at a time, multiply matching entries, add them up, and write one output value into one output cell. That is the right teaching focus: one patch, one kernel position, one output cell. Stride matters because it changes how far the window jumps between positions, so it directly changes both the path of the filter and the final output size.",
      "The prototype also makes the filter choice meaningful: different kernels behave like different local questions, such as vertical-edge detection, sharpening, or local averaging. So the explanation below the visualization should help the learner connect the moving window to the output feature map, not jump too quickly into a general CNN lecture. Convolution becomes intuitive when the learner can narrate each step: align patch, multiply, sum, place result, move, repeat.",
    ],
    formulas: [
      {
        expression: "Output(i, j) = sum(local patch &odot; kernel)",
        explanation: "One output value is produced by element-wise multiplication between the local input patch and the kernel, followed by a sum.",
      },
      {
        expression: "Output size depends on input size, kernel size, padding, and stride",
        explanation: "Input size, kernel size, padding, and stride together determine the spatial size of the output map.",
        tone: "statement",
      },
      {
        expression: "1 filter = 1 output channel",
        explanation: "Each filter produces one output channel, so more filters mean more feature maps.",
        tone: "statement",
      },
    ],
    pros: [
      "Uses local connectivity and weight sharing, which greatly reduces parameter count compared with fully connected image processing.",
      "Lets the network detect the same pattern at many positions using one reusable kernel.",
      "Builds feature maps that later layers can reuse to detect larger and more meaningful structures.",
      "Supports interpretable stepwise learning because each output cell can be traced back to one local patch and one filter.",
    ],
    cons: [
      "Looks only at a local region at each step, so a single convolution cannot capture broad context by itself.",
      "Output size can shrink quickly if stride and padding are chosen poorly.",
      "Different kernels can be visually intuitive early on but become harder to interpret in deeper layers.",
      "Beginners often find the indexing and size formulas confusing until they relate them back to the moving window.",
    ],
    quickExample:
      "A 5x5 input with a 3x3 kernel, stride 1, and no padding produces a 3x3 output. The top-left output value comes only from the top-left 3x3 patch. Move the kernel one step right, and you compute the next output cell from the next 3x3 patch.",
    commonMistake:
      "A common mistake is to talk about convolution only as a formula and ignore what the learner actually sees: a local patch being transformed into one output cell. Another mistake is to forget that changing stride changes both the movement pattern and the output size, not just the speed of the animation.",
  },
  pooling: {
    canonicalTitle: "Pooling and Downsampling",
    sourceDocument: "deep_learning_content_part2_rewritten.pdf",
    background: [
      "Pooling is a local summarization step, not a local pattern-learning step. Your prototype already teaches this well: the learner sees a small window move across an existing feature map, then sees a single summarized value written into a smaller output map. That visual contrast with convolution is the key lesson. Convolution learns a pattern by using trainable weights; pooling compresses an existing map by applying a fixed rule such as maximum or average.",
      "The output becomes spatially smaller, so later layers work with fewer positions and a broader effective view. In this prototype, the beginner should notice the current window, the mapped output cell, the compression ratio, and the fact that the strongest local signal is preserved in max pooling. The supporting text should therefore emphasize spatial compression, local summary, and the absence of learned parameters.",
    ],
    formulas: [
      {
        expression: "Max pooling(x) = max(window)",
        explanation: "Max pooling keeps the strongest activation inside the current local window.",
      },
      {
        expression: "Average pooling(x) = mean(window)",
        explanation: "Average pooling keeps the mean of the values inside the current local window.",
      },
      {
        expression: "Shrink factor depends on window size F and stride S",
        explanation: "The pooling window size F and stride S determine how much the feature map shrinks along each side.",
        tone: "statement",
      },
    ],
    pros: [
      "Reduces spatial size, which lowers memory use and later computation.",
      "Preserves strong local evidence in max pooling, which often helps later layers focus on salient signals.",
      "Introduces some tolerance to small spatial shifts because nearby values are summarized together.",
      "Has no learned weights, so its behavior is simple, fixed, and easy to explain visually.",
    ],
    cons: [
      "Throws away spatial detail, which can hurt tasks that need precise localization.",
      "Can be too aggressive if the window or stride is large, making the output lose useful structure.",
      "Average pooling may weaken sharp local signals, while max pooling may ignore moderate but still meaningful responses.",
      "Because pooling is fixed, it cannot adapt its summarization rule to the data the way convolution can.",
    ],
    quickExample:
      "A 6x6 map pooled with a 2x2 window and stride 2 becomes a 3x3 map. In max pooling, each output cell is simply the largest value from its corresponding 2x2 region, so the map becomes smaller while keeping the strongest local activation in each patch.",
    commonMistake:
      "A common mistake is to describe pooling as if it were learning a new detector. It is not learning a new pattern; it is compressing an existing map. Another mistake is to forget that pooling works channel by channel, so it shrinks height and width but usually keeps the number of channels the same.",
  },
  "feature-map-visualization": {
    canonicalTitle: "CNN Feature Map Visualization",
    sourceDocument: "deep_learning_content_part2_rewritten.pdf",
    background: [
      "A feature map is the spatial response pattern produced after a filter looks at an image or at a previous layer. Your prototype is strongest when it shows that different channels light up for different reasons and that those responses become more abstract across layers. In Layer 1, the learner should notice local edges, contrast changes, and simple textures. In the middle layer, the learner should notice grouped contours, corners, and local parts built from earlier channels. In the deeper layer, the learner should stop expecting a normal-looking image filter and instead look for broader object-relevant regions and more abstract focus.",
      "The overlay interaction is especially important because it connects a selected channel back to the original image region. So the supporting text should explain not only what a feature map is, but also what the learner is supposed to notice when clicking a map, changing the layer, and comparing channels.",
    ],
    formulas: [
      {
        expression: "Feature map<sub>k</sub> = &phi;(W<sub>k</sub> * input)",
        explanation: "The k-th feature map stores how strongly filter Wk responds at each spatial position after the nonlinearity phi is applied.",
      },
      {
        expression: "Deeper layers transform earlier feature maps into newer, more abstract maps",
        explanation: "Deeper layers do not start from raw pixels; they transform earlier feature maps into newer, more abstract maps.",
        tone: "statement",
      },
      {
        expression: "Tensor shape = height x width x channels",
        explanation: "A full feature-map tensor has height, width, and one channel for each filter.",
        tone: "statement",
      },
    ],
    pros: [
      "Makes the internal behavior of a CNN more interpretable by showing where and how different filters respond.",
      "Helps beginners see the hierarchy from simple local patterns to broader and more abstract representations.",
      "Supports debugging because dead, redundant, or overly background-focused channels become easier to notice.",
      "Connects the original image to internal activations through overlays, which makes the representation less mysterious.",
    ],
    cons: [
      "Deeper maps can become abstract enough that they stop looking intuitively image-like.",
      "A bright activation does not automatically mean that one channel alone is responsible for the final prediction.",
      "Visualization can be misleading if map normalization or color scaling hides relative differences.",
      "It is easy to over-interpret one selected map and forget that the network uses many channels together.",
    ],
    quickExample:
      "On a shoe image, one shallow map may respond strongly along sole edges, another may prefer diagonal upper contours, and a deeper map may highlight a larger silhouette region. Clicking different channels reveals that the CNN is not storing one copy of the image; it is storing many specialized responses to different aspects of the same image.",
    commonMistake:
      "A common mistake is to say that a feature map is 'just the filtered image.' That is too shallow, especially in deeper layers where the map is already built from earlier channels. Another mistake is to interpret one bright overlay as the whole explanation for the prediction, instead of one useful intermediate response among many.",
  },
  "rnn-structure": {
    canonicalTitle: "RNN Architectures",
    sourceDocument: "deep_learning_content_part2_rewritten.pdf",
    background: [
      "RNN architectures are best understood by asking how many time steps come in and how many outputs come out. Your prototype is architecture-focused, so the text should stay architecture-focused too. The central idea is that an RNN carries a hidden state forward through time, letting each step combine the current input with information from earlier steps. That shared hidden state is what makes sequence processing different from an ordinary feedforward network.",
      "But the prototype is not mainly about LSTM gates or advanced NLP internals; it is about mapping sequence shapes to task shapes. One-to-one behaves like a standard non-sequential model. One-to-many, many-to-one, and many-to-many show how the same recurrent core can support generation, classification, and aligned or unaligned sequence labeling. The best supporting note is therefore one that helps the learner match each architecture diagram to the kind of problem it is meant to solve.",
    ],
    formulas: [
      {
        expression: "h<sub>t</sub> = f(h<sub>t-1</sub>, x<sub>t</sub>)",
        explanation: "At each time step, the hidden state combines past memory h_(t-1) with the current input x_t.",
      },
      {
        expression: "y<sub>t</sub> may be emitted at every step or only selected steps",
        explanation: "An output can be produced from the current hidden state at every step or only at selected steps, depending on the architecture.",
        tone: "statement",
      },
      {
        expression: "Architecture shape depends on input length T<sub>x</sub> and output length T<sub>y</sub>",
        explanation: "The relationship between input length Tx and output length Ty helps distinguish one-to-one, one-to-many, many-to-one, and many-to-many setups.",
        tone: "statement",
      },
    ],
    pros: [
      "Provides a clean framework for sequence tasks where order matters.",
      "Reuses the same parameters across time, which keeps the model structure consistent across different sequence lengths.",
      "Supports several task shapes using the same recurrent idea: classification, generation, tagging, and translation-style mapping.",
      "Helps beginners reason about sequential data through a visible hidden-state flow instead of treating the sequence as one flat vector.",
    ],
    cons: [
      "Vanilla RNNs struggle with long-range dependencies because information and gradients can weaken across many time steps.",
      "Sequential computation limits parallelism compared with purely feedforward processing.",
      "The hidden state is useful but also easy to describe too vaguely unless the learner ties it to the actual time-step diagram.",
      "If the architecture type is chosen poorly, the model shape itself may be mismatched to the task before training even begins.",
    ],
    quickExample:
      "A many-to-one architecture fits sentiment analysis: the model reads a whole sentence word by word and outputs one final label. A one-to-many architecture fits generation: one seed input can produce a sequence of outputs over time. A many-to-many equal-length setup fits per-token tagging, while an unequal-length many-to-many setup fits translation.",
    commonMistake:
      "A common mistake is to treat every sequential problem as 'just use an RNN' without first deciding which input-output shape the task really needs. Another mistake is to explain hidden state only as 'memory' without showing that this memory is updated step by step and reused by a specific architecture pattern.",
  },
};

export function getTopicTeachingContent(slug: string) {
  return topicTeachingContentBySlug[slug];
}

export function hasTopicTeachingContent(slug: string) {
  return slug in topicTeachingContentBySlug;
}
