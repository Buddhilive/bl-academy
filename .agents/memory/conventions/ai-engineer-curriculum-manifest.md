# AI Engineer 6-Phase Curriculum Manifest

> **Status**: Foundation Manifest (ready for lesson authoring; no `.mdx` files generated yet)
> **Track ID**: `ai-engineer` (folder: `src/content/lessons/ai-engineer/`)
> **Entry Prerequisite**: `python-zero-to-hero/12-installing-third-party-packages-with-pip` (`track: "python"`, `order: 12`)
> **Content Contract**: Each lesson must be an `.mdx` file conforming to `src/content.config.ts` (`title`, `track`, `category`, `order`, `difficulty`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`), W3Schools scannable layout, 350+ words prose, KaTeX where mathematically relevant, and `<PythonRunner client:visible />` for in-browser Pyodide snippets alongside the specified Colab/Local runtime target.

---

## Reference Repository Status

All lessons are grounded in `.ref/` repositories:
- `.ref/Data-Science-For-Beginners` (populated)
- `.ref/ai-engineering-from-scratch` (populated)
- `.ref/AI-For-Beginners` (populated)
- `.ref/generative-ai-for-beginners` (populated)
- `.ref/mcp-for-beginners` (populated)
- `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main` (populated)
- `.ref/learn-harness-engineering/learn-harness-engineering-main` (populated)
- `.ref/edgeai-for-beginners/edgeai-for-beginners-main` (populated)
- `.ref/ML-For-Beginners` (populated under `.ref/ML-For-Beginners/ML-For-Beginners-main/`)

---

## Track Progression & Frontmatter Conventions

- **`track`**: `"ai-engineer"`
- **`category`**: Matches the Phase heading below (used by `LessonSidebar.astro` for section grouping).
- **`order`**: `1` through `33` (sequential across all 6 phases).
- **`difficulty`**:
  - Phase 1: `"beginner"`
  - Phases 2–3: `"intermediate"`
  - Phases 4–6: `"advanced"`
- **Execution Hybrid**:
  - In-browser **Pyodide** (`<PythonRunner client:visible />`): Pure Python, NumPy, math, JSON schema, and toy-loop "Try it Yourself" snippets.
  - **External / Notebook Runtime**: Specified per lesson (`Colab CPU`, `Colab T4 GPU`, or `Local + Colab`) with either Google AI Studio free tier (`GEMINI_API_KEY` via `google-genai`) or open-source libraries.

---

## Phase 1: Data Foundations & Classical ML

**Track**: `data-ml` (folder: `src/content/lessons/data-foundations-and-classical-ml/`, notebooks: `notebook/data-foundations-and-classical-ml/`)  
**Category**: `Phase 1: Data Foundations & Classical ML`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `ai-engineer/01-python-data-science-and-pandas` | Python Data Science & Pandas (EDA) | `.ref/Data-Science-For-Beginners/1-Introduction/01-defining-data-science/README.md`<br>`.ref/Data-Science-For-Beginners/1-Introduction/03-defining-data/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/07-python/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/07-python/notebook.ipynb` | `Colab CPU` (`notebook/ai-engineer/01-python-data-science-and-pandas.ipynb`) | Open-source (`numpy`, `pandas`, `matplotlib`) |
| 2 | `ai-engineer/02-data-preparation-and-cleaning` | Data Cleaning, Relational & JSON Sources | `.ref/Data-Science-For-Beginners/2-Working-With-Data/05-relational-databases/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/06-non-relational/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/08-data-preparation/README.md`<br>`.ref/Data-Science-For-Beginners/2-Working-With-Data/08-data-preparation/notebook.ipynb` | `Colab CPU` (`notebook/ai-engineer/02-data-preparation-and-cleaning.ipynb`) | Open-source (`pandas`, `sqlite3`, `json`) |
| 3 | `ai-engineer/03-stats-probability-and-visualization` | Statistics, Probability & Data Visualization | `.ref/Data-Science-For-Beginners/1-Introduction/04-stats-and-probability/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/09-visualization-quantities/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/10-visualization-distributions/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/12-visualization-relationships/README.md`<br>`.ref/Data-Science-For-Beginners/3-Data-Visualization/13-meaningful-visualizations/README.md` | `Colab CPU` (`notebook/ai-engineer/03-stats-probability-and-visualization.ipynb`) | Open-source (`numpy`, `scipy`, `matplotlib`) |
| 4 | `ai-engineer/04-regression-linear-and-logistic` | Regression: Linear, Polynomial & Logistic | `.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/1-Tools/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/2-Data/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/3-Linear/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/2-Regression/4-Logistic/README.md` | `Colab CPU` (`notebook/ai-engineer/04-regression-linear-and-logistic.ipynb`) | Open-source (`numpy`, `scikit-learn`, `matplotlib`) |
| 5 | `ai-engineer/05-classification-methods` | Classification: Multi-Class & Applied Classifiers | `.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/1-Introduction/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/2-Classifiers-1/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/3-Classifiers-2/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/4-Classification/4-Applied/README.md` | `Colab CPU` (`notebook/ai-engineer/05-classification-methods.ipynb`) | Open-source (`scikit-learn`, `matplotlib`) |
| 6 | `ai-engineer/06-clustering-kmeans` | Unsupervised Clustering & K-Means | `.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/1-Visualize/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/5-Clustering/2-K-Means/README.md` | `Colab CPU` (`notebook/ai-engineer/06-clustering-kmeans.ipynb`) | Open-source (`scikit-learn`, `matplotlib`) |
| 7 | `ai-engineer/07-time-series-forecasting` | Time Series Forecasting: ARIMA & SVR | `.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/1-Introduction/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/2-ARIMA/README.md`<br>`.ref/ML-For-Beginners/ML-For-Beginners-main/7-TimeSeries/3-SVR/README.md` | `Colab CPU` (`notebook/ai-engineer/07-time-series-forecasting.ipynb`) | Open-source (`statsmodels`, `scikit-learn`, `numpy`) |
| 8 | `ai-engineer/08-tabular-evaluation-and-pipelines` | Tabular Evaluation, Feature Engineering & Pipelines | `.ref/ML-For-Beginners/ML-For-Beginners-main/9-Real-World/2-Debugging-ML-Models/README.md`<br>`.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/15-analyzing/README.md`<br>`.ref/Data-Science-For-Beginners/4-Data-Science-Lifecycle/16-communication/README.md` | `Colab CPU` (`notebook/ai-engineer/08-tabular-evaluation-and-pipelines.ipynb`) | Open-source (`scikit-learn`, `pandas`, `numpy`) |

*Prerequisite link*: `ai-engineer/01-python-data-science-and-pandas` sets `prerequisites: ["python-zero-to-hero/12-installing-third-party-packages-with-pip"]`.

---

## Phase 2: Math & Neural Networks from First Principles

**Category**: `Phase 2: Math & Neural Networks from First Principles`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 7 | `ai-engineer/07-linear-algebra-vectors-and-matrices` | Linear Algebra: Vectors, Matrices & Transformations | `.ref/ai-engineering-from-scratch/phases/01-math-foundations/01-linear-algebra-intuition/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/02-vectors-matrices-operations/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/03-matrix-transformations/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/12-tensor-operations/docs/en.md` | `Colab CPU` | Open-source (`numpy`) |
| 8 | `ai-engineer/08-calculus-chain-rule-and-optimization` | Calculus, Chain Rule, Autodiff & Gradient Descent | `.ref/ai-engineering-from-scratch/phases/01-math-foundations/04-calculus-for-ml/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/05-chain-rule-and-autodiff/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/08-optimization/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/01-math-foundations/09-information-theory/docs/en.md` | `Colab CPU` | Open-source (`numpy`) |
| 9 | `ai-engineer/09-perceptron-and-mlp-from-scratch` | The Perceptron & Multi-Layer Networks from Scratch | `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/03-Perceptron/README.md`<br>`.ref/AI-For-Beginners/lessons/3-NeuralNetworks/04-OwnFramework/README.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/01-the-perceptron/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/02-multi-layer-networks/docs/en.md` | `Colab CPU` | Open-source (`numpy`) |
| 10 | `ai-engineer/10-backpropagation-activations-and-losses` | Backpropagation, Activation Functions & Loss Functions | `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/03-backpropagation/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/04-activation-functions/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/05-loss-functions/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/10-mini-framework/docs/en.md` | `Colab CPU` | Open-source (`numpy`) |
| 11 | `ai-engineer/11-optimizers-regularization-and-pytorch` | Optimizers, Regularization & Intro to PyTorch | `.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/06-optimizers/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/07-regularization/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/03-deep-learning-core/11-intro-to-pytorch/docs/en.md`<br>`.ref/AI-For-Beginners/lessons/3-NeuralNetworks/05-Frameworks/README.md` | `Colab T4 GPU` | Open-source (`torch`, `numpy`) |
| 12 | `ai-engineer/12-cnns-rnns-and-attention-foundations` | CNNs, RNNs & Attention Mechanisms | `.ref/AI-For-Beginners/lessons/4-ComputerVision/07-ConvNets/README.md`<br>`.ref/AI-For-Beginners/lessons/5-NLP/16-RNN/README.md`<br>`.ref/AI-For-Beginners/lessons/5-NLP/18-Transformers/README.md`<br>`.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/02-self-attention-from-scratch/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/07-transformers-deep-dive/03-multi-head-attention/docs/en.md` | `Colab T4 GPU` | Open-source (`torch`) |

---

## Phase 3: Generative AI, RAG & Fine-Tuning

**Category**: `Phase 3: Generative AI, RAG & Fine-Tuning`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 13 | `ai-engineer/13-llm-fundamentals-and-tokenization` | LLM Architectures, Tokenization & Gemini API Setup | `.ref/generative-ai-for-beginners/01-introduction-to-genai/README.md`<br>`.ref/generative-ai-for-beginners/02-exploring-and-comparing-different-llms/README.md`<br>`.ref/ai-engineering-from-scratch/phases/10-llms-from-scratch/01-tokenizers/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (Google AI Studio free tier via `google-genai`) + open-source (`tiktoken`) |
| 14 | `ai-engineer/14-prompt-engineering-and-structured-outputs` | Prompt Engineering, Few-Shot CoT & Structured Outputs | `.ref/generative-ai-for-beginners/04-prompt-engineering-fundamentals/README.md`<br>`.ref/generative-ai-for-beginners/05-advanced-prompts/README.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/01-prompt-engineering/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/02-few-shot-cot/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/03-structured-outputs/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`pydantic`) |
| 15 | `ai-engineer/15-embeddings-and-semantic-search` | Embeddings, Vector Similarity & Semantic Search | `.ref/generative-ai-for-beginners/08-building-search-applications/README.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/04-embeddings/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/22-embedding-models-deep-dive/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (Gemini Embeddings) + open-source (`sentence-transformers`, `numpy`) |
| 16 | `ai-engineer/16-rag-and-vector-databases` | Retrieval-Augmented Generation (RAG) & Vector Databases | `.ref/generative-ai-for-beginners/15-rag-and-vector-databases/README.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/06-rag/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/07-advanced-rag/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/05-nlp-foundations-to-advanced/23-chunking-strategies-rag/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`chromadb`, `faiss-cpu`, `rank-bm25`) |
| 17 | `ai-engineer/17-fine-tuning-with-lora-and-sft` | Supervised Fine-Tuning (SFT) & LoRA/QLoRA | `.ref/generative-ai-for-beginners/18-fine-tuning/README.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/08-fine-tuning-lora/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/10-llms-from-scratch/06-instruction-tuning-sft/docs/en.md` | `Colab T4 GPU` | Open-source (`transformers`, `peft`, `trl`, `bitsandbytes`, `datasets`) |
| 18 | `ai-engineer/18-llm-evaluation-and-guardrails` | LLM Evaluation, Caching, Cost & Safety Guardrails | `.ref/generative-ai-for-beginners/03-using-generative-ai-responsibly/README.md`<br>`.ref/generative-ai-for-beginners/13-securing-ai-applications/README.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/10-evaluation/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/11-llm-engineering/12-guardrails/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`pydantic`) |

