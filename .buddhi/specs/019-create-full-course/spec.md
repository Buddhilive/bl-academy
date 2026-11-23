# Feature Specification: Course 08 — Edge AI for Beginners (`edge-ai-for-beginners`)

**Feature Branch**: `019-create-full-course`

**Created**: 2026-11-22

**Status**: Approved

**Input**: User description: "Create full course for 'Edge AI for Beginners' based on `.ref/edgeai-for-beginners` repo project. Ground all content to the reference repo and include all appropriate detailed content for each lesson. Use `my-writing-style` skill to write the tutorials in a unique tone. For lessons where Microsoft Foundry or related non-Google service is used, use open source tools or frameworks that can run on free tier of Google Colab. For lessons where LLM or cloud models are needed, use Google AI Studio API key with free tier. For Google Colab Notebooks, create the notebooks in `./notebook/<course_name>/` folder and then link to the lesson with a button to 'Open with Google Colab' with the correct GitHub link."

---

## Course Overview & Curriculum Architecture

Course 08 (`edge-ai-for-beginners`) is the capstone course in the 9-course sequential AI Engineering learning path on **Buddhilive Academy**, directly following Course 07 (`harness-engineering`, lesson 24: `harness-engineering/24-frontier-harness-breakdowns`). It delivers **20 comprehensive, reference-grounded `.mdx` lessons** organized into **5 progressive modules**, paired with **in-browser `<PythonRunner client:visible />` sandboxes** on every lesson and **15 companion Google Colab Free Tier Jupyter notebooks** (`./notebook/edge-ai-for-beginners/<slug>.ipynb`) on all practical implementation lessons.

### 20-Lesson Syllabus & Grounding Map

