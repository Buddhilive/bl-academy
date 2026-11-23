# Implementation Plan: Course 08 — Edge AI for Beginners (`edge-ai-for-beginners`)

**Branch**: `019-create-full-course` | **Date**: 2026-11-22 | **Spec**: [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/019-create-full-course/spec.md)

**Input**: Feature specification from `.buddhi/specs/019-create-full-course/spec.md`

---

## Summary

Deliver the complete, production-ready **Course 08: Edge AI for Beginners (`edge-ai-for-beginners`)** curriculum as the capstone track of Buddhilive Academy's 9-course AI Engineering learning path. Grounded in the reference repository (`.ref/edgeai-for-beginners/edgeai-for-beginners-main/`), the implementation updates `src/lib/curriculum.ts` with a 5-module, 20-lesson syllabus, authors **20 comprehensive `.mdx` tutorials** in `src/content/lessons/edge-ai-for-beginners/` using the `my-writing-style` voice, embeds **20 client-side Pyodide `<PythonRunner client:visible />` sandboxes** and **20 `<QuizCard client:visible />` assessments**, and provides **16 companion Google Colab Free Tier Jupyter notebooks** in `notebook/edge-ai-for-beginners/` linked via `<ColabButton />` for all practical implementation lessons (Lessons 03, 05–07, 09–20), while foundational Lessons 01, 02, 04, and 08 use `<PythonRunner />` only. All proprietary Microsoft Foundry Local, Windows AI Foundry, Azure AI Foundry, and Azure ML dependencies are adapted to open-source frameworks (`Ollama`, `llama.cpp` / `GGUF`, `ONNX Runtime`, `OpenVINO NNCF`, `HuggingFace Transformers`, `PEFT/LoRA/QLoRA`, `FastMCP/mcp`, `sentence-transformers`) and **Google AI Studio Free Tier** (`google-genai` SDK with `GEMINI_API_KEY`).

---

## Technical Context

- **Language/Version**: TypeScript 5.x (Astro 5.x + React 19 islands), MDX 3, Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Google Colab Free Tier nbformat 4.5 notebooks)
- **Primary Dependencies**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `katex`, `@uiw/react-codemirror` (frontend); `google-genai`, `transformers`, `peft`, `bitsandbytes`, `llama-cpp-python`, `onnxruntime`, `openvino`, `nncf`, `sentence-transformers`, `mcp` (Colab notebooks)
- **Storage**: Static content collection (`src/content/lessons/edge-ai-for-beginners/*.mdx`), static notebook files (`notebook/edge-ai-for-beginners/*.ipynb`), and client-side `localStorage` for Pathfinder XP progress
- **Testing & Verification**: `pnpm astro check` (Zod content schema + TypeScript), `pnpm build` (static site generation of all routes + KaTeX/MDX compilation), Python verification script for `<PythonRunner />` `initialCode` == `expectedOutput` and `.ipynb` JSON validity, and `buddhi scripts verify-a11y` (static WCAG 2.2 AA gate)
- **Target Platform**: Static SSG web application (Modern evergreen browsers + Pyodide WASM Web Worker) & Google Colab Free Tier (CPU / T4 GPU)
- **Project Type**: Interactive educational web platform (Astro 5 static layout + hydrated React islands)
- **Performance Goals**: `< 500ms` execution time per `<PythonRunner />` snippet inside Pyodide; zero Cumulative Layout Shift (`CLS = 0`) across lesson layouts and AdSense slots; static first-paint with `client:visible` island hydration
- **Constraints**:
  - Zero server-side Python execution (100% Pyodide Web Worker with hard 5-second timeout or external Google Colab Free Tier)
  - Zero mention of `.ref/` or upstream reference repositories inside lesson or notebook prose (all credits in `ACKNOWLEDGEMENTS.md`)
  - Minimum 350+ words of explanatory prose per lesson in `my-writing-style`, with KaTeX math formulas and markdown reference tables
  - Graceful offline fallback in all Colab notebooks when `GEMINI_API_KEY` or GPU hardware is unavailable
- **Scale/Scope**: 1 central curriculum registry update (`src/lib/curriculum.ts`), 20 `.mdx` lessons (`src/content/lessons/edge-ai-for-beginners/`), and 16 `.ipynb` companion notebooks (`notebook/edge-ai-for-beginners/`)

---

## Multi-Angle Architectural Evaluation (`system-design`)

### 1. Fewest-Slices Lens
- **Minimal End-to-End Slice**: Updating `src/lib/curriculum.ts` and authoring Module 1 (Lessons 01–04 + Notebook 03) immediately activates `/learn/edge-ai-for-beginners`, links Course 07 (`harness-engineering/24-frontier-harness-breakdowns`) to Course 08 via `LessonLayout.astro` and `LessonSidebar.astro`, and renders the Google AI Studio onboarding callout on `/learn/edge-ai-for-beginners`. Subsequent modules (Modules 2–5) layer cleanly as independent content slices without touching layout or component code.

### 2. Risk-First Lens
- **Risk 1 — MDX & KaTeX Compilation Failures**: Unescaped `$` currency symbols or bare `<` followed by digits (e.g., `<500ms`) in MDX prose cause Acorn/JSX or KaTeX rendering errors during `pnpm build`.
  - *Mitigation*: Escape currency as `\$`, add spaces after comparison operators in prose (`< 500ms`), or wrap comparisons in KaTeX (`$< 500\text{ ms}$`).
