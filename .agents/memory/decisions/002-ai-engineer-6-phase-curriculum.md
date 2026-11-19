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
4. **Source Gap Recorded**:
   - `.ref/ML-For-Beginners/` currently contains only an empty `.git/` directory. Phase 1 Classical ML lessons are grounded in `.ref/Data-Science-For-Beginners/` and `.ref/ai-engineering-from-scratch/phases/02-ml-fundamentals/` until `.ref/ML-For-Beginners` is populated.