---

## Phase 4: Tools, MCP & Agentic Systems

**Category**: `Phase 4: Tools, MCP & Agentic Systems`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 19 | `ai-engineer/19-function-calling-and-tool-schemas` | Function Calling, Tool Schemas & Dispatchers | `.ref/generative-ai-for-beginners/11-integrating-with-function-calling/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/04-tool-use/README.md`<br>`.ref/ai-engineering-from-scratch/phases/13-tools-and-protocols/01-the-tool-interface/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/13-tools-and-protocols/02-function-calling-deep-dive/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/13-tools-and-protocols/05-tool-schema-design/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`jsonschema`, `pydantic`) |
| 20 | `ai-engineer/20-mcp-architecture-and-core-concepts` | Model Context Protocol (MCP): Architecture & Transports | `.ref/mcp-for-beginners/00-Introduction/README.md`<br>`.ref/mcp-for-beginners/01-CoreConcepts/README.md`<br>`.ref/mcp-for-beginners/03-GettingStarted/05-stdio-server/README.md`<br>`.ref/mcp-for-beginners/03-GettingStarted/06-http-streaming/README.md` | `Local + Colab` | Open-source (`mcp` Python SDK, `fastmcp`) |
| 21 | `ai-engineer/21-building-mcp-servers-and-clients` | Building & Testing MCP Servers, Clients & Security | `.ref/mcp-for-beginners/03-GettingStarted/01-first-server/README.md`<br>`.ref/mcp-for-beginners/03-GettingStarted/02-client/README.md`<br>`.ref/mcp-for-beginners/03-GettingStarted/03-llm-client/README.md`<br>`.ref/mcp-for-beginners/02-Security/README.md`<br>`.ref/mcp-for-beginners/03-GettingStarted/13-mcp-inspector/README.md` | `Local + Colab` | `GEMINI_API_KEY` (LLM host client) + open-source (`mcp` Python SDK, `pytest`) |
| 22 | `ai-engineer/22-agentic-design-patterns-and-loops` | Agentic Design Patterns: ReAct, Planning & Reflection | `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/01-intro-to-ai-agents/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/03-agentic-design-patterns/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/07-planning-design/README.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/01-the-agent-loop/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/02-rewoo-plan-and-execute/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`langgraph` or pure Python) |
| 23 | `ai-engineer/23-agentic-rag-and-memory` | Agentic RAG, Context Engineering & Agent Memory | `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/05-agentic-rag/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/12-context-engineering/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/13-agent-memory/README.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/07-memory-virtual-context-memgpt/docs/en.md` | `Colab CPU` | `GEMINI_API_KEY` (`google-genai`) + open-source (`chromadb`, `sqlite3`) |
| 24 | `ai-engineer/24-multi-agent-orchestration-and-trust` | Multi-Agent Systems, Metacognition & Agent Security | `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/06-building-trustworthy-agents/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/08-multi-agent/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/09-metacognition/README.md`<br>`.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/11-agentic-protocols/README.md` | `Local + Colab` | `GEMINI_API_KEY` (`google-genai`) + open-source (`mcp`, `langgraph`) |