- **Risk 2 — `<PythonRunner />` Output Mismatch or Timeout in Pyodide**: Heavy third-party imports (`torch`, `onnxruntime`, `transformers`) are unavailable in the lightweight in-browser Pyodide worker and would fail or time out.
  - *Mitigation*: All 20 `<PythonRunner />` blocks implement pure-Python standard-library mathematical and algorithmic engines (quantization kernels, KV-cache memory calculators, BitLinear ternary forward passes, KL-divergence distillation loss, LoRA rank calculators, JSON-RPC MCP dispatchers, RAG cosine retrieval + RAGAS scoring, and multi-agent podcast state machines) pre-tested via local Python execution so `stdout.trim() === expectedOutput.trim()` is 100% deterministic.
- **Risk 3 — Colab Free Tier OOM & Missing API Keys**: Loading 14B FP16 models or requiring a paid API key breaks free-tier accessibility.
  - *Mitigation*: Notebooks target compact checkpoints (`Qwen2.5-0.5B-Instruct`, `SmolLM2-360M-Instruct`, 4-bit GGUF/NF4) and wrap `google-genai` calls in a helper that checks `userdata.get('GEMINI_API_KEY')` / `os.environ.get('GEMINI_API_KEY')` with automatic deterministic fallback.

### 3. Seam-Quality Lens
- **Zero Component Coupling**: Existing components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) already support `course="edge-ai-for-beginners"` and dynamic cross-course pagination via `src/lib/curriculum.ts`. No temporary shims or component hacks are required.

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Passed prior to Phase 0 and verified after Phase 1 design.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check`, `pnpm build`, and `buddhi scripts verify-a11y`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 08 (`edge-ai-for-beginners`) connects directly from Course 07 (`harness-engineering/24-frontier-harness-breakdowns`) and grounds all 20 lessons in `.ref/edgeai-for-beginners/edgeai-for-beginners-main/` with zero `.ref/` mentions in lesson prose (`ACKNOWLEDGEMENTS.md` already credits `microsoft/edgeai-for-beginners`).
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style` + `antislop` + `antislop-copywriting`, exceeds 350 words of prose, and includes KaTeX formulas, reference tables, `<PythonRunner client:visible />`, and `<QuizCard client:visible />`.
- [x] **Open-Source Colab Free Tier & Google AI Studio Stack**: Replaces proprietary Foundry Local / Azure AI / Olive-only steps with open-source frameworks + `google-genai` (`GEMINI_API_KEY`) and provides 16 companion notebooks in `./notebook/edge-ai-for-beginners/` linked via `<ColabButton />`.
- [x] **DESIGN.md & Accessibility Strategy**:
  - Uses existing semantic design tokens (`#A7452A` light primary / `#E07A5F` dark primary, `#121212` / `#1E1E1E` dark surfaces, 1px hairline borders, zero CLS fixed-height `AdSlot.astro` containers).
  - Preserves strict heading hierarchy inside `.mdx` files (`##` for `h2` main sections, `###` for `h3` subsections, never `#` `h1` since `LessonLayout.astro` renders the page `<h1>`).
  - Reuses accessible `<PythonRunner client:visible />` (Escape keymap focus release, `aria-live="polite"` output console), `<QuizCard client:visible />` (`role="radiogroup"`, `aria-checked`, polite explanation panel), and `<ColabButton />` (44px min touch target, forced-colors safe focus outline, `<span class="sr-only"> (opens in a new tab)</span>`) as recorded in `A11Y-DECISIONS.md`.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/019-create-full-course/
├── spec.md              # Feature specification (20 lessons, 5 modules, 16 notebooks)
├── plan.md              # This architectural implementation plan
└── tasks.md             # Phase 2 output (/spec-tasks command)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── curriculum.ts    # Update Course 08 metadata, runtimeBadges, usesGeminiApi: true, 5 syllabusModules
└── content/
    └── lessons/
        └── edge-ai-for-beginners/
            ├── 01-introduction-to-edge-ai-and-paradigm-shift.mdx
            ├── 02-real-world-edge-ai-case-studies-and-architectures.mdx
            ├── 03-edge-ai-development-stack-colab-and-gemini-setup.mdx
            ├── 04-edge-deployment-hardware-npus-gpus-and-jetson.mdx
            ├── 05-phi-model-family-textbook-training-and-reasoning.mdx
            ├── 06-qwen-model-family-multilingual-and-thinking-modes.mdx
            ├── 07-gemma-model-family-matformer-ple-and-multimodal-edge.mdx
            ├── 08-bitnet-1-58-bit-ternary-llms-and-ultra-low-power-npus.mdx
            ├── 09-slm-deployment-foundations-ollama-and-local-serving.mdx
            ├── 10-containerized-slm-deployment-vllm-and-onnx-runtime.mdx
            ├── 11-quantization-foundations-and-llamacpp-gguf-pipelines.mdx
            ├── 12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.mdx
            ├── 13-slmops-lifecycle-and-knowledge-distillation-with-gemini.mdx
            ├── 14-peft-lora-qlora-fine-tuning-and-edge-export.mdx
            ├── 15-edge-ai-agents-and-slm-function-calling.mdx
            ├── 16-on-device-mcp-integration-for-edge-slms.mdx
            ├── 17-local-rag-pipelines-and-ragas-quality-evaluation.mdx
            ├── 18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.mdx
            ├── 19-models-as-tools-intelligent-routing-and-multi-agent-edge.mdx
            └── 20-capstone-local-multi-agent-ai-podcast-studio.mdx

