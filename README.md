# BuddhiAI Academy

> Free, high-performance, bite-sized interactive STEM learning platform covering Python, Data Science, AI, Mathematics, and Computer Science (inspired by Brilliant.org).

---

## 1. Executive Summary & Vision

BuddhiAI Academy empowers learners with intuitive, active STEM education. Lessons combine concise conceptual storytelling, rigorous mathematical foundations, and immediate hands-on code execution directly within the browser.

### Key Architectural Constraints
- **Zero-Backend / 100% Client-Side Execution**: All dynamic code runs client-side via **Pyodide (WebAssembly)** inside an isolated Web Worker (`/src/workers/pyodide.worker.ts`). There is zero remote code execution server to manage, scale, or secure.
- **Static First & AdSense Optimized**: Built on **Astro SSG**. Every lesson page pre-renders full semantic HTML and rich explanatory prose at build time, ensuring optimal SEO indexing and adherence to Google AdSense high-value content guidelines.
- **Island Architecture**: Interactive components (`PythonRunner`, `VisualQuiz`, `ConceptSlider`) are isolated UI islands (React / Preact) hydrated on-demand using `client:visible`.
- **Offline-First State & Progress Sync**: Learner progress, streaks, and scratchpad code are saved instantly in `localStorage` for anonymous users and synced seamlessly to **Supabase** (PostgreSQL + Row Level Security) upon authentication.
- **Source Grounding**: All curriculum, exercises, and interactive lessons are strictly synthesized from authoritative reference materials in the `/docs` folder.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Astro 5+** (SSG) | Content Layer / Content Collections, MDX |
| **Interactive Islands** | **React / Preact** | Hydrated selectively with `client:visible` |
| **Python WASM Engine** | **Pyodide v0.26+** | Dedicated Web Worker with a 5-second hard execution timeout |
| **Backend & Auth** | **Supabase** | PostgreSQL + RLS, Auth via `@supabase/supabase-js` |
| **Styling & Theme** | **Tailwind CSS** | Light and Dark mode with primary `#A7452A` (terracotta) |
| **Math Typesetting** | **KaTeX** | Fast, server-rendered and client-compatible mathematical formulas |
| **Monetization** | **Google AdSense** | Fixed-dimension slots with reserved height to eliminate CLS |

---

## 3. Directory Conventions

```text
/
├── docs/                      # Authoritative reference materials (PDFs, notes, syllabi)
├── public/                    # Static assets (favicons, images, Pyodide wheels if self-hosted)
├── src/
│   ├── assets/                # Images, illustrations, and SVG icons
│   ├── components/
│   │   ├── islands/           # Hydrated interactive components (PythonRunner, VisualQuiz)
│   │   └── static/            # Zero-JS Astro components (AdBanner.astro, LessonLayout.astro)
│   ├── content/
│   │   └── lessons/           # Validated MDX lesson collections
│   ├── layouts/               # Shared page and lesson layouts
│   ├── pages/                 # Astro routes (catalog, lesson pages, user profile)
│   ├── styles/                # Global styles, Tailwind base, and theme tokens
│   └── workers/               # Off-thread Web Workers (pyodide.worker.ts)
├── .agents/                   # Agent harness (skills, rules, memory, hooks)
├── AGENTS.md                  # Operational context and non-negotiable agent directives
├── DESIGN.md                  # Machine-readable tokens + visual aesthetic design system
├── astro.config.mjs           # Astro configuration
└── package.json               # Dependencies and scripts
```

---

## 4. Lesson Generation Guidelines

All curriculum lessons are mapped from source documents in `/docs` to MDX files under `/src/content/lessons/`:

1. **Source Citation**: Every lesson must ground its explanations, code snippets, and algorithms in reference documents located in `/docs`.
2. **AdSense & SEO Minimums**: Each lesson must contain at least **350+ words** of clear, conceptual explanation accompanied by relevant KaTeX formulas before or alongside interactive widgets.
3. **Non-Blocking Execution**: Code execution must always use `<PythonRunner client:visible />` powered by the Pyodide Web Worker. Main thread execution is strictly prohibited.
4. **Frontmatter Validation**: Strict schema matching Astro's Content Collection definition:
   ```yaml
   ---
   title: "Gradient Descent: Intuition and Implementation"
   topic: "machine-learning"
   difficulty: "intermediate"
   xp: 150
   prerequisites: ["derivatives-basics", "python-vectors"]
   ---
   ```

---

## 5. Development & Commands

All commands are run from the project root:

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install project dependencies |
| `pnpm dev` | Start Astro dev server at `localhost:4321` |
| `astro dev --background` | Start Astro dev server in background mode |
| `pnpm build` | Build production SSG site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | Run Astro schema and TypeScript type checks |