| Order | Lesson Slug (`src/content/lessons/edge-ai-for-beginners/`) | Lesson Title | Module Category | Execution & Notebook (`./notebook/edge-ai-for-beginners/`) | Reference Source Mapping |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **01** | `01-introduction-to-edge-ai-and-paradigm-shift` | Introduction to Edge AI: The On-Device Intelligence Paradigm | Module 1: Edge AI Foundations, Case Studies & Hardware Platforms | `<PythonRunner />` (Foundational) | `introduction.md`, `Module01/01.EdgeAIFundamentals.md` |
| **02** | `02-real-world-edge-ai-case-studies-and-architectures` | Real-World Edge AI Case Studies: QuaRot, Micro-Models & Enterprise Aviation | Module 1: Edge AI Foundations, Case Studies & Hardware Platforms | `<PythonRunner />` (Foundational) | `Module01/02.RealWorldCaseStudies.md` |
| **03** | `03-edge-ai-development-stack-colab-and-gemini-setup` | Edge AI Development Stack: Colab T4 GPU, Open-Source Runtimes & Google AI Studio | Module 1: Edge AI Foundations, Case Studies & Hardware Platforms | `<PythonRunner />` + `03-edge-ai-development-stack-colab-and-gemini-setup.ipynb` (`Colab Free T4 GPU`) | `Module01/03.PracticalImplementationGuide.md` |
| **04** | `04-edge-deployment-hardware-npus-gpus-and-jetson` | Edge Deployment Hardware Platforms: NPUs, Mobile SoCs & Embedded Accelerators | Module 1: Edge AI Foundations, Case Studies & Hardware Platforms | `<PythonRunner />` (Foundational) | `Module01/04.EdgeDeployment.md`, `Module07/README.md` |
| **05** | `05-phi-model-family-textbook-training-and-reasoning` | The Phi SLM Family: Textbook-Quality Data, Dense Reasoning & Edge Variants | Module 2: Small Language Model (SLM) Families & Architectures | `<PythonRunner />` + `05-phi-model-family-textbook-training-and-reasoning.ipynb` (`Colab Free T4 GPU`) | `Module02/01.PhiFamily.md` |
| **06** | `06-qwen-model-family-multilingual-and-thinking-modes` | The Qwen SLM Family: Dual Thinking Modes, MoE & Multilingual Edge Scaling | Module 2: Small Language Model (SLM) Families & Architectures | `<PythonRunner />` + `06-qwen-model-family-multilingual-and-thinking-modes.ipynb` (`Colab Free T4 GPU`) | `Module02/02.QwenFamily.md` |
| **07** | `07-gemma-model-family-matformer-ple-and-multimodal-edge` | The Gemma SLM Family: MatFormer, Per-Layer Embeddings (PLE) & Mobile Multimodal AI | Module 2: Small Language Model (SLM) Families & Architectures | `<PythonRunner />` + `07-gemma-model-family-matformer-ple-and-multimodal-edge.ipynb` (`Colab Free T4 GPU`) | `Module02/03.GemmaFamily.md` |
| **08** | `08-bitnet-1-58-bit-ternary-llms-and-ultra-low-power-npus` | BitNet b1.58 & NPU Micro-Models: Ternary Weights, Mu Architecture & Hardware Co-Design | Module 2: Small Language Model (SLM) Families & Architectures | `<PythonRunner />` (Foundational) | `Module02/04.BitNETFamily.md`, `Module02/05.mumodel.md`, `Module02/06.phisilica.md` |
| **09** | `09-slm-deployment-foundations-ollama-and-local-serving` | Local SLM Deployment: Parameter Tiers, Ollama Modelfiles & OpenAI-Compatible Serving | Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes | `<PythonRunner />` + `09-slm-deployment-foundations-ollama-and-local-serving.ipynb` (`Colab Free T4 GPU`) | `Module03/01.SLMAdvancedLearning.md`, `Module03/02.DeployingSLMinLocalEnv.md` |
| **10** | `10-containerized-slm-deployment-vllm-and-onnx-runtime` | Containerized SLM Serving: High-Throughput vLLM, PagedAttention & ONNX Runtime GenAI | Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes | `<PythonRunner />` + `10-containerized-slm-deployment-vllm-and-onnx-runtime.ipynb` (`Colab Free T4 GPU`) | `Module03/03.DeployingSLMinCloud.md` |
| **11** | `11-quantization-foundations-and-llamacpp-gguf-pipelines` | Quantization Foundations & llama.cpp: Precision Tiers, GGUF Conversion & K-Quants | Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes | `<PythonRunner />` + `11-quantization-foundations-and-llamacpp-gguf-pipelines.ipynb` (`Colab Free T4 GPU`) | `Module04/01.Introduce.md`, `Module04/02.Llamacpp.md` |
| **12** | `12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn` | Hardware-Aware Model Optimization: ONNX Graph Passes, OpenVINO NNCF, Apple MLX & Qualcomm QNN | Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes | `<PythonRunner />` + `12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.ipynb` (`Colab Free CPU`) | `Module04/03.MicrosoftOlive.md`, `Module04/04.openvino.md`, `Module04/05.AppleMLX.md`, `Module04/06.workflow-synthesis.md`, `Module04/07.QualcommQNN.md` |
| **13** | `13-slmops-lifecycle-and-knowledge-distillation-with-gemini` | SLMOps & Knowledge Distillation: Transferring Gemini Teacher Reasoning to Edge Student SLMs | Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents | `<PythonRunner />` + `13-slmops-lifecycle-and-knowledge-distillation-with-gemini.ipynb` (`Colab Free T4 GPU`) | `Module05/01.IntroduceSLMOps.md`, `Module05/02.SLMOps-Distillation.md` |
| **14** | `14-peft-lora-qlora-fine-tuning-and-edge-export` | Parameter-Efficient Fine-Tuning (LoRA & QLoRA) and Quantized Edge Export | Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents | `<PythonRunner />` + `14-peft-lora-qlora-fine-tuning-and-edge-export.ipynb` (`Colab Free T4 GPU`) | `Module05/03.SLMOps-Finetuing.md`, `Module05/04.SLMOps.Deployment.md` |
| **15** | `15-edge-ai-agents-and-slm-function-calling` | Edge AI Agents & SLM Function Calling: Deterministic JSON Schemas, Tool Loops & Guardrails | Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents | `<PythonRunner />` + `15-edge-ai-agents-and-slm-function-calling.ipynb` (`Colab Free CPU`) | `Module06/01.IntroduceAgent.md`, `Module06/02.FunctionCalling.md` |
| **16** | `16-on-device-mcp-integration-for-edge-slms` | On-Device Model Context Protocol (MCP): Connecting Local SLMs to STDIO & HTTP Tool Servers | Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents | `<PythonRunner />` + `16-on-device-mcp-integration-for-edge-slms.ipynb` (`Colab Free CPU`) | `Module06/03.IntroduceMCP.md`, `Module07/aitoolkit.md`, `Module07/windowdeveloper.md`, `Module07/foundrylocal.md` |
| **17** | `17-local-rag-pipelines-and-ragas-quality-evaluation` | Local Edge RAG Pipelines: On-Device Embeddings, Semantic Retrieval & RAGAS Evaluation | Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone | `<PythonRunner />` + `17-local-rag-pipelines-and-ragas-quality-evaluation.ipynb` (`Colab Free CPU`) | `Module08/01..02`, `Module08/samples/04`, `Workshop/Session01..02` |
| **18** | `18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs` | Multi-Model Edge Benchmarking: TTFT, Throughput, Perplexity & SLM vs. Cloud LLM Trade-offs | Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone | `<PythonRunner />` + `18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.ipynb` (`Colab Free CPU`) | `Module08/03..04`, `Module08/samples/01..03,07,08`, `Workshop/Session03..04` |
| **19** | `19-models-as-tools-intelligent-routing-and-multi-agent-edge` | Models-as-Tools: Task-Based SLM Routers, Hybrid Gemini Fallback & Multi-Agent Edge Coordinators | Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone | `<PythonRunner />` + `19-models-as-tools-intelligent-routing-and-multi-agent-edge.ipynb` (`Colab Free CPU`) | `Module08/05..06`, `Module08/samples/05,06,09,10`, `Workshop/Session05..06` |
| **20** | `20-capstone-local-multi-agent-ai-podcast-studio` | Capstone Workshop: Building the "Future Bytes" Local Multi-Agent AI Podcast Studio | Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone | `<PythonRunner />` + `20-capstone-local-multi-agent-ai-podcast-studio.ipynb` (`Colab Free T4 GPU`) | `WorkshopForAgentic/README.md`, `WorkshopForAgentic/md/01..03` |

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Module 1: Edge AI Foundations, Case Studies & Hardware Platforms (Lessons 01–04) (Priority: P1)

