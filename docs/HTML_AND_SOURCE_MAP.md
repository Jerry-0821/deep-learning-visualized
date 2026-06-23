# HTML And Source Map

This document explains how the repository keeps both viewable HTML pages and editable source code.

## Current Rule

- `topic-design-previews/` keeps editable HTML topic pages for the redesigned lesson experience.
- `public/topic-design-previews/` keeps generated public copies used by the live website.
- `public/prototypes/` keeps older standalone prototype HTML used by fallback routes and embedded previews.
- `source/visualizations/` keeps the Colab/Python source files behind those visualization prototypes.
- `reference_materials/` is local-only archive material and is ignored by Git.

The website runtime is still controlled by `app/`, `components/`, `data/`, `public/`, and `scripts/`.
Adding source files under `source/` does not change the rendered website.

## Redesigned Topic HTML

These pages are the current editable HTML sources for redesigned topic pages. They are copied to
`public/topic-design-previews/` during build by `scripts/sync_topic_design_previews.mjs`.

| Topic slug | Editable HTML | Public HTML |
| --- | --- | --- |
| `activation-functions-comparison` | `topic-design-previews/activation-functions-comparison.html` | `public/topic-design-previews/activation-functions-comparison.html` |
| `adam-vs-sgd` | `topic-design-previews/adam-vs-sgd.html` | `public/topic-design-previews/adam-vs-sgd.html` |
| `attention-mechanism-intuition` | `topic-design-previews/attention-mechanism-intuition.html` | `public/topic-design-previews/attention-mechanism-intuition.html` |
| `backpropagation-intuition` | `topic-design-previews/backpropagation-intuition.html` | `public/topic-design-previews/backpropagation-intuition.html` |
| `bias-vs-variance-diagnosis` | `topic-design-previews/bias-vs-variance-diagnosis.html` | `public/topic-design-previews/bias-vs-variance-diagnosis.html` |
| `convolution-operation` | `topic-design-previews/convolution-operation.html` | `public/topic-design-previews/convolution-operation.html` |
| `dropout` | `topic-design-previews/dropout.html` | `public/topic-design-previews/dropout.html` |
| `evaluation-metrics-confusion-matrix` | `topic-design-previews/evaluation-metrics-confusion-matrix.html` | `public/topic-design-previews/evaluation-metrics-confusion-matrix.html` |
| `feature-map-visualization` | `topic-design-previews/feature-map-visualization.html` | `public/topic-design-previews/feature-map-visualization.html` |
| `gradient-descent-learning-rate` | `topic-design-previews/gradient-descent-learning-rate.html` | `public/topic-design-previews/gradient-descent-learning-rate.html` |
| `loss-functions` | `topic-design-previews/loss-functions.html` | `public/topic-design-previews/loss-functions.html` |
| `mini-batch-training-batch-size` | `topic-design-previews/mini-batch-training-batch-size.html` | `public/topic-design-previews/mini-batch-training-batch-size.html` |
| `neuron-structure` | `topic-design-previews/single-neuron.html` | `public/topic-design-previews/single-neuron.html` |
| `overfitting-vs-underfitting` | `topic-design-previews/overfitting-vs-underfitting.html` | `public/topic-design-previews/overfitting-vs-underfitting.html` |
| `rnn-structure` | `topic-design-previews/rnn-structure.html` | `public/topic-design-previews/rnn-structure.html` |
| `train-val-test-split` | `topic-design-previews/train-val-test-split.html` | `public/topic-design-previews/train-val-test-split.html` |
| `transfer-learning-intuition` | `topic-design-previews/transfer-learning-intuition.html` | `public/topic-design-previews/transfer-learning-intuition.html` |

## Prototype HTML To Source Code

These rows connect the active standalone prototype HTML to the tracked source code in
`source/visualizations/`.

