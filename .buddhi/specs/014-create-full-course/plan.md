# Implementation Plan: Course 04 — Generative AI for Beginners (`generative-ai-for-beginners`)

**Branch**: `014-create-full-course` | **Date**: 2026-11-22 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/014-create-full-course/spec.md)

**Input**: Feature specification from `/.buddhi/specs/014-create-full-course/spec.md`

---

## Summary

Deliver the complete 22-lesson **Course 04: Generative AI for Beginners** (`track: "generative-ai-for-beginners"`) curriculum and 22 companion **Google Colab Free Tier** Jupyter notebooks (`./notebook/generative-ai-for-beginners/<slug>.ipynb`), grounded in `.ref/generative-ai-for-beginners/` (`00-course-setup` through `21-meta`). Every lesson is authored as an Astro Content Collection `.mdx` file under `src/content/lessons/generative-ai-for-beginners/` using the `my-writing-style` skill, includes KaTeX mathematical and algorithmic definitions, structured reference tables, a fast pure-Python `<PythonRunner client:visible />` in-browser sandbox (`math`, `statistics`, `random`, `collections`, `re`, `json`, `hashlib`), a `<ColabButton />` deep-link to its self-contained Google AI Studio (`google-genai`) / Hugging Face / ChromaDB / FAISS / PEFT-LoRA / Gradio Colab notebook, and a `<QuizCard client:visible />` assessment. Proprietary cloud dependencies (Microsoft Foundry, Azure OpenAI Service, GitHub Models, Foundry Local, Azure AI Content Safety, Azure Cognitive Search, Azure Cosmos DB, Microsoft Power Platform / Power Apps / Power Automate / Dataverse / AI Builder / Copilot Studio, PromptFlow, and Microsoft Agent Framework) are replaced with open-source Python frameworks (`Hugging Face Transformers`, `Diffusers`, `PEFT`/`LoRA`, `TRL`, `bitsandbytes`, `ChromaDB`, `FAISS`, `sentence-transformers`, `scikit-learn`, `Gradio`, `tiktoken`, `mistral-common`, `onnxruntime-genai`, `OpenCV`, `Pillow`) on **Google Colab Free Tier** (CPU & T4 GPU) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK).

---

## Technical Context

**Language/Version**: TypeScript 5.9.3, Astro 7.4.4, React 19.3.1, MDX (`@astrojs/mdx` 8.1.2), Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Jupyter `nbformat` v4 notebooks)

**Primary Dependencies**:
- **Frontend / SSG**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `remark-math`, `rehype-katex`, `katex`, `@uiw/react-codemirror`
- **Colab Notebook Stack (Free Tier)**: `google-genai`, `python-dotenv`, `tiktoken`, `numpy`, `pandas`, `scikit-learn`, `sentence-transformers`, `chromadb`, `faiss-cpu`, `transformers`, `diffusers`, `accelerate`, `peft`, `trl`, `bitsandbytes`, `gradio`, `pillow`, `opencv-python`, `mistral-common[hf-hub]`, `onnxruntime-genai`

**Storage**: Static Git-tracked files (`src/content/lessons/generative-ai-for-beginners/*.mdx`, `notebook/generative-ai-for-beginners/*.ipynb`, `src/lib/curriculum.ts`) + browser `localStorage` for Pathfinder XP progress

**Testing & Verification**:
- `pnpm astro check` (Astro content collection Zod schema + TypeScript validation)
- `pnpm build` (Static site generation across all 22 new lesson routes + course hub `/learn/generative-ai-for-beginners`)
- Automated Python verification script (`verify_course_04.py`) checking all 22 `.mdx` files (frontmatter schema, word count >= 350 words, component imports/usages, deterministic execution of `initialCode` matching `expectedOutput`, zero forbidden upstream/Azure/Foundry/Power-Platform terms) and all 22 `.ipynb` notebooks (valid JSON `nbformat: 4`, self-contained datasets and assets, graceful `GEMINI_API_KEY` fallback, zero broken local relative file paths)
- Accessibility & Design Token Gates: `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`

**Target Platform**: Static Web (SSG) + In-Browser WebAssembly (`Pyodide` Web Worker) + Google Colab Free Tier (CPU & T4 GPU) + Google AI Studio Free Tier (`GEMINI_API_KEY`)

**Project Type**: Static Educational Web Application & Interactive Curriculum Platform

**Performance Goals**:
- Zero main-thread blocking on page load (`client:visible` hydration for `PythonRunner` and `QuizCard`)
- Every `<PythonRunner />` `initialCode` executes deterministically in `< 2.0s` (well inside the hard 5-second `pyodide.worker.ts` timeout)
- Zero Cumulative Layout Shift (`CLS = 0`) across lesson pages and `AdSlot` containers

**Constraints**:
- Zero mentions of `.ref/`, `microsoft/generative-ai-for-beginners`, Microsoft Foundry, Azure OpenAI, GitHub Models, Foundry Local, Azure AI Content Safety, Azure AI Search, Azure Cosmos DB, Power Apps, Power Automate, Dataverse, AI Builder, Copilot Studio, PromptFlow, or `learn.microsoft.com` in lesson prose or notebooks (credits live solely in `ACKNOWLEDGEMENTS.md`)
- Self-contained `.ipynb` notebooks: must embed or deterministically synthesize all datasets and media (`embedding_index_3m.json`, `perceptron.md`, `own_framework.md`, `frameworks.md`, `training-data.jsonl`, `validation-data.jsonl`, `sunlit_lounge.png`, `mask.png`, `sample.jpg`) so they execute out-of-the-box on Google Colab without missing file errors
- Strict WCAG 2.2 AA contrast and heading hierarchy (`H1` rendered by `LessonLayout.astro`, so MDX bodies use `H2` → `H3` without skipping levels)

**Scale/Scope**:
- 1 curriculum registry update (`src/lib/curriculum.ts`)
- 22 `.mdx` tutorial lessons (`src/content/lessons/generative-ai-for-beginners/01-*.mdx` through `22-*.mdx`)
- 22 `.ipynb` companion Google Colab notebooks (`notebook/generative-ai-for-beginners/01-*.ipynb` through `22-*.ipynb`)

---

## Multi-Angle Architectural Evaluation & System Design

### 1. Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing layout and interactive components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) with zero new npm dependencies or UI component changes. Updating `src/lib/curriculum.ts` and adding `.mdx` files under `src/content/lessons/generative-ai-for-beginners/` automatically populates `/learn/generative-ai-for-beginners`, the left sidebar, the Pathfinder progress bar, and the cross-course handoff links from Course 03 (`ml-for-beginners/27-debugging-ml-models-and-explainability`) and into Course 05 (`mcp-for-beginners`).
- **Risk-First Lens**:
  1. *Pyodide 5s Timeout & No Network Access in Browser Web Worker*: `google-genai`, `transformers`, `diffusers`, `chromadb`, `faiss-cpu`, `peft`, and `trl` require external network calls or multi-gigabyte GPU weights and cannot execute inside the 5-second browser Pyodide Web Worker (`src/workers/pyodide.worker.ts`). **Mitigation**: Each lesson's `<PythonRunner />` uses Python's standard library (`math`, `statistics`, `random`, `collections`, `re`, `json`, `hashlib`) to execute the exact underlying algorithmic mechanics—BPE/subword tokenization, autoregressive softmax temperature sampling, 4-layer safety filtering, Chain-of-Thought & Self-Refine parsing, multi-stage prompt chaining, Perplexity/$F_1$/Cosine Similarity math, 3-minute overlapping transcript chunking, JSON Schema function-call dispatching, word-bounded RAG chunking & Mean Average Precision (MAP), visual metaprompt guardrails, invoice extraction schemas, PII scrubbing & `MakeMeSay` red-team evaluation, LLMOps DAG telemetry, Multi-Query Attention KV-cache & LoRA parameter reduction math, Top-2 Sparse MoE routing, Korean-English L2 vector search, and Llama `<|python_tag|>` tool parsing—deterministically in `< 150ms` with exact `expectedOutput`, while full `google-genai` and GPU open-weight workflows run in the linked Colab `.ipynb` notebook.
  2. *Missing `GEMINI_API_KEY` or Relative Files in Google Colab*: If a learner opens a notebook in Google Colab and clicks "Run All" before configuring `GEMINI_API_KEY` in Colab Secrets, or if a notebook tries to read `../data/perceptron.md` or `training-data.jsonl` from disk, execution would fail. **Mitigation**: Every notebook embeds its datasets inline (`embedding_index_3m.json` sample, `perceptron.md`/`own_framework.md`/`frameworks.md`, `training-data.jsonl`/`validation-data.jsonl`, and programmatic PIL test images) and includes a helper `get_gemini_client()` that reads `google.colab.userdata.get('GEMINI_API_KEY')` or `os.environ.get('GEMINI_API_KEY')` and falls back gracefully with clear setup instructions and a deterministic offline demonstration mode when no key is present.
- **Seam-Quality Lens**: Clean 1-to-1 slug parity (`<slug>.mdx` ↔ `notebook/generative-ai-for-beginners/<slug>.ipynb`) across all 22 lessons (`01` through `22`).

### 2. System Design Trade-Off Analysis (`system-design`)