notebook/
└── edge-ai-for-beginners/
    ├── 03-edge-ai-development-stack-colab-and-gemini-setup.ipynb
    ├── 05-phi-model-family-textbook-training-and-reasoning.ipynb
    ├── 06-qwen-model-family-multilingual-and-thinking-modes.ipynb
    ├── 07-gemma-model-family-matformer-ple-and-multimodal-edge.ipynb
    ├── 09-slm-deployment-foundations-ollama-and-local-serving.ipynb
    ├── 10-containerized-slm-deployment-vllm-and-onnx-runtime.ipynb
    ├── 11-quantization-foundations-and-llamacpp-gguf-pipelines.ipynb
    ├── 12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.ipynb
    ├── 13-slmops-lifecycle-and-knowledge-distillation-with-gemini.ipynb
    ├── 14-peft-lora-qlora-fine-tuning-and-edge-export.ipynb
    ├── 15-edge-ai-agents-and-slm-function-calling.ipynb
    ├── 16-on-device-mcp-integration-for-edge-slms.ipynb
    ├── 17-local-rag-pipelines-and-ragas-quality-evaluation.ipynb
    ├── 18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.ipynb
    ├── 19-models-as-tools-intelligent-routing-and-multi-agent-edge.ipynb
    └── 20-capstone-local-multi-agent-ai-podcast-studio.ipynb
```

**Structure Decision**: Extends the existing Astro content collection (`src/content/lessons/edge-ai-for-beginners/`) and companion Colab notebook folder (`notebook/edge-ai-for-beginners/`) mapped in `src/lib/curriculum.ts`.

---

## Detailed Module & Lesson Design Specifications

### Phase 1: Curriculum Registry & Module 1 — Edge AI Foundations, Case Studies & Hardware Platforms (User Story 1 / P1)

1. **`src/lib/curriculum.ts` Update**:
   - Update the `edge-ai-for-beginners` entry (`order: 8`, `stepCode: '08'`):
     - `runtimeBadges`: `['In-Browser Pyodide', 'Colab Free T4 GPU', 'Colab Free CPU', 'Google AI Studio Free Tier']`
     - `usesGeminiApi`: `true`
     - `plannedLessonCount`: `20`
     - `syllabusModules`: 5 modules matching the 20 lessons.
2. **Lesson 01 (`01-introduction-to-edge-ai-and-paradigm-shift.mdx`)** — *Foundational (`<PythonRunner />` only)*:
   - **Grounding**: `introduction.md`, `Module01/01.EdgeAIFundamentals.md`.
   - **Content**: Cloud vs. Edge AI paradigm shift, 5 core pillars (Proximity Processing, Decentralized Intelligence, Data Sovereignty, Autonomous Operation, Embedded AI), hardware/SLM/business convergence across 5 industries (Manufacturing/Siemens, Healthcare/Philips, Autonomous Vehicles/Tesla, Smart Cities/Singapore, Consumer Mobile/Neural Engine).
   - **Math**: End-to-end latency decomposition $L_{\text{total}} = L_{\text{network\_rtt}} + L_{\text{queue}} + L_{\text{prefill}} + N_{\text{tok}} \cdot L_{\text{decode}}$ and bandwidth cost savings $B_{\text{saved}} = R_{\text{sensors}} \cdot (1 - \rho_{\text{anomaly}})$.
   - **`<PythonRunner />`**: Cloud vs. Edge AI latency, bandwidth, and SLA simulator across autonomous driving, industrial quality control, and medical telemetry.
3. **Lesson 02 (`02-real-world-edge-ai-case-studies-and-architectures.mdx`)** — *Foundational (`<PythonRunner />` only)*:
   - **Grounding**: `Module01/02.RealWorldCaseStudies.md`.
   - **Content**: Phi-Silica on-device architecture (230ms TTFT, 20 tok/s on NPU, $N=64$ sliding window chunking), **QuaRot (Quantization with Rotation)** Hadamard orthogonal rotation to eliminate activation outliers before 4-bit quantization across weights, activations, and KV cache; **Mu 330M** encoder-decoder micro-model (2/3 encoder, 1/3 decoder split, 47% TTFT reduction, 4.7x decode speedup, 3.6M samples for sub-500ms system settings); **Japan Airlines (JAL) AI Report System** (offline in-flight cabin attendant reporting + structured post-flight synchronization).
   - **Math**: Orthogonal Hadamard rotation invariance $Y = X W = (X H)(H^T W)$ where $H H^T = I$, suppressing maximum activation outlier magnitude $\|X H\|_\infty \ll \|X\|_\infty$.
   - **`<PythonRunner />`**: QuaRot Hadamard rotation outlier suppression & INT4 quantization MSE comparator + JAL offline report ROI calculator.
4. **Lesson 03 (`03-edge-ai-development-stack-colab-and-gemini-setup.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
   - **Grounding**: `Module01/03.PracticalImplementationGuide.md`.
   - **Content**: Complete Edge AI software stack setup on Google Colab Free Tier (CPU & T4 GPU) and local machines; step-by-step **Google AI Studio Free Tier (`GEMINI_API_KEY`)** onboarding for teacher distillation and hybrid cloud-edge routing; open-source toolkit ecosystem (`llama.cpp`, `Ollama`, `ONNX Runtime`, `OpenVINO`, `Apple MLX`, `HuggingFace Transformers`, `PEFT`); VRAM/RAM memory budgeting formula for model weights + KV cache + activation buffers.
   - **Math**: Total inference memory $M_{\text{total}} = P \cdot \frac{b_w}{8} + 2 \cdot L \cdot n_{\text{kv}} \cdot d_{\text{head}} \cdot S \cdot \frac{b_{\text{kv}}}{8} + M_{\text{overhead}}$.
   - **`<PythonRunner />`** & **Notebook (`03-edge-ai-development-stack-colab-and-gemini-setup.ipynb`)**: Hardware capability & VRAM profiler that validates which SLM family (`Phi-4-mini-3.8B`, `Qwen3-0.6B/4B`, `Gemma-3n-E2B`) fits a given RAM/VRAM budget and runs a live `google-genai` (`gemini-2.5-flash`) + open-source tokenizer verification check.
