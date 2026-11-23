# BuddhiAI Academy

> Free, open-source, beginner-friendly 9-course AI Engineering learning platform — from Python fundamentals to Edge AI and Harness Engineering.

[![License: MIT](https://img.shields.io/badge/License-MIT-A7452A.svg)](./LICENSE)

---

## Overview

**BuddhiAI Academy** is a static-first, zero-backend interactive learning platform built with **Astro 7** and **React** islands. It guides learners step-by-step through a connected 9-course AI Engineering curriculum using plain-English explanations, copyable code examples, interactive self-check quizzes, and free-tier hands-on labs.

### Execution & Free-Tier Stack

- **Course 00 (`python-zero-to-hero`) — In-Browser Pyodide**: Python basics run 100% client-side via **Pyodide (WebAssembly)** inside an isolated Web Worker (`/src/workers/pyodide.worker.ts`) with a 5-second timeout. No backend server required.
- **Courses 01–08 — Google Colab Free Tier**: Machine learning, deep learning, GenAI, MCP, AI agents, and edge AI labs use static reference code blocks inline and 1-click **Open with Google Colab** notebooks (`./notebook/<course>/`) runnable on Colab Free Tier CPU or T4 GPU.
- **LLM & Agent Courses — Google AI Studio Free Tier**: Courses 04–08 use open-source frameworks paired with a free `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey) (`google-genai` SDK) — no paid cloud credits required.

---

## 9-Course Sequential Curriculum

| Step | Track ID | Course Title | Runtime Stack |
| :--- | :--- | :--- | :--- |
| `00` | `python` | **Python Zero to Hero** | In-Browser Pyodide |
| `01` | `ai-for-beginners` | **AI for Beginners** | Colab Free CPU / T4 GPU |
| `02` | `data-science-for-beginners` | **Data Science for Beginners** | Colab Free CPU |
| `03` | `ml-for-beginners` | **ML for Beginners** | Colab Free CPU |
| `04` | `generative-ai-for-beginners` | **Generative AI for Beginners** | Colab Free CPU + Google AI Studio |
| `05` | `mcp-for-beginners` | **MCP for Beginners** | Colab Free CPU + Google AI Studio |
| `06` | `ai-agents-for-beginners` | **AI Agents for Beginners** | Colab Free CPU + Google AI Studio |
| `07` | `harness-engineering` | **Harness Engineering** | Colab Free CPU + Google AI Studio |
| `08` | `edge-ai-for-beginners` | **Edge AI for Beginners** | Colab Free T4 GPU / CPU + Google AI Studio |

---

## Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Astro 7+** (SSG) | Content Collections (`src/content.config.ts`), MDX, Sitemap |
| **Interactive Islands** | **React 19** | Hydrated selectively via `client:visible` (`PythonRunner`, `QuizCard`) |
| **Python WASM (Course 00)** | **Pyodide v0.26+** | Off-main-thread Web Worker sandbox |
| **Styling & Theme** | **Tailwind CSS** | Light & Dark mode (`#A7452A` / `#E07A5F` terracotta accent), WCAG 2.2 AA |
| **Math Typesetting** | **KaTeX** | `remark-math` + `rehype-katex` |
| **Progress & XP** | **LocalStorage** | Client-side Pathfinder XP & completion tracking |

---

## Project Structure

```text
bl-academy/
├── notebook/                  # Companion Google Colab notebooks (.ipynb) for Courses 01–08
├── public/                    # Static assets (favicons, CNAME, images)
├── src/
│   ├── components/
│   │   ├── islands/           # Hydrated React islands (PythonRunner, QuizCard, LessonFooter)
│   │   └── static/            # Zero-JS Astro components (ColabButton, AdSlot, LessonSidebar)
│   ├── content/
│   │   └── lessons/           # Validated MDX lessons organized by course folder
│   ├── layouts/               # Page and lesson layouts (Layout.astro, LessonLayout.astro)
│   ├── lib/                   # Curriculum metadata & helpers (curriculum.ts)
│   ├── pages/                 # Astro routes (/, /learn/[track]/[slug], etc.)
│   └── workers/               # Pyodide Web Worker (pyodide.worker.ts)
├── ACKNOWLEDGEMENTS.md        # Upstream open-source curriculum credits & links
├── AGENTS.md                  # AI coding agent instructions and curriculum principles
├── DESIGN.md                  # Design tokens and WCAG 2.2 AA system spec
├── LICENSE                    # MIT License
└── astro.config.mjs           # Astro SSG configuration (outputs to ./docs)
```

---

## Development & Commands

All commands are run from the project root using `pnpm`:

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install project dependencies |
| `pnpm dev` | Start Astro dev server at `http://localhost:4321` |
| `pnpm build` | Build production SSG site to `./docs/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | Run Astro content schema and TypeScript checks |

---

## Acknowledgements & License

- **Upstream Curriculum Credits**: See [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.md) for attributions and links to the open-source curricula that inspired Courses 01–08.
- **License**: Released under the [MIT License](./LICENSE) — Copyright (c) 2026 BuddhiLive.