| Decision Area | Option A (Chosen) | Option B (Rejected) | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **LLM Cloud Provider Replacement (Lessons 01–16, 18, 21–22)** | **Google AI Studio Free Tier** (`google-genai` SDK with `GEMINI_API_KEY`, `gemini-2.5-flash`, `gemini-embedding-001`, and Imagen) + Colab Secrets guide | Azure OpenAI Service / Microsoft Foundry Models / OpenAI paid API | Google AI Studio offers a generous free tier requiring no credit card or Azure subscription, while supporting native system instructions, multi-turn chat, embeddings, structured Pydantic outputs, function calling, and safety settings. |
| **Low-Code AI Platform Replacement (Lesson 13 / Ref `10`)** | Open-source **Python Low-Code UI (`Gradio`) + `SQLite`/`Pandas` + `google-genai` multimodal structured outputs** on Google Colab Free Tier | Microsoft Power Apps, Power Automate, Dataverse, AI Builder, and Copilot Studio | Power Platform requires an enterprise M365/Power Apps license and cannot run in Colab. Gradio + SQLite + Gemini 2.5 Flash lets learners build and interact with the exact Student Assignment Tracker and Automated Invoice Extraction pipeline in pure Python on Colab Free Tier. |
| **Vector Search & RAG Storage (Lessons 09, 11, 21)** | Open-source **`ChromaDB`**, **`FAISS` (`faiss-cpu`)**, and **`scikit-learn` `NearestNeighbors(algorithm='ball_tree')`** paired with `gemini-embedding-001` / `sentence-transformers` | Azure Cognitive Search and Azure Cosmos DB for NoSQL Vector Search | Runs 100% in-memory or local persistent directory inside Google Colab with zero cloud database provisioning while preserving the exact `BallTree`, `IndexFlatL2`, and Mean Average Precision (MAP) evaluation workflows. |
| **LLM Fine-Tuning & Open-Weight Execution (Lessons 17, 19–22)** | Open-source **Hugging Face `transformers` + `peft` (`LoraConfig`) + `trl` (`SFTTrainer`) + `bitsandbytes` (4-bit QLoRA) + `onnxruntime-genai` + `mistral-common`** on Colab Free T4 GPU | OpenAI / Microsoft Foundry hosted Fine-Tuning API and Foundry Local | Teaches real parameter-efficient fine-tuning (LoRA/QLoRA) on the exact "Elle" Periodic Table Limerick JSONL dataset and executes open-weight SLMs/tokenizers directly on a free Colab T4 GPU. |

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `A11Y-DECISIONS.md`, and `.agents/rules/`.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check` and `pnpm build`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 04 (`generative-ai-for-beginners`) connects directly from `ml-for-beginners/27-debugging-ml-models-and-explainability` (`Course 03`) and hands off to `mcp-for-beginners` (`Course 05`). All 22 lessons are grounded in `.ref/generative-ai-for-beginners/` (`00`–`21`) with zero `.ref/` mentions in lesson prose.
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style`, and includes opening hook, KaTeX math/formulas, `<PythonRunner client:visible />`, `<ColabButton course="generative-ai-for-beginners" />`, reference tables, `<QuizCard client:visible />`, and 350+ words of explanatory prose.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Replaces Microsoft Foundry, Azure OpenAI, GitHub Models, Azure AI Search, Azure Cosmos DB, Power Platform, and PromptFlow with open-source Python on Colab Free Tier and Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`).
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution in `/src/workers/pyodide.worker.ts`; zero server-side execution dependencies.
- [x] **Theme, Contrast & Accessibility Strategy (`DESIGN.md` & `A11Y-DECISIONS.md`)**:
  - Reuses accessible `<PythonRunner client:visible />` (Decision 1: Escape key focus-trap release; Decision 3: `aria-live="polite"` output region; Decision 4: reduced-motion confetti guard), `<QuizCard client:visible />` (Decision 2: `role="radiogroup"`, `aria-checked`, polite explanation region), and `<ColabButton />` (Decision 8 & 9: `min-h-[44px]`, forced-colors-safe focus outline, `.sr-only` new-tab announcement, high-contrast runtime metadata).
  - Maintains strict `H2` → `H3` heading hierarchy inside MDX articles (since `LessonLayout.astro` renders `H1`).
  - Uses standard Markdown tables (rendered with semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`) and fences all shell/CLI commands or escapes literal `$` (`\$1000`) so `$` never collides with KaTeX math delimiters.
  - Preserves fixed-height `AdSlot.astro` containers for zero CLS.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/014-create-full-course/
├── spec.md              # Feature specification (22 lessons, 5 user stories, requirements)
├── plan.md              # This implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                    # Zod schema for lessons collection
├── lib/
│   └── curriculum.ts                                    # Update generative-ai-for-beginners: plannedLessonCount: 22, runtimeBadges, 5 syllabusModules
├── components/
│   ├── islands/
│   │   ├── PythonRunner.tsx                             # Reused in-browser Pyodide runner
│   │   └── QuizCard.tsx                                 # Reused accessible quiz component
│   └── static/
│       ├── ColabButton.astro                            # Reused Google Colab deep-link CTA
│       ├── LessonSidebar.astro                          # Dynamic category-grouped sidebar
│       └── AdSlot.astro                                 # Zero-CLS reserved ad slot
└── content/
    └── lessons/
        └── generative-ai-for-beginners/                 # 22 MDX lessons (order: 1..22)
            ├── 01-course-setup-and-google-ai-studio.mdx
            ├── 02-introduction-to-generative-ai-and-llms.mdx
            ├── 03-exploring-and-comparing-different-llms.mdx
            ├── 04-using-generative-ai-responsibly.mdx
            ├── 05-prompt-engineering-fundamentals.mdx
            ├── 06-creating-advanced-prompts.mdx
            ├── 07-building-text-generation-applications.mdx
            ├── 08-building-chat-applications.mdx
            ├── 09-building-semantic-search-applications.mdx
            ├── 10-integrating-with-function-calling.mdx
            ├── 11-rag-and-vector-databases.mdx
            ├── 12-building-image-generation-applications.mdx
            ├── 13-building-low-code-ai-applications.mdx
            ├── 14-designing-ux-for-ai-applications.mdx
            ├── 15-securing-generative-ai-applications.mdx
            ├── 16-the-generative-ai-application-lifecycle.mdx
            ├── 17-open-source-models-and-hugging-face.mdx
            ├── 18-ai-agents-and-multi-agent-workflows.mdx
            ├── 19-fine-tuning-llms-with-lora.mdx
            ├── 20-building-with-small-language-models.mdx
            ├── 21-building-with-mistral-models.mdx
            └── 22-building-with-meta-llama-models.mdx

notebook/
└── generative-ai-for-beginners/                         # 22 self-contained Colab notebooks (nbformat v4)
    ├── 01-course-setup-and-google-ai-studio.ipynb
    ├── 02-introduction-to-generative-ai-and-llms.ipynb
    ├── 03-exploring-and-comparing-different-llms.ipynb
    ├── 04-using-generative-ai-responsibly.ipynb
    ├── 05-prompt-engineering-fundamentals.ipynb
    ├── 06-creating-advanced-prompts.ipynb
    ├── 07-building-text-generation-applications.ipynb
    ├── 08-building-chat-applications.ipynb
    ├── 09-building-semantic-search-applications.ipynb
    ├── 10-integrating-with-function-calling.ipynb
    ├── 11-rag-and-vector-databases.ipynb
    ├── 12-building-image-generation-applications.ipynb
    ├── 13-building-low-code-ai-applications.ipynb
    ├── 14-designing-ux-for-ai-applications.ipynb
    ├── 15-securing-generative-ai-applications.ipynb
    ├── 16-the-generative-ai-application-lifecycle.ipynb
    ├── 17-open-source-models-and-hugging-face.ipynb
    ├── 18-ai-agents-and-multi-agent-workflows.ipynb
    ├── 19-fine-tuning-llms-with-lora.ipynb
    ├── 20-building-with-small-language-models.ipynb
    ├── 21-building-with-mistral-models.ipynb
    └── 22-building-with-meta-llama-models.ipynb