---

## Phase 5: Harness Engineering for Reliable Agents

**Category**: `Phase 5: Harness Engineering for Reliable Agents`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 25 | `ai-engineer/25-why-agents-fail-and-harness-anatomy` | Why Capable Agents Fail & Anatomy of an Agent Harness | `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-02-what-a-harness-actually-is/index.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/31-agent-workbench-why-models-fail/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/32-minimal-agent-workbench/docs/en.md` | `Local + Colab` | `GEMINI_API_KEY` (`google-genai`) + open-source (Python harness loop) |
| 26 | `ai-engineer/26-repo-as-system-of-record-and-split-rules` | Repository as System of Record & Modular Instructions | `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/33-instructions-as-executable-constraints/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/34-repo-memory-and-state/docs/en.md` | `Local + Colab` | Open-source (`git`, `AGENTS.md` templates) |
| 27 | `ai-engineer/27-session-continuity-init-and-feature-lists` | Initialization Phases, Feature Lists & Multi-Session Continuity | `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md` | `Local + Colab` | `GEMINI_API_KEY` (`google-genai`) + open-source (JSON feature state, init scripts) |
| 28 | `ai-engineer/28-verification-gates-and-observability` | Verification Gates, E2E Testing & Runtime Observability | `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-09-why-agents-declare-victory-too-early/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md`<br>`.ref/ai-engineering-from-scratch/phases/14-agent-engineering/38-verification-gates/docs/en.md` | `Local + Colab` | `GEMINI_API_KEY` (`google-genai`) + open-source (`pytest`, JSONL/OTel traces) |
| 29 | `ai-engineer/29-clean-handoffs-loop-and-graph-engineering` | Clean Session Handoffs, Loop Engineering & Graph Engineering | `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-13-loop-engineering/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/lectures/lecture-14-graph-engineering/index.md`<br>`.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/projects/project-06-runtime-observability-and-debugging/index.md` | `Local + Colab` | `GEMINI_API_KEY` (`google-genai`) + open-source (Python loop/graph runner) |