A learner finishing Course 07 (`harness-engineering`) navigates to Course 08 (`edge-ai-for-beginners`) to master the fundamentals of Edge AI, understand why latency, privacy, bandwidth, and energy constraints drive local inference, examine real-world case studies (QuaRot 4-bit rotation quantization, 330M encoder-decoder micro-models, and Japan Airlines' offline-capable cabin reporting workflow), configure a zero-cost development environment using Google Colab Free Tier (CPU/T4 GPU) and Google AI Studio (`GEMINI_API_KEY`), and evaluate edge hardware platforms (Intel NUC/Movidius VPU, Qualcomm Hexagon NPU, NVIDIA Jetson Orin Nano 67 TOPS, and NPU-accelerated PCs/mobile SoCs).

**Why this priority**: Establishes the entry point for Course 08 from Course 07, updates `src/lib/curriculum.ts` with the complete 20-lesson syllabus, and delivers the first playable module (MVP slice) with foundational `<PythonRunner />` simulators and the environment setup Colab notebook.

**Independent Test**: Navigate from `harness-engineering/24-frontier-harness-breakdowns` to `/learn/edge-ai-for-beginners/01-introduction-to-edge-ai-and-paradigm-shift`, complete lessons 01–04, run each `<PythonRunner />` simulation and lesson 03's Colab notebook link, and verify schema validation via `pnpm astro check`.

**Acceptance Scenarios**:

1. **Given** a learner on the final lesson of Course 07 (`harness-engineering`), **When** they click the next-course continuation link or open `/learn/edge-ai-for-beginners`, **Then** Lesson 01 (`01-introduction-to-edge-ai-and-paradigm-shift`) loads with prerequisite linkage to `harness-engineering/24-frontier-harness-breakdowns`.
2. **Given** Lessons 01, 02, and 04 (foundational lessons), **When** the learner reads the prose and clicks "Run" on `<PythonRunner client:visible />`, **Then** the Pyodide Web Worker executes the latency/bandwidth/energy trade-off calculator, QuaRot outlier rotation & case-study ROI analyzer, and hardware TOPS/Watt roofline profiler in under 5 seconds without errors.
3. **Given** Lesson 03 (practical environment setup), **When** the learner inspects the tutorial, **Then** they find a step-by-step Google AI Studio Free Tier (`GEMINI_API_KEY`) onboarding guide, an open-source Colab setup guide (`llama-cpp-python`, `onnxruntime`, `transformers`, `google-genai`), a runnable `<PythonRunner />`, and a valid `<ColabButton course="edge-ai-for-beginners" notebook="03-edge-ai-development-stack-colab-and-gemini-setup.ipynb" runtime="Colab Free T4 GPU" />` pointing to `./notebook/edge-ai-for-beginners/03-edge-ai-development-stack-colab-and-gemini-setup.ipynb`.

---

### User Story 2 - Module 2: Small Language Model (SLM) Families & Architectures (Lessons 05–08) (Priority: P2)

A learner explores the major Small Language Model families driving modern Edge AI: Microsoft's Phi family (Phi-1 to Phi-4, textbook-quality synthetic data, chain-of-thought reasoning, and multimodal variants), Alibaba's Qwen family (Qwen3 dual thinking/non-thinking modes, Mixture-of-Experts, and 119-language tokenization), Google's Gemma family (Gemma 3 and Gemma 3n with MatFormer nested sub-networks and Per-Layer Embeddings for 2–3 GB mobile footprints), and extreme 1-bit/NPU architectures (BitNet b1.58 ternary weights $\{-1, 0, +1\}$ with `bitnet.cpp`, 330M encoder-decoder Mu models, and 650 tok/s @ 1.5W NPU execution).

**Why this priority**: Grounds the learner in the architectural mathematics and practical Hugging Face / Colab execution of the four core SLM ecosystems before deploying and quantizing them in Module 3.

**Independent Test**: Load Lessons 05–08, run the in-browser `<PythonRunner />` sandboxes (synthetic data curriculum filtering, MoE active parameter routing, MatFormer/PLE memory calculator, and BitLinear ternary absmean/absmax quantization math), and verify the companion Colab notebooks for Lessons 05, 06, and 07.

**Acceptance Scenarios**:

1. **Given** Lessons 05, 06, and 07, **When** a learner clicks the `<ColabButton />` in each lesson, **Then** the corresponding notebook (`05-phi-...ipynb`, `06-qwen-...ipynb`, `07-gemma-...ipynb`) exists in `./notebook/edge-ai-for-beginners/` and runs open-source Hugging Face inference and architectural inspection on Google Colab Free Tier.
2. **Given** Lesson 08 (`08-bitnet-1-58-bit-ternary-llms-and-ultra-low-power-npus`), **When** the learner runs the `<PythonRunner />` sandbox, **Then** it executes the exact BitNet b1.58 ternary weight quantization formula ($\tilde{W} = \text{RoundClip}(W / (\gamma + \epsilon), -1, 1)$) and compares memory/energy footprints against FP16 and INT4 baselines.

---

### User Story 3 - Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes (Lessons 09–12) (Priority: P3)

A learner deploys and optimizes SLMs across local and containerized runtimes: classifying Micro/Small/Medium parameter tiers, configuring Ollama Modelfiles and OpenAI-compatible local servers, orchestrating containerized vLLM (with PagedAttention) and ONNX Runtime GenAI endpoints, converting models to GGUF and applying `llama.cpp` K-quantization (`Q2_K` through `Q8_0`), and building hardware-aware optimization pipelines using ONNX Runtime graph optimizations, Intel OpenVINO NNCF, Apple MLX unified memory, and Qualcomm QNN heterogeneous execution.

**Why this priority**: Replaces proprietary Windows/Foundry-locked workflows with universal open-source runtimes (`Ollama`, `vLLM`, `llama.cpp`, `ONNX Runtime`, `OpenVINO NNCF`, `MLX`, `QNN`) runnable on Google Colab Free Tier and cross-platform hardware.

**Independent Test**: Complete Lessons 09–12, execute each `<PythonRunner />` sandbox and verify all four companion Colab notebooks (`09-...ipynb` through `12-...ipynb`).

**Acceptance Scenarios**:

1. **Given** Lessons 09 and 10, **When** the learner studies local and containerized serving, **Then** they receive complete Ollama Modelfile, Docker Compose, vLLM, and ONNX Runtime configurations plus Colab notebooks that benchmark KV-cache memory and token throughput.
2. **Given** Lessons 11 and 12, **When** the learner runs the quantization and hardware-aware synthesis workflows, **Then** the lessons and Colab notebooks demonstrate GGUF block quantization (`Q4_0`, `Q4_K_M`, `Q8_0`), ONNX dynamic/static INT4/INT8 quantization, OpenVINO NNCF compression, and an automated hardware-target decision matrix.

---

### User Story 4 - Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents (Lessons 13–16) (Priority: P4)

A learner builds an end-to-end SLMOps pipeline: designing edge CI/CD and fleet lifecycle management, performing two-stage knowledge distillation using **Google AI Studio Free Tier** (`gemini-2.5-flash` via `google-genai`) as the teacher model to generate synthetic reasoning datasets for a compact student SLM, fine-tuning the student with PEFT (`LoRA` and 4-bit `QLoRA` via `bitsandbytes`) on Colab Free T4 GPU and exporting to quantized ONNX/GGUF, implementing deterministic SLM function calling with JSON schema validation, and connecting local SLMs to external tools via the **Model Context Protocol (MCP)** over `stdio` and Streamable HTTP transports.

**Why this priority**: Connects cloud teacher intelligence (Google AI Studio Free Tier) to specialized edge student SLMs and bridges Course 05 (`mcp-for-beginners`) and Course 06 (`ai-agents-for-beginners`) directly into resource-constrained edge hardware.

**Independent Test**: Complete Lessons 13–16, run the `<PythonRunner />` sandboxes (KL-divergence temperature-scaled distillation loss, LoRA rank parameter savings, function-calling JSON schema dispatcher, and MCP JSON-RPC client-server loop), and verify all four companion notebooks (`13-...ipynb` through `16-...ipynb`).

**Acceptance Scenarios**:

1. **Given** Lesson 13 (`13-slmops-lifecycle-and-knowledge-distillation-with-gemini`), **When** the learner opens the lesson and companion notebook, **Then** Azure ML distillation is replaced with a runnable two-stage distillation pipeline using Google AI Studio (`GEMINI_API_KEY`) + deterministic offline fallback to train a compact student model using combined soft-target KL divergence and hard-label cross-entropy loss.
2. **Given** Lesson 14 (`14-peft-lora-qlora-fine-tuning-and-edge-export`), **When** the learner runs the Colab notebook, **Then** it executes LoRA/QLoRA fine-tuning on an open-source SLM and exports the merged weights for edge inference.
3. **Given** Lessons 15 and 16, **When** the learner tests edge agents and MCP tool calling, **Then** the lessons and notebooks run local SLM tool dispatch and FastMCP/Python MCP SDK `stdio` tool integration without proprietary cloud dependencies.

---

### User Story 5 - Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone (Lessons 17–20) (Priority: P5)

A learner builds production-ready edge AI applications inspired by the reference Workshop, Module 08 samples, and the Agentic AI Podcast Studio Workshop: constructing an on-device Retrieval-Augmented Generation (RAG) pipeline with `sentence-transformers` embeddings and evaluating faithfulness, answer relevancy, and context precision with RAGAS metrics; running a multi-model benchmark suite measuring Time-To-First-Token (TTFT), p95 latency, and tokens/sec across SLMs vs. cloud LLMs; engineering a "Models-as-Tools" intelligent task router and multi-agent coordinator (Retrieval, Reasoning, and Execution specialists) with hybrid fallback to Google AI Studio (`gemini-2.5-flash`); and completing the 3-Act **"Future Bytes" Local Multi-Agent AI Podcast Studio Capstone** (Act 1: Research & Tool-Calling SLM Agent, Act 2: Centralized Multi-Agent Scriptwriter + Human-in-the-Loop Editor Workflow, Act 3: Multi-Speaker Conversational Audio Synthesis Pipeline).

**Why this priority**: Synthesizes all 8 courses into production-ready edge portfolios and concludes the entire 9-course Buddhilive Academy AI Engineering learning path with a flagship multi-agent edge capstone.

**Independent Test**: Complete Lessons 17–20, verify all `<PythonRunner />` sandboxes, `<QuizCard />` checks, and companion Colab notebooks (`17-...ipynb` through `20-...ipynb`), and run `pnpm astro check && pnpm build` to confirm zero build or schema errors across the entire site.

**Acceptance Scenarios**:

1. **Given** Lessons 17, 18, and 19, **When** the learner completes the tutorials and notebooks, **Then** all 6 Workshop sessions and all 10 Module 08 architectural patterns (streaming chat, client factory, multi-model benchmark, RAG + RAGAS, multi-agent coordinator, intent-based model router, resilient direct REST client, desktop UI architecture, quality-gated agent workflows, and tool framework integration) are covered using open-source Python, Ollama/ONNX/llama.cpp, and optional Gemini hybrid fallback.
2. **Given** Lesson 20 (`20-capstone-local-multi-agent-ai-podcast-studio`), **When** the learner completes the capstone lesson and opens `20-capstone-local-multi-agent-ai-podcast-studio.ipynb`, **Then** they build the complete 3-Act "Future Bytes" AI Podcast Studio pipeline (Research Agent → Scriptwriter Agent → Human-in-the-Loop Approval Gate → Multi-Speaker Audio Synthesis) running 100% free on Google Colab.

---

### Edge Cases & Boundary Conditions

- **Missing or Unconfigured `GEMINI_API_KEY` in Colab Notebooks**: Every notebook that uses `google-genai` (Lessons 03, 13, 18, 19, 20) MUST check `os.environ.get("GEMINI_API_KEY")` (and `google.colab.userdata`) and gracefully fall back to a deterministic open-source local model or pre-computed synthetic trace so learners without an API key can still execute every cell end-to-end without exceptions.
- **Colab Free Tier RAM / VRAM Limits (12.7 GB System RAM / 15 GB T4 VRAM)**: All Colab notebooks must select compact SLM checkpoints (`Qwen2.5-0.5B-Instruct`, `Qwen2.5-1.5B-Instruct`, `SmolLM2-360M-Instruct`, `Phi-4-mini-instruct` 4-bit, or `Gemma-2-2B-IT` 4-bit) so downloads complete quickly and never trigger Out-Of-Memory (OOM) crashes on Colab Free Tier.
- **Pyodide 5-Second Execution Timeout**: Every `<PythonRunner client:visible />` code snippet in Lessons 01–20 must use pure Python standard library (`math`, `json`, `dataclasses`, `statistics`, `typing`, `hashlib`, `re`) with zero network calls and complete in `< 500ms` inside the browser Web Worker.
- **Zero Upstream Reference Leakage**: No `.mdx` lesson or `.ipynb` notebook may mention `.ref/`, `edgeai-for-beginners`, or upstream repository directory paths in user-facing prose; all upstream attributions reside exclusively in `ACKNOWLEDGEMENTS.md`.
- **MDX / Acorn Parser Safety**: Avoid bare `<` followed by numbers in Markdown prose (use `< 500ms` with a space or `\lt` inside KaTeX `$...$`) and escape literal dollar signs as `\$` in prose so Astro's MDX compiler and KaTeX renderer parse cleanly.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Curriculum Registry Update)**: Update `src/lib/curriculum.ts` for Course 08 (`track: 'edge-ai-for-beginners'`) so `plannedLessonCount` is `20`, `usesGeminiApi` is `true`, `runtimeBadges` includes `['In-Browser Pyodide', 'Colab Free T4 GPU', 'Colab Free CPU', 'Google AI Studio Free Tier']`, and `syllabusModules` reflects the 5 structured modules and 20 lesson topics.
- **FR-002 (20 Reference-Grounded MDX Lessons)**: Author 20 `.mdx` files under `src/content/lessons/edge-ai-for-beginners/` (`01-introduction-to-edge-ai-and-paradigm-shift.mdx` through `20-capstone-local-multi-agent-ai-podcast-studio.mdx`), grounded in the technical concepts, architectures, formulas, benchmarks, and code patterns of the reference materials.
- **FR-003 (Frontmatter Schema & Sequential Linking)**: Every `.mdx` lesson MUST validate against `src/content.config.ts` (`title`, `track: "edge-ai-for-beginners"`, `category`, `order` 1..20, `difficulty`, `xp`, `description` >= 30 chars, `topic`, `prerequisites`). Lesson 01 MUST set `prerequisites: ["harness-engineering/24-frontier-harness-breakdowns"]`, and Lessons 02–20 MUST link sequentially to the preceding lesson slug.
- **FR-004 (Authoring Voice & Anti-Slop Compliance)**: Write all tutorial prose using the `.agents/skills/my-writing-style/SKILL.md` voice (opening with "You may know..." or a relatable engineering hook, clear conceptual architecture diagrams in Mermaid, structured parameter/reference tables, and "As I always say, happy coding!" sign-offs where fitting) while adhering to `.agents/skills/antislop/SKILL.md` and `.agents/skills/antislop-copywriting/SKILL.md`.
- **FR-005 (Minimum Depth, KaTeX Math & Components)**: Every lesson MUST contain at least **350+ words** of clear explanatory prose, mathematically relevant KaTeX equations (e.g., quantization scaling factors, KV-cache memory formulas, roofline arithmetic intensity, KL-divergence distillation loss, LoRA rank decomposition, RAGAS faithfulness/relevancy scores), a copyable code example, an interactive `<PythonRunner client:visible />` sandbox with `expectedOutput`, and a `<QuizCard client:visible />` comprehension check.
- **FR-006 (Open-Source Colab & Google AI Studio Adaptation)**: Replace proprietary Microsoft Foundry Local, Windows AI Foundry, Azure AI Foundry, and Azure ML dependencies with open-source frameworks runnable on Google Colab Free Tier (`Ollama`, `llama.cpp` / `llama-cpp-python`, `GGUF`, `ONNX Runtime`, `OpenVINO NNCF`, `HuggingFace Transformers`, `PEFT` / `LoRA` / `bitsandbytes`, `FastMCP` / `mcp`, `sentence-transformers`) and **Google AI Studio Free Tier** (`google-genai` SDK with `GEMINI_API_KEY`) for cloud teacher distillation, hybrid cloud-edge fallback, and SLM-vs-LLM benchmarking. Include a step-by-step guide on obtaining and configuring a free `GEMINI_API_KEY`.
- **FR-007 (15 Companion Google Colab Notebooks)**: Create 15 valid Jupyter notebooks (nbformat v4) in `./notebook/edge-ai-for-beginners/` for all practical implementation lessons (Lessons 03, 05, 06, 07, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 — 16 practical lessons total; specifically Lessons 03, 05–07, 09–20 = 16 notebooks, while foundational Lessons 01, 02, 04, 08 use `<PythonRunner />` only) and link each practical lesson to its notebook using `<ColabButton course="edge-ai-for-beginners" notebook="<lesson_slug>.ipynb" runtime="..." />`.
- **FR-008 (Accessibility & Design Token Compliance)**: Ensure all lesson embeds, tables, Mermaid diagrams, and UI surfaces comply with `DESIGN.md` tokens, Light/Dark theme contrast (`#A7452A` / `#E07A5F`), and WCAG 2.2 AA accessibility rules (`.agents/skills/a11y/SKILL.md`).
- **FR-009 (Acknowledgements Integrity)**: Verify `ACKNOWLEDGEMENTS.md` includes the proper upstream credit for Course 08 (`microsoft/edgeai-for-beginners`) and ensure zero `.ref/` or upstream repository mentions appear in any lesson prose.

### Key Entities

- **Lesson MDX Document (`src/content/lessons/edge-ai-for-beginners/<slug>.mdx`)**: Static Astro content collection entry containing validated YAML frontmatter, Mermaid architecture diagrams, KaTeX formulas, reference tables, `<PythonRunner />` island, optional `<ColabButton />` static component, and `<QuizCard />` island.
- **Companion Colab Notebook (`notebook/edge-ai-for-beginners/<slug>.ipynb`)**: Valid nbformat 4.5 JSON notebook containing structured markdown cells and runnable Python code cells with deterministic fallback when `GEMINI_API_KEY` or GPU hardware is absent.
- **Course Metadata (`CourseMeta` in `src/lib/curriculum.ts`)**: Central curriculum registry entry for `edge-ai-for-beginners` controlling sidebar navigation, course overview cards, runtime badges, and cross-course pagination from Course 07 (`harness-engineering`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Complete 20-Lesson Coverage)**: All 20 `.mdx` lessons exist in `src/content/lessons/edge-ai-for-beginners/`, ordered `1` through `20`, covering all modules and workshops from the reference curriculum.
- **SC-002 (16 Practical Companion Colab Notebooks)**: All 16 practical lessons (Lessons 03, 05–07, 09–20) link via `<ColabButton />` to a valid, parseable `.ipynb` file in `./notebook/edge-ai-for-beginners/`, while foundational Lessons 01, 02, 04, and 08 use `<PythonRunner />` only.
- **SC-003 (Prose Depth & Educational Quality)**: 100% of lessons contain >= 350 words of original explanatory prose in the `my-writing-style` voice, at least one Markdown comparison/parameter table, KaTeX mathematical formulation where applicable, a runnable `<PythonRunner />`, and a `<QuizCard />`.
- **SC-004 (Zero Schema, Build, or A11Y Errors)**: `pnpm astro check` reports 0 errors and 0 warnings, `pnpm build` pre-renders all 20 new `/learn/edge-ai-for-beginners/*` static routes cleanly, and `buddhi scripts verify-a11y` passes.
- **SC-005 (Zero Reference Leakage)**: Searching `src/content/lessons/edge-ai-for-beginners/` and `notebook/edge-ai-for-beginners/` for `.ref` or `edgeai-for-beginners` returns 0 matches.

---

## Assumptions

- Learners entering Course 08 have completed or are familiar with Python (Course 00), deep learning & Transformers (Courses 01–04), Model Context Protocol (Course 05), AI Agents (Course 06), and Harness Engineering (Course 07).
- Learners use **Google Colab Free Tier** (CPU or T4 GPU) and a free **Google AI Studio** API key (`GEMINI_API_KEY`) for cloud teacher distillation and hybrid cloud-edge comparison, alongside local open-source tools (`Ollama`, `llama.cpp`, `ONNX Runtime`, `OpenVINO`).
