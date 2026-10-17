from __future__ import annotations

"""Manual exporter for standalone prototype HTML.

This script is not part of the Vercel build. By default it only reports which
public/prototypes/ files would change. Writing requires --write and an explicit
output file (--topic) or --all.
"""

import argparse
import ast
import html as html_lib
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source" / "visualizations"
OUTPUT_DIR = ROOT / "public" / "prototypes"


MAPPINGS = {
    "single-neuron/single_neuron.ipynb": "neuron-structure.html",
    "activation-functions-comparison/Activations.ipynb": "activation-functions-comparison.html",
    "loss-functions/loss_functions_style_source.py": "loss-functions.html",
    "backpropagation/Backpropagation.ipynb": "backpropagation-intuition.html",
    "gradient-descent/Gradient Descent.ipynb": "gradient-descent-learning-rate.html",
    "overfitting-vs-underfitting/overfitting_top_controls_colab.py": "overfitting-vs-underfitting.html",
    "dropout/Dropout.ipynb": "dropout.html",
    "adam-vs-sgd/adam_vs_sgd_white_style_source.py": "adam-vs-sgd.html",
    "mini-batch-training/Mini-batch Training and Batch Size Intuition.ipynb": "mini-batch-training-batch-size.html",
    "train-val-test-split/train_val_test_split_visualization.py": "train-val-test-split.html",
    "bias-vs-variance-diagnosis/bias_variance_diagnosis_dashboard.py": "bias-vs-variance-diagnosis.html",
    "transfer-learning-intuition/transfer_learning_intuition_source.py": "transfer-learning-intuition.html",
    "cnn-convolution-operation/convolution_operation_stepwise_source.py": "convolution-operation.html",
    "pooling-and-downsampling/pooling_style_aligned_source.py": "pooling.html",
    "feature-map-visualization/feature_map_visualization_source.py": "feature-map-visualization.html",
    "rnn-structure/rnn_structure_colab.py": "rnn-structure.html",
    "evaluation-metrics-confusion-matrix/Evaluation Metrics _ Confusion Matrix Intuition.ipynb": "evaluation-metrics-confusion-matrix.html",
}

# Browser-tab titles for generated pages; anything not listed falls back to the source file name.
TITLES = {
    "neuron-structure.html": "Single Neuron Forward Pass — Interactive Explorer",
    "loss-functions.html": "Loss Functions & Training Signal — Interactive Explorer",
    "backpropagation-intuition.html": "Backpropagation — Interactive Explorer",
    "gradient-descent-learning-rate.html": "Gradient Descent & Learning Rate — Interactive Explorer",
    "overfitting-vs-underfitting.html": "Overfitting vs. Underfitting — Interactive Explorer",
    "dropout.html": "Dropout — Interactive Explorer",
    "adam-vs-sgd.html": "Adam Optimizer vs. SGD — Interactive Explorer",
    "mini-batch-training-batch-size.html": "Mini-Batch Training & Batch Size — Interactive Explorer",
    "bias-vs-variance-diagnosis.html": "Bias vs. Variance Diagnosis — Interactive Explorer",
    "convolution-operation.html": "Convolution Operation — Interactive Explorer",
    "pooling.html": "Pooling and Downsampling — Interactive Explorer",
    "rnn-structure.html": "RNN Structure — Interactive Explorer",
    "evaluation-metrics-confusion-matrix.html": "Evaluation Metrics & Confusion Matrix — Interactive Explorer",
}

# Intentionally left unmapped for now:
# - "attention-mechanism-intuition/transfomer.ipynb"
#   Original Attention animation, kept as an archive. The lesson now uses the
#   hand-written public/prototypes/attention-guided-lesson.html, and the old
#   /prototypes/attention-mechanism-intuition.html URL redirects (next.config.ts).
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
    source = source_path.read_text(encoding="utf-8-sig")
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
  <title>{html_lib.escape(title, quote=False)}</title>
</head>
<body style="margin:0;background:#ffffff;">
{body}
</body>
</html>
"""
    validate_exported_html(title, document)
    return document


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Write generated HTML instead of previewing changes")
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument("--topic", choices=sorted(MAPPINGS.values()), help="Select one output HTML file")
    selection.add_argument("--all", action="store_true", help="Select all mapped output files")
    args = parser.parse_args()

    if args.write and not (args.topic or args.all):
        parser.error("--write requires --topic OUTPUT_HTML or --all")

    selected = [
        (source_name, output_name)
        for source_name, output_name in MAPPINGS.items()
        if args.topic is None or output_name == args.topic
    ]
    generated: list[tuple[str, str]] = []
    errors: list[str] = []

    for source_name, output_name in selected:
        source_path = SOURCE_DIR / source_name
        try:
            if not source_path.exists():
                raise FileNotFoundError(f"Prototype source not found: {source_path}")
            html_outputs = collect_source_outputs(source_path)
            document = to_document(TITLES.get(output_name, source_path.name), html_outputs)
        except (FileNotFoundError, ValueError, SyntaxError) as error:
            detail = str(error).replace(str(source_path), source_name)
            errors.append(
                f"Cannot generate {output_name}: {detail}".encode("ascii", "backslashreplace").decode("ascii")
            )
            continue
        generated.append((output_name, document))

    for error in errors:
        print(error)
    if errors and args.write:
        print("No files written: fix every generation error before writing.")
        return 1

    changed = 0
    for output_name, document in generated:
        output_path = OUTPUT_DIR / output_name
        current = output_path.read_text(encoding="utf-8") if output_path.exists() else None
        if current == document:
            print(f"Unchanged: {output_name}")
            continue

        changed += 1
        if args.write:
            OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            output_path.write_text(document, encoding="utf-8")
            print(f"Wrote: {output_name}")
        else:
            action = "Would create" if current is None else "Would overwrite"
            print(f"{action}: {output_name}")

    if not args.write:
        print(f"Preview only: {changed} of {len(generated)} generated file(s) differ; nothing was written.")
        if changed:
            print("To write, use --write --topic OUTPUT_HTML (or --write --all).")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
