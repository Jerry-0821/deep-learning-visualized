from __future__ import annotations

import ast
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTEBOOK_DIR = ROOT / "better_content"
OUTPUT_DIR = ROOT / "public" / "prototypes"


MAPPINGS = {
    "single_neuron.ipynb": "neuron-structure.html",
    "Activations.ipynb": "activation-functions-comparison.html",
    "loss_functions_style_source.py": "loss-functions.html",
    "Backpropagation.ipynb": "backpropagation-intuition.html",
    "Gradient Descent.ipynb": "gradient-descent-learning-rate.html",
    "overfitting_top_controls_colab.py": "overfitting-vs-underfitting.html",
    "Dropout.ipynb": "dropout.html",
    "adam_vs_sgd_white_style_source.py": "adam-vs-sgd.html",
    "Mini-batch Training and Batch Size Intuition.ipynb": "mini-batch-training-batch-size.html",
    "train_val_test_split_visualization.py": "train-val-test-split.html",
    "bias_variance_diagnosis_dashboard.py": "bias-vs-variance-diagnosis.html",
    "transfer_learning_intuition_source.py": "transfer-learning-intuition.html",
    "convolution_operation_stepwise_source.py": "convolution-operation.html",
    "pooling_style_aligned_source.py": "pooling.html",
    "feature_map_visualization_source.py": "feature-map-visualization.html",
    "rnn_v4_label_fixed_requested_fix.html": "rnn-structure.html",
    "transfomer.ipynb": "attention-mechanism-intuition.html",
    "Evaluation Metrics _ Confusion Matrix Intuition.ipynb": "evaluation-metrics-confusion-matrix.html",
}

# Intentionally left unmapped for now:
# - "pooling_style_aligned_standalone.py"
#   Standalone duplicate kept out of the live mapping because
#   "pooling_style_aligned_source.py" is the chosen source file.
# - "CNN Convolution Operation (1).ipynb"
#   Preserved in place, but no longer the active live source for
#   "convolution-operation" after extracting the stepwise variant.


def collect_html_outputs(notebook_path: Path) -> list[str]:
    notebook = json.loads(notebook_path.read_text(encoding="utf-8"))
    html_outputs: list[str] = []

    for cell in notebook.get("cells", []):
        if cell.get("cell_type") != "code":
            continue
        for output in cell.get("outputs", []):
            data = output.get("data", {})
            html = data.get("text/html")
            if isinstance(html, list):
                html_outputs.append("".join(html))
            elif isinstance(html, str):
                html_outputs.append(html)

    if not html_outputs:
      raise ValueError(f"No text/html outputs found in {notebook_path}")

    return html_outputs


def collect_python_html_outputs(source_path: Path) -> list[str]:
    source = source_path.read_text(encoding="utf-8")
    module = ast.parse(source, filename=str(source_path))
    html_values: dict[str, str] = {}
    html_outputs: list[str] = []

    for node in module.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in {"html_code", "HTML_SOURCE"}:
                    try:
                        value = ast.literal_eval(node.value)
                    except (ValueError, SyntaxError):
                        continue
                    if isinstance(value, str):
                        html_values[target.id] = value
        elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            display_call = node.value
            if not isinstance(display_call.func, ast.Name) or display_call.func.id != "display":
                continue
            if not display_call.args:
                continue
            html_call = display_call.args[0]
            if not isinstance(html_call, ast.Call):
                continue
            if not isinstance(html_call.func, ast.Name) or html_call.func.id != "HTML":
                continue
            if not html_call.args:
                continue
            html_arg = html_call.args[0]
            value = None
            if isinstance(html_arg, ast.Name):
                value = html_values.get(html_arg.id)
            else:
                try:
                    value = ast.literal_eval(html_arg)
                except (ValueError, SyntaxError):
                    continue
            if isinstance(value, str):
                html_outputs.append(value)

    if not html_outputs:
        for variable_name in ("html_code", "HTML_SOURCE"):
            value = html_values.get(variable_name)
            if isinstance(value, str):
                html_outputs.append(value)

    if not html_outputs:
        raise ValueError(f"No embedded HTML found in {source_path}")

    stable_token = re.sub(r"[^a-z0-9]+", "-", source_path.stem.lower()).strip("-") or "prototype"
    return [html.replace("__UID__", stable_token) for html in html_outputs]


def collect_source_outputs(source_path: Path) -> list[str]:
    if source_path.suffix == ".ipynb":
        return collect_html_outputs(source_path)

    if source_path.suffix == ".py":
        return collect_python_html_outputs(source_path)

    if source_path.suffix == ".html":
        return [source_path.read_text(encoding="utf-8")]

    raise ValueError(f"Unsupported prototype source type: {source_path.name}")


def normalize_exported_html(html: str) -> str:
    replacements = {
        "inlineMath: [['\\(','\\)'], ['$', '$']],": "inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],",
        "displayMath: [['\\[','\\]']]": "displayMath: [['\\\\[', '\\\\]']]",
        "â†": "←",
        "â†’": "→",
        "â–¶": "▶",
        "Â·": "·",
        "Î·": "η",
        "âˆ‡": "∇",
        "â‰ˆ": "≈",
        "âˆ’": "−",
        "â€œ": "“",
        "â€": "”",
        "â€™": "’",
        "â€²": "′",
        "â€–âˆ‡fâ€–": "||∇f||",
    }

    normalized = html
    for bad, good in replacements.items():
        normalized = normalized.replace(bad, good)

    return normalized


def validate_exported_html(source_name: str, html: str) -> None:
    suspicious_fragments = [
        "inlineMath: [['\\(', '\\)'], ['$', '$']],",
        "displayMath: [['\\[','\\]']]",
        "Â·",
        "â†",
        "Î·",
        "âˆ‡",
        "â€”",
        "â€“",
        "â€œ",
        "â€",
        "â€™",
    ]

    found = [fragment for fragment in suspicious_fragments if fragment in html]
    if found:
        joined = ", ".join(repr(fragment) for fragment in found)
        raise ValueError(f"Suspicious exported HTML detected in {source_name}: {joined}")


def to_document(title: str, html_outputs: list[str]) -> str:
    body = "\n\n".join(normalize_exported_html(html) for html in html_outputs)
    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
</head>
<body style="margin:0;background:#ffffff;">
{body}
</body>
</html>
"""
    validate_exported_html(title, document)
    return document


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for source_name, output_name in MAPPINGS.items():
        source_path = NOTEBOOK_DIR / source_name
        html_outputs = collect_source_outputs(source_path)
        document = to_document(source_name, html_outputs)
        (OUTPUT_DIR / output_name).write_text(document, encoding="utf-8")


if __name__ == "__main__":
    main()