5. **Lesson 04 (`04-edge-deployment-hardware-npus-gpus-and-jetson.mdx`)** — *Foundational (`<PythonRunner />` only)*:
   - **Grounding**: `Module01/04.EdgeDeployment.md`, `Module07/README.md`.
   - **Content**: Edge hardware taxonomy and silicon trade-offs: Intel NUC & Movidius Myriad X VPU (1–3W vision acceleration), Qualcomm Snapdragon & Hexagon NPU (heterogeneous CPU+GPU+NPU mobile inference), NVIDIA Jetson Nano / Orin Nano (67 TOPS, 1024 CUDA cores, 32 Tensor Cores, 7–15W power modes) & Jetson AGX Xavier/Orin, and NPU-enabled AI PCs (40+ TOPS Copilot+ NPU class). Execution providers (`CUDAExecutionProvider`, `OpenVINOExecutionProvider`, `QNNExecutionProvider`, `CoreMLExecutionProvider`, `DmlExecutionProvider`).
   - **Math**: Roofline model arithmetic intensity $I = \frac{\text{FLOPs}}{\text{Bytes}}$ and attainable throughput $\text{Perf} = \min(\text{Peak TOPS}, I \times \text{Memory Bandwidth})$.
   - **`<PythonRunner />`**: Hardware Roofline & TOPS/Watt profiler comparing compute-bound prefill vs. memory-bandwidth-bound token decoding across Jetson Orin Nano, Hexagon NPU, Movidius VPU, and Desktop GPU.

---

### Phase 2: Module 2 — Small Language Model (SLM) Families & Architectures (User Story 2 / P2)

