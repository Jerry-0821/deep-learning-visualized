(function () {
  const approvedNotes = {
    "gradient-descent-learning-rate": {
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
      background: [
        "Backpropagation is the algorithm that efficiently computes gradients for every weight in a multi-layer neural network. It performs a forward pass to compute activations and cache intermediate values, then propagates error signals backward using the chain rule.",
        "The key idea is reuse. Instead of recomputing every derivative from scratch, each layer reuses the error term from the layer after it. This makes deep learning practical: without backpropagation, exact training of large neural networks would be prohibitively expensive.",
      ],
      formulas: [
        {
          expression: "&delta;<sup>[L]</sup> = &nabla;<sub>a</sub>L &odot; g'(z<sup>[L]</sup>)",
          explanation: "The output-layer error combines the loss derivative with the derivative of the activation.",
        },
        {
          expression: "&delta;<sup>[l]</sup> = (W<sup>[l+1]</sup>)<sup>T</sup>&delta;<sup>[l+1]</sup> &odot; g'(z<sup>[l]</sup>)",
          explanation: "Hidden-layer errors are propagated backward from later layers.",
        },
        {
          expression: "&part;L / &part;W<sup>[l]</sup> = &delta;<sup>[l]</sup>(a<sup>[l-1]</sup>)<sup>T</sup>",
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
    dropout: {
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
    "convolution-operation": {
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
        },
        {
          expression: "1 filter = 1 output channel",
          explanation: "Each filter produces one output channel, so more filters mean more feature maps.",
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
    "rnn-structure": {
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
        },
        {
          expression: "Architecture shape depends on input length T<sub>x</sub> and output length T<sub>y</sub>",
          explanation: "The relationship between input length Tx and output length Ty helps distinguish one-to-one, one-to-many, many-to-one, and many-to-many setups.",
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

  const topicConfigs = {
    "activation-functions-comparison": {
      moduleLabel: "Module 01 / Foundation",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/1",
      title: "Activation Functions Comparison",
      subtitle: "Compare how ReLU, Leaky ReLU, Sigmoid, and Tanh transform a neuron's raw score and control gradient flow.",
      prototype: "../public/prototypes/activation-functions-comparison.html",
      frameHeight: 2200,
      freezeFrameAfterLoad: true,
      drawerMode: "empty",
      reservedReading: false,
      readingMode: "activation-supplement",
      frameTreatment: "activation-editorial",
    },
    "attention-mechanism-intuition": {
      moduleLabel: "Module 02 / Attention",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/2",
      title: "Attention Mechanism Inside a Transformer",
      subtitle: "Follow tokens through embeddings, Query/Key/Value projections, attention scores, softmax weights, and context vectors.",
      prototype: "../public/prototypes/attention-mechanism-intuition.html",
      frameHeight: 3000,
      drawerMode: "empty",
      reservedReading: true,
      decard: true,
    },
    "evaluation-metrics-confusion-matrix": {
      moduleLabel: "Module 03 / Evaluation",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/3",
      title: "Evaluation Metrics & Confusion Matrix",
      subtitle: "Accuracy tells how often the model is right. The confusion matrix shows where it is wrong.",
      drawerMode: "empty",
      reservedReading: false,
      readingMode: "evaluation-supplement",
      interactionMode: "inline-evaluation",
    },
    "bias-vs-variance-diagnosis": {
      moduleLabel: "Module 03 / Diagnosis",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/3",
      title: "Bias vs. Variance Diagnosis",
      subtitle: "Compare human-level, training, train-dev, dev, and test errors to diagnose bias, variance, mismatch, and dev-set overfitting.",
      drawerMode: "empty",
      reservedReading: false,
      readingMode: "bias-variance-supplement",
      interactionMode: "inline-bias-variance",
    },
    "transfer-learning-intuition": {
      moduleLabel: "Module 03 / Transfer",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/3",
      title: "Transfer Learning Intuition",
      subtitle: "See how a model pretrained on Task A can reuse learned features, replace the head, and adapt to a smaller Task B.",
      prototype: "../public/prototypes/transfer-learning-intuition.html",
      frameHeight: 3200,
      drawerMode: "empty",
      reservedReading: true,
      decard: true,
    },
    "rnn-structure": {
      moduleLabel: "Module 02 / Sequence",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/2",
      title: "RNN Structure",
      subtitle: "Compare one-to-one, one-to-many, many-to-one, and many-to-many RNN layouts for sequence tasks.",
      prototype: "../public/prototypes/rnn-structure.html",
      frameHeight: 2600,
      freezeFrameAfterLoad: true,
      drawerMode: "mirror",
      reservedReading: false,
      readingMode: "rnn-supplement",
      frameTreatment: "rnn-editorial",
      mirrorBlocks: [
        { title: "Current step", sources: ["#step-title", "#step-body"] },
        { title: "Architecture", sources: ["#arch-body"] },
        { title: "Core equations", sources: ["#core-equations", "#fn-note"] },
        { title: "Formula block", sources: ["#formula-overlay", "#formula-title", "#formula-body", "#formula-note"] },
        { title: "Application", sources: ["#app-title", "#app-body"] },
      ],
      hideNodes: [
        { selector: "#formula-overlay", up: 0 },
        { selector: "#desc-row", up: 0 },
        { selector: ".bot", up: 0 },
      ],
    },
    "backpropagation-intuition": {
      moduleLabel: "Module 01 / Core Concept",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/1",
      title: "Backpropagation",
      subtitle: "Follow the error signal backward through cached forward values, gradients, and parameter updates.",
      prototype: "../public/prototypes/backpropagation-intuition.html",
      frameHeight: 1320,
      drawerMode: "backprop-tabs",
      reservedReading: false,
      readingMode: "backpropagation-supplement",
      frameTreatment: "backpropagation-editorial",
      mirrorBlocks: [
        { title: "Formula", sources: ["#bpCacheFormulaMain", "#bpCacheFormulaSub", "#bpCacheFormulaFinal"] },
        { title: "What is cached?", sources: ["#bpCacheExplain"] },
        { title: "Concept note", sources: ["#bpCacheConcept"] },
        { title: "Current moment", sources: ["#bpCacheMomentTitle", "#bpCacheMomentDesc"] },
      ],
      hideNodes: [
        { selector: "#bpCacheFormulaMain", up: 1 },
        { selector: "#bpCacheExplain", up: 1 },
        { selector: "#bpCacheConcept", up: 1 },
        { selector: "#bpCacheMomentTitle", up: 1 },
      ],
    },
    "convolution-operation": {
      moduleLabel: "Module 02 / Core Operation",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/2",
      title: "Convolution Operation",
      subtitle: "Watch a filter slide across an input image, multiply local patches, and produce an output feature map.",
      prototype: "../public/prototypes/convolution-operation.html",
      frameHeight: 1200,
      drawerMode: "mirror",
      reservedReading: false,
      readingMode: "convolution-supplement",
      frameTreatment: "convolution-editorial",
      mirrorBlocks: [
        { title: "Live Calculation (Element-wise Multiply & Sum)", sources: ["#convFormulaMain"] },
        { title: "Current Step", sources: ["#convMomentTitle", "#convMomentDesc"] },
        { title: "Filter Characteristics", sources: ["#convFilterExplain"] },
      ],
      hideNodes: [
        { selector: "#convFormulaMain", up: 1 },
        { selector: "#convMomentTitle", up: 1 },
        { selector: "#convFilterExplain", up: 1 },
      ],
    },
    dropout: {
      moduleLabel: "Module 01 / Regularisation",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/1",
      title: "Dropout",
      subtitle: "See how random neuron masking and inverted dropout scaling reduce co-adaptation during training.",
      prototype: "../public/prototypes/dropout.html",
      frameHeight: 1960,
      drawerMode: "mirror",
      reservedReading: false,
      readingMode: "dropout-supplement",
      frameTreatment: "dropout-editorial",
      mirrorBlocks: [
        { title: "Live Math Area: Bernoulli Mask & Scaling", sources: ["#doBadge-87f74045", "#doMath-87f74045"] },
        { title: "Current Action", sources: ["#doTitle-87f74045", "#doDesc-87f74045"] },
      ],
      hideNodes: [{ selector: ".info-grid", up: 0 }],
    },
    "gradient-descent-learning-rate": {
      moduleLabel: "Module 01 / Optimisation",
      moduleUrl: "https://deep-learning-visualized.vercel.app/module/1",
      title: "Gradient Descent & Learning Rate",
      subtitle: "Watch parameters move across a loss surface and see how learning rate changes the descent path.",
      prototype: "../public/prototypes/gradient-descent-learning-rate.html",
      frameHeight: 1900,
      drawerMode: "mirror",
      reservedReading: false,
      readingMode: "gradient-supplement",
      frameTreatment: "gradient-editorial",
      mirrorBlocks: [
        { title: "3D formula", sources: ["#gd_combo_8d0a9e18_formulaMeta", "#gd_combo_8d0a9e18_formulaMain"] },
        { title: "Current 3D step computation", sources: ["#gd_combo_8d0a9e18_stepMeta", "#gd_combo_8d0a9e18_formulaCurrent"] },
        { title: "2D intuition formula", sources: ["#gd_combo_8d0a9e18_formula2DMeta", "#gd_combo_8d0a9e18_formula2D"] },
        { title: "Interpretation", sources: ["#gd_combo_8d0a9e18_noteText"] },
        { title: "Current moment", sources: ["#gd_combo_8d0a9e18_momentHead", "#gd_combo_8d0a9e18_momentText"] },
      ],
      hideNodes: [{ selector: ".gd_combo_8d0a9e18_cards", up: 0 }],
    },
  };

  const slug = window.TOPIC_PREVIEW_SLUG;
  const config = topicConfigs[slug];

  if (!config) {
    document.body.innerHTML = "<p>Unknown topic preview.</p>";
    return;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderReservedSection(id, title) {
    return `
      <section class="content-section" id="${id}">
        <p class="section-kicker">Reserved reading section</p>
        <h2>${title}</h2>
        <div class="reserved-section" aria-label="${title} content position reserved"></div>
      </section>`;
  }

  function renderNotes(notes) {
    const formulas = notes.formulas
      .map(
        (formula) => `
          <div class="formula-row">
            <div class="formula-expression">${formula.expression}</div>
            <p class="formula-explanation">${escapeHtml(formula.explanation)}</p>
          </div>`,
      )
      .join("");
    const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        ${notes.background.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </section>
      <section class="content-section" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important formulas</h2>
        ${formulas}
      </section>
      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list">${list(notes.pros)}</ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list">${list(notes.cons)}</ul>
        </div>
      </section>
      <section class="content-section two-column" id="example-guidance">
        <div class="reading-copy">
          <p class="reading-heading">Quick example</p>
          <p>${escapeHtml(notes.quickExample)}</p>
        </div>
        <div class="reading-copy">
          <p class="reading-heading">Common mistake</p>
          <p>${escapeHtml(notes.commonMistake)}</p>
        </div>
      </section>`;
  }

  function renderEvaluationInteraction() {
    return `
      <div class="evaluation-interaction" id="evaluation-interaction">
        <div class="evaluation-explore-line">
          <span>Explore:</span> Threshold <span class="evaluation-arrow">&rarr;</span> Confusion Matrix <span class="evaluation-arrow">&rarr;</span> Metrics
        </div>
        <div class="evaluation-controls">
          <div class="evaluation-metric-controls" aria-label="Select a metric">
            <button type="button" data-evaluation-metric="accuracy">Accuracy</button>
            <button type="button" class="is-selected" data-evaluation-metric="precision">Precision</button>
            <button type="button" data-evaluation-metric="recall">Recall</button>
            <button type="button" data-evaluation-metric="f1">F1</button>
          </div>
          <label class="evaluation-threshold-control" for="evaluation-threshold">
            <span>Threshold</span>
            <input id="evaluation-threshold" type="range" min="0.05" max="0.95" step="0.01" value="0.55" />
            <output id="evaluation-threshold-value">0.55</output>
          </label>
        </div>
        <div class="evaluation-legend" aria-label="Confusion matrix legend">
          <span><i class="evaluation-dot tp"></i>Correct Positive</span>
          <span><i class="evaluation-dot fp"></i>False Positive</span>
          <span><i class="evaluation-dot fn"></i>Missed Positive</span>
          <span><i class="evaluation-dot tn"></i>Correct Negative</span>
        </div>
        <section class="evaluation-score-region">
          <h3>Score distribution and threshold intuition</h3>
          <svg class="evaluation-score-strip" id="evaluation-score-strip" viewBox="0 0 900 160" aria-label="Probability scores divided by the current threshold"></svg>
          <div class="evaluation-scale-labels">
            <span>Lower score - more likely negative</span>
            <span>Higher score - more likely positive</span>
          </div>
        </section>
        <div class="evaluation-results">
          <section class="evaluation-matrix-region">
            <h3>Confusion Matrix</h3>
            <div class="evaluation-confusion-matrix" id="evaluation-confusion-matrix">
              <span></span><span class="matrix-axis">Predicted +</span><span class="matrix-axis">Predicted -</span>
              <span class="matrix-axis">Actual +</span>
              <div class="matrix-value tp" id="evaluation-tp"><b>TP</b><strong>0</strong></div>
              <div class="matrix-value fn" id="evaluation-fn"><b>FN</b><strong>0</strong></div>
              <span class="matrix-axis">Actual -</span>
              <div class="matrix-value fp" id="evaluation-fp"><b>FP</b><strong>0</strong></div>
              <div class="matrix-value tn" id="evaluation-tn"><b>TN</b><strong>0</strong></div>
            </div>
            <p class="evaluation-total">Total samples: <span id="evaluation-total">0</span></p>
          </section>
          <section class="evaluation-metrics-region">
            <h3>Metrics</h3>
            <div class="evaluation-metric-grid">
              <button class="evaluation-metric-item" type="button" data-evaluation-card="precision">
                <span>Precision</span><small>TP / (TP + FP)</small><strong id="evaluation-value-precision">0%</strong>
              </button>
              <button class="evaluation-metric-item" type="button" data-evaluation-card="recall">
                <span>Recall</span><small>TP / (TP + FN)</small><strong id="evaluation-value-recall">0%</strong>
              </button>
              <button class="evaluation-metric-item" type="button" data-evaluation-card="f1">
                <span>F1 Score</span><small>2TP / (2TP + FP + FN)</small><strong id="evaluation-value-f1">0%</strong>
              </button>
              <button class="evaluation-metric-item" type="button" data-evaluation-card="accuracy">
                <span>Accuracy</span><small>(TP + TN) / Total</small><strong id="evaluation-value-accuracy">0%</strong>
              </button>
            </div>
          </section>
        </div>
        <div class="evaluation-live-reading">
          <p class="evaluation-selected-label" id="evaluation-selected-label">Precision</p>
          <div class="evaluation-live-formula" id="evaluation-live-formula"></div>
          <p class="evaluation-insight" id="evaluation-insight"></p>
        </div>
      </div>`;
  }

  function renderBiasVarianceInteraction() {
    const input = (id, label, max, value) => `
      <label class="bias-input" for="bias-${id}">
        <span>${label}</span>
        <output id="bias-${id}-value">${value}%</output>
        <input id="bias-${id}" type="range" min="0" max="${max}" step="0.1" value="${value}" />
      </label>`;
    const errorRow = (id, label, color) => `
      <div class="bias-error-row" id="bias-row-${id}">
        <span>${label}</span>
        <div class="bias-bar-track"><i class="bias-bar-fill ${color}" id="bias-bar-${id}"></i></div>
        <output id="bias-read-${id}">0.0%</output>
      </div>`;
    const gap = (id, title, note) => `
      <div class="bias-gap" id="bias-gap-block-${id}">
        <span>${title}</span>
        <strong id="bias-gap-${id}">0.0%</strong>
        <small id="bias-gap-${id}-note">${note}</small>
      </div>`;

    return `
      <div class="bias-interaction" id="bias-interaction">
        <div class="bias-explore-line">
          <span>Explore:</span> Error values <span>&rarr;</span> Gaps <span>&rarr;</span> Diagnosis
        </div>
        <div class="bias-toolbar">
          <fieldset class="bias-choice-group" aria-label="Quick scenarios">
            <legend>Quick scenarios</legend>
            <div>
              <button type="button" data-bias-preset="high_bias">High bias</button>
              <button type="button" data-bias-preset="high_variance">High variance</button>
              <button type="button" data-bias-preset="good_fit">Good fit</button>
              <button type="button" data-bias-preset="mismatch">Mismatch</button>
              <button type="button" data-bias-preset="dev_overfit">Dev overfit</button>
            </div>
          </fieldset>
          <fieldset class="bias-choice-group mode" aria-label="Comparison mode">
            <legend>Comparison mode</legend>
            <div>
              <button type="button" data-bias-mode="standard">Standard</button>
              <button type="button" class="is-selected" data-bias-mode="mismatch">Mismatch mode</button>
            </div>
          </fieldset>
        </div>
        <div class="bias-input-grid">
          ${input("human", "Human-level error", "15", "0.5")}
          ${input("train", "Training error", "30", "7.0")}
          ${input("train-dev", "Training-dev error", "30", "10.0")}
          ${input("dev", "Dev error", "35", "12.0")}
          ${input("test", "Test error", "35", "12.0")}
        </div>
        <div class="bias-baseline-row">
          <span>Human baseline</span>
          <button type="button" data-bias-human="3.0">Typical human</button>
          <button type="button" data-bias-human="1.0">Doctor</button>
          <button type="button" data-bias-human="0.7">Expert</button>
          <button type="button" class="is-selected" data-bias-human="0.5">Team</button>
        </div>
        <div class="bias-results-layout">
          <div>
            <section class="bias-error-region">
              <h3>Diagnostic error stack</h3>
              <p>Read the gaps from top to bottom.</p>
              <div class="bias-error-stack" id="bias-error-stack">
                ${errorRow("human", "Human-level", "human")}
                ${errorRow("train", "Training error", "train")}
                ${errorRow("train-dev", "Training-dev error", "train-dev")}
                ${errorRow("dev", "Dev error", "dev")}
                ${errorRow("test", "Test error", "test")}
              </div>
              <div class="bias-gap-grid" id="bias-gap-grid">
                ${gap("bias", "Avoidable bias", "Human-level to train gap")}
                ${gap("variance", "Variance", "Train to training-dev gap")}
                ${gap("mismatch", "Data mismatch", "Training-dev to dev gap")}
                ${gap("dev-overfit", "Dev overfit", "Dev to test gap")}
              </div>
            </section>
            <section class="bias-curve-region">
              <h3>Small visual intuition</h3>
              <p>Only a helper, not the main diagnosis.</p>
              <svg id="bias-curve" viewBox="0 0 760 240" aria-label="Training and validation error by model complexity"></svg>
            </section>
          </div>
          <section class="bias-diagnosis-result" id="bias-diagnosis-result">
            <p class="bias-result-label">Current diagnosis</p>
            <h3 id="bias-status">High bias</h3>
            <dl>
              <div><dt>Main issue</dt><dd id="bias-issue">Bias</dd></div>
              <div><dt>Confidence</dt><dd id="bias-confidence">Clear</dd></div>
              <div><dt>Largest gap</dt><dd id="bias-largest">6.5%</dd></div>
              <div><dt>Suggested focus</dt><dd id="bias-focus">Fit training</dd></div>
            </dl>
            <p class="bias-reason" id="bias-reason"></p>
          </section>
        </div>
      </div>`;
  }

  function renderInteraction() {
    if (config.interactionMode === "inline-evaluation") {
      return renderEvaluationInteraction();
    }
    if (config.interactionMode === "inline-bias-variance") {
      return renderBiasVarianceInteraction();
    }
    return `<iframe class="prototype-frame" id="prototype-frame" title="${escapeHtml(config.title)} interactive prototype" src="${config.prototype}" style="height:${config.frameHeight}px"></iframe>`;
  }

  function renderEvaluationSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>Imagine a disease detector testing 1,000 people.</p>
        <p>Only 20 people are actually sick. If the model predicts everyone is healthy, it gets:</p>
        <div class="lesson-formula">\[
          \text{Accuracy} = \frac{980}{1000} = 98\%
        \]</div>
        <p>That looks good, but the model missed every sick patient.</p>
        <p>So accuracy alone is not enough.</p>
        <p>We need to ask:</p>
        <blockquote class="lesson-quote">What kind of mistake did the model make?</blockquote>
        <p>That is the purpose of a confusion matrix.</p>
      </section>

      <section class="content-section reading-copy" id="idea">
        <p class="section-kicker">Idea</p>
        <h2>Idea</h2>
        <p>A confusion matrix compares:</p>
        <div class="lesson-formula compact">\[
          \text{Actual Class} \qquad \text{with} \qquad \text{Predicted Class}
        \]</div>
        <p>It separates predictions into four cases:</p>
        <div class="lesson-formula compact">\[
          \mathrm{TP},\ \mathrm{FP},\ \mathrm{TN},\ \mathrm{FN}
        \]</div>
        <p>From these four numbers, we calculate metrics like accuracy, precision, recall, and F1-score.</p>
        <p>The key idea:</p>
        <blockquote class="lesson-quote">Metrics are different ways to read the same confusion matrix.</blockquote>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Formula</p>
        <h2>Formula</h2>
        <h3 class="reading-subheading">Threshold</h3>
        <div class="lesson-formula">\[
          \hat{y} =
          \begin{cases}
            1, & p \geq \text{threshold} \\
            0, & p < \text{threshold}
          \end{cases}
        \]</div>
        <p>Changing the threshold changes the confusion matrix.</p>

        <h3 class="reading-subheading">Confusion Matrix</h3>
        <table class="lesson-table matrix-table">
          <thead>
            <tr>
              <th></th>
              <th>Predicted Positive</th>
              <th>Predicted Negative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Actual Positive</th>
              <td>\(\mathrm{TP}\)</td>
              <td>\(\mathrm{FN}\)</td>
            </tr>
            <tr>
              <th>Actual Negative</th>
              <td>\(\mathrm{FP}\)</td>
              <td>\(\mathrm{TN}\)</td>
            </tr>
          </tbody>
        </table>

        <h3 class="reading-subheading">Metrics</h3>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[
            \text{Accuracy} = \frac{\mathrm{TP}+\mathrm{TN}}{\mathrm{TP}+\mathrm{TN}+\mathrm{FP}+\mathrm{FN}}
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Precision} = \frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FP}}
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Recall} = \frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}
          \]</div>
          <div class="lesson-formula compact">\[
            F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision}+\text{Recall}}
          \]</div>
        </div>
      </section>

      <section class="content-section" id="symbols">
        <p class="section-kicker">Symbols</p>
        <h2>Symbols</h2>
        <dl class="symbol-list">
          <div><dt>\(\mathrm{TP}\)</dt><dd>Correctly predicted positive.</dd></div>
          <div><dt>\(\mathrm{FP}\)</dt><dd>Predicted positive, but actually negative.</dd></div>
          <div><dt>\(\mathrm{TN}\)</dt><dd>Correctly predicted negative.</dd></div>
          <div><dt>\(\mathrm{FN}\)</dt><dd>Predicted negative, but actually positive.</dd></div>
          <div><dt>\(p\)</dt><dd>Model probability score.</dd></div>
          <div><dt>\(\text{threshold}\)</dt><dd>Cutoff used to turn probability into a class label.</dd></div>
        </dl>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Example</p>
        <h2>Example</h2>
        <p>Suppose a disease detector gives these scores:</p>
        <table class="lesson-table example-table">
          <thead>
            <tr><th>Person</th><th>Actual</th><th>Score</th></tr>
          </thead>
          <tbody>
            <tr><td>A</td><td>Positive</td><td>0.92</td></tr>
            <tr><td>B</td><td>Positive</td><td>0.80</td></tr>
            <tr><td>C</td><td>Positive</td><td>0.48</td></tr>
            <tr><td>D</td><td>Positive</td><td>0.30</td></tr>
            <tr><td>E</td><td>Negative</td><td>0.70</td></tr>
            <tr><td>F</td><td>Negative</td><td>0.40</td></tr>
            <tr><td>G</td><td>Negative</td><td>0.20</td></tr>
            <tr><td>H</td><td>Negative</td><td>0.10</td></tr>
          </tbody>
        </table>
        <p>With:</p>
        <div class="lesson-formula compact">\[
          \text{threshold} = 0.50
        \]</div>
        <p>Predicted positive:</p>
        <div class="lesson-formula compact">\[
          A,\ B,\ E
        \]</div>
        <p>So:</p>
        <div class="lesson-formula compact">\[
          \mathrm{TP}=2,\quad \mathrm{FP}=1,\quad \mathrm{FN}=2,\quad \mathrm{TN}=3
        \]</div>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[
            \text{Accuracy} = \frac{5}{8} = 62.5\%
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Precision} = \frac{2}{3} = 66.7\%
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Recall} = \frac{2}{4} = 50\%
          \]</div>
        </div>
        <p>The model only finds half of the sick patients.</p>
        <p>If we lower the threshold, recall increases, but false positives may also increase.</p>
        <p>That is the trade-off.</p>
      </section>

      <section class="content-section" id="workflow">
        <p class="section-kicker">Workflow</p>
        <h2>Workflow</h2>
        <ol class="workflow-list">
          <li>Model outputs a probability score.</li>
          <li>Choose a threshold.</li>
          <li>Convert score into predicted class.</li>
          <li>Count \(\mathrm{TP}\), \(\mathrm{FP}\), \(\mathrm{TN}\), and \(\mathrm{FN}\).</li>
          <li>Calculate the metrics.</li>
          <li>Decide which mistake matters more.</li>
        </ol>
      </section>

      <section class="content-section" id="strengths-limits">
        <p class="section-kicker">Pros &amp; Cons</p>
        <h2>Pros &amp; Cons</h2>
        <div class="metric-reading-list">
          <article>
            <h3>Accuracy</h3>
            <p>Easy to understand, but can be misleading when classes are imbalanced.</p>
          </article>
          <article>
            <h3>Precision</h3>
            <p>Useful when false positives are costly.</p>
            <p>Example: do not mark normal emails as spam.</p>
          </article>
          <article>
            <h3>Recall</h3>
            <p>Useful when false negatives are costly.</p>
            <p>Example: do not miss sick patients.</p>
          </article>
          <article>
            <h3>F1-score</h3>
            <p>Useful when precision and recall both matter.</p>
            <p>But it ignores true negatives.</p>
          </article>
        </div>
      </section>

      <section class="content-section" id="common-mistake">
        <p class="section-kicker">Common Mistake</p>
        <h2>Common Mistake</h2>
        <div class="metric-reading-list">
          <article>
            <h3>Only looking at accuracy</h3>
            <p>High accuracy does not always mean the model is useful.</p>
          </article>
          <article>
            <h3>Confusing precision and recall</h3>
            <p>Precision asks:</p>
            <blockquote class="lesson-quote">Of predicted positives, how many are truly positive?</blockquote>
            <p>Recall asks:</p>
            <blockquote class="lesson-quote">Of actual positives, how many did the model find?</blockquote>
          </article>
          <article>
            <h3>Thinking threshold \(0.5\) is always best</h3>
            <p>The best threshold depends on the task.</p>
            <p>Lower threshold usually increases recall. Higher threshold usually increases precision.</p>
          </article>
          <article>
            <h3>Ignoring error cost</h3>
            <p>A false positive and a false negative can have very different real-world consequences.</p>
          </article>
        </div>
      </section>

      <section class="content-section reading-copy takeaway" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>The confusion matrix shows the model's mistake pattern.</p>
        <p>Accuracy measures overall correctness.</p>
        <p>Precision measures trust in positive predictions.</p>
        <p>Recall measures how many real positives are found.</p>
        <p>F1-score balances precision and recall.</p>
        <p>The best metric depends on which mistake is more expensive.</p>
      </section>`;
  }

  function renderBiasVarianceSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>A model can fail for different reasons.</p>
        <p>It may not fit the training data well. It may fit training data but fail on unseen examples. It may also fail because the dev/test data comes from a different distribution.</p>
        <p>Bias&ndash;variance diagnosis helps us compare error gaps and decide what to fix first.</p>
        <p><strong>Core question:</strong></p>
        <blockquote class="lesson-quote">Where does the biggest error gap appear?</blockquote>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important Formulas</h2>
        <p>Let:</p>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[
            E_h = \text{human-level error}
          \]</div>
          <div class="lesson-formula compact">\[
            E_{train} = \text{training error}
          \]</div>
          <div class="lesson-formula compact">\[
            E_{train-dev} = \text{train-dev error}
          \]</div>
          <div class="lesson-formula compact">\[
            E_{dev} = \text{dev error}
          \]</div>
          <div class="lesson-formula compact">\[
            E_{test} = \text{test error}
          \]</div>
        </div>
        <p>Main gaps:</p>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[
            \text{Avoidable Bias} = E_{train} - E_h
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Variance} = E_{train-dev} - E_{train}
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Data Mismatch} = E_{dev} - E_{train-dev}
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Dev Overfitting} = E_{test} - E_{dev}
          \]</div>
        </div>
        <p>Simple rule:</p>
        <div class="lesson-formula compact">\[
          \text{Largest gap} \Rightarrow \text{main problem}
        \]</div>
      </section>

      <section class="content-section reading-copy" id="diagnosis-table">
        <p class="section-kicker">Diagnosis table</p>
        <h2>Diagnosis Table</h2>
        <table class="lesson-table diagnosis-table">
          <thead>
            <tr><th>Large gap</th><th>What it means</th><th>Main problem</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>\((E_{train} - E_h)\) is large</td>
              <td>The model is still far from human-level performance, even on training data.</td>
              <td>High bias</td>
            </tr>
            <tr>
              <td>\((E_{train-dev} - E_{train})\) is large</td>
              <td>The model fits training data but does worse on unseen data from the same distribution.</td>
              <td>High variance</td>
            </tr>
            <tr>
              <td>\((E_{dev} - E_{train-dev})\) is large</td>
              <td>The model works on train-like data but fails on dev data.</td>
              <td>Data mismatch</td>
            </tr>
            <tr>
              <td>\((E_{test} - E_{dev})\) is large</td>
              <td>The model looks good on dev but worse on test.</td>
              <td>Dev overfitting</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Example</p>
        <h2>Example</h2>
        <p>Suppose:</p>
        <div class="lesson-formula compact">\[
          \begin{aligned}
            E_h &= 2\%, \quad E_{train} = 8\% \\
            E_{train-dev} &= 9\%, \quad E_{dev} = 16\% \\
            E_{test} &= 17\%
          \end{aligned}
        \]</div>
        <p>Then:</p>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[
            \text{Avoidable Bias} = 8\% - 2\% = 6\%
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Variance} = 9\% - 8\% = 1\%
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Data Mismatch} = 16\% - 9\% = 7\%
          \]</div>
          <div class="lesson-formula compact">\[
            \text{Dev Overfitting} = 17\% - 16\% = 1\%
          \]</div>
        </div>
        <p>The largest gap is:</p>
        <div class="lesson-formula compact">\[
          E_{dev} - E_{train-dev} = 7\%
        \]</div>
        <p>So the main issue is <strong>data mismatch</strong>.</p>
        <p>The model is not mainly overfitting. It performs well on train-like data, but fails when the data distribution changes.</p>
      </section>

      <section class="content-section reading-copy" id="recommended-fix">
        <p class="section-kicker">Recommended fix</p>
        <h2>Recommended Fix</h2>
        <table class="lesson-table">
          <thead>
            <tr><th>Diagnosis</th><th>What to try</th></tr>
          </thead>
          <tbody>
            <tr><td>High bias</td><td>Use a bigger model, train longer, improve optimization, or add better features.</td></tr>
            <tr><td>High variance</td><td>Add more data, use regularization, data augmentation, or simplify the model.</td></tr>
            <tr><td>Data mismatch</td><td>Collect more dev-like data, redesign the data split, or analyze mismatch examples.</td></tr>
            <tr><td>Dev overfitting</td><td>Stop tuning too much on dev, use a larger dev set, or create a fresh test set.</td></tr>
          </tbody>
        </table>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list">
            <li>Gives a clear way to locate the main problem.</li>
            <li>Separates model weakness from data distribution problems.</li>
            <li>Helps choose the next action instead of guessing.</li>
            <li>Useful when training, train-dev, dev, and test sets are properly separated.</li>
          </ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list">
            <li>Needs a reliable human-level baseline.</li>
            <li>Poor data splits can give misleading diagnosis.</li>
            <li>Small datasets may produce noisy error estimates.</li>
            <li>It tells you where the problem is, but not the exact fix.</li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="common-mistake">
        <p class="section-kicker">Common mistake</p>
        <h2>Common Mistake</h2>
        <p>A common mistake is to compare only training error and dev error.</p>
        <p>If training error is low and dev error is high, people may immediately say:</p>
        <pre class="lesson-code">This is high variance.</pre>
        <p>But this may be wrong.</p>
        <p>If \((E_{train-dev})\) is also low, then the model generalizes well to train-like data. The real issue may be:</p>
        <div class="lesson-formula compact">\[
          E_{dev} - E_{train-dev}
        \]</div>
        <p>which means <strong>data mismatch</strong>.</p>
        <p>Better diagnosis:</p>
        <pre class="lesson-code">Training &rarr; Train-dev = variance
Train-dev &rarr; Dev = data mismatch
Dev &rarr; Test = dev overfitting</pre>
      </section>

      <section class="content-section reading-copy takeaway" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>Bias&ndash;variance diagnosis is not about one error number.</p>
        <p>It is about comparing where the gap appears.</p>
        <div class="lesson-formula compact">\[
          E_{train} - E_h
        \]</div>
        <p>tells us about <strong>bias</strong>.</p>
        <div class="lesson-formula compact">\[
          E_{train-dev} - E_{train}
        \]</div>
        <p>tells us about <strong>variance</strong>.</p>
        <div class="lesson-formula compact">\[
          E_{dev} - E_{train-dev}
        \]</div>
        <p>tells us about <strong>data mismatch</strong>.</p>
        <div class="lesson-formula compact">\[
          E_{test} - E_{dev}
        \]</div>
        <p>tells us about <strong>dev overfitting</strong>.</p>
        <p>The biggest gap usually tells you what to fix first.</p>
      </section>`;
  }

  function renderRnnSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>Standard neural networks treat each input independently. This works for fixed data like images, but not for sequence data.</p>
        <p>In language, speech, or time-series data, order matters. The meaning of the current step often depends on what happened before.</p>
        <p>RNNs solve this by passing a <strong>hidden state</strong> from one time step to the next. This hidden state acts like a short-term memory of the previous context.</p>
      </section>

      <section class="content-section reading-copy" id="idea">
        <p class="section-kicker">Idea</p>
        <h2>Idea</h2>
        <p>An RNN uses the same cell repeatedly across time.</p>
        <p>At each step, it receives:</p>
        <div class="lesson-formula compact">\[
          x^{\langle t\rangle}
        \]</div>
        <p>the current input, and</p>
        <div class="lesson-formula compact">\[
          a^{\langle t-1\rangle}
        \]</div>
        <p>the previous hidden state.</p>
        <p>It then produces a new hidden state:</p>
        <div class="lesson-formula compact">\[
          a^{\langle t\rangle}
        \]</div>
        <p>This allows information to flow through the sequence.</p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">General formula</p>
        <h2>Formula</h2>
        <p>The hidden state is updated as:</p>
        <div class="lesson-formula">\[
          a^{\langle t\rangle}
          =
          \tanh\left(W_{aa}a^{\langle t-1\rangle}
          + W_{ax}x^{\langle t\rangle}
          + b_a\right)
        \]</div>
        <p>The output is predicted from the hidden state:</p>
        <div class="lesson-formula">\[
          \hat{y}^{\langle t\rangle}
          =
          g\left(W_{ya}a^{\langle t\rangle}
          + b_y\right)
        \]</div>
        <p>Where:</p>
        <dl class="symbol-list">
          <div><dt>\(x^{\langle t\rangle}\)</dt><dd>is the input at time step \(t\),</dd></div>
          <div><dt>\(a^{\langle t\rangle}\)</dt><dd>is the hidden state at time step \(t\),</dd></div>
          <div><dt>\(a^{\langle t-1\rangle}\)</dt><dd>is the memory from the previous step,</dd></div>
          <div><dt>\(W_{aa}, W_{ax}, W_{ya}\)</dt><dd>are shared weights used across all time steps.</dd></div>
        </dl>
      </section>

      <section class="content-section reading-copy" id="rnn-structures">
        <p class="section-kicker">RNN structures</p>
        <h2>RNN Structures</h2>
        <div class="structure-reading-list">
          <article>
            <h3>One-to-One</h3>
            <p>One input produces one output.</p>
            <p>This is similar to a standard feedforward network.</p>
            <p><strong>Example:</strong> image classification</p>
            <div class="lesson-formula compact">\[ x \rightarrow \hat{y} \]</div>
          </article>
          <article>
            <h3>One-to-Many</h3>
            <p>One input produces a sequence of outputs.</p>
            <p><strong>Example:</strong> image captioning</p>
            <div class="lesson-formula compact">\[
              x \rightarrow \hat{y}^{\langle 1\rangle}, \hat{y}^{\langle 2\rangle}, \dots, \hat{y}^{\langle T_y\rangle}
            \]</div>
          </article>
          <article>
            <h3>Many-to-One</h3>
            <p>A sequence of inputs produces one final output.</p>
            <p><strong>Example:</strong> sentiment classification</p>
            <div class="lesson-formula compact">\[
              x^{\langle 1\rangle}, x^{\langle 2\rangle}, \dots, x^{\langle T_x\rangle} \rightarrow \hat{y}
            \]</div>
          </article>
          <article>
            <h3>Many-to-Many</h3>
            <p>Each input step produces an output step.</p>
            <p><strong>Example:</strong> named entity recognition</p>
            <div class="lesson-formula compact">\[
              x^{\langle t\rangle} \rightarrow \hat{y}^{\langle t\rangle}
            \]</div>
          </article>
          <article>
            <h3>Encoder-Decoder</h3>
            <p>The input sequence and output sequence can have different lengths.</p>
            <p><strong>Example:</strong> machine translation</p>
            <div class="lesson-formula compact">\[
              x^{\langle 1:T_x\rangle} \rightarrow a^{\langle T_x\rangle} \rightarrow \hat{y}^{\langle 1:T_y\rangle}
            \]</div>
            <p>The encoder reads the input sequence. The decoder generates the output sequence.</p>
          </article>
        </div>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Example</p>
        <h2>Example</h2>
        <p>Consider the sentence:</p>
        <blockquote class="lesson-quote">The movie was not good.</blockquote>
        <p>A many-to-one RNN reads the sentence step by step.</p>
        <div class="metric-formula-list">
          <div class="lesson-formula compact">\[ a^{\langle 1\rangle}: \text{The} \]</div>
          <div class="lesson-formula compact">\[ a^{\langle 2\rangle}: \text{The movie} \]</div>
          <div class="lesson-formula compact">\[ a^{\langle 3\rangle}: \text{The movie was} \]</div>
          <div class="lesson-formula compact">\[ a^{\langle 4\rangle}: \text{The movie was not} \]</div>
          <div class="lesson-formula compact">\[ a^{\langle 5\rangle}: \text{The movie was not good} \]</div>
        </div>
        <p>The final hidden state is used to predict the sentiment:</p>
        <div class="lesson-formula compact">\[
          \hat{y} = \text{negative}
        \]</div>
        <p>This example shows why memory matters. The word &ldquo;good&rdquo; alone may sound positive, but &ldquo;not good&rdquo; changes the meaning.</p>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div class="reading-copy">
          <p class="reading-heading">Pros</p>
          <p>RNNs are useful for sequence data because they can process inputs step by step while carrying context forward.</p>
          <p>They also reuse the same weights at every time step, which allows the model to handle sequences of different lengths.</p>
          <p class="reading-heading">Key strengths</p>
          <ul class="reading-list">
            <li>Handles sequential data</li>
            <li>Supports variable-length inputs</li>
            <li>Shares parameters across time</li>
            <li>Uses hidden state to carry context</li>
          </ul>
        </div>
        <div class="reading-copy">
          <p class="reading-heading">Cons</p>
          <p>Basic RNNs struggle with long sequences. As the sequence becomes longer, earlier information may gradually disappear.</p>
          <p>They are also slower than parallel models because each step depends on the previous step.</p>
          <p class="reading-heading">Main limitations</p>
          <ul class="reading-list">
            <li>Weak long-term memory</li>
            <li>Vanishing gradient problem</li>
            <li>Sequential computation is slow</li>
            <li>Often replaced by LSTM, GRU, or Transformer models for harder tasks</li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="common-mistake">
        <p class="section-kicker">Common mistake</p>
        <h2>Common Mistake</h2>
        <p>A common mistake is thinking that an RNN uses a different network at each time step.</p>
        <p>In reality, it is the <strong>same RNN cell reused again and again</strong>. The weights stay the same; only the hidden state changes over time.</p>
        <p>Another mistake is assuming the hidden state remembers everything perfectly. In a basic RNN, old information can fade as the sequence gets longer.</p>
      </section>`;
  }

  function renderGradientSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>A model usually starts with random parameters, so its first predictions are often wrong. Training means repeatedly adjusting those parameters so the loss becomes smaller.</p>
        <p>Gradient descent is the basic method for making those adjustments. It uses the gradient to know which direction makes the loss increase the fastest, then moves the parameters in the opposite direction.</p>
        <p>The learning rate controls how large each move is. If the direction is the gradient, the learning rate is the step size.</p>
        <p><strong>Core idea:</strong><br />Gradient descent decides <strong>where to move</strong>.<br />The learning rate decides <strong>how far to move</strong>.</p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Formulas</p>
        <h2>Formulas</h2>
        <h3 class="reading-subheading">General update rule</h3>
        <div class="lesson-formula">\[
          \theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
        \]</div>
        <p>where:</p>
        <dl class="symbol-list">
          <div><dt>\(\theta_t\)</dt><dd>current model parameters</dd></div>
          <div><dt>\(J(\theta)\)</dt><dd>loss function</dd></div>
          <div><dt>\(\nabla J(\theta_t)\)</dt><dd>gradient of the loss</dd></div>
          <div><dt>\(\eta\)</dt><dd>learning rate</dd></div>
          <div><dt>\(-\nabla J(\theta_t)\)</dt><dd>direction that reduces the loss</dd></div>
        </dl>
        <p>The gradient points uphill, so gradient descent moves in the opposite direction.</p>
        <h3 class="reading-subheading">Single parameter update</h3>
        <div class="lesson-formula">\[
          w_{\text{new}} = w - \eta \frac{\partial J}{\partial w}
        \]</div>
        <p>For one weight \(w\), the update depends on the slope of the loss with respect to that weight.</p>
        <h3 class="reading-subheading">Mini-batch gradient</h3>
        <div class="lesson-formula">\[
          \nabla J_B(\theta) = \frac{1}{|B|}\sum_{i \in B} \nabla J_i(\theta)
        \]</div>
        <p>Instead of using the full dataset every time, mini-batch gradient descent estimates the gradient using a small batch of examples.</p>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Example</p>
        <h2>Example</h2>
        <p>Suppose the loss is:</p>
        <div class="lesson-formula compact">\[ J(w) = w^2 \]</div>
        <p>The gradient is:</p>
        <div class="lesson-formula compact">\[ \frac{dJ}{dw} = 2w \]</div>
        <p>Start with:</p>
        <div class="lesson-formula compact">\[ w = 3,\qquad \eta = 0.1 \]</div>
        <table class="lesson-table example-table">
          <thead>
            <tr><th>Step</th><th>Current \(w\)</th><th>Gradient \(2w\)</th><th>Update</th><th>New \(w\)</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>3.00</td><td>6.00</td><td>\(3 - 0.1(6)\)</td><td>2.40</td></tr>
            <tr><td>2</td><td>2.40</td><td>4.80</td><td>\(2.40 - 0.1(4.80)\)</td><td>1.92</td></tr>
            <tr><td>3</td><td>1.92</td><td>3.84</td><td>\(1.92 - 0.1(3.84)\)</td><td>1.54</td></tr>
          </tbody>
        </table>
        <p>Each step moves \(w\) closer to the minimum at \(w=0\). The steps become smaller because the gradient becomes smaller near the minimum.</p>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list">
            <li>Simple and intuitive: move parameters in the direction that reduces loss.</li>
            <li>Works with many differentiable models, including neural networks.</li>
            <li>Scales well when used with mini-batches.</li>
            <li>Gives a clear training signal: the loss should generally decrease over time.</li>
          </ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list">
            <li>A learning rate that is too large can overshoot the minimum or make training diverge.</li>
            <li>A learning rate that is too small makes training very slow.</li>
            <li>Poor feature scaling can cause inefficient zig-zag movement.</li>
            <li>In deep networks, flat regions, saddle points, or poor local areas can slow training.</li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="common-mistake">
        <p class="section-kicker">Common mistakes</p>
        <h2>Common Mistakes</h2>
        <h3 class="reading-subheading">1. Thinking the gradient points to the minimum</h3>
        <p>The gradient points in the direction of steepest increase. Gradient descent reduces the loss by moving in the opposite direction.</p>
        <h3 class="reading-subheading">2. Using one learning rate without testing</h3>
        <p>A bad learning rate can make a good model look bad. It is common to try several values, such as:</p>
        <div class="lesson-formula compact">\[
          0.1,\quad 0.01,\quad 0.001
        \]</div>
        <p>and compare how the loss changes.</p>
        <h3 class="reading-subheading">3. Ignoring feature scaling</h3>
        <p>When input features have very different scales, gradient descent may take an unstable zig-zag path. Scaling the features usually makes optimization smoother and faster.</p>
      </section>

      <section class="content-section reading-copy takeaway" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>Gradient descent is the rule for updating parameters to reduce the loss:</p>
        <div class="lesson-formula">\[
          \theta_{t+1} = \theta_t - \eta \nabla J(\theta_t)
        \]</div>
        <p>The gradient gives the direction, and the learning rate controls the step size. Good training depends on choosing a step size that is large enough to learn quickly but small enough to stay stable.</p>
      </section>`;
  }

  function renderDropoutSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>Deep networks can overfit by relying too heavily on a small set of neurons or feature pathways. <strong>Dropout</strong> helps reduce this problem by randomly turning off some activations during training.</p>
        <p>This forces the network to learn more robust and distributed features, rather than depending on one strong path. At inference time, dropout is turned off and the full network is used.</p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important Formulas</h2>
        <h3 class="reading-subheading">1. Dropout mask</h3>
        <div class="lesson-formula">\[
          m_i \sim \text{Bernoulli}(q), \qquad q = 1 - p
        \]</div>
        <p>Each unit is kept with probability \(q\), where \(p\) is the dropout rate.</p>
        <h3 class="reading-subheading">2. Inverted dropout (training)</h3>
        <div class="lesson-formula">\[
          \tilde{a}_i = \frac{m_i a_i}{q}
        \]</div>
        <p>If a unit is kept, its activation is scaled by \(1/q\). This keeps the expected activation magnitude stable.</p>
        <h3 class="reading-subheading">3. Inference</h3>
        <div class="lesson-formula">\[
          \tilde{a}_i = a_i
        \]</div>
        <p>At test time, dropout is disabled.</p>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Reduces co-adaptation</strong><span>Neurons cannot rely too much on specific neighboring neurons.</span></li>
            <li><strong>Improves generalization</strong><span>Helps reduce overfitting on the training set.</span></li>
            <li><strong>Acts like model averaging</strong><span>Each mini-batch trains a slightly different sub-network.</span></li>
            <li><strong>Simple to use</strong><span>Easy to add to many neural network architectures.</span></li>
          </ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Adds noise during training</strong><span>This can slow convergence.</span></li>
            <li><strong>Needs tuning</strong><span>Too much dropout can cause underfitting.</span></li>
            <li><strong>Not always necessary</strong><span>It may provide limited benefit when other regularization methods already work well.</span></li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Quick example</p>
        <h2>Quick Example</h2>
        <p>Suppose a layer outputs</p>
        <div class="lesson-formula compact">\[
          a = [0.5,\ 1.0,\ 0.8]
        \]</div>
        <p>and the dropout rate is</p>
        <div class="lesson-formula compact">\[
          p = 0.5, \qquad q = 0.5
        \]</div>
        <p>Sampled mask:</p>
        <div class="lesson-formula compact">\[
          m = [1,\ 0,\ 1]
        \]</div>
        <p>Then the output after inverted dropout is</p>
        <div class="lesson-formula">\[
          \tilde{a} = \frac{m \odot a}{q}
          = \frac{[0.5,\ 0,\ 0.8]}{0.5}
          = [1.0,\ 0,\ 1.6]
        \]</div>
        <p>The second unit is dropped, while the remaining activations are scaled up.</p>
      </section>

      <section class="content-section" id="common-mistake">
        <p class="section-kicker">Common mistakes</p>
        <h2>Common Mistakes</h2>
        <div class="metric-reading-list">
          <article>
            <h3>1. Leaving dropout on during inference</h3>
            <p>Dropout should only be active during training. During inference, the full network should be used.</p>
          </article>
          <article>
            <h3>2. Forgetting the scaling factor</h3>
            <p>If activations are not scaled by \(1/q\) during training, the train-time and test-time activation magnitudes will not match.</p>
          </article>
        </div>
      </section>

      <section class="content-section takeaway-section reading-copy" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p><strong>Dropout reduces overfitting by randomly removing activations during training, forcing the network to learn more robust feature representations.</strong></p>
      </section>`;
  }

  function renderConvolutionSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>Images contain local patterns: edges, corners, textures, and shapes. A fully connected layer treats every pixel separately, but convolution looks at nearby pixels together.</p>
        <p>A convolution filter works like a small pattern detector. It slides across the image, compares itself with one local patch at a time, and writes one value into the output feature map.</p>
        <p>The key idea is simple:</p>
        <blockquote class="lesson-quote">align a patch &rarr; multiply with the kernel &rarr; sum the result &rarr; place one output value &rarr; move and repeat.</blockquote>
        <p>Stride controls how far the filter moves each step. Padding controls whether the filter can also look near the image border.</p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important Formulas</h2>
        <h3 class="reading-subheading">One output value</h3>
        <div class="lesson-formula">\[
          Y_{i,j} = \sum_{u=0}^{K-1}\sum_{v=0}^{K-1}X_{i+u,j+v}W_{u,v}+b
        \]</div>
        <p>One output cell is produced by multiplying a local input patch with the kernel, then summing the results.</p>
        <h3 class="reading-subheading">Output size</h3>
        <div class="lesson-formula">\[
          \begin{aligned}
            H_{out} &= \left\lfloor \frac{H+2P-K}{S} \right\rfloor + 1 \\
            W_{out} &= \left\lfloor \frac{W+2P-K}{S} \right\rfloor + 1
          \end{aligned}
        \]</div>
        <p>Here \(H,W\) are input height and width, \(K\) is kernel size, \(P\) is padding, and \(S\) is stride.</p>
        <h3 class="reading-subheading">One filter gives one feature map</h3>
        <div class="lesson-formula compact">\[
          \begin{aligned}
            \text{Number of output channels} \\
            {}= \text{Number of filters}
          \end{aligned}
        \]</div>
        <p>Each filter learns to detect a different type of local pattern.</p>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Preserves local structure</strong><span>Convolution looks at nearby pixels together, which fits image data naturally.</span></li>
            <li><strong>Shares weights</strong><span>The same filter is reused across the whole image, reducing the number of parameters.</span></li>
            <li><strong>Detects patterns anywhere</strong><span>A filter can find the same pattern in different positions.</span></li>
            <li><strong>Builds visual hierarchy</strong><span>Early layers may detect edges, while deeper layers combine them into shapes or objects.</span></li>
          </ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Limited local view</strong><span>One convolution only sees a small region at a time.</span></li>
            <li><strong>Output size can shrink</strong><span>Large kernels, large stride, or no padding can quickly reduce the feature map size.</span></li>
            <li><strong>Shape calculation can be confusing</strong><span>Beginners often forget how stride, padding, and kernel size change the output.</span></li>
            <li><strong>Harder to interpret deeper filters</strong><span>Early filters are often visual, but deeper filters become more abstract.</span></li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Quick example</p>
        <h2>Quick Example</h2>
        <p>Suppose we have a \(5 \times 5\) input, a \(3 \times 3\) kernel, stride \(S=1\), and no padding.</p>
        <div class="lesson-formula">\[
          H_{out} = W_{out}
          = \left\lfloor \frac{5+2(0)-3}{1} \right\rfloor + 1
          = 3
        \]</div>
        <p>So the output is a \(3 \times 3\) feature map.</p>
        <p>The top-left output value comes from the top-left \(3 \times 3\) input patch. Then the kernel moves one step to the right and computes the next output cell.</p>
        <p>Each output value answers one question:</p>
        <blockquote class="lesson-quote">How strongly does this local patch match the filter?</blockquote>
      </section>

      <section class="content-section" id="common-mistake">
        <p class="section-kicker">Common mistakes</p>
        <h2>Common Mistakes</h2>
        <div class="metric-reading-list">
          <article><h3>Mistake 1: Thinking convolution is normal matrix multiplication</h3><p>Convolution is not full matrix multiplication. It is element-wise multiplication over a small local window, followed by a sum.</p></article>
          <article><h3>Mistake 2: Ignoring stride</h3><p>Stride does not only make the animation faster. It changes where the filter lands and changes the final output size.</p></article>
          <article><h3>Mistake 3: Forgetting padding</h3><p>Without padding, the output usually becomes smaller. Padding helps preserve spatial size and lets the filter cover border pixels.</p></article>
        </div>
      </section>

      <section class="content-section takeaway-section reading-copy" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>Convolution turns an image into a feature map by sliding a small filter across local regions and measuring how strongly each region matches a learned pattern.</p>
      </section>`;
  }

  function renderBackpropagationSupplement() {
    return String.raw`
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>A neural network learns by finding how each weight contributed to the final error.</p>
        <p>During the <strong>forward pass</strong>, the model computes activations and stores useful intermediate values such as \(A_0\), \(Z_1\), \(A_1\), \(Z_2\), and \(A_2\). During the <strong>backward pass</strong>, these cached values are reused to compute gradients layer by layer.</p>
        <p>The core idea is:</p>
        <blockquote class="lesson-quote">forward stores values &rarr; backward reuses them &rarr; gradients tell weights how to change.</blockquote>
        <p>Backpropagation is not sending the loss backward. It sends <strong>gradients</strong> backward using the chain rule.</p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important Formulas</h2>
        <p>Choose a derivation to read it in the explanation drawer while keeping the animation visible.</p>
        <div class="derivation-launchers">
          <button class="derivation-launcher" type="button" data-drawer-view="single-neuron">
            <strong>Single Neuron</strong>
            <span>Forward pass, chain rule, local derivatives, and parameter gradients</span>
          </button>
          <button class="derivation-launcher" type="button" data-drawer-view="multi-layer">
            <strong>Multi-layer Network</strong>
            <span>Layer error signals, parameter gradients, and updates</span>
          </button>
        </div>
      </section>

      <section class="content-section two-column" id="strengths-limits">
        <div>
          <p class="reading-heading">Pros</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Efficient gradient computation</strong><span>Reuses cached forward values instead of recomputing every derivative from scratch.</span></li>
            <li><strong>Scales to deep networks</strong><span>Makes training multi-layer neural networks practical.</span></li>
            <li><strong>Layer-by-layer logic</strong><span>Each layer only needs the downstream gradient, cached inputs, and its local derivative.</span></li>
            <li><strong>Works with many architectures</strong><span>Useful for any network built from differentiable operations.</span></li>
          </ul>
        </div>
        <div>
          <p class="reading-heading">Cons</p>
          <ul class="reading-list explanatory-list">
            <li><strong>Vanishing or exploding gradients</strong><span>Gradients may become too small or too large through many layers.</span></li>
            <li><strong>Shape mistakes</strong><span>Matrix dimensions must match in both forward and backward passes.</span></li>
            <li><strong>Depends on correct caching</strong><span>If \(Z\), \(A\), or inputs are cached incorrectly, the backward pass becomes wrong.</span></li>
            <li><strong>Requires differentiable operations</strong><span>Non-differentiable components need special handling or approximations.</span></li>
          </ul>
        </div>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Quick example</p>
        <h2>Quick Example</h2>
        <p>In a small \(2 \rightarrow 2 \rightarrow 1\) network, the forward pass stores:</p>
        <div class="lesson-formula compact">\[
          \text{cache} = \{A_0,\ Z_1,\ A_1,\ Z_2,\ A_2\}
        \]</div>
        <p>Then the backward pass starts from the output gradient:</p>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial Z^{[2]}} = (A_2-y)\sigma'(Z_2)
        \]</div>
        <p>Next, the hidden-layer gradient sends the output gradient backward:</p>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial Z^{[1]}}
          = (W^{[2]})^T \frac{\partial L}{\partial Z^{[2]}} \odot \sigma'(Z_1)
        \]</div>
        <p>Finally, cached activations form the weight gradients:</p>
        <div class="lesson-formula">\[
          \begin{aligned}
            dW^{[2]} &= \frac{\partial L}{\partial Z^{[2]}}(A_1)^T \\
            dW^{[1]} &= \frac{\partial L}{\partial Z^{[1]}}(A_0)^T
          \end{aligned}
        \]</div>
        <blockquote class="lesson-quote">cache forward values first, then reuse them to compute backward gradients.</blockquote>
      </section>

      <section class="content-section" id="common-mistake">
        <p class="section-kicker">Common mistakes</p>
        <h2>Common Mistakes</h2>
        <div class="metric-reading-list">
          <article><h3>Mistake 1: Thinking backpropagation updates weights directly</h3><p>Backpropagation computes gradients. The optimizer performs the actual update.</p></article>
          <article><h3>Mistake 2: Forgetting cached values</h3><p>Backward formulas need forward-pass values such as \(A^{[l-1]}\) and \(Z^{[l]}\). Without cache, the backward pass becomes inefficient or incorrect.</p></article>
          <article><h3>Mistake 3: Confusing loss with gradient</h3><p>The loss is a scalar error value. The gradient tells how that loss changes when a parameter changes.</p></article>
          <article><h3>Mistake 4: Ignoring branches in computation graphs</h3><p>When multiple paths affect the same variable, their gradient contributions must be added together.</p></article>
        </div>
      </section>

      <section class="content-section takeaway-section reading-copy" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>Backpropagation trains a neural network by reusing cached forward-pass values and applying the chain rule backward. Each layer computes how much its weights contributed to the final loss, producing gradients for the optimizer to use.</p>
      </section>`;
  }

  function renderBackpropSingleNeuronDerivation() {
    return String.raw`
      <section class="derivation-section">
        <h3>1. Forward pass</h3>
        <div class="lesson-formula compact">\[z = wx + b\]</div>
        <div class="lesson-formula compact">\[\hat{y} = \sigma(z)\]</div>
        <div class="lesson-formula compact">\[L = l(\hat{y}, y)\]</div>
        <h3>2. Chain rule</h3>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial w}
          = \frac{\partial L}{\partial \hat{y}}
            \cdot \frac{\partial \hat{y}}{\partial z}
            \cdot \frac{\partial z}{\partial w}
        \]</div>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial b}
          = \frac{\partial L}{\partial \hat{y}}
            \cdot \frac{\partial \hat{y}}{\partial z}
            \cdot \frac{\partial z}{\partial b}
        \]</div>
        <h3>3. Local derivatives</h3>
        <div class="lesson-formula compact">\[
          \frac{\partial z}{\partial w}=x,\qquad
          \frac{\partial z}{\partial b}=1,\qquad
          \frac{\partial \hat{y}}{\partial z}=\sigma'(z)=\hat{y}(1-\hat{y})
        \]</div>
        <h3>4. Weight and bias gradients</h3>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial w}=\frac{\partial L}{\partial z}x,
          \qquad
          \frac{\partial L}{\partial b}=\frac{\partial L}{\partial z}
        \]</div>
        <p>For sigmoid + binary cross-entropy:</p>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial z}=\hat{y}-y,\qquad
          \frac{\partial L}{\partial w}=(\hat{y}-y)x,\qquad
          \frac{\partial L}{\partial b}=\hat{y}-y
        \]</div>
      </section>`;
  }

  function renderBackpropMultiLayerDerivation() {
    return String.raw`
      <section class="derivation-section">
        <h3>1. Forward pass</h3>
        <div class="lesson-formula">\[
          Z^{[l]}=W^{[l]}A^{[l-1]}+b^{[l]},\qquad
          A^{[l]}=g^{[l]}(Z^{[l]})
        \]</div>
        <h3>2. Layer error signal</h3>
        <div class="lesson-formula compact">\[
          \frac{\partial L}{\partial Z^{[l]}}
        \]</div>
        <p>This tells how much the loss changes when pre-activation \(Z^{[l]}\) changes.</p>
        <h3>3. Output-layer gradient</h3>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial Z^{[L]}}
          = \frac{\partial L}{\partial A^{[L]}} \odot g'^{[L]}(Z^{[L]})
        \]</div>
        <h3>4. Hidden-layer gradient</h3>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial Z^{[l]}}
          = \left(W^{[l+1]}\right)^T
            \frac{\partial L}{\partial Z^{[l+1]}}
            \odot g'^{[l]}(Z^{[l]})
        \]</div>
        <h3>5. Parameter gradients</h3>
        <div class="lesson-formula">\[
          \frac{\partial L}{\partial W^{[l]}}
          = \frac{\partial L}{\partial Z^{[l]}}(A^{[l-1]})^T,
          \qquad
          \frac{\partial L}{\partial b^{[l]}}
          = \frac{\partial L}{\partial Z^{[l]}}
        \]</div>
        <p>For mini-batches:</p>
        <div class="lesson-formula">\[
          dW^{[l]}=\frac{1}{m}\frac{\partial L}{\partial Z^{[l]}}(A^{[l-1]})^T,
          \qquad
          db^{[l]}=\frac{1}{m}\sum_{i=1}^{m}
          \frac{\partial L^{(i)}}{\partial Z^{[l](i)}}
        \]</div>
        <h3>6. Parameter update</h3>
        <div class="lesson-formula">\[
          W^{[l]} := W^{[l]}-\alpha dW^{[l]},
          \qquad
          b^{[l]} := b^{[l]}-\alpha db^{[l]}
        \]</div>
        <p>Backpropagation computes the gradients. The optimizer uses them to update the parameters.</p>
      </section>`;
  }

  function renderActivationSupplement() {
    return `
      <section class="content-section reading-copy" id="background">
        <p class="section-kicker">Background</p>
        <h2>Background</h2>
        <p>A neuron first computes a raw score:</p>
        <div class="lesson-formula compact">\\[ z = Wx + b \\]</div>
        <p>If a network only stacks linear transformations, the whole model can still collapse into one larger linear transformation. More layers alone do not create the curved boundaries needed for complex patterns.</p>
        <p>An activation function changes this. It takes the raw score \\(z\\) and transforms it into an activation output:</p>
        <div class="lesson-formula compact">\\[ a = f(z) \\]</div>
        <p>This is where nonlinearity enters the network.</p>
        <p>Different activation functions shape the signal differently. ReLU keeps positive values and removes negative ones. Leaky ReLU keeps a small negative slope so gradients can still flow. Sigmoid compresses values into \\((0,1)\\). Tanh compresses values into \\((-1,1)\\) and is zero-centered.</p>
        <p>The core idea is:</p>
        <p><strong>activation curve \\(f(z)\\) shapes the forward signal, while derivative curve \\(f'(z)\\) controls the backward learning signal.</strong></p>
      </section>

      <section class="content-section reading-copy" id="important-formulas">
        <p class="section-kicker">Important formulas</p>
        <h2>Important formulas</h2>

        <h3 class="reading-subheading">Neuron Transform</h3>
        <div class="lesson-formula compact">\\[ z = Wx + b \\]</div>
        <div class="lesson-formula compact">\\[ a = f(z) \\]</div>
        <dl class="symbol-list">
          <div><dt>\\(z\\)</dt><dd>The raw pre-activation score.</dd></div>
          <div><dt>\\(W\\)</dt><dd>The weight matrix.</dd></div>
          <div><dt>\\(x\\)</dt><dd>The input vector.</dd></div>
          <div><dt>\\(b\\)</dt><dd>The bias term.</dd></div>
          <div><dt>\\(a\\)</dt><dd>The activation output.</dd></div>
          <div><dt>\\(f(z)\\)</dt><dd>The activation function.</dd></div>
        </dl>
        <p>The activation function is applied after the linear score \\(z\\).</p>

        <h3 class="reading-subheading">Backward Signal Through an Activation</h3>
        <div class="lesson-formula">\\[
          \\frac{\\partial L}{\\partial z}
          =
          \\frac{\\partial L}{\\partial a}
          \\odot f'(z)
        \\]</div>
        <dl class="symbol-list">
          <div><dt>\\(L\\)</dt><dd>The loss function.</dd></div>
          <div><dt>\\(\\frac{\\partial L}{\\partial a}\\)</dt><dd>The gradient arriving from later layers.</dd></div>
          <div><dt>\\(\\frac{\\partial L}{\\partial z}\\)</dt><dd>The gradient passed backward through the activation.</dd></div>
          <div><dt>\\(f'(z)\\)</dt><dd>The derivative of the activation function.</dd></div>
          <div><dt>\\(\\odot\\)</dt><dd>Element-wise multiplication.</dd></div>
        </dl>
        <p>This is why the derivative curve matters. If \\(f'(z)\\) is close to zero, the learning signal becomes weak.</p>

        <h3 class="reading-subheading">ReLU</h3>
        <div class="lesson-formula compact">\\[ f(z)=\\max(0,z) \\]</div>
        <div class="lesson-formula">\\[
          f'(z)=
          \\begin{cases}
          0, & z<0 \\\\
          1, & z>0
          \\end{cases}
        \\]</div>
        <ul class="reading-list">
          <li><span>Negative inputs are set to \\(0\\).</span></li>
          <li><span>Positive inputs pass through unchanged.</span></li>
          <li><span>The positive side has a strong constant gradient.</span></li>
          <li><span>The negative side has zero gradient.</span></li>
        </ul>
        <p>At \\(z=0\\), the derivative is usually handled by convention in implementations.</p>

        <h3 class="reading-subheading">Leaky ReLU</h3>
        <div class="lesson-formula">\\[
          f(z)=
          \\begin{cases}
          z, & z\\ge 0 \\\\
          \\alpha z, & z<0
          \\end{cases}
        \\]</div>
        <div class="lesson-formula">\\[
          f'(z)=
          \\begin{cases}
          1, & z>0 \\\\
          \\alpha, & z<0
          \\end{cases}
        \\]</div>
        <dl class="symbol-list">
          <div><dt>\\(\\alpha\\)</dt><dd>A small positive slope, often around \\(0.01\\).</dd></div>
        </dl>
        <ul class="reading-list">
          <li><span>Positive inputs pass through unchanged.</span></li>
          <li><span>Negative inputs are not killed completely.</span></li>
          <li><span>The negative side keeps a small gradient.</span></li>
        </ul>
        <p>Leaky ReLU is designed to reduce the dying ReLU problem.</p>

        <h3 class="reading-subheading">Sigmoid</h3>
        <div class="lesson-formula compact">\\[
          \\sigma(z)=\\frac{1}{1+e^{-z}}
        \\]</div>
        <div class="lesson-formula compact">\\[
          \\sigma'(z)=\\sigma(z)(1-\\sigma(z))
        \\]</div>
        <dl class="symbol-list">
          <div><dt>\\(\\sigma(z)\\)</dt><dd>The sigmoid output.</dd></div>
        </dl>
        <ul class="reading-list">
          <li><span>The output range is \\((0,1)\\).</span></li>
          <li><span>Large positive inputs approach \\(1\\).</span></li>
          <li><span>Large negative inputs approach \\(0\\).</span></li>
          <li><span>Gradients become small in saturated regions.</span></li>
        </ul>
        <p>Sigmoid is useful when the output should behave like a probability, but it is often less suitable for deep hidden layers.</p>

        <h3 class="reading-subheading">Tanh</h3>
        <div class="lesson-formula compact">\\[
          \\tanh(z)=\\frac{e^z-e^{-z}}{e^z+e^{-z}}
        \\]</div>
        <div class="lesson-formula compact">\\[
          \\frac{d}{dz}\\tanh(z)=1-\\tanh^2(z)
        \\]</div>
        <ul class="reading-list">
          <li><span>The output range is \\((-1,1)\\).</span></li>
          <li><span>The output is zero-centered.</span></li>
          <li><span>Large positive inputs approach \\(1\\).</span></li>
          <li><span>Large negative inputs approach \\(-1\\).</span></li>
          <li><span>Gradients become small when \\(|z|\\) is large.</span></li>
        </ul>
        <p>Tanh is more centered than sigmoid, but it can still saturate.</p>
      </section>

      <section class="content-section reading-copy" id="strengths-limits">
        <p class="section-kicker">Pros and Cons</p>
        <h2>Pros and Cons</h2>
        <div class="comparison-list">
          <article>
            <h3>ReLU</h3>
            <h4>Pros</h4>
            <p><strong>Simple and fast.</strong> ReLU is cheap to compute and easy to understand.</p>
            <p><strong>Strong positive-side gradient.</strong> For \\(z>0\\), the derivative is \\(1\\), so gradients can flow well.</p>
            <p><strong>Common hidden-layer choice.</strong> It often works well in deep networks.</p>
            <h4>Cons</h4>
            <p><strong>Can create dead neurons.</strong> If a neuron stays in the negative region, its gradient becomes zero.</p>
            <p><strong>Not zero-centered.</strong> Outputs are always non-negative.</p>
          </article>
          <article>
            <h3>Leaky ReLU</h3>
            <h4>Pros</h4>
            <p><strong>Keeps negative-side gradient.</strong> Negative inputs still receive a small gradient.</p>
            <p><strong>Reduces dying ReLU risk.</strong> The neuron is less likely to become completely inactive.</p>
            <p><strong>Still simple.</strong> It keeps the efficiency and shape of ReLU.</p>
            <h4>Cons</h4>
            <p><strong>Adds one hyperparameter.</strong> The slope \\(\\alpha\\) must be chosen.</p>
            <p><strong>Negative-side signal is still small.</strong> It helps, but the negative region is still much weaker than the positive region.</p>
          </article>
          <article>
            <h3>Sigmoid</h3>
            <h4>Pros</h4>
            <p><strong>Maps to probability range.</strong> The output is between \\(0\\) and \\(1\\), which is useful for binary probability outputs.</p>
            <p><strong>Smooth curve.</strong> The function is continuous and differentiable.</p>
            <h4>Cons</h4>
            <p><strong>Saturates easily.</strong> For large positive or negative \\(z\\), the gradient becomes very small.</p>
            <p><strong>Not zero-centered.</strong> Outputs are always positive, which can make optimization less convenient.</p>
            <p><strong>Poor hidden-layer default.</strong> Using sigmoid in many hidden layers can slow learning.</p>
          </article>
          <article>
            <h3>Tanh</h3>
            <h4>Pros</h4>
            <p><strong>Zero-centered output.</strong> The range \\((-1,1)\\) is often easier to optimize than sigmoid's \\((0,1)\\).</p>
            <p><strong>Smooth bounded output.</strong> It can be useful when centered bounded values are needed.</p>
            <h4>Cons</h4>
            <p><strong>Still saturates.</strong> For large \\(|z|\\), gradients become very small.</p>
            <p><strong>Can slow deep networks.</strong> Repeated saturation can weaken gradient flow across layers.</p>
          </article>
        </div>
      </section>

      <section class="content-section reading-copy" id="example-guidance">
        <p class="section-kicker">Quick Example</p>
        <h2>Quick Example</h2>
        <p>Suppose the raw neuron score is:</p>
        <div class="lesson-formula compact">\\[ z=-2 \\]</div>
        <p>Different activations transform the same score differently:</p>
        <table class="lesson-table example-table">
          <thead><tr><th>Activation</th><th>Output</th></tr></thead>
          <tbody>
            <tr><td>ReLU</td><td>\\(0\\)</td></tr>
            <tr><td>Leaky ReLU, \\(\\alpha=0.01\\)</td><td>\\(-0.02\\)</td></tr>
            <tr><td>Sigmoid</td><td>\\(\\approx 0.12\\)</td></tr>
            <tr><td>Tanh</td><td>\\(\\approx -0.96\\)</td></tr>
          </tbody>
        </table>
        <p>The same raw score can be killed, slightly passed, compressed into probability range, or centered into \\((-1,1)\\).</p>
        <p>Now compare a positive score:</p>
        <div class="lesson-formula compact">\\[ z=2 \\]</div>
        <table class="lesson-table example-table">
          <thead><tr><th>Activation</th><th>Output</th></tr></thead>
          <tbody>
            <tr><td>ReLU</td><td>\\(2\\)</td></tr>
            <tr><td>Leaky ReLU</td><td>\\(2\\)</td></tr>
            <tr><td>Sigmoid</td><td>\\(\\approx 0.88\\)</td></tr>
            <tr><td>Tanh</td><td>\\(\\approx 0.96\\)</td></tr>
          </tbody>
        </table>
        <p>ReLU and Leaky ReLU keep positive values large. Sigmoid and Tanh compress them into bounded ranges.</p>
        <p>This is why activation choice changes both the forward signal and the learning behavior.</p>
      </section>

      <section class="content-section reading-copy" id="common-mistake">
        <p class="section-kicker">Common Mistakes</p>
        <h2>Common Mistakes</h2>
        <div class="mistake-list">
          <article><h3>Mistake 1: Thinking activation only affects the forward pass</h3><p>Activation functions also affect backpropagation through \\(f'(z)\\). A good-looking output curve can still cause weak gradients.</p></article>
          <article><h3>Mistake 2: Using sigmoid everywhere</h3><p>Sigmoid is useful for binary probability outputs, but using it in many hidden layers can cause saturation and slow learning.</p></article>
          <article><h3>Mistake 3: Forgetting ReLU can die</h3><p>If a ReLU neuron keeps receiving negative \\(z\\) values, its output stays \\(0\\), and its gradient also stays \\(0\\).</p></article>
          <article><h3>Mistake 4: Thinking bounded output is always better</h3><p>Sigmoid and Tanh have clean bounded ranges, but their gradients become small in saturated regions.</p></article>
          <article><h3>Mistake 5: Confusing hidden-layer activation with output activation</h3><p>Hidden layers usually need activations that support gradient flow. The final layer depends on the task, such as binary classification, multi-class classification, or regression.</p></article>
        </div>
      </section>

      <section class="content-section reading-copy" id="takeaway">
        <p class="section-kicker">Takeaway</p>
        <h2>Takeaway</h2>
        <p>Activation functions turn raw linear scores into nonlinear signals.</p>
        <p>The forward curve \\(f(z)\\) decides what value passes to the next layer. The derivative curve \\(f'(z)\\) decides how much learning signal flows backward.</p>
        <p>ReLU and Leaky ReLU are common hidden-layer choices because they keep gradients active more easily. Sigmoid and Tanh are useful when bounded outputs are needed, but they can saturate and weaken gradient flow.</p>
      </section>`;
  }

  function readingSections() {
    if (config.readingMode === "activation-supplement") {
      return renderActivationSupplement();
    }
    if (config.readingMode === "evaluation-supplement") {
      return renderEvaluationSupplement();
    }
    if (config.readingMode === "bias-variance-supplement") {
      return renderBiasVarianceSupplement();
    }
    if (config.readingMode === "rnn-supplement") {
      return renderRnnSupplement();
    }
    if (config.readingMode === "gradient-supplement") {
      return renderGradientSupplement();
    }
    if (config.readingMode === "dropout-supplement") {
      return renderDropoutSupplement();
    }
    if (config.readingMode === "convolution-supplement") {
      return renderConvolutionSupplement();
    }
    if (config.readingMode === "backpropagation-supplement") {
      return renderBackpropagationSupplement();
    }
    if (!config.reservedReading) {
      return renderNotes(config.notes);
    }
    return [
      renderReservedSection("background", "Background"),
      renderReservedSection("important-formulas", "Important formulas"),
      renderReservedSection("strengths-limits", "Pros / Cons"),
      renderReservedSection("example-guidance", "Example / Mistake"),
    ].join("");
  }

  function navigationLinks() {
    if (config.readingMode === "activation-supplement") {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["important-formulas", "Important formulas"],
        ["strengths-limits", "Pros / Cons"],
        ["example-guidance", "Quick Example"],
        ["common-mistake", "Common Mistakes"],
        ["takeaway", "Takeaway"],
      ];
    }
    if (config.readingMode === "evaluation-supplement") {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["idea", "Idea"],
        ["important-formulas", "Formula"],
        ["symbols", "Symbols"],
        ["example-guidance", "Example"],
        ["workflow", "Workflow"],
        ["strengths-limits", "Pros / Cons"],
        ["common-mistake", "Common Mistake"],
        ["takeaway", "Takeaway"],
      ];
    }
    if (config.readingMode === "bias-variance-supplement") {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["important-formulas", "Important formulas"],
        ["diagnosis-table", "Diagnosis table"],
        ["example-guidance", "Example"],
        ["recommended-fix", "Recommended fix"],
        ["strengths-limits", "Pros / Cons"],
        ["common-mistake", "Common Mistake"],
        ["takeaway", "Takeaway"],
      ];
    }
    if (config.readingMode === "rnn-supplement") {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["idea", "Idea"],
        ["important-formulas", "Formula"],
        ["rnn-structures", "RNN Structures"],
        ["example-guidance", "Example"],
        ["strengths-limits", "Pros / Cons"],
        ["common-mistake", "Common Mistake"],
      ];
    }
    if (config.readingMode === "gradient-supplement") {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["important-formulas", "Formulas"],
        ["example-guidance", "Example"],
        ["strengths-limits", "Pros / Cons"],
        ["common-mistake", "Common Mistakes"],
        ["takeaway", "Takeaway"],
      ];
    }
    if (["dropout-supplement", "convolution-supplement", "backpropagation-supplement"].includes(config.readingMode)) {
      return [
        ["interactive-prototype", "Interactive lesson"],
        ["background", "Background"],
        ["important-formulas", "Important formulas"],
        ["strengths-limits", "Pros / Cons"],
        ["example-guidance", "Quick Example"],
        ["common-mistake", "Common Mistakes"],
        ["takeaway", "Takeaway"],
      ];
    }
    return [
      ["interactive-prototype", "Interactive lesson"],
      ["background", "Background"],
      ["important-formulas", "Important formulas"],
      ["strengths-limits", "Pros / Cons"],
      ["example-guidance", "Example / Mistake"],
    ];
  }

  function renderNavigationLinks() {
    return navigationLinks()
      .map(([id, label]) => `<a href="#${id}">${label}</a>`)
      .join("");
  }

  function typesetSupplementMath() {
    if (
      ![
        "evaluation-supplement",
        "bias-variance-supplement",
        "rnn-supplement",
        "gradient-supplement",
        "dropout-supplement",
        "convolution-supplement",
        "backpropagation-supplement",
        "activation-supplement",
      ].includes(config.readingMode)
    ) return;
    window.MathJax = {
      tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"]],
      },
    };
    const mathScript = document.createElement("script");
    mathScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    mathScript.async = true;
    mathScript.onload = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax
          .typesetPromise([document.querySelector("main"), document.getElementById("calculation-drawer")])
          .catch(() => {});
      }
    };
    document.head.appendChild(mathScript);
  }

  function initializeEvaluationInteraction() {
    const root = document.getElementById("evaluation-interaction");
    if (!root) return;

    const samples = [
      { score: 0.97, label: 1 }, { score: 0.95, label: 1 }, { score: 0.93, label: 1 },
      { score: 0.91, label: 1 }, { score: 0.89, label: 0 }, { score: 0.86, label: 1 },
      { score: 0.83, label: 0 }, { score: 0.81, label: 1 }, { score: 0.78, label: 1 },
      { score: 0.75, label: 0 }, { score: 0.72, label: 1 }, { score: 0.69, label: 0 },
      { score: 0.66, label: 1 }, { score: 0.63, label: 0 }, { score: 0.60, label: 1 },
      { score: 0.57, label: 0 }, { score: 0.54, label: 1 }, { score: 0.50, label: 0 },
      { score: 0.46, label: 1 }, { score: 0.42, label: 0 }, { score: 0.38, label: 0 },
      { score: 0.32, label: 1 }, { score: 0.24, label: 0 }, { score: 0.12, label: 0 },
    ];
    const metricCopy = {
      accuracy: {
        label: "Accuracy",
        cells: ["tp", "tn"],
        insight: "Accuracy measures overall correctness, but it can hide missed positives when the classes are imbalanced.",
        formula: (counts) => String.raw`\[
          \text{Accuracy} = \frac{${counts.TP} + ${counts.TN}}{${counts.total}} = ${counts.accuracy.toFixed(2)}
        \]`,
      },
      precision: {
        label: "Precision",
        cells: ["tp", "fp"],
        insight: "Precision measures how trustworthy positive predictions are. It matters most when false alarms are costly.",
        formula: (counts) => String.raw`\[
          \text{Precision} = \frac{${counts.TP}}{${counts.TP} + ${counts.FP}} = ${counts.precision.toFixed(2)}
        \]`,
      },
      recall: {
        label: "Recall",
        cells: ["tp", "fn"],
        insight: "Recall measures how many real positives are found. It matters most when missed cases are costly.",
        formula: (counts) => String.raw`\[
          \text{Recall} = \frac{${counts.TP}}{${counts.TP} + ${counts.FN}} = ${counts.recall.toFixed(2)}
        \]`,
      },
      f1: {
        label: "F1 Score",
        cells: ["tp", "fp", "fn"],
        insight: "F1 balances precision and recall. It is useful when both false alarms and missed positives matter.",
        formula: (counts) => String.raw`\[
          F_1 = \frac{2 \cdot ${counts.TP}}{2 \cdot ${counts.TP} + ${counts.FP} + ${counts.FN}} = ${counts.f1.toFixed(2)}
        \]`,
      },
    };
    const slider = root.querySelector("#evaluation-threshold");
    const thresholdOutput = root.querySelector("#evaluation-threshold-value");
    const scoreStrip = root.querySelector("#evaluation-score-strip");
    const selectedLabel = root.querySelector("#evaluation-selected-label");
    const liveFormula = root.querySelector("#evaluation-live-formula");
    const insight = root.querySelector("#evaluation-insight");
    const metricButtons = root.querySelectorAll("[data-evaluation-metric], [data-evaluation-card]");
    const matrixCells = {
      tp: root.querySelector("#evaluation-tp"),
      fp: root.querySelector("#evaluation-fp"),
      fn: root.querySelector("#evaluation-fn"),
      tn: root.querySelector("#evaluation-tn"),
    };
    let selectedMetric = "precision";

    function safeDivide(numerator, denominator) {
      return denominator === 0 ? 0 : numerator / denominator;
    }

    function countsForThreshold(threshold) {
      let TP = 0;
      let FP = 0;
      let FN = 0;
      let TN = 0;
      samples.forEach((sample) => {
        const predictsPositive = sample.score >= threshold;
        if (sample.label === 1 && predictsPositive) TP += 1;
        else if (sample.label === 0 && predictsPositive) FP += 1;
        else if (sample.label === 1) FN += 1;
        else TN += 1;
      });
      const total = TP + FP + FN + TN;
      const accuracy = safeDivide(TP + TN, total);
      const precision = safeDivide(TP, TP + FP);
      const recall = safeDivide(TP, TP + FN);
      const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
      return { TP, FP, FN, TN, total, accuracy, precision, recall, f1 };
    }

    function percent(value) {
      return `${Math.round(value * 100)}%`;
    }

    function category(sample, threshold) {
      const predictsPositive = sample.score >= threshold;
      if (sample.label === 1 && predictsPositive) return "tp";
      if (sample.label === 0 && predictsPositive) return "fp";
      if (sample.label === 1) return "fn";
      return "tn";
    }

    function renderScoreStrip(threshold) {
      const start = 44;
      const span = 812;
      const thresholdX = start + span * threshold;
      const circles = samples
        .map((sample, index) => {
          const x = start + span * sample.score;
          const y = index % 2 === 0 ? 91 : 119;
          return `<circle class="${category(sample, threshold)}" cx="${x}" cy="${y}" r="7"></circle>`;
        })
        .join("");
      scoreStrip.innerHTML = `
        <text x="${start}" y="26">More likely negative</text>
        <text x="${start + span}" y="26" text-anchor="end">More likely positive</text>
        <rect class="negative-region" x="${start}" y="48" width="${thresholdX - start}" height="88" rx="14"></rect>
        <rect class="positive-region" x="${thresholdX}" y="48" width="${start + span - thresholdX}" height="88" rx="14"></rect>
        <line class="threshold-line" x1="${thresholdX}" y1="39" x2="${thresholdX}" y2="142"></line>
        <rect class="threshold-label" x="${thresholdX - 40}" y="31" width="80" height="24" rx="7"></rect>
        <text class="threshold-text" x="${thresholdX}" y="47" text-anchor="middle">${threshold.toFixed(2)}</text>
        ${circles}
        <text class="range-text" x="${start}" y="155">0.0</text>
        <text class="range-text" x="${start + span}" y="155" text-anchor="end">1.0</text>`;
    }

    function typesetLiveFormula() {
      if (!window.MathJax || !window.MathJax.typesetPromise) return;
      if (window.MathJax.typesetClear) window.MathJax.typesetClear([liveFormula]);
      window.MathJax.typesetPromise([liveFormula]).catch(() => {});
    }

    function render() {
      const threshold = Number(slider.value);
      const counts = countsForThreshold(threshold);
      const current = metricCopy[selectedMetric];
      thresholdOutput.textContent = threshold.toFixed(2);
      root.querySelector("#evaluation-total").textContent = String(counts.total);
      Object.entries(matrixCells).forEach(([key, cell]) => {
        cell.querySelector("strong").textContent = String(counts[key.toUpperCase()]);
        cell.classList.toggle("is-relevant", current.cells.includes(key));
        cell.classList.toggle("is-muted", !current.cells.includes(key));
      });
      root.querySelector("#evaluation-value-accuracy").textContent = percent(counts.accuracy);
      root.querySelector("#evaluation-value-precision").textContent = percent(counts.precision);
      root.querySelector("#evaluation-value-recall").textContent = percent(counts.recall);
      root.querySelector("#evaluation-value-f1").textContent = percent(counts.f1);
      metricButtons.forEach((button) => {
        const metric = button.dataset.evaluationMetric || button.dataset.evaluationCard;
        button.classList.toggle("is-selected", metric === selectedMetric);
      });
      selectedLabel.textContent = current.label;
      liveFormula.innerHTML = current.formula(counts);
      insight.textContent = current.insight;
      renderScoreStrip(threshold);
      typesetLiveFormula();
    }

    metricButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedMetric = button.dataset.evaluationMetric || button.dataset.evaluationCard;
        render();
      });
    });
    slider.addEventListener("input", render);
    render();
  }

  function initializeBiasVarianceInteraction() {
    const root = document.getElementById("bias-interaction");
    if (!root) return;

    const state = {
      human: 0.5,
      train: 7.0,
      trainDev: 10.0,
      dev: 12.0,
      test: 12.0,
      mismatchMode: true,
    };
    const scenarios = {
      high_bias: { human: 0.5, train: 11.5, trainDev: 12.2, dev: 13.1, test: 13.2 },
      high_variance: { human: 0.5, train: 3.0, trainDev: 8.5, dev: 9.0, test: 9.1 },
      good_fit: { human: 0.5, train: 1.4, trainDev: 1.8, dev: 2.0, test: 2.1 },
      mismatch: { human: 0.5, train: 1.3, trainDev: 1.8, dev: 8.6, test: 8.7 },
      dev_overfit: { human: 0.5, train: 1.8, trainDev: 2.6, dev: 3.0, test: 5.5 },
    };
    const inputs = {
      human: root.querySelector("#bias-human"),
      train: root.querySelector("#bias-train"),
      trainDev: root.querySelector("#bias-train-dev"),
      dev: root.querySelector("#bias-dev"),
      test: root.querySelector("#bias-test"),
    };
    const readouts = {
      human: root.querySelector("#bias-read-human"),
      train: root.querySelector("#bias-read-train"),
      trainDev: root.querySelector("#bias-read-train-dev"),
      dev: root.querySelector("#bias-read-dev"),
      test: root.querySelector("#bias-read-test"),
    };
    const controlValues = {
      human: root.querySelector("#bias-human-value"),
      train: root.querySelector("#bias-train-value"),
      trainDev: root.querySelector("#bias-train-dev-value"),
      dev: root.querySelector("#bias-dev-value"),
      test: root.querySelector("#bias-test-value"),
    };
    const bars = {
      human: root.querySelector("#bias-bar-human"),
      train: root.querySelector("#bias-bar-train"),
      trainDev: root.querySelector("#bias-bar-train-dev"),
      dev: root.querySelector("#bias-bar-dev"),
      test: root.querySelector("#bias-bar-test"),
    };
    const presetButtons = root.querySelectorAll("[data-bias-preset]");
    const baselineButtons = root.querySelectorAll("[data-bias-human]");
    const modeButtons = root.querySelectorAll("[data-bias-mode]");

    function fmt(value) {
      return `${Number(value).toFixed(1)}%`;
    }

    function syncInputs() {
      inputs.human.value = state.human;
      inputs.train.value = state.train;
      inputs.trainDev.value = state.trainDev;
      inputs.dev.value = state.dev;
      inputs.test.value = state.test;
    }

    function computeGaps() {
      const bias = Math.max(0, state.train - state.human);
      const variance = state.mismatchMode
        ? Math.max(0, state.trainDev - state.train)
        : Math.max(0, state.dev - state.train);
      const mismatch = state.mismatchMode ? Math.max(0, state.dev - state.trainDev) : 0;
      const devOverfit = Math.max(0, state.test - state.dev);
      return { bias, variance, mismatch, devOverfit };
    }

    function diagnose() {
      const gaps = computeGaps();
      const candidates = [
        { key: "bias", label: "High bias", value: gaps.bias },
        { key: "variance", label: "High variance", value: gaps.variance },
        { key: "mismatch", label: "Data mismatch", value: state.mismatchMode ? gaps.mismatch : -1 },
        { key: "dev-overfit", label: "Dev overfitting", value: gaps.devOverfit },
      ].sort((left, right) => right.value - left.value);
      const top = candidates[0];
      const second = candidates[1];
      const confidence = top.value - second.value > 1.0 ? "Clear" : top.value - second.value > 0.3 ? "Moderate" : "Mixed";

      if (top.value < 1.0 && state.dev <= Math.max(state.human + 2.0, 3.0)) {
        return {
          type: "good",
          status: "Good fit",
          issue: "Balanced",
          confidence: "Healthy",
          largest: Math.max(gaps.bias, gaps.variance, gaps.mismatch, gaps.devOverfit),
          focus: "Maintain",
          reason: "No gap dominates strongly, and the overall error levels are reasonably close to the human-level baseline.",
        };
      }
      if (top.key === "bias") {
        return {
          type: "bias",
          status: "High bias",
          issue: "Bias",
          confidence,
          largest: gaps.bias,
          focus: "Fit training",
          reason: "The human-level to training gap is dominant, so the model still struggles to fit the training distribution well.",
        };
      }
      if (top.key === "variance") {
        return {
          type: "variance",
          status: "High variance",
          issue: "Variance",
          confidence,
          largest: gaps.variance,
          focus: "Generalize",
          reason: state.mismatchMode
            ? "Training is much better than training-dev, so the model is not generalizing well to unseen examples from the same distribution."
            : "Training is much better than dev, so the dominant issue is generalization rather than fitting.",
        };
      }
      if (top.key === "mismatch") {
        return {
          type: "mismatch",
          status: "Data mismatch",
          issue: "Mismatch",
          confidence,
          largest: gaps.mismatch,
          focus: "Match data",
          reason: "Training-dev remains much better than dev, so distribution shift is a major part of the performance drop.",
        };
      }
      return {
        type: "dev-overfit",
        status: "Dev overfitting",
        issue: "Dev overfit",
        confidence,
        largest: gaps.devOverfit,
        focus: "Be honest",
        reason: "Test error is notably worse than dev error, which suggests repeated iteration may be overfitting to the dev set.",
      };
    }

    function renderBarsAndGaps() {
      const maxError = Math.max(15, state.human, state.train, state.trainDev, state.dev, state.test) + 2;
      Object.entries({ human: state.human, train: state.train, trainDev: state.trainDev, dev: state.dev, test: state.test }).forEach(
        ([key, value]) => {
          readouts[key].textContent = fmt(value);
          controlValues[key].textContent = fmt(value);
          bars[key].style.width = `${((100 * value) / maxError).toFixed(1)}%`;
        },
      );
      const gaps = computeGaps();
      root.querySelector("#bias-gap-bias").textContent = fmt(gaps.bias);
      root.querySelector("#bias-gap-variance").textContent = fmt(gaps.variance);
      root.querySelector("#bias-gap-mismatch").textContent = fmt(gaps.mismatch);
      root.querySelector("#bias-gap-dev-overfit").textContent = fmt(gaps.devOverfit);
      root.querySelector("#bias-gap-variance-note").textContent = state.mismatchMode
        ? "Train to training-dev gap"
        : "Train to dev gap";
      root.querySelector("#bias-row-train-dev").hidden = !state.mismatchMode;
      root.querySelector("#bias-gap-block-mismatch").hidden = !state.mismatchMode;
    }

    function renderCurve() {
      const svg = root.querySelector("#bias-curve");
      const width = 760;
      const height = 240;
      const pad = { left: 44, right: 20, top: 20, bottom: 36 };
      const plotWidth = width - pad.left - pad.right;
      const plotHeight = height - pad.top - pad.bottom;
      const points = Array.from({ length: 12 }, (_, index) => {
        const x = index + 1;
        const bias = Math.max(0, state.train - state.human);
        const deviation = Math.max(0, state.dev - state.train) * 0.15;
        const train = 12 / (x + 1.8) + bias * 0.18 + 0.3;
        let dev = 11 / (x + 0.8) + 0.33 * x + 0.012 * Math.pow(x - 5.5, 2) + deviation;
        if (state.mismatchMode) dev += Math.max(0, state.dev - state.trainDev) * 0.18;
        return { x, train, dev };
      });
      const maxY = Math.max(...points.flatMap((point) => [point.train, point.dev])) + 1;
      const scaleX = (x) => pad.left + ((x - 1) / 11) * plotWidth;
      const scaleY = (y) => pad.top + plotHeight - (y / maxY) * plotHeight;
      const pathFor = (key) =>
        points.map((point, index) => `${index === 0 ? "M" : "L"}${scaleX(point.x).toFixed(1)} ${scaleY(point[key]).toFixed(1)}`).join(" ");
      const selectedIndex = Math.max(1, Math.min(12, Math.round((state.train + state.dev) / 4)));
      const selected = points[selectedIndex - 1];
      svg.innerHTML = `
        ${Array.from({ length: 5 }, (_, index) => {
          const y = pad.top + (plotHeight * index) / 4;
          return `<line class="bias-grid-line" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line>`;
        }).join("")}
        <path class="bias-curve-train" d="${pathFor("train")}"></path>
        <path class="bias-curve-dev" d="${pathFor("dev")}"></path>
        <circle class="bias-curve-train-point" cx="${scaleX(selectedIndex)}" cy="${scaleY(selected.train)}" r="5"></circle>
        <circle class="bias-curve-dev-point" cx="${scaleX(selectedIndex)}" cy="${scaleY(selected.dev)}" r="5"></circle>
        <text x="${pad.left}" y="14">error</text>
        <text x="${width - pad.right}" y="${height - 8}" text-anchor="end">model complexity</text>`;
    }

    function renderDiagnosis() {
      const diagnosis = diagnose();
      const result = root.querySelector("#bias-diagnosis-result");
      result.dataset.kind = diagnosis.type;
      root.querySelector("#bias-status").textContent = diagnosis.status;
      root.querySelector("#bias-issue").textContent = diagnosis.issue;
      root.querySelector("#bias-confidence").textContent = diagnosis.confidence;
      root.querySelector("#bias-largest").textContent = fmt(diagnosis.largest);
      root.querySelector("#bias-focus").textContent = diagnosis.focus;
      root.querySelector("#bias-reason").textContent = diagnosis.reason;
    }

    function render() {
      renderBarsAndGaps();
      renderCurve();
      renderDiagnosis();
    }

    Object.entries(inputs).forEach(([key, input]) => {
      input.addEventListener("input", () => {
        state[key] = Number(input.value);
        presetButtons.forEach((button) => button.classList.remove("is-selected"));
        render();
      });
    });
    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        presetButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
        Object.assign(state, scenarios[button.dataset.biasPreset]);
        syncInputs();
        baselineButtons.forEach((item) => item.classList.toggle("is-selected", Number(item.dataset.biasHuman) === state.human));
        render();
      });
    });
    baselineButtons.forEach((button) => {
      button.addEventListener("click", () => {
        baselineButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
        state.human = Number(button.dataset.biasHuman);
        inputs.human.value = state.human;
        presetButtons.forEach((item) => item.classList.remove("is-selected"));
        render();
      });
    });
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.mismatchMode = button.dataset.biasMode === "mismatch";
        modeButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
        render();
      });
    });

    syncInputs();
    render();
  }

  function drawerBlocks() {
    if (config.drawerMode === "empty") {
      return '<div class="drawer-empty" aria-label="Reserved explanation drawer"></div>';
    }
    if (config.drawerMode === "backprop-tabs") {
      return `
        <nav class="drawer-tabs" aria-label="Backpropagation detail views">
          <button type="button" data-drawer-tab="single-neuron">Single Neuron</button>
          <button type="button" data-drawer-tab="multi-layer">Multi-layer Network</button>
          <button class="is-selected" type="button" data-drawer-tab="live-detail">Live detail</button>
        </nav>
        <div class="drawer-panel" data-drawer-panel="single-neuron">
          ${renderBackpropSingleNeuronDerivation()}
        </div>
        <div class="drawer-panel" data-drawer-panel="multi-layer">
          ${renderBackpropMultiLayerDerivation()}
        </div>
        <div class="drawer-panel is-selected" data-drawer-panel="live-detail">
          ${config.mirrorBlocks
            .map(
              (block, index) => `
                <section class="drawer-reading-block">
                  <h3>${escapeHtml(block.title)}</h3>
                  <div class="mirror-content drawer-math-reading" data-mirror-block="${index}"></div>
                </section>`,
            )
            .join("")}
        </div>`;
    }
    return config.mirrorBlocks
      .map(
        (block, index) => `
          <section class="drawer-reading-block">
            <h3>${escapeHtml(block.title)}</h3>
            <div class="mirror-content drawer-math-reading" data-mirror-block="${index}"></div>
          </section>`,
      )
      .join("");
  }

  document.title = `${config.title} | Topic Design Preview`;
  document.body.className = `navigation-open preview-${slug}`;
  document.body.innerHTML = `
    <header class="topic-topbar">
      <div class="topbar-inner">
        <a class="brand" href="#">
          <span class="brand-dot"></span>
          Deep Learning Visualized
        </a>
        <div class="topbar-actions">
          <span class="preview-label">Topic design preview</span>
          <a class="back-module-link" href="${config.moduleUrl}">Back to module</a>
        </div>
      </div>
    </header>
    <button class="navigation-toggle" id="navigation-drawer-toggle" type="button" aria-controls="navigation-drawer" aria-expanded="true">
      <span class="visually-hidden">Collapse section navigation</span>
      <svg class="sidebar-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="3" width="15" height="14" rx="3" stroke-width="1.5"></rect>
        <path d="M8 3.5V16.5" stroke-width="1.5"></path>
      </svg>
    </button>
    <button class="calculation-drawer-toggle" id="calculation-drawer-toggle" type="button" aria-controls="calculation-drawer" aria-expanded="false">
      <span class="visually-hidden">Open explanation drawer</span>
      <span class="drawer-icon" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <div class="page">
      <aside class="navigation-drawer" id="navigation-drawer" aria-hidden="false">
        <nav class="toc" aria-label="Topic sections">
          <p class="toc-label">On This Page</p>
          ${renderNavigationLinks()}
        </nav>
      </aside>
      <main>
        <section class="hero" aria-label="Topic introduction">
          <p class="kicker">${escapeHtml(config.moduleLabel)}</p>
          <h1>${escapeHtml(config.title)}</h1>
          <p class="lede">${escapeHtml(config.subtitle)}</p>
          <div class="hero-meta"><span>Visual design preview</span><span>${config.interactionMode?.startsWith("inline-") ? "Concept interaction restyled" : "Original interaction preserved"}</span></div>
        </section>
        <section class="content-section" id="interactive-prototype">
          <p class="section-kicker">Explore</p>
          <h2>Interactive lesson</h2>
          <div class="interactive-stage">
            ${renderInteraction()}
          </div>
        </section>
        ${readingSections()}
      </main>
    </div>
    <button class="navigation-backdrop" id="navigation-backdrop" type="button" aria-label="Close section navigation"></button>
    <button class="drawer-backdrop" id="drawer-backdrop" type="button" aria-label="Close explanation drawer"></button>
    <aside class="calculation-drawer" id="calculation-drawer" aria-hidden="true" inert>
      <header class="drawer-header">
        <div>
          <p class="drawer-label">${config.drawerMode === "empty" ? "Reserved panel" : "Explanation"}</p>
          <h2>${config.drawerMode === "empty" ? "Reading panel" : "Live details"}</h2>
        </div>
        <button class="drawer-close" id="calculation-drawer-close" type="button" aria-label="Close explanation drawer">&times;</button>
      </header>
      ${drawerBlocks()}
    </aside>`;

  const narrowLayout = window.matchMedia("(max-width: 980px)");
  const navigationDrawer = document.getElementById("navigation-drawer");
  const navigationToggle = document.getElementById("navigation-drawer-toggle");
  const navigationBackdrop = document.getElementById("navigation-backdrop");
  const drawer = document.getElementById("calculation-drawer");
  const drawerToggle = document.getElementById("calculation-drawer-toggle");
  const drawerClose = document.getElementById("calculation-drawer-close");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const frame = document.getElementById("prototype-frame");

  typesetSupplementMath();
  initializeEvaluationInteraction();
  initializeBiasVarianceInteraction();

  function setNavigationOpen(isOpen) {
    const mobile = narrowLayout.matches;
    navigationDrawer.setAttribute("aria-hidden", String(!isOpen));
    navigationToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("navigation-collapsed", !mobile && !isOpen);
    document.body.classList.toggle("navigation-mobile-open", mobile && isOpen);
    if (isOpen) {
      navigationDrawer.removeAttribute("inert");
      if (mobile) setDrawerOpen(false);
    } else {
      navigationDrawer.setAttribute("inert", "");
    }
  }

  function setDrawerOpen(isOpen) {
    if (isOpen && narrowLayout.matches) {
      setNavigationOpen(false);
    }
    drawer.classList.toggle("is-open", isOpen);
    drawer.setAttribute("aria-hidden", String(!isOpen));
    drawerToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("drawer-open", isOpen);
    if (isOpen) {
      drawer.removeAttribute("inert");
    } else {
      drawer.setAttribute("inert", "");
    }
  }

  function initializeNavigationForViewport() {
    setNavigationOpen(!narrowLayout.matches);
  }

  navigationToggle.addEventListener("click", () => {
    setNavigationOpen(navigationDrawer.getAttribute("aria-hidden") === "true");
  });
  navigationBackdrop.addEventListener("click", () => setNavigationOpen(false));
  navigationDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (narrowLayout.matches) setNavigationOpen(false);
    });
  });
  drawerToggle.addEventListener("click", () => setDrawerOpen(drawer.getAttribute("aria-hidden") === "true"));
  drawerClose.addEventListener("click", () => setDrawerOpen(false));
  drawerBackdrop.addEventListener("click", () => setDrawerOpen(false));
  narrowLayout.addEventListener("change", initializeNavigationForViewport);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (drawer.getAttribute("aria-hidden") === "false") {
      setDrawerOpen(false);
      drawerToggle.focus();
      return;
    }
    if (narrowLayout.matches && navigationDrawer.getAttribute("aria-hidden") === "false") {
      setNavigationOpen(false);
      navigationToggle.focus();
    }
  });

  function setBackpropDrawerView(view) {
    if (config.drawerMode !== "backprop-tabs") return;
    drawer.querySelectorAll("[data-drawer-tab]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.drawerTab === view);
    });
    drawer.querySelectorAll("[data-drawer-panel]").forEach((panel) => {
      panel.classList.toggle("is-selected", panel.dataset.drawerPanel === view);
    });
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([drawer]).catch(() => {});
    }
  }

  function initializeBackpropDrawerViews() {
    if (config.drawerMode !== "backprop-tabs") return;
    document.querySelectorAll("[data-drawer-view]").forEach((button) => {
      button.addEventListener("click", () => {
        setBackpropDrawerView(button.dataset.drawerView);
        setDrawerOpen(true);
      });
    });
    drawer.querySelectorAll("[data-drawer-tab]").forEach((button) => {
      button.addEventListener("click", () => setBackpropDrawerView(button.dataset.drawerTab));
    });
    setBackpropDrawerView("live-detail");
  }

  function removeDuplicateOutputPanels(frameDocument) {
    for (const hidden of config.hideNodes || []) {
      let node = frameDocument.querySelector(hidden.selector);
      for (let index = 0; node && index < hidden.up; index += 1) {
        node = node.parentElement;
      }
      if (node) node.style.setProperty("display", "none", "important");
    }
  }

  function updateMirroredBlocks(frameDocument) {
    if (!["mirror", "backprop-tabs"].includes(config.drawerMode)) return;
    config.mirrorBlocks.forEach((block, index) => {
      const output = drawer.querySelector(`[data-mirror-block="${index}"]`);
      let needsTypeset = false;
      const mirrorContent = block.sources
        .map((selector) => {
          const source = frameDocument.querySelector(selector);
          if (source && source.dataset.drawerLatex) {
            needsTypeset = true;
            return `<div>${escapeHtml(source.dataset.drawerLatex)}</div>`;
          }
          return source ? `<div>${source.innerHTML}</div>` : "";
        })
        .join("");
      if (output.dataset.mirrorContent === mirrorContent) return;
      output.dataset.mirrorContent = mirrorContent;
      output.innerHTML = mirrorContent;
      if (needsTypeset && window.MathJax && window.MathJax.typesetPromise) {
        if (window.MathJax.typesetClear) window.MathJax.typesetClear([output]);
        window.MathJax.typesetPromise([output]).catch(() => {});
      }
    });
  }

  function frameTreatmentCss() {
    if (config.frameTreatment === "rnn-editorial") {
      return `
        body { background: transparent !important; padding: 0 !important; }
        .nav, .hero { display: none !important; }
        .main { margin: 0 !important; max-width: none !important; }
        .panel { background: transparent !important; border: 0 !important; border-radius: 0 !important; }
        .tabs-row { border-top: 1px solid #e8e5ee !important; border-bottom-color: #e8e5ee !important; }
        .arch-tab { border-color: #e8e5ee !important; color: #585566 !important; }
        .arch-tab.active { background: #6c5ce7 !important; color: #ffffff !important; }
        .controls .btn.pri { background: #6c5ce7 !important; border-color: #6c5ce7 !important; }
        .visual-legend, .pill-bar, .hs-bar, .controls { border-color: #e8e5ee !important; }
      `;
    }
    if (config.frameTreatment === "dropout-editorial") {
      return `
        body { background: transparent !important; }
        #dropout-page-87f74045 .page {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          margin: 0 !important;
          min-height: 0 !important;
        }
        #dropout-page-87f74045 .nav,
        #dropout-page-87f74045 .hero,
        #dropout-page-87f74045 .section-label {
          display: none !important;
        }
        #dropout-page-87f74045 .main {
          gap: 0 !important;
          margin: 0 !important;
          max-width: none !important;
          padding: 0 !important;
        }
        #dropout-page-87f74045 .panel,
        #dropout-page-87f74045 .stage-panel {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        #dropout-page-87f74045 .board {
          border-color: #242341 !important;
          border-radius: 10px !important;
          padding: 14px !important;
        }
        #dropout-page-87f74045 .pill-btn.primary,
        #dropout-page-87f74045 .step-pill.active {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
          color: #ffffff !important;
        }
        #dropout-page-87f74045 .pill-btn.danger,
        #dropout-page-87f74045 .pill-btn.purple {
          background: rgba(255,255,255,0.09) !important;
          border-color: rgba(255,255,255,0.14) !important;
          color: #f8fafc !important;
        }
        #dropout-page-87f74045 input[type="range"] { accent-color: #6c5ce7 !important; }
      `;
    }
    if (config.frameTreatment === "convolution-editorial") {
      return `
        body { background: transparent !important; }
        #conv-demo-wrap {
          background: transparent !important;
          border-radius: 0 !important;
          font-family: Inter, Arial, sans-serif !important;
          margin: 0 !important;
          max-width: none !important;
          padding: 0 !important;
        }
        #conv-demo-wrap > div:nth-child(1),
        #conv-demo-wrap > div:nth-child(2),
        #conv-demo-wrap > div:nth-child(3) > div:last-child {
          display: none !important;
        }
        #conv-demo-wrap > div:nth-child(3) {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        #conv-demo-wrap > div:nth-child(3) > div:first-child {
          border-color: #242341 !important;
          border-radius: 10px !important;
        }
        #conv-demo-wrap .conv-btn {
          border-radius: 10px !important;
          font-weight: 500 !important;
          min-height: 43px !important;
          padding: 9px 14px !important;
        }
        #conv-demo-wrap .conv-btn.primary {
          background: #6c5ce7 !important;
          box-shadow: none !important;
        }
        #conv-demo-wrap .mini-field {
          background: transparent !important;
          border: 0 !important;
          border-left: 1px solid rgba(232,229,238,0.32) !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          min-height: 55px !important;
          padding: 0 12px !important;
        }
        #conv-demo-wrap .mini-field label { color: #bcb7c9 !important; margin-bottom: 5px !important; }
        #conv-demo-wrap .mini-field select {
          background: transparent !important;
          border-color: #494653 !important;
          color: #f8fafc !important;
          padding: 6px 9px !important;
        }
        #conv-demo-wrap .mini-field option {
          background: #ffffff !important;
          color: #23212c !important;
        }
        #conv-demo-wrap input[type="range"] { accent-color: #6c5ce7 !important; }
        #conv-demo-wrap .step-chip.active {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
          color: #fff !important;
        }
      `;
    }
    if (config.frameTreatment === "backpropagation-editorial") {
      return `
        body { background: transparent !important; }
        #bp-cache-demo-wrap {
          background: transparent !important;
          border-radius: 0 !important;
          font-family: Inter, Arial, sans-serif !important;
          margin: 0 !important;
          max-width: none !important;
          padding: 0 !important;
        }
        #bp-cache-demo-wrap > div:nth-child(1),
        #bp-cache-demo-wrap > div:nth-child(2),
        #bp-cache-demo-wrap > div:nth-child(3) > div:last-child {
          display: none !important;
        }
        #bp-cache-demo-wrap > div:nth-child(3) {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        #bp-cache-demo-wrap > div:nth-child(3) > div:first-child {
          border-color: #242341 !important;
          border-radius: 10px !important;
        }
        #bpPrevBtn, #bpNextBtn, #bpShowCacheBtn, #bpHideCacheBtn,
        #bpCachePlayPauseBtn, #bpCacheReplayBtn {
          border-radius: 10px !important;
          font-family: Inter, Arial, sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          padding: 9px 14px !important;
        }
        #bpCachePlayPauseBtn {
          background: #6c5ce7 !important;
          color: #fff !important;
        }
        #bpCacheTimeSlider { accent-color: #6c5ce7 !important; }
      `;
    }
    if (config.frameTreatment === "activation-editorial") {
      return `
        body {
          background: transparent !important;
          color: #23212c !important;
          font-family: Inter, Arial, sans-serif !important;
        }
        .wrap {
          gap: 48px !important;
          margin: 0 auto !important;
          max-width: none !important;
          padding: 0 !important;
        }
        section {
          border-top: 1px solid #e8e5ee !important;
          padding-top: 34px !important;
        }
        section:first-child {
          border-top: 0 !important;
          padding-top: 0 !important;
        }
        .phase-label {
          background: transparent !important;
          color: #6c5ce7 !important;
          font-size: 11px !important;
          letter-spacing: 0.18em !important;
          margin-bottom: 10px !important;
          padding: 0 !important;
        }
        .phase-title {
          color: #23212c !important;
          font-family: "Instrument Serif", Georgia, serif !important;
          font-size: clamp(36px, 5.2vw, 64px) !important;
          font-weight: 400 !important;
          letter-spacing: -0.045em !important;
          line-height: 0.98 !important;
          margin-bottom: 18px !important;
        }
        .phase-title .hl {
          background: linear-gradient(135deg, #6c5ce7, #00b894) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
        }
        .phase-desc {
          color: #585566 !important;
          font-size: 17px !important;
          line-height: 1.75 !important;
          margin-bottom: 26px !important;
          max-width: 760px !important;
        }
        .card {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .scatter-wrap,
        .dp-panel,
        .p25-canvas-bg {
          background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(247,245,255,0.72)) !important;
          border: 1px solid #e8e5ee !important;
          box-shadow: none !important;
        }
        .scatter-wrap,
        .dp-panel {
          border-radius: 18px !important;
        }
        .btn {
          background: rgba(255,255,255,0.74) !important;
          border-color: #dcd7ea !important;
          border-radius: 999px !important;
          box-shadow: none !important;
          color: #585566 !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          padding: 9px 16px !important;
        }
        .btn:hover {
          border-color: #6c5ce7 !important;
          color: #23212c !important;
          transform: translateY(-1px) !important;
        }
        .btn-primary,
        .btn.active {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
          color: #ffffff !important;
        }
        .btn-ghost {
          background: transparent !important;
          color: #817d8f !important;
        }
        .selector-label,
        .dp-panel-title,
        .p25-tag,
        .grad-title {
          color: #817d8f !important;
          letter-spacing: 0.15em !important;
        }
        .arrow-name,
        .p25-fn-tag {
          color: #6c5ce7 !important;
        }
        .track-line {
          background: #cfc9e4 !important;
        }
        .track-head {
          border-left-color: #cfc9e4 !important;
        }
        .explanation-box {
          background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,184,148,0.06)) !important;
          border: 1px solid #dcd7ea !important;
          border-radius: 16px !important;
          color: #585566 !important;
          font-size: 15px !important;
          margin-top: 24px !important;
        }
        .problem-box {
          background: transparent !important;
          border: 0 !important;
          border-left: 2px solid #6c5ce7 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 4px 0 4px 24px !important;
        }
        .prob-badge {
          background: rgba(108,92,231,0.09) !important;
          color: #6c5ce7 !important;
        }
        .prob-badge.danger {
          background: rgba(236,99,72,0.1) !important;
          color: #d85f49 !important;
        }
        .prob-badge.success {
          background: rgba(0,184,148,0.1) !important;
          color: #00a783 !important;
        }
        .prob-title {
          color: #23212c !important;
          font-size: 19px !important;
        }
        .prob-text,
        .p1-msg {
          color: #585566 !important;
          font-size: 15px !important;
          line-height: 1.75 !important;
        }
        .formula,
        .p25-formula {
          background: rgba(108,92,231,0.08) !important;
          border-radius: 7px !important;
          color: #23212c !important;
          font-family: Inter, Arial, sans-serif !important;
          font-size: 12px !important;
        }
        .p25-grid {
          gap: 20px !important;
          padding: 0 !important;
        }
        .p25-head {
          border-bottom-color: #e8e5ee !important;
        }
        .p25-name {
          color: #23212c !important;
          font-size: 15px !important;
        }
        .p25-canvas-bg {
          border-radius: 14px !important;
        }
        .grad-bar {
          background: linear-gradient(90deg, #d85f49 0%, #eeb86b 28%, #00b894 46%, #00b894 54%, #eeb86b 72%, #d85f49 100%) !important;
        }
        @media (max-width: 820px) {
          .phase-title {
            font-size: 42px !important;
          }
        }
      `;
    }
    if (config.frameTreatment === "gradient-editorial") {
      return `
        body { background: transparent !important; }
        #gd_combo_8d0a9e18_app {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          margin: 0 auto !important;
        }
        #gd_combo_8d0a9e18_header { display: none !important; }
        #gd_combo_8d0a9e18_mainWrap { padding: 0 !important; }
        .gd_combo_8d0a9e18_panel {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 18px 0 !important;
        }
        #gd_combo_8d0a9e18_topPanel {
          border-top: 1px solid #e8e5ee !important;
          margin-bottom: 12px !important;
        }
        #gd_combo_8d0a9e18_twoDPanel { border-top: 1px solid #e8e5ee !important; }
        #gd_combo_8d0a9e18_plot {
          background: #ffffff !important;
          border: 1px solid #e8e5ee !important;
          border-radius: 8px !important;
          height: 550px !important;
        }
        #gd_combo_8d0a9e18_controlWrap {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          border-top: 1px solid #e8e5ee !important;
          margin-top: 18px !important;
          padding: 18px 0 0 !important;
        }
        .gd_combo_8d0a9e18_chip,
        .gd_combo_8d0a9e18_paramBox {
          background: transparent !important;
          border-color: #e8e5ee !important;
        }
        .gd_combo_8d0a9e18_chip {
          border-radius: 999px !important;
          color: #585566 !important;
        }
        #gd_combo_8d0a9e18_paramGrid {
          gap: 24px !important;
          margin-top: 18px !important;
        }
        .gd_combo_8d0a9e18_paramBox {
          border: 0 !important;
          border-top: 1px solid #e8e5ee !important;
          border-radius: 0 !important;
          padding: 12px 0 4px !important;
        }
        .gd_combo_8d0a9e18_paramName,
        .gd_combo_8d0a9e18_smallLabel,
        .gd_combo_8d0a9e18_check { color: #585566 !important; }
        .gd_combo_8d0a9e18_paramVal,
        #gd_combo_8d0a9e18_stepValue { color: #23212c !important; }
        .gd_combo_8d0a9e18_btnPrimary {
          background: #6c5ce7 !important;
          border-color: #6c5ce7 !important;
        }
        .gd_combo_8d0a9e18_range { accent-color: #6c5ce7 !important; }
        #gd_combo_8d0a9e18_svgWrap {
          background: #ffffff !important;
          border-color: #e8e5ee !important;
          border-radius: 8px !important;
        }
      `;
    }
    return "";
  }

  function styleFrame(frameDocument) {
    const injected = frameDocument.createElement("style");
    injected.textContent = `
      body { background: transparent !important; }
      ${config.decard ? `
        .card, .panel, .hero-panel, .control-block, .gap-card, .task-card,
        .mini-card, .formula-box, .vector-card, .side-shell {
          box-shadow: none !important;
          border-color: transparent !important;
        }
      ` : ""}
      ${frameTreatmentCss()}
    `;
    frameDocument.head.appendChild(injected);
  }

  function resizeFrame(frameDocument, resetViewport = false) {
    if (!frameDocument.documentElement || !frameDocument.body) return;
    if (resetViewport) {
      frame.style.height = "720px";
    }
    const height = Math.max(720, frameDocument.documentElement.scrollHeight, frameDocument.body.scrollHeight);
    frame.style.height = `${height + 8}px`;
  }

  if (frame) {
    let frameRefreshInterval;
    function stopFrameRefresh() {
      if (!frameRefreshInterval) return;
      window.clearInterval(frameRefreshInterval);
      frameRefreshInterval = undefined;
    }

    frame.addEventListener("load", () => {
      stopFrameRefresh();
      const frameDocument = frame.contentDocument;
      if (!frameDocument || !frameDocument.head) return;
      const frameBody = frameDocument.body;
      if (!frameBody) return;
      styleFrame(frameDocument);
      removeDuplicateOutputPanels(frameDocument);
      updateMirroredBlocks(frameDocument);
      resizeFrame(frameDocument, true);
      if (config.freezeFrameAfterLoad) {
        window.setTimeout(() => resizeFrame(frameDocument, false), 300);
        window.setTimeout(() => resizeFrame(frameDocument, false), 900);
        window.setTimeout(() => resizeFrame(frameDocument, false), 1600);
        return;
      }
      frameRefreshInterval = window.setInterval(() => {
        if (!frame.isConnected || frame.contentDocument !== frameDocument || !frameDocument.body) {
          stopFrameRefresh();
          return;
        }
        updateMirroredBlocks(frameDocument);
        resizeFrame(frameDocument, false);
      }, 120);
    });
    window.addEventListener("pagehide", stopFrameRefresh, { once: true });
  }

  initializeNavigationForViewport();
  setDrawerOpen(false);
  initializeBackpropDrawerViews();
})();
