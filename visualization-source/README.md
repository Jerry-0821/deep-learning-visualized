# Visualization Source Files

This folder contains the original visualization source files used to build or prototype the interactive deep learning visualizations.

These files are intended for Colab or local experimentation. They are kept separately from the deployed Next.js website so learners can inspect, reuse, or modify individual visualization topics without needing to understand the full app structure.

The main deployed website is still controlled by:

- `app/`
- `components/`
- `data/`
- `public/`

Most topic folders contain the original `.ipynb` or `.py` file. The live website uses exported HTML prototypes from `public/prototypes/`, while this folder is for source/reference code.

## Notes

- Notebook files can be opened directly in Google Colab.
- Python source files can be copied into a Colab cell or uploaded and run in Colab.
- The RNN source was originally available as a standalone HTML prototype, so this archive includes a Colab-runnable Python wrapper that displays and writes the HTML output.
- Generated caches, browser profiles, logs, `.next`, and `node_modules` are intentionally excluded.
