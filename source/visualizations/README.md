# Visualization Source Files

This folder keeps the editable source files behind the standalone visualization HTML pages.

The website still serves exported HTML from `public/prototypes/` and redesigned topic HTML from
`topic-design-previews/`. The files here are the cleaner code/notebook sources that can be opened,
studied, or regenerated separately without digging through local archive material.

## How To Read This Folder

- `.ipynb` files are intended for Google Colab or Jupyter.
- `.py` files are Colab-friendly Python exports or source scripts.
- Per-topic `README.md` files describe the related website topic and exported HTML.
- Historical handoffs and outdated HTML exports are kept locally under `reference_materials/`, not here.

## Topic Sources

| Source folder | Main source file | Related website topic |
| --- | --- | --- |
| `activation-functions-comparison/` | `Activations.ipynb` | Activation Functions Comparison |
| `adam-vs-sgd/` | `adam_vs_sgd_white_style_source.py` | Adam Optimizer vs. SGD |
| `attention-mechanism-intuition/` | `transfomer.ipynb` | Attention Mechanism Intuition |
| `backpropagation/` | `Backpropagation.ipynb` | Backpropagation Intuition |
| `bias-vs-variance-diagnosis/` | `bias_variance_diagnosis_dashboard.py` | Bias vs. Variance Diagnosis |
| `cnn-convolution-operation/` | `convolution_operation_stepwise_source.py` | Convolution Operation |
| `dropout/` | `Dropout.ipynb` | Dropout |
| `evaluation-metrics-confusion-matrix/` | `Evaluation Metrics _ Confusion Matrix Intuition.ipynb` | Evaluation Metrics & Confusion Matrix |
| `feature-map-visualization/` | `feature_map_visualization_source.py` | Feature Map Visualization |
| `gradient-descent/` | `Gradient Descent.ipynb` | Gradient Descent & Learning Rate |
| `loss-functions/` | `loss_functions_style_source.py` | Loss Functions |
| `mini-batch-training/` | `Mini-batch Training and Batch Size Intuition.ipynb` | Mini-batch Training & Batch Size |
| `overfitting-vs-underfitting/` | `overfitting_top_controls_colab.py` | Overfitting vs. Underfitting |
| `pooling-and-downsampling/` | `pooling_style_aligned_source.py` | Pooling and Downsampling |
| `rnn-structure/` | `rnn_structure_colab.py` | RNN Structure |
| `single-neuron/` | `single_neuron.ipynb` | Single Neuron Forward Pass |
| `train-val-test-split/` | `train_val_test_split_visualization.py` | Train / Val / Test Split |
| `transfer-learning-intuition/` | `transfer_learning_intuition_source.py` | Transfer Learning Intuition |

For the full relationship between source files, HTML files, and Next.js routes, see
`docs/HTML_AND_SOURCE_MAP.md`.