| Topic | Runtime HTML | Source code |
| --- | --- | --- |
| Activation Functions Comparison | `public/prototypes/activation-functions-comparison.html` | `source/visualizations/activation-functions-comparison/Activations.ipynb` |
| Adam Optimizer vs. SGD | `public/prototypes/adam-vs-sgd.html` and `public/prototypes/adam-optimizer-vs-sgd.html` | `source/visualizations/adam-vs-sgd/adam_vs_sgd_white_style_source.py` |
| Attention Mechanism Intuition | `public/prototypes/attention-mechanism-intuition.html` | `source/visualizations/attention-mechanism-intuition/transfomer.ipynb` |
| Backpropagation Intuition | `public/prototypes/backpropagation-intuition.html` | `source/visualizations/backpropagation/Backpropagation.ipynb` |
| Bias vs. Variance Diagnosis | `public/prototypes/bias-vs-variance-diagnosis.html` | `source/visualizations/bias-vs-variance-diagnosis/bias_variance_diagnosis_dashboard.py` |
| Convolution Operation | `public/prototypes/convolution-operation.html` | `source/visualizations/cnn-convolution-operation/convolution_operation_stepwise_source.py` |
| Dropout | `public/prototypes/dropout.html` | `source/visualizations/dropout/Dropout.ipynb` |
| Evaluation Metrics & Confusion Matrix | `public/prototypes/evaluation-metrics-confusion-matrix.html` | `source/visualizations/evaluation-metrics-confusion-matrix/Evaluation Metrics _ Confusion Matrix Intuition.ipynb` |
| Feature Map Visualization | `public/prototypes/feature-map-visualization.html` | `source/visualizations/feature-map-visualization/feature_map_visualization_source.py` |
| Gradient Descent & Learning Rate | `public/prototypes/gradient-descent-learning-rate.html` | `source/visualizations/gradient-descent/Gradient Descent.ipynb` |
| Loss Functions | `public/prototypes/loss-functions.html` | `source/visualizations/loss-functions/loss_functions_style_source.py` |
| Mini-batch Training & Batch Size | `public/prototypes/mini-batch-training-batch-size.html` | `source/visualizations/mini-batch-training/Mini-batch Training and Batch Size Intuition.ipynb` |
| Neuron Structure | `public/prototypes/neuron-structure.html` | `source/visualizations/single-neuron/single_neuron.ipynb` |
| Overfitting vs. Underfitting | `public/prototypes/overfitting-vs-underfitting.html` | `source/visualizations/overfitting-vs-underfitting/overfitting_top_controls_colab.py` |
| Pooling and Downsampling | `public/prototypes/pooling.html` | `source/visualizations/pooling-and-downsampling/pooling_style_aligned_source.py` |
| RNN Structure | `public/prototypes/rnn-structure.html` | `source/visualizations/rnn-structure/rnn_structure_colab.py` |
| Train / Val / Test Split | `public/prototypes/train-val-test-split.html` | `source/visualizations/train-val-test-split/train_val_test_split_visualization.py` |
| Transfer Learning Intuition | `public/prototypes/transfer-learning-intuition.html` | `source/visualizations/transfer-learning-intuition/transfer_learning_intuition_source.py` |

## Native Website Code

Some pages are already native Next.js/React/data code rather than standalone HTML:

| Area | Main source |
| --- | --- |
| Homepage, curriculum, topics, blog, about | `app/`, `components/`, `data/` |
| Formula Hub | `app/formula-hub/`, `components/formula-hub/`, `data/formulaHub.ts`, `data/formulaHubEntries.json` |
| Formula detail pages | `app/formula-hub/[id]/`, `components/formula-hub/`, `data/formulaHub.ts` |
| Saved formulas | `app/formula-hub/saved/`, `components/formula-hub/` |
| Mindmap route wrapper | `app/mindmap/page.tsx` and `public/mindmap/training-pipeline-mindmap.html` |

## Cleanup Guidance

When changing a visualization:

1. Edit source code in `source/visualizations/` if regenerating the prototype.
2. Update the exported runtime HTML in `public/prototypes/` if the website still uses that prototype.
3. Update redesigned topic HTML in `topic-design-previews/` if the visible lesson page is the redesigned version.
4. Run `npm run build` to sync public topic previews and verify Next.js routes.

Do not move or delete runtime HTML from `public/` unless the corresponding route has already been migrated and tested.
