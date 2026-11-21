---
title: "9-Course Sequential AI Engineering Learning Path & Open-Source Colab/Gemini Stack"
date: "2026-11-21"
status: "accepted"
tags:
  - curriculum
  - ai-engineering
  - colab
  - gemini-api
  - learning-path
---

# Decision: 9-Course Sequential AI Engineering Learning Path

## Context
The prior 6-phase curriculum had structural gaps and fragmented tracks (`data-foundations-and-classical-ml`, `math-and-neural-nets`). To provide a complete, cohesive AI Engineering education inspired by `AI Engineering from Scratch` (`.ref/ai-engineering-from-scratch/`), we redesigned the curriculum into a **9-course sequential learning path** starting from the existing Python course.

## Decision
1. **9 Sequential Courses (Ordered Learning Path)**:
   - `00` **`python`** (`src/content/lessons/python-zero-to-hero/`, preserved 12 lessons)
   - `01` **`ai-for-beginners`** (`.ref/AI-For-Beginners`)
   - `02` **`data-science-for-beginners`** (`.ref/Data-Science-For-Beginners`)
   - `03` **`ml-for-beginners`** (`.ref/ML-For-Beginners/ML-For-Beginners-main`)
   - `04` **`generative-ai-for-beginners`** (`.ref/generative-ai-for-beginners`)
   - `05` **`mcp-for-beginners`** (`.ref/mcp-for-beginners`)
   - `06` **`ai-agents-for-beginners`** (`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main`)
   - `07` **`harness-engineering`** (`.ref/learn-harness-engineering/learn-harness-engineering-main`)
   - `08` **`edge-ai-for-beginners`** (`.ref/edgeai-for-beginners/edgeai-for-beginners-main`)
2. **Cross-Course Continuity**:
   - Every course connects directly to the next via `src/lib/curriculum.ts`, `LessonLayout.astro`, `LessonSidebar.astro`, and `LessonFooter.tsx`.
   - Each course has a static overview and syllabus preview hub at `/learn/<track>/` (`src/pages/learn/[track]/index.astro`).
3. **Full Reference Grounding & Attribution**:
   - Every lesson is grounded in its `.ref/` repository with full conceptual, mathematical, and practical depth.
   - Reference repositories are never named inside lesson prose; all upstream GitHub credits live in `ACKNOWLEDGEMENTS.md`.
4. **Authoring Voice**:
   - All tutorial prose is written using the `my-writing-style` skill (`.agents/skills/my-writing-style/SKILL.md`).
5. **Free-Tier Open-Source + Google Stack**:
   - Proprietary Microsoft Foundry / Azure services are replaced with open-source tools (`PyTorch`, `Scikit-Learn`, `ChromaDB`, `FAISS`, `FastMCP`, `LangGraph`, `llama.cpp`, `ONNX Runtime`) running on **Google Colab Free Tier** (`./notebook/<course_name>/` + `<ColabButton />`) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`), including an onboarding guide for obtaining a free API key.