6. **Lesson 05 (`05-phi-model-family-textbook-training-and-reasoning.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
   - **Grounding**: `Module02/01.PhiFamily.md`.
   - **Content**: Evolution from Phi-1 (1.3B Python code) and Phi-2 (2.7B) to Phi-3/3.5 and Phi-4 (`Phi-4-14B`, `Phi-4-mini-instruct` 3.8B, `Phi-4-mini-reasoning`, `Phi-4-multimodal`). The "Textbook-Quality" synthetic data paradigm, edge-of-capability curriculum filtering, Grouped-Query Attention (GQA), and inference-time reasoning chains.
   - **Math**: GQA KV-cache compression ratio $\frac{n_{\text{kv}}}{n_{\text{heads}}}$ and information density scaling law $L(N, D_{\text{qual}})$.
   - **`<PythonRunner />`** & **Notebook (`05-phi-model-family-textbook-training-and-reasoning.ipynb`)**: Educational data quality scorer & GQA KV-cache profiler + Colab notebook running `Phi-4-mini-instruct` / compact reasoning traces and structured JSON outputs.
7. **Lesson 06 (`06-qwen-model-family-multilingual-and-thinking-modes.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
   - **Grounding**: `Module02/02.QwenFamily.md`.
   - **Content**: Alibaba Qwen evolution (Qwen 1.0 to Qwen2.5 and Qwen3 trained on 36T tokens across 119 languages), parameter tiers from 0.5B/0.6B micro models to dense and Mixture-of-Experts (`Qwen3-30B-A3B`) architectures, **Dual-Mode Operation** (switching dynamically between `<think>...</think>` reasoning mode and fast non-thinking chat mode via `/think` and `/no_think` tokens), and domain variants (`Qwen-Coder`, `Qwen-Math`, `Qwen-VL`).
   - **Math**: Sparse MoE active parameter computation $y = \sum_{i \in \text{TopK}(G(x))} G(x)_i E_i(x)$ and token budget allocation between thinking tokens $T_{\text{think}}$ and answer tokens $T_{\text{ans}}$.
   - **`<PythonRunner />`** & **Notebook (`06-qwen-model-family-multilingual-and-thinking-modes.ipynb`)**: Dual-mode thinking/non-thinking router and Top-K MoE expert gating simulator + Colab notebook loading `Qwen2.5-0.5B-Instruct` / `Qwen3` for multilingual & thinking-mode generation.
8. **Lesson 07 (`07-gemma-model-family-matformer-ple-and-multimodal-edge.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
   - **Grounding**: `Module02/03.GemmaFamily.md`.
   - **Content**: Google's open-weight Gemma family (`Gemma 2`, `Gemma 3` 1B/4B/12B/27B with 128K context and interleaved vision-language, and mobile-first `Gemma 3n` E2B & E4B). Deep dive into **MatFormer (Matryoshka Transformer)** nested feed-forward sub-networks, **Per-Layer Embeddings (PLE)** that offload high-dimensional token embeddings from GPU/NPU SRAM to fast CPU DRAM/flash so a 5B/8B total-parameter model runs with an effective 2B/4B (2–3 GB) active memory footprint, plus RLHF/RLMF/RLEF post-training alignment.
   - **Math**: Effective active parameter footprint $P_{\text{effective}} = P_{\text{backbone}} + \alpha_{\text{sub}} P_{\text{FFN}}$ with PLE SRAM savings $\Delta M_{\text{SRAM}} = L \cdot V \cdot d_{\text{ple}} \cdot \frac{b}{8}$.
   - **`<PythonRunner />`** & **Notebook (`07-gemma-model-family-matformer-ple-and-multimodal-edge.ipynb`)**: MatFormer sub-network slicing & Per-Layer Embedding (PLE) memory calculator + Colab notebook exploring Gemma tokenization, sliding-window local/global attention ratios (5:1), and open-source inference.
9. **Lesson 08 (`08-bitnet-1-58-bit-ternary-llms-and-ultra-low-power-npus.mdx`)** — *Foundational (`<PythonRunner />` only)*:
   - **Grounding**: `Module02/04.BitNETFamily.md`, `Module02/05.mumodel.md`, `Module02/06.phisilica.md`.
   - **Content**: 1-bit LLM frontier with **BitNet b1.58** (`BitNet-b1.58-2B4T`): replacing standard `nn.Linear` with `BitLinear` using ternary weights $\{-1, 0, +1\}$ (1.58 bits per weight: $\log_2 3 \approx 1.585$), `absmean` weight quantization, 8-bit `absmax` activation quantization, `ReLU`$^2$, RMSNorm, and `bitnet.cpp` lookup-table (LUT) addition-only kernels achieving 1.37x–6.17x CPU speedups and 55–82% energy reduction; plus hardware co-designed NPU micro-models (**Mu** 330M encoder-decoder & **Phi-Silica** 650 tok/s @ 1.5W on NPU).
   - **Math**: Absmean ternary quantization $\gamma = \frac{1}{nm}\sum_{ij}|W_{ij}|$, $\tilde{W} = \text{RoundClip}\left(\frac{W}{\gamma + \epsilon}, -1, 1\right)$ and absmax activation scaling $\tilde{x} = \text{Clip}\left(x \cdot \frac{Q_b}{\|x\|_\infty}, -Q_b+\epsilon, Q_b-\epsilon\right)$.
   - **`<PythonRunner />`**: Complete pure-Python `BitLinear` forward-pass engine implementing `absmean` ternary weight quantization and `absmax` INT8 activation quantization vs. FP32 matrix multiplication.

---

### Phase 3: Module 3 — Local & Containerized SLM Deployment, Quantization & Runtimes (User Story 3 / P3)

10. **Lesson 09 (`09-slm-deployment-foundations-ollama-and-local-serving.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module03/01.SLMAdvancedLearning.md`, `Module03/02.DeployingSLMinLocalEnv.md`.
    - **Content**: SLM parameter classification tiers (Micro 100M–1.4B, Small 1.5B–13.9B, Medium 14B–30B), Hugging Face programmatic model acquisition & validation, universal local deployment with **Ollama** (architecture, lifecycle commands, custom `Modelfile` authoring with `PARAMETER`, `SYSTEM`, `TEMPLATE`, and OpenAI-compatible `/v1/chat/completions` REST endpoints), and comparative analysis of local serving engines.
    - **Math**: Throughput scaling and concurrency saturation under local batching $T(B) = \frac{B}{t_{\text{compute}}(B) + t_{\text{mem}}}$.
    - **`<PythonRunner />`** & **Notebook (`09-slm-deployment-foundations-ollama-and-local-serving.ipynb`)**: Modelfile parser, parameter-tier classifier, and OpenAI-compatible local REST payload validator + Colab notebook demonstrating programmatic Hugging Face SLM loading and local serving patterns.
11. **Lesson 10 (`10-containerized-slm-deployment-vllm-and-onnx-runtime.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module03/03.DeployingSLMinCloud.md`.
    - **Content**: Production containerized deployment of `Phi-4-mini-instruct` (3.8B) across three enterprise runtimes: **vLLM** (PagedAttention KV-cache block allocation, continuous batching, Docker/Kubernetes manifests), **Ollama Container Orchestration** (Docker Compose + healthchecks), and **ONNX Runtime GenAI** (`onnxruntime-genai` OGA loop: tokenization → generator state → logits → token sampling), plus Prometheus/Grafana observability and container security hardening.
    - **Math**: PagedAttention memory utilization efficiency $\eta_{\text{paged}} = \frac{M_{\text{active\_tokens}}}{M_{\text{allocated\_blocks}}}$ reducing KV-cache fragmentation from ~60% to $< 4\%$.
    - **`<PythonRunner />`** & **Notebook (`10-containerized-slm-deployment-vllm-and-onnx-runtime.ipynb`)**: PagedAttention block allocator vs. contiguous KV-cache simulator + Colab notebook running ONNX Runtime inference and benchmarking continuous batching metrics.
12. **Lesson 11 (`11-quantization-foundations-and-llamacpp-gguf-pipelines.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module04/01.Introduce.md`, `Module04/02.Llamacpp.md`.
    - **Content**: Precision classification framework (Ultra-Low 1–2 bit, Low 3–4 bit, Medium 5–8 bit), symmetric vs. asymmetric affine quantization, **GGUF (General GGML Universal Format)** binary header/metadata/tensor layout, and end-to-end **`llama.cpp`** workflows: compiling with CMake (`GGML_CUDA`, `GGML_METAL`, `GGML_BLAS`), converting Hugging Face weights to FP16 GGUF, quantizing across K-quant levels (`Q2_K`, `Q3_K_M`, `Q4_0`, `Q4_K_M`, `Q5_K_M`, `Q6_K`, `Q8_0`), importance matrix (`imatrix`) calibration, and `llama-cpp-python` server/embedding integration.
    - **Math**: Block quantization scale & zero-point $q = \text{round}\left(\frac{x}{s}\right) + z$, super-block K-quant double quantization overhead (bits-per-weight $\text{bpw} = b + \frac{b_{\text{scale}}}{B_{\text{block}}}$).
    - **`<PythonRunner />`** & **Notebook (`11-quantization-foundations-and-llamacpp-gguf-pipelines.ipynb`)**: GGUF K-quant block quantizer (`Q4_0` vs `Q4_K_M` vs `Q8_0`) measuring SQNR (Signal-to-Quantization-Noise Ratio) and effective bits-per-weight + Colab notebook executing GGUF inference via `llama-cpp-python`.
13. **Lesson 12 (`12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module04/03.MicrosoftOlive.md`, `Module04/04.openvino.md`, `Module04/05.AppleMLX.md`, `Module04/06.workflow-synthesis.md`, `Module04/07.QualcommQNN.md`.
    - **Content**: Cross-platform hardware-aware optimization synthesis:
      1. **ONNX Runtime & Olive Pass Pipelines**: Graph fusion (attention/LayerNorm fusion) and INT4/INT8 dynamic & static quantization.
      2. **Intel OpenVINO & NNCF**: Converting PyTorch/ONNX models to OpenVINO IR (`.xml`/`.bin`), post-training weight compression with `nncf.compress_weights(mode=CompressWeightsMode.INT4_SYM)`, and `openvino_genai.LLMPipeline`.
      3. **Apple MLX (`mlx-lm`)**: Unified memory zero-copy array execution on Apple Silicon M-series and 4-bit quantization (`mlx_lm.convert --q`).
      4. **Qualcomm QNN**: Heterogeneous workload distribution across Hexagon NPU, Adreno GPU, and Kryo CPU with mixed INT8/INT16 precision.
      5. **Workflow Synthesis**: Automated multi-framework selection decision tree and production readiness validation gate.
    - **Math**: Graph operator fusion memory traffic reduction $\Delta B_{\text{DRAM}} = \sum_{k=1}^{K-1} 2 \cdot |A_k| \cdot \text{sizeof}(\text{dtype})$ and composite hardware score $S_{\text{hw}} = w_1 \frac{T}{T_{\text{target}}} + w_2 \frac{M_{\text{budget}}}{M} - w_3 \Delta \text{PPL}$.
    - **`<PythonRunner />`** & **Notebook (`12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.ipynb`)**: Multi-framework optimization selector & production readiness gate evaluator + Colab notebook performing live PyTorch → ONNX export, dynamic INT8 quantization, and latency/size benchmarking with `onnxruntime`.

---

### Phase 4: Module 4 — SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents (User Story 4 / P4)

14. **Lesson 13 (`13-slmops-lifecycle-and-knowledge-distillation-with-gemini.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module05/01.IntroduceSLMOps.md`, `Module05/02.SLMOps-Distillation.md`.
    - **Content**: **SLMOps** vs. traditional MLOps (privacy-first edge localization, heterogeneous fleet orchestration, canary rollouts, drift detection, and CapEx vs. OpEx economics). **Two-Stage Knowledge Distillation**: using **Google AI Studio Free Tier (`gemini-2.5-flash`)** as the Teacher model to synthesize high-quality Chain-of-Thought reasoning traces and soft probability distributions, and training a compact Student SLM (`Qwen2.5-0.5B` / `Phi-4-mini`) to achieve 85% latency reduction and 95% memory reduction while retaining >90% task accuracy.
    - **Math**: Temperature-scaled Kullback-Leibler (KL) distillation loss:
      $$\mathcal{L}_{\text{KD}} = (1 - \alpha)\,\mathcal{L}_{\text{CE}}(y, \sigma(z_S)) + \alpha T^2 \, D_{\text{KL}}\!\left(\sigma\!\left(\frac{z_T}{T}\right) \;\middle\|\; \sigma\!\left(\frac{z_S}{T}\right)\right)$$
    - **`<PythonRunner />`** & **Notebook (`13-slmops-lifecycle-and-knowledge-distillation-with-gemini.ipynb`)**: Temperature-scaled softmax & KL-divergence distillation loss simulator + Colab notebook generating teacher synthetic data with `google-genai` (with offline fallback) and distilling into a compact student model.
15. **Lesson 14 (`14-peft-lora-qlora-fine-tuning-and-edge-export.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module05/03.SLMOps-Finetuing.md`, `Module05/04.SLMOps.Deployment.md`.
    - **Content**: Full fine-tuning vs. **Parameter-Efficient Fine-Tuning (PEFT)** for edge SLMs: **LoRA (Low-Rank Adaptation)** and **QLoRA** (4-bit NormalFloat `NF4`, double quantization, paged optimizers), multi-adapter hot-swapping on edge devices, hyperparameter tuning (rank $r$, scaling $\alpha$, target modules `q_proj`, `v_proj`, `k_proj`, `o_proj`), adapter merging ($W_{\text{merged}} = W_0 + \frac{\alpha}{r} B A$), and post-tuning quantization export to ONNX INT4 / GGUF for local edge deployment.
    - **Math**: LoRA weight update $h = W_0 x + \frac{\alpha}{r} B A x$ where $B \in \mathbb{R}^{d \times r}, A \in \mathbb{R}^{r \times k}, r \ll \min(d, k)$, and trainable parameter ratio $\rho_{\text{LoRA}} = \frac{r(d + k)}{d \cdot k}$.
    - **`<PythonRunner />`** & **Notebook (`14-peft-lora-qlora-fine-tuning-and-edge-export.ipynb`)**: LoRA rank & QLoRA VRAM calculator + adapter weight merger simulator + Colab notebook fine-tuning a compact SLM with `peft` LoRA and merging weights for edge inference.
16. **Lesson 15 (`15-edge-ai-agents-and-slm-function-calling.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module06/01.IntroduceAgent.md`, `Module06/02.FunctionCalling.md`.
    - **Content**: Edge AI Agent classification (Simple Reflex, Model-Based, Goal-Based, Learning Agents), SLM vs. Cloud LLM trade-offs for agentic loops (10–30x cost reduction, sub-second local tool dispatch, full data sovereignty), the **6-Step SLM Function Calling Lifecycle** (Tool Integration → JSON Schema Definition → Intent Detection → Structured JSON Generation → Validated External Execution → Response Synthesis), platform implementations (`Phi-4-mini`, `Qwen3` native `<tool_call>` tags, OpenAI-compatible `tools` schema), and production guardrails (rate limiting, parameter sanitization, retry backoff, audit logging).
    - **Math**: Multi-step agent reliability $R_{\text{chain}} = (p_{\text{schema}} \cdot p_{\text{args}})^K$ and grammar-constrained decoding gain ($p_{\text{schema}} \to 1.0$).
    - **`<PythonRunner />`** & **Notebook (`15-edge-ai-agents-and-slm-function-calling.ipynb`)**: Complete 6-stage SLM Function Calling dispatcher with JSON schema validation, retry recovery, and audit log + Colab notebook running local SLM tool calling.
17. **Lesson 16 (`16-on-device-mcp-integration-for-edge-slms.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module06/03.IntroduceMCP.md`, `Module07/aitoolkit.md`, `Module07/windowdeveloper.md`, `Module07/foundrylocal.md`.
    - **Content**: Connecting resource-constrained edge SLMs to the **Model Context Protocol (MCP)**: two-layer architecture (JSON-RPC 2.0 Data Layer + `stdio` and Streamable HTTP/SSE Transport Layer), building an on-device MCP Host + Client that bridges local SLMs (`Ollama` / `llama.cpp` / `ONNX Runtime`) to local MCP tool servers (file system, SQLite telemetry, hardware sensors), plus VS Code AI Toolkit / local inspector workflows and cross-platform hardware abstraction (`ONNX Runtime` Execution Providers).
    - **Math**: Protocol framing overhead and end-to-end local MCP tool round-trip latency $L_{\text{MCP}} = L_{\text{SLM\_intent}} + L_{\text{IPC\_stdio}} + L_{\text{tool\_exec}} + L_{\text{SLM\_synth}}$.
    - **`<PythonRunner />`** & **Notebook (`16-on-device-mcp-integration-for-edge-slms.ipynb`)**: In-memory JSON-RPC 2.0 MCP Host-Client-Server protocol simulator with `initialize`, `tools/list`, and `tools/call` + Colab notebook running an open-source MCP server connected to a local SLM agent.

---

### Phase 5: Module 5 — Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone (User Story 5 / P5)

18. **Lesson 17 (`17-local-rag-pipelines-and-ragas-quality-evaluation.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module08/01..02`, `Module08/samples/04`, `Workshop/Session01..02`.
    - **Content**: Privacy-preserving on-device **Retrieval-Augmented Generation (RAG)**: multi-provider OpenAI-compatible client factory (local Ollama/ONNX server with seamless cloud fallback to Google AI Studio `gemini-2.5-flash`), local dense embeddings (`sentence-transformers/all-MiniLM-L6-v2`), chunking & cosine vector retrieval, grounding prompts for small context windows, and quantitative RAG evaluation using **RAGAS** metrics (**Faithfulness**, **Answer Relevancy**, and **Context Precision**).
    - **Math**: Cosine similarity $\text{sim}(q, d) = \frac{q \cdot d}{\|q\|_2 \|d\|_2}$, RAGAS Faithfulness $F = \frac{|V_{\text{supported}}|}{|V_{\text{claims}}|}$, and Context Precision@K $\text{CP@K} = \frac{\sum_{k=1}^K \text{Precision@k} \cdot r_k}{\text{Total Relevant in Top } K}$.
    - **`<PythonRunner />`** & **Notebook (`17-local-rag-pipelines-and-ragas-quality-evaluation.ipynb`)**: Self-contained local vector RAG engine + RAGAS Faithfulness, Answer Relevancy, and Context Precision evaluator + Colab notebook with `sentence-transformers`.
19. **Lesson 18 (`18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module08/03..04`, `Module08/samples/01..03,07,08`, `Workshop/Session03..04`.
    - **Content**: Production multi-model benchmarking & SLM-vs-LLM comparative methodology: measuring **Time-To-First-Token (TTFT)**, **Inter-Token Latency (ITL)**, **Tokens Per Second (TPS)**, **p50/p95 tail latency**, and memory footprint across multiple open-source SLMs (`Qwen2.5-0.5B`, `Phi-4-mini-3.8B`, `Gemma-3-4B`, `Mistral-7B`) vs. cloud LLMs (`gemini-2.5-flash`), resilient direct REST API clients with exponential backoff and health monitoring, and streaming chat UI architectures.
    - **Math**: Streaming latency model $T_{\text{stream}}(N) = \text{TTFT} + (N - 1) \cdot \text{ITL}$, throughput $\text{TPS} = \frac{N - 1}{T_{\text{total}} - \text{TTFT}}$, and Pareto efficiency frontier $E(m) = \frac{\text{Quality}(m)}{\text{Latency}(m) \cdot \text{Memory}(m)}$.
    - **`<PythonRunner />`** & **Notebook (`18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.ipynb`)**: Multi-model benchmark harness calculating TTFT, ITL, TPS, p95 latency, and Pareto winners with Markdown report export + Colab notebook benchmarking open-source SLMs vs. `gemini-2.5-flash`.
20. **Lesson 19 (`19-models-as-tools-intelligent-routing-and-multi-agent-edge.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `Module08/05..06`, `Module08/samples/05,06,09,10`, `Workshop/Session05..06`.
    - **Content**: **Models-as-Tools** architecture: treating specialized local SLMs as modular tools (`general`, `reasoning`, `code`, `creative`) behind an intent-detecting **Intelligent Model Router**, hybrid complexity escalation to **Google AI Studio (`gemini-2.5-flash`)** when uncertainty or context threshold is exceeded, and **Coordinator-Specialist Multi-Agent Orchestration** (Retrieval Specialist → Reasoning Specialist → Execution Specialist → Quality Assurance Refinement Loop).
    - **Math**: Hybrid routing expected latency & cost objective:
      $$C_{\text{hybrid}} = P(\text{route}=\text{edge}) \cdot C_{\text{edge}} + P(\text{route}=\text{cloud}) \cdot C_{\text{cloud}}$$
      under quality constraint $Q_{\text{hybrid}} \ge Q_{\min}$.
    - **`<PythonRunner />`** & **Notebook (`19-models-as-tools-intelligent-routing-and-multi-agent-edge.ipynb`)**: Intent-scoring Models-as-Tools router + 3-specialist Coordinator-Refinement pipeline simulator + Colab notebook orchestrating local SLMs with Gemini hybrid escalation.
21. **Lesson 20 (`20-capstone-local-multi-agent-ai-podcast-studio.mdx`)** — *Practical (`<PythonRunner />` + Colab Notebook)*:
    - **Grounding**: `WorkshopForAgentic/README.md`, `WorkshopForAgentic/md/01.BuildAIAgentWithSLM.md`, `02.AIAgentOrchestrationAndWorkflows.md`, `03.Multi-SpeakerPodcastGenerationWithVibeVoice.md`.
    - **Content**: The 3-Act **"Future Bytes" Local Multi-Agent AI Podcast Studio Capstone**:
      - **Act 1 (Meet Your AI Research Assistant "Alex")**: Building a tool-equipped, chain-of-thought reasoning SLM agent that researches tech topics and verifies facts.
      - **Act 2 (Assemble Your Production Team & Orchestration Workflow)**: Centralized vs. Decentralized vs. Hybrid orchestration; wiring the **Research Agent**, **Scriptwriter Agent**, and **Human-in-the-Loop (HITL) Editor Approval Gate** into a stateful multi-turn production workflow.
      - **Act 3 (Multi-Speaker Conversational Audio Synthesis)**: Converting the approved two-host dialogue script (`Speaker 1`, `Speaker 2`) into natural multi-speaker podcast audio using ultra-low frame-rate (7.5 Hz) LLM + acoustic diffusion synthesis (`VibeVoice` / open-source multi-speaker TTS pipeline on Colab).
    - **Math**: Ultra-low frame-rate acoustic token compression $N_{\text{frames}} = f_{\text{hz}} \cdot D_{\text{sec}}$ ($7.5\text{ Hz} \times 5400\text{ s} = 40,500$ frames for a 90-minute episode vs. $50\text{ Hz} \to 270,000$ frames, yielding a $6.67\times$ sequence length reduction).
    - **`<PythonRunner />`** & **Notebook (`20-capstone-local-multi-agent-ai-podcast-studio.ipynb`)**: End-to-end 3-Act "Future Bytes" Podcast Studio orchestrator (Research Agent + Scriptwriter Agent + HITL Quality Gate + Multi-Speaker Acoustic Frame Synthesizer) + Colab T4 GPU notebook generating a complete podcast episode with playable audio output.

---

## Verification & Testing Strategy

1. **Automated Content & Schema Verification**:
   - Run `pnpm astro check` to validate all 20 `.mdx` frontmatter blocks against `src/content.config.ts` and check TypeScript types in `src/lib/curriculum.ts`.
   - Run a Python verification script to confirm:
     - All 20 `.mdx` files exist, have sequential `order` (`1`..`20`), valid `prerequisites` chain starting from `harness-engineering/24-frontier-harness-breakdowns`, `>= 350` words of prose, `<PythonRunner`, and `<QuizCard`.
     - Every `<PythonRunner />` `initialCode` executes in Python standard library in `< 500ms` and its trimmed stdout matches `expectedOutput` 100%.
     - Foundational lessons (`01`, `02`, `04`, `08`) use `<PythonRunner />` only, while all 16 practical lessons (`03`, `05`–`07`, `09`–`20`) include `<ColabButton />` pointing to an existing, valid nbformat v4 `.ipynb` file in `notebook/edge-ai-for-beginners/`.
     - Zero matches for `.ref/` or `edgeai-for-beginners` appear in any lesson or notebook file.
2. **Production Build & Static A11Y Gate**:
   - Run `pnpm build` via `terminal-runner` to verify clean static route generation for `/learn/edge-ai-for-beginners` and all 20 `/learn/edge-ai-for-beginners/<slug>` pages.
   - Run `buddhi scripts verify-a11y` via `terminal-runner` to confirm WCAG 2.2 AA compliance.

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. All components, layouts, and interactive islands are reused without modification.