```

**Structure Decision**: Uses Astro's existing file-based content collection (`src/content/lessons/generative-ai-for-beginners/<slug>.mdx`) and top-level `./notebook/generative-ai-for-beginners/<slug>.ipynb` directory so `ColabButton.astro` resolves `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/generative-ai-for-beginners/<slug>.ipynb` without modifying any routing or component code.

---

## Detailed Module & Lesson Implementation Blueprint

### Module 1: GenAI Setup & Foundations (`category: "Module 1: GenAI Setup & Foundations"`)
1. **Lesson 01 (`01-course-setup-and-google-ai-studio`, `order: 1`, `xp: 50`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ml-for-beginners/27-debugging-ml-models-and-explainability"]`
   - **Reference**: `.ref/generative-ai-for-beginners/00-course-setup/README.md`, `01-setup-cloud.md`, `02-setup-local.md`, `03-providers.md`
   - **Content**: Course roadmap and transition from Classical Machine Learning to Generative AI Engineering; Choosing an execution runtime (**Google Colab Free Tier** CPU & T4 GPU vs. local Python virtual environment `python -m venv .venv`); Step-by-step guide to obtaining a free **Google AI Studio API Key (`GEMINI_API_KEY`)**; Storing secrets securely in **Google Colab Secrets (`google.colab.userdata.get('GEMINI_API_KEY')`)** and local `.env` files (`python-dotenv` `load_dotenv()`, `.gitignore` hygiene); Comparing hosted LLM API endpoints (`google-genai` SDK: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-embedding-001`) with open-weight Hugging Face Hub models (`HF_TOKEN`) and local inference runtimes (`Ollama`, `llama.cpp`, `onnxruntime-genai`); Understanding free-tier rate limits (Requests Per Minute $\text{RPM}$, Tokens Per Minute $\text{TPM}$, Requests Per Day $\text{RPD}$) and exponential backoff retry math.
   - **Pyodide Sandbox**: Pure-Python Environment Config Validator & Token/Rate-Limit Planner that parses a simulated `.env` configuration, masks API keys for safe logging, verifies secret isolation rules, and computes free-tier batch throughput and exponential backoff intervals ($t_k = \min(t_{\max}, t_0 \cdot 2^k)$).
   - **Colab Notebook**: `01-course-setup-and-google-ai-studio.ipynb` (Installing `google-genai` and `python-dotenv`, reading `GEMINI_API_KEY` from Colab `userdata` or `.env`, verifying connection with a first `gemini-2.5-flash` call, and testing local Hugging Face tokenizer setup).
2. **Lesson 02 (`02-introduction-to-generative-ai-and-llms`, `order: 2`, `xp: 60`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/01-course-setup-and-google-ai-studio"]`
   - **Reference**: `.ref/generative-ai-for-beginners/01-introduction-to-genai/README.md`
   - **Content**: Evolution of AI & NLP (1960s keyword chatbots $\rightarrow$ 1990s statistical ML classification $\rightarrow$ 2000s RNN virtual assistants $\rightarrow$ the Transformer revolution); Where Generative AI fits inside **AI $\supset$ Machine Learning $\supset$ Deep Learning $\supset$ Generative AI**; How Large Language Models work under the hood:
     1. **Tokenization**: Splitting raw text into subword tokens and integer IDs.
     2. **Transformer Architecture & Self-Attention**: Weighing contextual relationships across all tokens in parallel rather than sequentially.
     3. **Autoregressive Next-Token Prediction (Expanding Window)**: Given $n$ input tokens, predicting $t_{n+1} \sim P(w \mid t_1, \dots, t_n)$, appending $t_{n+1}$ to the context window, and repeating until `<EOS>` or `max_output_tokens`.
     4. **Probability Distributions & Temperature ($T$)**: Softmax temperature scaling:
        $$P(w_i \mid w_{<t}) = \frac{\exp(z_i / T)}{\sum_{j=1}^{|V|} \exp(z_j / T)}$$
        and why $T \to 0$ yields deterministic greedy argmax while higher $T$ increases stochastic creativity (and fabrication risk).
     - Applying LLMs to our EdTech startup scenarios (summarizing academic papers, creative essay ideation, Q&A tutoring, text completion, and code explanation/generation).
   - **Pyodide Sandbox**: Pure-Python Subword Tokenizer, Autoregressive Expanding-Window Simulator & Softmax Temperature Sampler ($T=0.1$ vs $T=1.2$) showing how logit distributions shift and how tokens are appended step-by-step.
   - **Colab Notebook**: `02-introduction-to-generative-ai-and-llms.ipynb` (Exploring tokenization, running the 5 EdTech startup scenarios with `gemini-2.5-flash`, comparing $T=0.0$ vs $T=1.0$ outputs, and Assignment: Industry GenAI Transformation Analysis).
3. **Lesson 03 (`03-exploring-and-comparing-different-llms`, `order: 3`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/02-introduction-to-generative-ai-and-llms"]`
   - **Reference**: `.ref/generative-ai-for-beginners/02-exploring-and-comparing-different-llms/README.md`
   - **Content**: Categorizing the LLM landscape:
     - **By Modality**: Audio/Speech (Whisper), Image Synthesis (Diffusion / Imagen), Text & Code Generation, and Native Multimodal models (Gemini).
     - **Foundation Models vs. Instruction/Chat-Tuned LLMs**: Self-supervised pre-training on broad data vs. task/dialogue alignment.
     - **Open-Weight / Open-Source (Gemma, Llama, Mistral, OLMo) vs. Proprietary Hosted Models (Gemini, GPT, Claude)** and the **Service vs. Model** distinction.
     - **By Output Type**: Dense vector **Embeddings** (for transfer learning & semantic similarity) vs. Image synthesis vs. Text/Code completion.
     - **By Transformer Architecture**:
       1. *Encoder-Only* (bidirectional context reviewer for classification, NER, embeddings — e.g., BERT, RoBERTa).
       2. *Decoder-Only* (causal masked autoregressive content creator — e.g., Gemini, GPT, Llama, Mistral, Gemma).
       3. *Encoder-Decoder* (sequence-to-sequence translation & summarization — e.g., T5, BART).
     - **Testing, Benchmarking, Iteration & Evaluation**: Understanding model cards, benchmark suites, and the **4-Tier Enterprise Adaptation Hierarchy**:
       1. *Prompt Engineering with Context* (lowest cost, fastest iteration).
       2. *Retrieval-Augmented Generation (RAG)* (grounding in private/fresh vector-indexed data).
       3. *Fine-Tuning* (adapting style, tone, or specialized task weights).
       4. *Training from Scratch* (domain-specific foundation pre-training).
   - **Pyodide Sandbox**: Pure-Python LLM Architecture & Adaptation Strategy Decision Engine that evaluates startup requirements (latency budget, privacy constraints, knowledge freshness, task modality) and recommends the optimal Transformer architecture (`Encoder-Only`, `Decoder-Only`, `Encoder-Decoder`) and adaptation tier (`Prompting`, `RAG`, `Fine-Tuning`, `Pre-training`) with cost/complexity scores.
   - **Colab Notebook**: `03-exploring-and-comparing-different-llms.ipynb` (Comparing Decoder-only `gemini-2.5-flash`, Embedding model `gemini-embedding-001`, and open-weight Hugging Face Encoder/Seq2Seq models on Colab Free Tier).
4. **Lesson 04 (`04-using-generative-ai-responsibly`, `order: 4`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/03-exploring-and-comparing-different-llms"]`
   - **Reference**: `.ref/generative-ai-for-beginners/03-using-generative-ai-responsibly/README.md`
   - **Content**: The 6 Core Responsible AI Principles in the Generative AI era (Fairness, Inclusiveness, Reliability/Safety, Security & Privacy, Transparency, Accountability); Deep dive into the 3 primary Generative AI failure modes:
     1. **Hallucinations / Fabrications**: Why statistical next-token predictors plausibly invent false facts (e.g., the classic *"Who was the sole survivor of the Titanic?"* prompt fabricating an answer when over 700 people survived).
     2. **Harmful Content**: Hate speech, harassment, self-harm, violent or sexually explicit generation, and copyright/IP leakage.
     3. **Bias & Lack of Fairness**: Amplifying historical demographic stereotypes present in internet pre-training corpora.
     - The **Measure $\rightarrow$ Mitigate $\rightarrow$ Operate** Lifecycle: building red-teaming test sets, evaluating accuracy/groundedness/similarity/relevance, and establishing incident response and rollback plans.
     - The **4 Defense-in-Depth Mitigation Layers**:
       1. *Layer 1 — Model*: Selecting right-sized models and safety-aligned weights.
       2. *Layer 2 — Safety System*: Platform content filters (`google-genai` `SafetySetting`, `HarmCategory`, `HarmBlockThreshold`), jailbreak classifiers, and bot abuse limits.
       3. *Layer 3 — Metaprompt & Grounding*: System instructions defining boundaries, fact-retrieval RAG, and explicit refusal rules.
       4. *Layer 4 — User Experience (UX)*: Input constraints, AI disclosure badges, source citations, and human-in-the-loop review.
   - **Pyodide Sandbox**: Pure-Python 4-Layer Responsible GenAI Defense Pipeline & Groundedness Evaluator that processes adversarial and hallucination-inducing prompts (including *"Who was the sole survivor of the Titanic?"*) through Layer 1–4 checks and computes a Factual Groundedness Score against verified reference facts.
   - **Colab Notebook**: `04-using-generative-ai-responsibly.ipynb` (Configuring `types.SafetySetting` across `HARM_CATEGORY_HATE_SPEECH`, `HARM_CATEGORY_HARASSMENT`, and `HARM_CATEGORY_DANGEROUS_CONTENT` in `google-genai`, testing the Titanic premise-trap prompt with grounded system instructions, and auditing response groundedness).

### Module 2: Prompt Engineering & Text/Chat Applications (`category: "Module 2: Prompt Engineering & Text/Chat Applications"`)
5. **Lesson 05 (`05-prompt-engineering-fundamentals`, `order: 5`, `xp: 75`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/04-using-generative-ai-responsibly"]`
   - **Reference**: `.ref/generative-ai-for-beginners/04-prompt-engineering-fundamentals/README.md`, `python/oai-assignment.ipynb`
   - **Content**: What is Prompt Engineering (guiding stochastic completion toward high-utility outputs); **Base LLMs vs. Instruction-Tuned LLMs (RLHF — Reinforcement Learning from Human Feedback)**; Why prompt engineering is essential (model variance, stochasticity, and fabrications like `"generate a lesson plan on the Martian War of 2076"`); **Tokenization Deep Dive**: subword encoding/decoding of the Jupiter astronomy passage (`tiktoken` & `client.models.count_tokens()`); **Decomposing Prompt Anatomy**:
     - *Basic vs. Complex Multi-Turn Prompts* (`system`, `user`, `assistant`/`model` roles).
     - *Instruction Prompts* + *Primary Content* (summarizing the Jupiter passage for a 2nd-grade student).
     - *Examples* (Zero-shot, One-shot, Few-shot learning).
     - *Cues* (priming the output prefix so the model completes in the desired format).
     - *Prompt Templates* (parameterized reusable structures) and *Supporting / Secondary Content* (taxonomies, prioritization tags).
     - Case Study: **How GitHub Copilot Constructs Prompts** from open editor tabs, cursor neighbor code, file paths, and comments; Prompt Engineering Best Practices (specificity, delimiters, show-and-tell, double-down repetition, recency/ordering effect, and giving the model an explicit "out" when facts are missing).
   - **Pyodide Sandbox**: Pure-Python Prompt Anatomy Compiler, Subword Tokenizer & Fabrication Guard that tokenizes the Jupiter passage, builds structured prompts combining `Instruction + Primary Content + Few-Shot Examples + Supporting Taxonomy + Output Cue`, and demonstrates how giving the model an explicit "out" blocks the *"Martian War of 2076"* fabrication.
   - **Colab Notebook**: `05-prompt-engineering-fundamentals.ipynb` (All 5 hands-on exercises from the reference notebook adapted to `google-genai` and `tiktoken`: Jupiter tokenization, `"oh say can you see"` completion, Martian War of 2076 fabrication test, 2nd-grade Jupiter summarizer, and multi-turn sarcastic 2020 World Series assistant).
6. **Lesson 06 (`06-creating-advanced-prompts`, `order: 6`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/05-prompt-engineering-fundamentals"]`
   - **Reference**: `.ref/generative-ai-for-beginners/05-advanced-prompts/README.md`, `python/aoai-assignment.py`, `python/aoai-solution.py`
   - **Content**: Mastering the 7 Advanced Prompting Techniques:
     1. **Zero-Shot vs. Few-Shot Prompting**: Guiding style and meter with 3 Shakespearean sonnet exemplars (Sonnets 18, 116, 132) to compose a new sonnet about the moon.
     2. **Chain-of-Thought (CoT)**: Why `"Alice has 5 apples, throws 3 away, gives 2 to Bob and Bob gives 1 back"` tricks naive one-shot prompting into answering `5`, and how demonstrating Lisa's step-by-step arithmetic ($7 - 1 = 6$, $6 - 4 = 2$, $2 + 1 = 3$) guides the model to the exact answer (`1 apple`).
     3. **Generated Knowledge**: Dynamically injecting structured domain facts (`ACME Insurance` product catalog, `\$1000` budget, home/auto/marine requirements) into `{{company}}` template variables before asking for a recommendation.
     4. **Least-to-Most Prompting**: Decomposing complex workflows into ordered sub-questions (`"How to perform data science in 5 steps?"` $\rightarrow$ expanding each step sequentially).
     5. **Self-Refine (Critique & Improve)**: Generating an initial Flask web route (`request.args.get('name', 'World')`), prompting the LLM to critique security and architecture weaknesses, and regenerating a hardened version (`FlaskForm` validation with `DataRequired`/`Length`/`Email`, `os.environ.get('FLASK_SECRET_KEY')`, `markupsafe.escape` XSS sanitization, and `@app.errorhandler(400)`).
     6. **Maieutic Prompting**: Building an explanation tree (`"How can I create a crisis plan to mitigate a pandemic in 5 steps?"` $\rightarrow$ asking `"Why is step X critical and what happens if it fails?"`) to prune logically inconsistent branches.
     7. **Varying Output Parameters**: Controlling determinism vs. divergence with `temperature` ($0.1$ vs $0.9$), `top_p`, and `top_k`.
   - **Pyodide Sandbox**: Pure-Python Advanced Prompting Workbench executing (1) Chain-of-Thought arithmetic verification (Lisa & Alice apple problem), (2) Generated Knowledge template hydration (`ACME Insurance`), and (3) Automated Self-Refine security critique comparing the vulnerable vs. hardened Flask code from `aoai-assignment.py` and `aoai-solution.py`.
   - **Colab Notebook**: `06-creating-advanced-prompts.ipynb` (Executing Few-Shot Sonnets, Chain-of-Thought, Generated Knowledge, Least-to-Most, Maieutic prompting, $T=0.1$ vs $T=0.9$ sampling, and the complete Flask Self-Refine security upgrade using `google-genai`).
7. **Lesson 07 (`07-building-text-generation-applications`, `order: 7`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/06-creating-advanced-prompts"]`
   - **Reference**: `.ref/generative-ai-for-beginners/06-text-generation-apps/README.md`, `python/aoai-app.py`, `python/aoai-app-recipe.py`, `python/aoai-history-bot.py`, `python/aoai-study-buddy.py`
   - **Content**: Architecture of a Production Text Generation Application (comparing traditional fixed-logic CLI/GUI apps against prompt-driven LLM applications); Input validation and prompt-injection defense (`validate_number_input` checking $1 \le n \le 10$ and `validate_text_input` using regex `^[a-zA-Z0-9\s,.\-\']+$` to strip control characters); Token budgeting (`max_output_tokens`), `temperature`, and `.env` credential management; Building 3 complete Python applications with **Google AI Studio (`google-genai`)**:
     1. **Multi-Step Recipe Generator & Shopping List Chainer (`app-recipe.py`)**: Takes recipe count, ingredients on hand (`chicken, broccoli, carrots`), and dietary filter (`vegetarian`/`peanuts`), generates recipes + nutrition facts (`old_prompt_result`), and chains `old_prompt_result` into a second LLM call (`new_prompt`) to build a categorized grocery shopping list that excludes ingredients already at home.
     2. **Historical Persona Bot (`history-bot.py`)**: Adopts a historical figure (e.g., Abraham Lincoln) with temperature $0.0$ and strict timeline grounding (`"If the question asks about events after your lifetime or facts you don't know, say you don't remember"`).
     3. **Python Study Buddy (`study-buddy.py`)**: Answers beginner Python questions enforcing a strict 3-part markdown response contract (`- Concept`, `- Example code`, `- Explanation`).
   - **Pyodide Sandbox**: Pure-Python Multi-Step Recipe & Shopping List Prompt Chainer + Regex Input Sanitizer that validates user inputs against injection payloads, constructs Prompt 1 (Recipe Generation), chains the output into Prompt 2 (Shopping List Subtraction), and computes set-difference grocery items excluding home pantry ingredients.
   - **Colab Notebook**: `07-building-text-generation-applications.ipynb` (Complete runnable implementations of the Starter Completion App, the 2-stage Recipe & Shopping List Chainer, the Abraham Lincoln History Bot, and the Python Study Buddy using `google-genai`).
8. **Lesson 08 (`08-building-chat-applications`, `order: 8`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/07-building-text-generation-applications"]`
   - **Reference**: `.ref/generative-ai-for-beginners/07-building-chat-applications/README.md`, `python/aoai-assignment.ipynb`
   - **Content**: Traditional rule-based chatbots vs. context-aware Generative AI chat applications; Managing stateful conversation history (`client.chats.create(model="gemini-2.5-flash")` and `system`, `user`, `model` message turns); The **4-Part System Message Design Framework**:
     1. *Define the Model's Profile* (audience, capabilities, domain boundaries).
     2. *Define the Output Format* (tables, bullet lists, verbosity limits).
     3. *Provide Examples* (few-shot conversational turns).
     4. *Establish Behavioral Guardrails* (safety, tone, citation rules).
     - Customizing chat applications for specialized domains (e.g., medical advisory vs. educational tutoring) and **4-Dimension Accessibility** (Visual: screen readers & high contrast; Auditory: captions & visual cues; Motor: keyboard/voice operability; Cognitive: simplified explanations & adjustable reading levels).
     - **10 Operational & ML Evaluation Metrics for Chatbots**: Uptime, Response Time (Latency), **Precision** ($\frac{\text{TP}}{\text{TP}+\text{FP}}$), **Recall** ($\frac{\text{TP}}{\text{TP}+\text{FN}}$), **$F_1$ Score** ($\frac{2PR}{P+R}$), **Perplexity**:
       $$\text{PPL}(W) = \exp\left(-\frac{1}{N}\sum_{i=1}^{N} \log P(w_i \mid w_{<i})\right)$$
       User Satisfaction (CSAT), Error Rate, Retraining Frequency, and Anomaly Detection.
     - Hands-On Multi-Task Chat & Embedding Lab (`aoai-assignment.ipynb`):
       - Conversational Q&A (`"Should oxford commas always be used?"`).
       - `tl;dr` Summarization on an NLP research abstract.
       - Zero-Shot Customer Inquiry Classification (`"one of the keys on my laptop keyboard broke"` $\rightarrow$ `Hardware Support`).
       - Few-Shot Product Name Generation (`HomeShaker, Fit Shaker` $\rightarrow$ omni-fit adaptable shoes).
       - **Word & Article Embeddings Cosine Similarity**: comparing `automobile`, `vehicle`, `dinosaur`, and `stick`, and comparing 3 CNN/DailyMail news articles (1. Werder Bremen's record signing of Brazilian midfielder Carlos Alberto, 2. David Beckham's LA Galaxy transfer & injury update, and 3. Five-year-old burn survivor Youssif meeting Spider-Man at the Mattel Children's Hospital).
   - **Pyodide Sandbox**: Pure-Python Chatbot Evaluation & Embedding Similarity Suite that computes Precision, Recall, $F_1$, and Perplexity on chat transcripts and calculates the exact Cosine Similarity matrix across `automobile`/`vehicle`/`dinosaur`/`stick` and the 3 news articles (proving Article 1 Carlos Alberto and Article 2 David Beckham share high soccer similarity while Article 3 Youssif/Spider-Man is distinct).
   - **Colab Notebook**: `08-building-chat-applications.ipynb` (Stateful `google-genai` chat sessions with the 4-part System Message Framework, `tl;dr` summarization, zero-shot ticket classification, few-shot product naming, and `gemini-embedding-001` cosine similarity over words and the 3 CNN/DailyMail articles).

### Module 3: Semantic Search, RAG & Function Calling (`category: "Module 3: Semantic Search, RAG & Function Calling"`)
9. **Lesson 09 (`09-building-semantic-search-applications`, `order: 9`, `xp: 85`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["generative-ai-for-beginners/08-building-chat-applications"]`
   - **Reference**: `.ref/generative-ai-for-beginners/08-building-search-applications/README.md`, `embedding_index_3m.json`, `python/aoai-solution.ipynb`, `scripts/README.md`
   - **Content**: **Semantic Search vs. Keyword Search** (why keyword search fails when a learner searches `"how do I deploy models in Python?"` against a transcript that says `"serving neural networks in production"`); Understanding **Text Embeddings** as points in a high-dimensional semantic vector space; Unpacking the 5-stage **YouTube Video Transcript Enrichment Pipeline (`scripts/`)**:
     1. *Transcript Download (`transcript_download.py`)*: Fetching raw timestamped captions for educational AI videos.
     2. *Speaker Extraction (`transcript_enrich_speaker.py`)*: Using LLM function calling on the first 3 minutes of transcript to identify the speaker's name.
     3. *Time-Bucket Chunking with Overlap (`transcript_enrich_bucket.py`)*: Aggregating text into **3-minute segments (`180s`) with a 20-word overlap** from the next segment so concepts split across a 3-minute boundary remain intact.
     4. *Segment Summarization (`transcript_enrich_summaries.py`)*: Summarizing each 3-minute bucket into a dense 60-word summary.
     5. *Vector Embedding Index (`transcript_enrich_embeddings.py`)*: Embedding each segment summary into `embedding_index_3m.json`.
     - Deriving **Cosine Similarity**:
       $$\text{similarity}(\mathbf{a}, \mathbf{b}) = \cos(\theta) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\|_2 \|\mathbf{b}\|_2} = \frac{\sum_{i=1}^{d} a_i b_i}{\sqrt{\sum_{i=1}^{d} a_i^2}\sqrt{\sum_{i=1}^{d} b_i^2}}$$
     - Implementing `cosine_similarity(a, b)`, `get_videos(query, dataset, rows=5)` with similarity threshold filtering ($\ge 0.35$), and `display_results(videos, query)` formatting clickable timestamped deep links (`https://youtu.be/{videoId}?t={seconds}`).
   - **Pyodide Sandbox**: Pure-Python 3-Minute Overlapping Transcript Chunker & Semantic Video Search Engine that chunks timestamped transcript lines into 180-second buckets with a 20-word lookahead overlap, computes cosine similarity against embedded video segments, filters by $\ge 0.35$, and outputs the top-ranked `https://youtu.be/{videoId}?t={seconds}` deep links.
   - **Colab Notebook**: `09-building-semantic-search-applications.ipynb` (Self-contained `embedding_index_3m.json` dataset + transcript chunker, embedding queries with **Google AI Studio `gemini-embedding-001`** and open-source **`sentence-transformers`**, ranking segments by cosine similarity, and rendering clickable YouTube timestamp links).
10. **Lesson 10 (`10-integrating-with-function-calling`, `order: 10`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/09-building-semantic-search-applications"]`
    - **Reference**: `.ref/generative-ai-for-beginners/11-integrating-with-function-calling/README.md`, `python/aoai-assignment.ipynb`
    - **Content**: Why LLMs need **Function Calling (Tool Use)**: overcoming frozen training-cutoff knowledge and inconsistent unstructured JSON formatting; Demonstrating the Unstructured Prompting Problem: extracting `{name, major, school, grades, club}` from `Emily Johnson` (Duke University, Computer Science, 3.7 GPA, Chess Club) vs. `Michael Lee` (Stanford University, Computer Science, 3.8 GPA, Robotics Team) where plain prompts yield inconsistent types (`"3.7"` vs `"3.8 GPA"`); Anatomy of a Function Declaration / JSON Schema (`name`, `description`, `parameters`, `properties`, `required`); Core Use Cases (`send_email`, `get_completed`, `get_important_facts`); The **4-Stage Function Calling Lifecycle**:
      1. *Tool Registration*: Passing user prompt + `tools=[search_courses]` schema (`role`, `product`, `level`) to the LLM.
      2. *Intent & Argument Extraction*: Model emits a structured `function_call` object (`name="search_courses"`, `args={"role": "student", "product": "python", "level": "beginner"}`).
      3. *External Execution*: Application dispatches `available_functions[function_name](**function_args)` against a live course catalog REST API and extracts the top 5 modules (`title`, `url`).
      4. *Grounded Response Synthesis*: Application sends `function_response` back to the LLM to synthesize a study plan with real course URLs.
    - **Pyodide Sandbox**: Pure-Python Function-Calling Dispatcher & JSON Schema Validator that compares unstructured vs. schema-enforced extraction on the `Emily Johnson` and `Michael Lee` student biographies, validates tool call arguments against the `search_courses` JSON Schema, executes the catalog search function, and synthesizes the final response turn.
    - **Colab Notebook**: `10-integrating-with-function-calling.ipynb` (Extracting uniform student JSON profiles using `google-genai` Pydantic `response_schema`, defining the `search_courses(role, product, level)` tool, executing live REST API queries, and completing the multi-turn tool-response loop with `gemini-2.5-flash`).
11. **Lesson 11 (`11-rag-and-vector-databases`, `order: 11`, `xp: 90`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/10-integrating-with-function-calling"]`
    - **Reference**: `.ref/generative-ai-for-beginners/15-rag-and-vector-databases/README.md`, `notebook-rag-vector-databases.ipynb`, `data/perceptron.md`, `data/own_framework.md`, `data/frameworks.md`
    - **Content**: The complete **Retrieval-Augmented Generation (RAG)** architecture (Retriever + Generator, Knowledge Base Ingestion $\rightarrow$ Chunking $\rightarrow$ Embedding $\rightarrow$ Vector Index $\rightarrow$ Query Retrieval $\rightarrow$ Re-ranking $\rightarrow$ Grounded Generation); Comparing **RAG-Sequence** (same retrieved passages condition the entire generated sequence) vs. **RAG-Token** (different passages can condition each generated token); **Vector Databases vs. Traditional Relational/NoSQL Databases** and **Keyword vs. Vector vs. Hybrid Search**; Comparing the 3 core Vector Distance & Similarity Metrics:
      $$\text{Cosine Similarity} = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|_2 \|\mathbf{b}\|_2}, \quad d_{L_2}(\mathbf{a}, \mathbf{b}) = \sqrt{\sum_{i=1}^d (a_i - b_i)^2}, \quad \text{Dot Product} = \sum_{i=1}^d a_i b_i$$
      Hands-On Engineering Walkthrough (`notebook-rag-vector-databases.ipynb`):
      1. *Loading the 3 Neural Network Markdown Documents*: `data/perceptron.md`, `data/own_framework.md`, and `data/frameworks.md`.
      2. *Word-Bounded Chunking (`split_text(text, max_length=400, min_length=300)`)**: Splitting long markdown documents between 300 and 400 characters along word boundaries without cutting words in half, followed by `df.explode('chunks')`.
      3. *Vector Indexing with `BallTree` & `ChromaDB`*: Indexing chunk embeddings with `sklearn.neighbors.NearestNeighbors(n_neighbors=5, algorithm='ball_tree')` and open-source **`ChromaDB`**.
      4. *Grounded RAG Chatbot*: `chatbot("what is a perceptron?")` retrieving the top-5 chunks via `nbrs.kneighbors` and answering strictly from retrieved context.
      5. *Quantitative RAG Evaluation via Mean Average Precision (MAP)*:
         $$\text{AP} = \sum_{k=1}^{n} (R_k - R_{k-1}) P_k, \quad \text{MAP} = \frac{1}{|Q|} \sum_{q=1}^{|Q|} \text{AP}(q)$$
         Scoring chatbot answers against ground-truth `relevant_responses` and `irrelevant_responses` across 4 test queries (`"What is a perceptron?"`, `"What is machine learning?"`, `"What is deep learning?"`, `"What is a neural network?"`) using `average_precision_score`.
    - **Pyodide Sandbox**: Pure-Python Word-Bounded RAG Chunker (`split_text(400, 300)`), Nearest-Neighbor Retriever & Mean Average Precision (MAP) Evaluator operating over the `perceptron.md`, `own_framework.md`, and `frameworks.md` corpus.
    - **Colab Notebook**: `11-rag-and-vector-databases.ipynb` (Self-contained notebook embedding `perceptron.md`, `own_framework.md`, and `frameworks.md` inline, running `split_text(400, 300)`, indexing with `NearestNeighbors(algorithm='ball_tree')` and `ChromaDB`, querying with `gemini-2.5-flash` & `gemini-embedding-001`, and computing the 4-query Mean Average Precision score).

### Module 4: Multimodal Apps, Low-Code UI, AI UX, Security & LLMOps (`category: "Module 4: Multimodal Apps, Low-Code UI, AI UX, Security & LLMOps"`)
12. **Lesson 12 (`12-building-image-generation-applications`, `order: 12`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/11-rag-and-vector-databases"]`
    - **Reference**: `.ref/generative-ai-for-beginners/09-building-image-applications/README.md`, `python/aoai-app.py`, `python/aoai-solution.py`
    - **Content**: How Text-to-Image Generation works (text encoder embeddings conditioning an iterative latent diffusion denoising process $x_{t-1} \sim p_\theta(x_{t-1} \mid x_t, c_{\text{text}})$); Generating images from text prompts (`"Bunny on a horse, holding a lollipop, on a foggy meadow where it grows daffodils"`) and decoding base64 image payloads (`b64_json`) into PNG files with `Pillow` (`Image.open(BytesIO(base64.b64decode(...)))`); **Image Editing & Mask-Based Inpainting**: how an alpha mask (`mask.png`) isolates regions of an original image (`sunlit_lounge.png`) to synthesize `"A sunlit indoor lounge area with a pool containing a flamingo"` while preserving unmasked pixels; **Child-Safe Educational Visual Guardrails via Metaprompts (`aoai-solution.py`)**: wrapping user inputs (`"Generate monument of the Arc of Triumph in Paris, France, in the evening light with a small child holding a Teddy looks on"`) inside a structured safety metaprompt enforcing a `disallow_list` (`"swords, violence, blood, gore, nudity, sexual content, adult content, adult themes, adult language, adult situations, adult humor, adult concepts"`), `16:9` aspect ratio, landscape orientation, and full color; Running both open-source **Hugging Face `diffusers` (`AutoPipelineForText2Image`, `AutoPipelineForInpainting`)** on **Google Colab Free Tier (T4 GPU)** and **Google AI Studio Imagen (`client.models.generate_images`)**.
    - **Pyodide Sandbox**: Pure-Python Child-Safe Visual Metaprompt Compiler, Disallow-List Policy Enforcer & Alpha-Mask Inpainting Bounding-Box Compositor that validates monument prompts against the `disallow_list`, compiles the structured metaprompt, and simulates pixel-mask alpha blending (`sunlit_lounge` + `mask` $\rightarrow$ inpainted pool region).
    - **Colab Notebook**: `12-building-image-generation-applications.ipynb` (Generating images and running mask-based inpainting using open-source Hugging Face `diffusers` on Colab T4 GPU and `google-genai` Imagen API, plus the child-safe Arc de Triomphe monument generator).
13. **Lesson 13 (`13-building-low-code-ai-applications`, `order: 13`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/12-building-image-generation-applications"]`
    - **Reference**: `.ref/generative-ai-for-beginners/10-building-low-code-ai-applications/README.md`
    - **Content**: Principles of **Low-Code AI Application Development**: rapidly composing data tables, declarative UIs, prebuilt NLP/vision primitives, and event-driven automation workflows without writing boilerplate frontend/backend glue; Replacing proprietary Power Apps, Power Automate, Dataverse, AI Builder, and Copilot Studio with open-source **Python Low-Code AI Frameworks (`Gradio` + `SQLite`/`Pandas` + `google-genai` structured outputs)** runnable directly on **Google Colab Free Tier**; Building our Startup's 2 Complete Low-Code AI Workflows:
      1. **Student Assignment Tracker & AI Grading Assistant**: Designing the relational schema (`Assignment_ID`, `Title`, `Student_Name`, `Student_Email`, `Submission_Text`, `Due_Date`, `Grading_Status`, `Score`, `AI_Feedback`), building a declarative Gradio UI to track and filter assignments, and wiring an AI copilot action that grades submissions and drafts personalized student notification emails.
      2. **Automated Invoice & Document Processing Pipeline**: Extracting structured fields (`ID`, `Amount`, `Date`, `Name`, `Status`, `Supplier_Email`) from uploaded invoices using **Gemini 2.5 Flash multimodal vision + Pydantic structured outputs**, running prebuilt AI tasks (**Key Phrase Extraction**, **Language Detection**, **Sentiment Analysis**, **Text Recognition / OCR**), inserting validated records into the `InvoiceInfo` SQLite table, and triggering automated supplier status notifications.
    - **Pyodide Sandbox**: Pure-Python Low-Code Workflow Engine & Invoice/Assignment SQLite Pipeline that initializes the `StudentAssignments` and `InvoiceInfo` relational tables in Python's built-in `sqlite3`, extracts structured invoice fields (`ID`, `Amount`, `Date`, `Name`, `Status`, `Supplier_Email`), runs key-phrase/sentiment/language detection, inserts the database rows, and generates the automated email notification payload.
    - **Colab Notebook**: `13-building-low-code-ai-applications.ipynb` (Interactive **Gradio** Student Assignment Tracker & AI Grader backed by `sqlite3` + multimodal **Gemini 2.5 Flash** Invoice Extraction & Automated Notification workflow on Google Colab Free Tier).
14. **Lesson 14 (`14-designing-ux-for-ai-applications`, `order: 14`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/13-building-low-code-ai-applications"]`
    - **Reference**: `.ref/generative-ai-for-beginners/12-designing-ux-for-ai-applications/README.md`
    - **Content**: Why designing User Experience (UX) for probabilistic Generative AI differs fundamentally from deterministic software; The **4 Pillars of AI UX** (**Usability, Reliability, Accessibility, Pleasantness**); Designing for **Trust and Transparency**:
      - **The Trust Calibration Matrix**: Why *Mistrust* causes users to abandon helpful tools, why *Overtrust* causes users to blindly accept hallucinations (e.g., an unverified automated grading system), and how **Intentional Friction** and inline source citations build *Calibrated Trust*.
      - **Explainability & Persona-Aware Scaffolding**: Explicit AI identity disclosure (`"Hello! I'm your AI learning assistant"`), simplified plain-language explanations of how the AI works, and **Persona-Aware Responses** (giving a *Student* guided Socratic hints vs. giving a *Teacher* a complete grading rubric and answer key).
      - **User Control**: Giving users explicit controls over response tone, format, length, and **Data Collection Opt-In / Opt-Out** privacy toggles.
      - **Collaboration, Feedback Loops & Graceful Out-of-Scope Handling**: Thumbs-up/down and structured feedback collection that shapes system behavior; refusing out-of-scope questions gracefully without blaming the user (e.g., a tutor trained on **History and Math** declining a **Geography** question by clearly stating its supported subjects).
    - **Pyodide Sandbox**: Pure-Python Persona-Aware AI UX Controller, Out-of-Scope Boundary Detector & Trust Calibration Engine that switches behavior between `student` (Socratic scaffolding) and `teacher` (rubric generation), enforces `data_opt_in` privacy redaction, handles out-of-scope Geography queries gracefully, and logs thumbs-up/down calibration metrics.
    - **Colab Notebook**: `14-designing-ux-for-ai-applications.ipynb` (Building a trust-calibrated, persona-aware EdTech Tutor in Python & Gradio with `google-genai`, featuring Socratic student mode vs. teacher mode, tone/length sliders, data opt-in toggle, out-of-scope domain guardrails, and feedback telemetry).
15. **Lesson 15 (`15-securing-generative-ai-applications`, `order: 15`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/14-designing-ux-for-ai-applications"]`
    - **Reference**: `.ref/generative-ai-for-beginners/13-securing-ai-applications/README.md`
    - **Content**: The AI Security Threat Landscape (why traditional AppSec must expand to cover training data, weights, prompts, and stochastic outputs); Deep dive into the **4 Data Poisoning Attack Vectors**:
      1. *Label Flipping* (maliciously flipping benign/malicious labels in training data).
      2. *Feature Poisoning* (modifying input features with deceptive keywords to skew classification).
      3. *Data Injection* (flooding datasets with fabricated reviews to shift sentiment distributions).
      4. *Backdoor Attacks* (embedding a hidden trigger pattern during training that forces a target output at inference).
      - Industry Threat Frameworks: **MITRE ATLAS** (Adversarial Threat Landscape for Artificial-Intelligence Systems) and the **OWASP Top 10 for Large Language Model Applications** (Prompt Injection, Insecure Output Handling, Training Data Poisoning, Supply Chain Vulnerabilities, Overreliance, Sensitive Information / PII Disclosure).
      - The **4 Pillars of AI Security Testing**: **Data Sanitization**, **Adversarial Testing**, **Model Verification**, and **Output Validation**.
      - **AI Red Teaming & Safety Evaluation Benchmarks**:
        - *Persuasion Benchmarks*: **`MakeMeSay`** (tricking the model into uttering a secret forbidden codeword during conversation), **`MakeMePay`** (con-artist persuasion), and **`Ballot Proposal`** (political opinion shifting).
        - *Steganography Benchmarks*: Hidden messaging, Text Compression, and Schelling Point covert coordination.
      - **Data Protection & Governance**: PII masking/anonymization (emails, phone numbers, SSNs, credit cards), Role-Based Access Control (RBAC), and encryption.
    - **Pyodide Sandbox**: Pure-Python 4-Pillar AI Security & Red-Teaming Harness implementing (1) Regex/Presidio-style PII Data Sanitizer (`[REDACTED_EMAIL]`, `[REDACTED_SSN]`, `[REDACTED_CARD]`), (2) Direct & Indirect Prompt Injection Detector, (3) `MakeMeSay` Persuasion Red-Team Grader, and (4) Output Validator.
    - **Colab Notebook**: `15-securing-generative-ai-applications.ipynb` (Hands-on AI Security & Red-Teaming suite with `google-genai`: PII scrubbing pipeline, prompt-injection defense testing, automated `MakeMeSay` red-team simulation, and output validation guardrails).
16. **Lesson 16 (`16-the-generative-ai-application-lifecycle`, `order: 16`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/15-securing-generative-ai-applications"]`
    - **Reference**: `.ref/generative-ai-for-beginners/14-the-generative-ai-application-lifecycle/README.md`
    - **Content**: The Paradigm Shift from **MLOps to LLMOps**:
      - *Traditional MLOps*: Data scientists training single-task models from scratch, optimizing accuracy/loss over tabular/labeled datasets.
      - *Modern LLMOps*: Application developers orchestrating pre-trained foundation **Models-as-a-Service (MaaS)** via Directed Acyclic Graph (DAG) flows combining prompts, RAG vector search, function tools, and safety filters.
      - The **5 Holistic LLMOps Evaluation Metrics**: **Quality** (coherence, relevance, fluency), **Harm** (hate, violence, sexual, self-harm risk scores), **Honesty / Groundedness** (factual adherence to retrieved context without hallucination), **Cost** (input + output token expenditure: $\text{Cost} = \frac{N_{\text{in}} \cdot c_{\text{in}} + N_{\text{out}} \cdot c_{\text{out}}}{10^6}$), and **Latency** (Time-to-First-Token $\text{TTFT}$ and total wall-clock milliseconds).
      - Navigating the **3 Iterative Stages of the GenAI Application Lifecycle** (+ continuous **Management: Security, Compliance, Governance**):
        1. *Stage 1 — Ideating / Exploring*: Defining business hypothesis, prototyping prompt/RAG DAG flows, testing on a small golden sample.
        2. *Stage 2 — Building / Augmenting*: Scaling evaluation to large benchmark datasets, systematically experimenting with Metaprompts vs. RAG vs. Fine-Tuning, and gating on Quality/Harm/Honesty/Cost/Latency.
        3. *Stage 3 — Operationalizing*: Packaging the DAG for production deployment, A/B traffic routing, live token/latency telemetry, and automated regression alerts.
    - **Pyodide Sandbox**: Pure-Python LLMOps DAG Execution Tracer & 5-Metric Evaluation Harness that executes a multi-node RAG + LLM DAG flow across a golden test dataset and computes the complete 5-metric scorecard (`Quality`, `Harm`, `Honesty/Groundedness`, `Token Cost ($)`, and `Latency (ms)`) to decide whether a release candidate passes the Stage 2 $\rightarrow$ Stage 3 deployment gate.
    - **Colab Notebook**: `16-the-generative-ai-application-lifecycle.ipynb` (Building an open-source Python LLMOps DAG runner and LLM-as-a-Judge evaluation suite with `google-genai` that benchmarks prompt/RAG variants across Quality, Groundedness, Safety Harm, Token Cost, and Latency).

### Module 5: Open-Source Models, AI Agents, LoRA Fine-Tuning & SLMs (`category: "Module 5: Open-Source Models, AI Agents, LoRA Fine-Tuning & SLMs"`)
17. **Lesson 17 (`17-open-source-models-and-hugging-face`, `order: 17`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/16-the-generative-ai-application-lifecycle"]`
    - **Reference**: `.ref/generative-ai-for-beginners/16-open-source-models/README.md`
    - **Content**: **Open-Source vs. Open-Weight LLMs**:
      - *Open Source Initiative (OSI) Criteria*: Why a truly open-source LLM requires open pre-training datasets, full weights, evaluation code, fine-tuning scripts, and transparent metrics (exemplified by AllenAI's **OLMo-7B**), whereas most popular community models are **Open-Weight Models** (weights released under Apache 2.0 or custom community licenses).
      - The 3 Core Advantages of Open Models: **Customizability** (domain fine-tuning & architectural inspection), **Price vs. Performance Optimization** (analyzing Artificial Analysis Quality Index vs. $\text{\$/1M tokens}$ and throughput), and **Vendor-Agnostic Model Switching**.
      - Architectural Innovations Powering Open Models:
        1. **Multi-Query Attention (MQA) & Grouped-Query Attention (GQA)**: Sharing Key ($K$) and Value ($V$) projections across Query ($Q$) heads to shrink the autoregressive **KV-Cache** memory footprint by $4\times\text{–}8\times$:
           $$\text{KV Cache Bytes} = 2 \cdot b \cdot s \cdot L \cdot n_{\text{kv\_heads}} \cdot d_{\text{head}} \cdot \text{bytes\_per\_param}$$
        2. **FlashAttention**: IO-aware GPU SRAM tiling avoiding quadratic $O(N^2)$ HBM memory reads/writes.
        3. **Sparse Mixture-of-Experts (MoE)**: Routing each token to top-$k$ expert FFNs so a 47B total-parameter model runs with the latency of a ~13B active-parameter model.
      - Surveying Major Open Model Families & Domain Fine-Tunes on **Hugging Face**:
        - **Meta Llama** (RLHF dialogue alignment; community derivatives like *Japanese Llama* and *Llama Pro*).
        - **Mistral** (Apache 2.0 efficiency & Sparse MoE; domain derivatives like *BioMistral* for biomedical PubMed Central and *OpenMath-Mistral*).
        - **Falcon (TII)** (FlashAttention + Multi-Query Attention; powers *OpenAssistant* and *GPT4All*).
        - **Google Gemma** & **AllenAI OLMo**.
    - **Pyodide Sandbox**: Pure-Python Attention KV-Cache Memory Profiler (MHA vs. GQA vs. MQA) & Open-Model Cost/Quality Pareto Analyzer that computes exact GPU VRAM requirements across context lengths ($4\text{k}$ to $128\text{k}$) and ranks open vs. proprietary models on quality-per-dollar.
    - **Colab Notebook**: `17-open-source-models-and-hugging-face.ipynb` (Loading and benchmarking open-weight models from Hugging Face `transformers` on Google Colab Free Tier T4 GPU, inspecting attention head configurations, and measuring tokens-per-second throughput and VRAM usage).
18. **Lesson 18 (`18-ai-agents-and-multi-agent-workflows`, `order: 18`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/17-open-source-models-and-hugging-face"]`
    - **Reference**: `.ref/generative-ai-for-beginners/17-ai-agents/README.md`
    - **Content**: What is an **AI Agent**? Defining the triad: **$\text{Agent} = \text{LLM} + \text{State (Memory/Threads)} + \text{Tools (Functions/APIs/Models)}$**; When to use single-agent tool loops vs. multi-agent orchestration; Deep architectural comparison of the **5 Agent Paradigms**:
      1. **LangChain Agents**: `AgentExecutor` loop binding community toolkits with LangSmith trace observability.
      2. **AutoGen**: Conversable multi-agent systems pairing an LLM `AssistantAgent` with a code-executing/human-in-the-loop `UserProxyAgent`.
      3. **Typed Function-Tool & Workflow Orchestration**: Python typed tool decorators with Pydantic `Field` annotations, persistent conversation threads, OpenTelemetry spans, **Sequential Pipelines** (`[researcher, writer, editor]` where each agent refines the previous agent's output), and **Concurrent Fan-Out / Fan-In Workflows** (`[analyst_a, analyst_b, analyst_c]` running in parallel and aggregating perspectives).
      4. **TaskWeaver ("Code-First" Analytics Agent)**: Converting user requests directly into executable Python code manipulating **Pandas DataFrames** in-memory via a `Planner`, `CodeGenerator`, `CodeInterpreter`, embedding-selected `Plugins` (e.g., `AnomalyDetectionPlugin`), and persistent YAML `experience` memory.
      5. **JARVIS / HuggingGPT (Multimodal Model Controller)**: Using an LLM as a 4-stage controller (**1. Task Planning $\rightarrow$ 2. Model Selection $\rightarrow$ 3. Task Execution $\rightarrow$ 4. Response Generation**) that decomposes a complex user request into a dependency DAG of specialized Hugging Face models (`[{"task": "image-to-text", "id": 0, "dep": [-1]}, {"task": "object-detection", "id": 1, "dep": [0]}]`).
      - Hands-On Assignment Project: Building the **Multi-Agent EdTech Startup Pitch Boardroom** where distinct department agents (*Curriculum Pedagogy Lead*, *AI Systems Architect*, and *Trust, Safety & Finance Officer*) critique an EdTech product pitch sequentially and concurrently and generate follow-up diligence questions.
    - **Pyodide Sandbox**: Pure-Python Multi-Agent Orchestrator & JARVIS Task-DAG Planner that executes (1) a 4-stage JARVIS dependency DAG planner resolving topological execution order across vision/NLP models, and (2) the Sequential + Concurrent **EdTech Startup Pitch Boardroom** multi-agent simulation.
    - **Colab Notebook**: `18-ai-agents-and-multi-agent-workflows.ipynb` (Building a typed tool-calling agent, a Sequential `[Researcher -> Writer -> Editor]` pipeline, a Concurrent multi-agent pitch boardroom, and a TaskWeaver-style Pandas code-generating analytics agent using `google-genai` on Google Colab Free Tier).
19. **Lesson 19 (`19-fine-tuning-llms-with-lora`, `order: 19`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/18-ai-agents-and-multi-agent-workflows"]`
    - **Reference**: `.ref/generative-ai-for-beginners/18-fine-tuning/README.md`, `RESOURCES.md`, `python/openai/oai-assignment.ipynb`, `python/openai/training-data.jsonl`, `python/openai/validation-data.jsonl`
    - **Content**: What is Fine-Tuning and when should you use it? Evaluating the 4 Decision Pillars (**1. Use Case**, **2. Alternatives Baseline — Prompting & RAG first**, **3. Costs**, **4. Benefits**: shifting complexity from prompt tokens into model weights to shrink prompt length, reduce latency, and allow smaller models to match larger ones); Comparing the **3 Core Fine-Tuning Methods**:
      1. **Supervised Fine-Tuning (SFT)**: Training on curated `(system, user, assistant)` JSONL demonstration pairs to teach style, tone, format, or domain tasks.
      2. **Direct Preference Optimization (DPO)**: Aligning model outputs on `(prompt, chosen, rejected)` preference triples without training a separate RL reward model:
         $$\mathcal{L}_{\text{DPO}}(\pi_\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l)}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)\right]$$
      3. **Reinforcement Fine-Tuning (RFT)**: Grading chain-of-thought reasoning models with verifiable reward graders on small datasets.
      - Mathematical Foundation of **Low-Rank Adaptation (LoRA)** and **4-bit QLoRA**:
        $$W = W_0 + \Delta W = W_0 + \frac{\alpha}{r} B A, \quad B \in \mathbb{R}^{d \times r}, \; A \in \mathbb{R}^{r \times k}, \; r \ll \min(d, k)$$
        Freezing base pretrained weights $W_0$ (quantized to 4-bit NormalFloat `nf4` via `bitsandbytes` in QLoRA) and training only low-rank adapter matrices $A$ and $B$, cutting trainable parameters by $>99\%$.
      - Hands-On Fine-Tuning Project (**The "Elle" Periodic Table Limerick Chatbot**):
        - Inspecting and validating `training-data.jsonl` (Gallium, Hydrogen, Helium, Boron, Iron, Carbon, Cobalt, Titanium, Silver, Mercury) and `validation-data.jsonl` (`"Elle is a factual chatbot that answers questions about elements in the periodic table with a limerick"`).
        - Configuring hyperparameters (**Epochs**, **Learning Rate Multiplier**, **Batch Size**, **LoRA Rank $r$**, **LoRA Alpha $\alpha$**) and monitoring training telemetry (`train_loss`, `valid_loss`, `mean_token_accuracy`) to select the best checkpoint and prevent overfitting.
        - Running a real open-source **LoRA / QLoRA SFT fine-tuning job** using **Hugging Face `peft` (`LoraConfig`), `trl` (`SFTTrainer`), `transformers`, and `bitsandbytes`** on **Google Colab Free Tier (T4 GPU)** and testing inference on `"Tell me about Strontium"`.
    - **Pyodide Sandbox**: Pure-Python LoRA Parameter-Efficiency Calculator, JSONL Dataset Validator & Training Loss/Overfitting Checkpoint Analyzer that validates the exact `"Elle"` Periodic Table Limerick JSONL records, computes full vs. LoRA trainable parameter counts and VRAM savings across ranks $r \in \{4, 8, 16, 64\}$, and analyzes epoch-by-epoch `train_loss` vs `valid_loss` to select the optimal non-overfit checkpoint.
    - **Colab Notebook**: `19-fine-tuning-llms-with-lora.ipynb` (Self-contained notebook embedding the complete `training-data.jsonl` and `validation-data.jsonl` Periodic Table Limerick datasets inline, running 4-bit QLoRA / LoRA fine-tuning with Hugging Face `peft` and `trl` `SFTTrainer` on Colab T4 GPU, plotting training/validation loss curves, and generating a limerick for `"Tell me about Strontium"`).
20. **Lesson 20 (`20-building-with-small-language-models`, `order: 20`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/19-fine-tuning-llms-with-lora"]`
    - **Reference**: `.ref/generative-ai-for-beginners/19-slm/README.md`, `python/phi35-instruct-demo.ipynb`, `python/phi35-vision-demo.ipynb`, `python/phi35_moe_demo.ipynb`
    - **Content**: What are **Small Language Models (SLMs)**? How knowledge distillation, structured pruning, quantization, and "textbook-quality" synthetic/curated training data pack frontier reasoning into 1B–14B parameters; **5-Dimension Comparison of SLMs vs. LLMs** (**Size**: 2B–7B vs. >100B–1T; **Comprehension**: domain-focused accuracy vs. broad world knowledge; **Computing**: single T4 GPU / laptop / mobile edge vs. multi-node data center; **Bias**: curated training mixes; **Inference Speed & Latency**); Deep dive into the 3 SLM Architecture Variants & Runtimes:
      1. **Instruct SLMs (`phi35-instruct-demo.ipynb` / `Gemma-2-2B-IT`)**: Loading causal SLMs with Hugging Face `AutoModelForCausalLM.from_pretrained(..., device_map="cuda", torch_dtype="auto")`, `AutoTokenizer`, chat templates (`<|system|>...<|end|><|user|>...<|end|><|assistant|>`), and `transformers.pipeline("text-generation")`.
      2. **Multimodal Vision SLMs & Video Keyframe Summarization (`phi35-vision-demo.ipynb`)**: Using **OpenCV (`cv2.VideoCapture`)** to compute normalized HSV color histograms (`cv2.calcHist` + `cv2.normalize`) and frame-to-frame correlation (`cv2.compareHist(..., cv2.HISTCMP_CORREL) < 0.9`) to extract distinct visual keyframes `<|image_1|>...<|image_N|>` for multimodal video summarization.
      3. **Sparse Mixture-of-Experts SLMs (`phi35_moe_demo.ipynb`)**: Inspecting the 32-layer `PhiMoEForCausalLM` architecture (`PhiMoESparseMoeBlock` with `gate: Linear(4096, 16)` routing each token to the top-2 of 16 `PhiMoEBlockSparseTop2MLP` experts: $16 \times 3.8\text{B} \approx 42\text{B}$ total parameters, only **$6.6\text{B}$ active parameters** per token, plus `Phi3LongRoPEScaledRotaryEmbedding` for 128k context) and executing multi-step JSON tool routing (`Blog` + `Translate` agent actions).
      4. **High-Speed Edge Inference with ONNX Runtime for GenAI (`onnxruntime-genai`)**: Explicit autoregressive token loop (`og.Model`, `og.Tokenizer`, `og.GeneratorParams`, `generator.compute_logits()`, `generator.generate_next_token()`, `tokenizer_stream.decode()`).
    - **Pyodide Sandbox**: Pure-Python SLM vs. LLM Compute Profiler, OpenCV-Style Histogram Keyframe Extractor & Top-2 Sparse MoE Router that computes histogram correlation between consecutive video frames to isolate scene changes ($r < 0.9$), executes top-2 softmax expert gating across 16 MoE experts, and simulates the `onnxruntime-genai` token generation loop.
    - **Colab Notebook**: `20-building-with-small-language-models.ipynb` (Running an open-weight Instruct SLM with Hugging Face `transformers` on Colab T4 GPU, extracting distinct video/animation keyframes with OpenCV histogram correlation, inspecting Sparse MoE top-2 expert routing & JSON tool planning, and demonstrating `onnxruntime-genai`).
21. **Lesson 21 (`21-building-with-mistral-models`, `order: 21`, `xp: 85`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/20-building-with-small-language-models"]`
    - **Reference**: `.ref/generative-ai-for-beginners/20-mistral/README.md`, `python/githubmodels-assignment.ipynb`
    - **Content**: Exploring the **Mistral Model Family**:
      1. **Mistral Large 3**: Flagship enterprise Sparse Mixture-of-Experts (MoE) model under Apache 2.0 weights with a **256k token context window**, native parallel & sequential function calling, strong code generation (Python, Java, TypeScript, C++), and first-class multilingual fluency (English, French, German, Spanish, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic, Hindi).
      2. **Mistral Small 3.1**: Low-latency, cost-saving enterprise SLM (~80% lower token cost, 3–5s faster response time) optimized for high-volume summarization, sentiment analysis, translation, and fast code review.
      3. **Mistral NeMo (12B) & Mistral 7B**: Apache 2.0 open-weight models introducing the **Tekken Tokenizer** and native open-weight function calling.
      - Hands-On Engineering Walkthroughs (`20-mistral/README.md`):
        - **Cross-Language Korean-to-English FAISS RAG Pipeline**: Fetching Paul Graham's essay (`paul_graham_essay.txt`), chunking into `2048`-character segments, generating dense embeddings, indexing in **FAISS (`faiss.IndexFlatL2(d)`)**, querying in **Korean** (`"저자가 대학에 오기 전에 주로 했던 두 가지 일은 무엇이었나요?"` — *"What were the two main things the author worked on before college?"*), retrieving the top $k=2$ English chunks by $L_2$ distance (`D, I = index.search(...)`), and generating a grounded Korean/bilingual response (identifying *writing short stories* and *programming on an IBM 1401 in 9th grade*).
        - **Latency & Style Benchmarking (Small vs. Large)**: Comparing wall-clock latency, token count, and explanation verbosity on the Python `FizzBuzz` coding benchmark.
        - **Tekken Tokenizer Deep Dive (`mistral-common[hf-hub]`)**: Running `MistralTokenizer.from_hf_hub("mistralai/Mistral-Nemo-Instruct-2407")` locally with `ChatCompletionRequest` and `Tool(function=Function(name="get_current_weather", ...))` to measure multi-language and tool-schema token compression compared to legacy SentencePiece / `tiktoken`.
    - **Pyodide Sandbox**: Pure-Python Cross-Language Korean-to-English L2 Vector Index (`IndexFlatL2` simulator) & Tekken vs. BPE Multilingual Token Efficiency Analyzer that chunks Paul Graham's essay overview, performs $L_2$ nearest-neighbor search for the Korean query `"저자가 대학에 오기 전에 주로 했던 두 가지 일은 무엇이었나요?"`, retrieves the exact pre-college writing & IBM 1401 programming passage, and compares token compression across English, Korean, and JSON tool schemas.
    - **Colab Notebook**: `21-building-with-mistral-models.ipynb` (Building the complete **FAISS (`faiss-cpu` `IndexFlatL2`) Cross-Language Korean-to-English RAG pipeline** over Paul Graham's essay, benchmarking Small vs. Large model latency on `FizzBuzz`, and running the local **`mistral-common` Tekken tokenizer** from Hugging Face with `get_current_weather` tool schemas).
22. **Lesson 22 (`22-building-with-meta-llama-models`, `order: 22`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["generative-ai-for-beginners/21-building-with-mistral-models"]`
    - **Reference**: `.ref/generative-ai-for-beginners/21-meta/README.md`, `python/githubmodels-assignment.ipynb`
    - **Content**: Exploring the **Meta "Llama Herd" Architecture Evolution**:
      1. **Llama 3.1 & Llama 3.3 (8B, 70B, 405B Instruct)**: Expanding context window from $8\text{k} \rightarrow 128\text{k}$ tokens and max output tokens from $2048 \rightarrow 4096$, enabling long-context RAG, **Synthetic Data Generation** (generating teacher-student fine-tuning datasets), and **Native Function Calling**.
      2. **Llama 3.2 (1B & 3B Edge Text-Only + 11B & 90B Multimodal Vision Instruct)**: Bringing low-latency on-device SLMs to mobile/edge hardware and introducing cross-attention vision adapters for image-and-text understanding.
      3. **Llama 4 Scout (`17B-16E` Instruct)**: Native multimodal Mixture-of-Experts architecture combining 17B active parameters across 16 experts.
      - Hands-On Engineering Walkthroughs (`21-meta/README.md`):
        - **Llama Native Tool-Calling Prompt Protocol**: Constructing the exact special-token header structure:
          ```text
          <|begin_of_text|><|start_header_id|>system<|end_header_id|>
          Environment: ipython
          Tools: brave_search, wolfram_alpha
          Cutting Knowledge Date: December 2023
          Today Date: 23 July 2024
          You are a helpful assistant<|eot_id|>
          ```
          sending `"What is the weather in Stockholm?"` or mathematical queries, parsing the emitted `<|python_tag|>brave_search.call(query="Stockholm weather")` or `wolfram_alpha.call(...)` invocation, and executing the tool in Python.
        - **Multimodal Vision Analysis**: Encoding an image (`sample.jpg`) as base64 / PIL Image, passing both text (`"What's in this image?"`) and visual content to a multimodal model, and generating detailed scene descriptions.
        - Course 04 Synthesis & Handoff to **Course 05: MCP for Beginners** (`/learn/mcp-for-beginners`) where learners standardize tool and context integrations using the **Model Context Protocol (MCP)**.
    - **Pyodide Sandbox**: Pure-Python Llama Special-Token Prompt Compiler (`<|begin_of_text|>`, `<|start_header_id|>`, `<|eot_id|>`) & `<|python_tag|>` Native Tool-Call Parser/Executor that compiles the `ipython` system header with `brave_search`, `wolfram_alpha`, and custom tools, parses `<|python_tag|>` calls (`brave_search.call(query="Stockholm weather")`), executes the dispatched Python function, and formats the `<|start_header_id|>ipython<|end_header_id|>` observation turn.
    - **Colab Notebook**: `22-building-with-meta-llama-models.ipynb` (Running Llama native `<|python_tag|>` tool calling for `brave_search` and `wolfram_alpha` + self-contained PIL image synthesis and multimodal vision analysis on Google Colab Free Tier with Hugging Face / `google-genai`).

---

## Verification & Quality Gates

1. **Automated Content, Sandbox & Notebook Validator (`verify_course_04.py`)**:
   - Validate every `.mdx` frontmatter against `src/content.config.ts` (`track: "generative-ai-for-beginners"`, `order: 1..22`, `description.length >= 30`, valid `prerequisites` chain starting from `["ml-for-beginners/27-debugging-ml-models-and-explainability"]`).
   - Confirm each `.mdx` has `>= 350` words of prose, `<PythonRunner`, `<QuizCard`, `<ColabButton`, and markdown table headers (`| :---` or `| ---`), with strict `H2` (`## `) → `H3` (`### `) heading hierarchy.
   - Execute every `<PythonRunner />` `initialCode` snippet in Python 3 and verify `stdout.strip() == expectedOutput.strip()` in `< 2.0` seconds.
   - Parse every `.ipynb` file in `notebook/generative-ai-for-beginners/` as JSON (`nbformat == 4`), verify self-contained dataset/image initialization cells and graceful `GEMINI_API_KEY` handling, and scan both `.mdx` and `.ipynb` files for forbidden terms (`.ref/`, `generative-ai-for-beginners` repo links, `Microsoft Foundry`, `Azure OpenAI`, `GitHub Models`, `Foundry Local`, `Azure AI Search`, `Azure Cosmos DB`, `Power Apps`, `Power Automate`, `Dataverse`, `AI Builder`, `Copilot Studio`, `PromptFlow`, `learn.microsoft.com`).
2. **Build & Type Verification**:
   - `pnpm astro check` (`0` errors, `0` warnings)
   - `pnpm build` (`0` errors, static HTML generated for `/learn/generative-ai-for-beginners/` and all 22 lessons)
3. **Accessibility & Design Token Verification**:
   - `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`
   - `buddhi scripts verify-a11y` via `terminal-runner`

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. Zero new npm dependencies or architectural layers are introduced.
