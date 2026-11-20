---
title: "6-Phase AI Engineer Curriculum Manifest & Hybrid Runtime Model"
date: "2026-11-20"
status: "accepted"
tags:
  - curriculum
  - ai-engineer
  - pyodide
  - colab
  - gemini-api
---

# Decision: 6-Phase AI Engineer Curriculum Manifest & Hybrid Runtime Model

## Context
Following the completion of the 12-lesson `python` track (`src/content/lessons/python-zero-to-hero/01-setting-up-python.mdx` through `12-installing-third-party-packages-with-pip.mdx`), Buddhilive Academy is extending into a 6-phase AI Engineer study guide grounded in the reference repositories inside `.ref/`.

## Decision
1. **Track & Continuity**:
   - Register the AI Engineer study guide under `track: "ai-engineer"` in `src/content/lessons/ai-engineer/` (`01-...` through `33-...`), ordered `1..33`.
   - `ai-engineer/01-python-data-science-and-pandas` explicitly lists `["python-zero-to-hero/12-installing-third-party-packages-with-pip"]` in `prerequisites` to connect directly to the Python track.
   - `category` maps 1:1 to the 6 phase titles so `LessonSidebar.astro` renders phase-grouped navigation.
2. **Authoritative Manifest**:
   - Maintained in [ai-engineer-curriculum-manifest.md](../conventions/ai-engineer-curriculum-manifest.md), mapping every lesson slug, title, exact `.ref/` source file(s), runtime target (`Colab CPU`, `Colab T4 GPU`, or `Local + Colab`), and API/library stack (`GEMINI_API_KEY` Google AI Studio free tier vs. open-source libraries).
3. **Hybrid Execution Model**:
   - Preserve `<PythonRunner client:visible />` (Pyodide Web Worker) for lightweight in-browser Python/NumPy/math/JSON-schema snippets.
   - Pair heavier ML, PyTorch, LoRA, MCP server, harness, and quantization labs with explicit `Colab CPU`, `Colab T4 GPU`, or `Local + Colab` runbooks.
4. **Phase 1 Grounding & Colab Notebooks (`009-phase-1-data-tutorials`)**:
   - `.ref/ML-For-Beginners/ML-For-Beginners-main/` is now populated; Phase 1 (`track: "data-ml"`, folder `src/content/lessons/data-foundations-and-classical-ml/`, `order: 1..8`) is grounded in `.ref/Data-Science-For-Beginners/` and `.ref/ML-For-Beginners/ML-For-Beginners-main/` (EDA, cleaning, stats/viz, regression, classification, K-Means clustering, ARIMA/SVR time series, and tabular evaluation/pipelines).
   - Companion Google Colab notebooks live in `notebook/data-foundations-and-classical-ml/` and are linked from each lesson via `src/components/static/ColabButton.astro` (`https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/data-foundations-and-classical-ml/<notebook>.ipynb`).
5. **Phase 2 Grounding & Runtime-Aware Colab Notebooks (`010-phase-2-math`)**:
   - Phase 2 (`track: "math-neural-nets"`, folder `src/content/lessons/math-and-neural-nets/`, `order: 1..6`) is grounded in `.ref/ai-engineering-from-scratch/` and `.ref/AI-For-Beginners/`.
   - Companion notebooks live in `notebook/math-and-neural-nets/` with `ColabButton.astro` `runtime` prop distinguishing `Free Tier CPU` (Lessons 1–4, pure `numpy`) and `Free Tier T4 GPU` (Lessons 5–6, `torch` + `numpy`).