---

## Phase 6: Edge AI, Quantization & Capstone

**Category**: `Phase 6: Edge AI, Quantization & Capstone`

| Order | Slug | Title | `.ref/` Source Files | Runtime Target | API / Libraries |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 30 | `ai-engineer/30-edge-ai-and-small-language-models` | Edge AI Fundamentals & Small Language Models (SLMs) | `.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module01/01.EdgeAIFundamentals.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module02/README.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module02/01.PhiFamily.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module02/02.QwenFamily.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module02/03.GemmaFamily.md` | `Colab T4 GPU` | Open-source (`transformers`, `torch`, Hugging Face SLMs) |
| 31 | `ai-engineer/31-quantization-and-model-conversion` | Quantization (INT8/INT4/GGUF) & Model Format Conversion | `.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module04/01.Introduce.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module04/02.Llamacpp.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module04/04.openvino.md`<br>`.ref/ai-engineering-from-scratch/phases/10-llms-from-scratch/11-quantization/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/17-infrastructure-and-production/09-production-quantization/docs/en.md` | `Colab T4 GPU` | Open-source (`llama-cpp-python`, `bitsandbytes`, `openvino`) |
| 32 | `ai-engineer/32-local-slm-deployment-and-slmops` | Local SLM Deployment, Distillation & SLMOps | `.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module03/02.DeployingSLMinLocalEnv.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module05/01.IntroduceSLMOps.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module05/02.SLMOps-Distillation.md`<br>`.ref/ai-engineering-from-scratch/phases/17-infrastructure-and-production/12-edge-inference/docs/en.md` | `Local + Colab` | Open-source (`llama-cpp-python`, `ollama`, `onnxruntime`) |
| 33 | `ai-engineer/33-edge-agentic-systems-and-capstone` | Edge Agentic Systems & End-to-End AI Engineer Capstone | `.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module06/README.md`<br>`.ref/edgeai-for-beginners/edgeai-for-beginners-main/Module06/03.IntroduceMCP.md`<br>`.ref/ai-engineering-from-scratch/phases/19-capstone-projects/20-agent-harness-loop-contract/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/19-capstone-projects/25-verification-gates-observation-budget/docs/en.md`<br>`.ref/ai-engineering-from-scratch/phases/19-capstone-projects/69-end-to-end-rag-system/docs/en.md` | `Local + Colab` | `GEMINI_API_KEY` (optional cloud fallback) + open-source (`llama-cpp-python`, `mcp`, `chromadb`, `pytest`) |
