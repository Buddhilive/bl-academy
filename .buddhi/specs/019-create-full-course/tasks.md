# Tasks: Course 08 — Edge AI for Beginners (`edge-ai-for-beginners`)

**Branch**: `019-create-full-course` | **Spec**: [spec.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/019-create-full-course/spec.md) | **Plan**: [plan.md](file:///c:/DevDojo/Buddhi/bl-academy/.buddhi/specs/019-create-full-course/plan.md)

---

## Phase 1: Setup & Directory Structure

- [x] T001 Create target directories `src/content/lessons/edge-ai-for-beginners/` and `notebook/edge-ai-for-beginners/` if they do not exist.
- [x] T002 Verify `ACKNOWLEDGEMENTS.md` includes upstream attribution for `microsoft/edgeai-for-beginners` and ensure zero `.ref/` mentions will be introduced in lesson/notebook prose.

---

## Phase 2: Foundational (Blocking Curriculum Registry)

- [x] T003 Update `src/lib/curriculum.ts` for `track: 'edge-ai-for-beginners'` (`order: 8`, `stepCode: '08'`):
  - Set `plannedLessonCount: 20`
  - Set `usesGeminiApi: true`
  - Set `runtimeBadges: ['In-Browser Pyodide', 'Colab Free T4 GPU', 'Colab Free CPU', 'Google AI Studio Free Tier']`
  - Update `syllabusModules` to the 5-module, 20-lesson curriculum structure matching `spec.md` and `plan.md`.
- [x] T004 Run `pnpm astro check` via `terminal-runner` to verify `src/lib/curriculum.ts` compiles cleanly with zero TypeScript errors.

---

## Phase 3: User Story 1 — Module 1: Edge AI Foundations, Case Studies & Hardware Platforms (P1 🎯 MVP)

**Goal**: Deliver the standalone MVP slice for Course 08 (Lessons 01–04 + Notebook 03), linking directly from Course 07 (`harness-engineering/24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi`).

- [x] T005 [P] [US1] Author `src/content/lessons/edge-ai-for-beginners/01-introduction-to-edge-ai-and-paradigm-shift.mdx` (foundational `<PythonRunner />` + `<QuizCard />`, prerequisite: `harness-engineering/24-frontier-harness-design-breakdowns-claude-code-codex-deepseek-and-pi`, grounded in `introduction.md` and `Module01/01.EdgeAIFundamentals.md`).
- [x] T006 [P] [US1] Author `src/content/lessons/edge-ai-for-beginners/02-real-world-edge-ai-case-studies-and-architectures.mdx` (foundational `<PythonRunner />` + `<QuizCard />`, QuaRot Hadamard rotation, Mu 330M, and Japan Airlines case study, grounded in `Module01/02.RealWorldCaseStudies.md`).
- [x] T007 [P] [US1] Author `notebook/edge-ai-for-beginners/03-edge-ai-development-stack-colab-and-gemini-setup.ipynb` (valid nbformat 4.5 notebook with Google AI Studio `GEMINI_API_KEY` setup, offline fallback, and hardware/tokenizer profiler).
- [x] T008 [P] [US1] Author `src/content/lessons/edge-ai-for-beginners/03-edge-ai-development-stack-colab-and-gemini-setup.mdx` (practical `<PythonRunner />` + `<ColabButton course="edge-ai-for-beginners" notebook="03-edge-ai-development-stack-colab-and-gemini-setup.ipynb" runtime="Colab Free T4 GPU" />` + `<QuizCard />`, grounded in `Module01/03.PracticalImplementationGuide.md`).
- [x] T009 [P] [US1] Author `src/content/lessons/edge-ai-for-beginners/04-edge-deployment-hardware-npus-gpus-and-jetson.mdx` (foundational `<PythonRunner />` + `<QuizCard />`, Intel NUC/Movidius VPU, Qualcomm Hexagon NPU, NVIDIA Jetson Orin Nano 67 TOPS, roofline profiler, grounded in `Module01/04.EdgeDeployment.md` & `Module07/README.md`).
- [x] T010 [US1] **Checkpoint**: Verify Lessons 01–04 `<PythonRunner />` snippets execute with exact `expectedOutput`, Notebook 03 is valid JSON nbformat 4.5, and `pnpm astro check` passes.

---

## Phase 4: User Story 2 — Module 2: Small Language Model (SLM) Families & Architectures (P2)

**Goal**: Deliver Lessons 05–08 and Companion Notebooks 05–07 covering Phi, Qwen, Gemma (MatFormer/PLE), and BitNet b1.58 / NPU micro-models.

- [x] T011 [P] [US2] Author `notebook/edge-ai-for-beginners/05-phi-model-family-textbook-training-and-reasoning.ipynb` (Colab Free T4 GPU notebook exploring Phi-4-mini / compact reasoning & GQA memory inspection).
- [x] T012 [P] [US2] Author `src/content/lessons/edge-ai-for-beginners/05-phi-model-family-textbook-training-and-reasoning.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module02/01.PhiFamily.md`).
- [x] T013 [P] [US2] Author `notebook/edge-ai-for-beginners/06-qwen-model-family-multilingual-and-thinking-modes.ipynb` (Colab Free T4 GPU notebook demonstrating Qwen dual thinking/non-thinking modes & multilingual generation).
- [x] T014 [P] [US2] Author `src/content/lessons/edge-ai-for-beginners/06-qwen-model-family-multilingual-and-thinking-modes.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module02/02.QwenFamily.md`).
- [x] T015 [P] [US2] Author `notebook/edge-ai-for-beginners/07-gemma-model-family-matformer-ple-and-multimodal-edge.ipynb` (Colab Free T4 GPU notebook exploring Gemma tokenization, sliding-window attention, and PLE memory math).
- [x] T016 [P] [US2] Author `src/content/lessons/edge-ai-for-beginners/07-gemma-model-family-matformer-ple-and-multimodal-edge.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module02/03.GemmaFamily.md`).
- [x] T017 [P] [US2] Author `src/content/lessons/edge-ai-for-beginners/08-bitnet-1-58-bit-ternary-llms-and-ultra-low-power-npus.mdx` (foundational `<PythonRunner />` implementing `BitLinear` absmean/absmax forward pass + `<QuizCard />`, grounded in `Module02/04.BitNETFamily.md`, `05.mumodel.md`, `06.phisilica.md`).
- [x] T018 [US2] **Checkpoint**: Verify Lessons 05–08 `<PythonRunner />` snippets, Notebooks 05–07 JSON validity, and `pnpm astro check`.

---

## Phase 5: User Story 3 — Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes (P3)

**Goal**: Deliver Lessons 09–12 and Companion Notebooks 09–12 covering Ollama, vLLM/ONNX Runtime GenAI, `llama.cpp` GGUF K-quants, and OpenVINO/MLX/QNN optimization synthesis.

- [x] T019 [P] [US3] Author `notebook/edge-ai-for-beginners/09-slm-deployment-foundations-ollama-and-local-serving.ipynb` (Colab Free T4 GPU notebook for local SLM serving, Modelfile generation, and OpenAI-compatible client patterns).
- [x] T020 [P] [US3] Author `src/content/lessons/edge-ai-for-beginners/09-slm-deployment-foundations-ollama-and-local-serving.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module03/01.SLMAdvancedLearning.md` & `02.DeployingSLMinLocalEnv.md`).
- [x] T021 [P] [US3] Author `notebook/edge-ai-for-beginners/10-containerized-slm-deployment-vllm-and-onnx-runtime.ipynb` (Colab Free T4 GPU notebook demonstrating ONNX Runtime inference & KV-cache batching benchmarks).
- [x] T022 [P] [US3] Author `src/content/lessons/edge-ai-for-beginners/10-containerized-slm-deployment-vllm-and-onnx-runtime.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module03/03.DeployingSLMinCloud.md`).
- [x] T023 [P] [US3] Author `notebook/edge-ai-for-beginners/11-quantization-foundations-and-llamacpp-gguf-pipelines.ipynb` (Colab Free T4 GPU notebook running `llama-cpp-python` GGUF inference & quantization size/speed comparison).
- [x] T024 [P] [US3] Author `src/content/lessons/edge-ai-for-beginners/11-quantization-foundations-and-llamacpp-gguf-pipelines.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module04/01.Introduce.md` & `02.Llamacpp.md`).
- [x] T025 [P] [US3] Author `notebook/edge-ai-for-beginners/12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.ipynb` (Colab Free CPU notebook performing PyTorch -> ONNX export, dynamic INT8 quantization, and OpenVINO IR / NNCF benchmarking).
- [x] T026 [P] [US3] Author `src/content/lessons/edge-ai-for-beginners/12-hardware-aware-optimization-onnx-openvino-mlx-and-qnn.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module04/03..07`).
- [x] T027 [US3] **Checkpoint**: Verify Lessons 09–12 `<PythonRunner />` snippets, Notebooks 09–12 JSON validity, and `pnpm astro check`.

---

## Phase 6: User Story 4 — Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents (P4)

**Goal**: Deliver Lessons 13–16 and Companion Notebooks 13–16 covering SLMOps, Gemini teacher distillation, PEFT LoRA/QLoRA fine-tuning, SLM function calling, and on-device MCP integration.

- [x] T028 [P] [US4] Author `notebook/edge-ai-for-beginners/13-slmops-lifecycle-and-knowledge-distillation-with-gemini.ipynb` (Colab Free T4 GPU notebook using `google-genai` `gemini-2.5-flash` teacher with offline fallback + KL-divergence student distillation).
- [x] T029 [P] [US4] Author `src/content/lessons/edge-ai-for-beginners/13-slmops-lifecycle-and-knowledge-distillation-with-gemini.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module05/01..02`).
- [x] T030 [P] [US4] Author `notebook/edge-ai-for-beginners/14-peft-lora-qlora-fine-tuning-and-edge-export.ipynb` (Colab Free T4 GPU notebook running PEFT LoRA/QLoRA fine-tuning on a compact SLM and merging adapters for edge export).
- [x] T031 [P] [US4] Author `src/content/lessons/edge-ai-for-beginners/14-peft-lora-qlora-fine-tuning-and-edge-export.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module05/03..04`).
- [x] T032 [P] [US4] Author `notebook/edge-ai-for-beginners/15-edge-ai-agents-and-slm-function-calling.ipynb` (Colab Free CPU notebook implementing the 6-stage SLM function calling loop with JSON schema validation).
- [x] T033 [P] [US4] Author `src/content/lessons/edge-ai-for-beginners/15-edge-ai-agents-and-slm-function-calling.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module06/01..02`).
- [x] T034 [P] [US4] Author `notebook/edge-ai-for-beginners/16-on-device-mcp-integration-for-edge-slms.ipynb` (Colab Free CPU notebook running an open-source `FastMCP` / Python MCP SDK `stdio` server connected to a local SLM agent).
- [x] T035 [P] [US4] Author `src/content/lessons/edge-ai-for-beginners/16-on-device-mcp-integration-for-edge-slms.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module06/03` & `Module07/*`).
- [x] T036 [US4] **Checkpoint**: Verify Lessons 13–16 `<PythonRunner />` snippets, Notebooks 13–16 JSON validity, and `pnpm astro check`.

---

## Phase 7: User Story 5 — Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone (P5)

**Goal**: Deliver Lessons 17–20 and Companion Notebooks 17–20 covering Local Edge RAG + RAGAS, Multi-Model Benchmarking, Models-as-Tools Routing + Multi-Agent Coordination, and the 3-Act "Future Bytes" AI Podcast Studio Capstone.

- [x] T037 [P] [US5] Author `notebook/edge-ai-for-beginners/17-local-rag-pipelines-and-ragas-quality-evaluation.ipynb` (Colab Free CPU notebook building local RAG with `sentence-transformers` and computing RAGAS Faithfulness/Relevancy/Precision).
- [x] T038 [P] [US5] Author `src/content/lessons/edge-ai-for-beginners/17-local-rag-pipelines-and-ragas-quality-evaluation.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module08/01..02`, `samples/04`, `Workshop/Session01..02`).
- [x] T039 [P] [US5] Author `notebook/edge-ai-for-beginners/18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.ipynb` (Colab Free CPU notebook benchmarking TTFT, ITL, TPS, and p95 latency across open-source SLMs vs. `gemini-2.5-flash`).
- [x] T040 [P] [US5] Author `src/content/lessons/edge-ai-for-beginners/18-multi-model-edge-benchmarking-and-slm-vs-llm-tradeoffs.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module08/03..04`, `samples/01..03,07,08`, `Workshop/Session03..04`).
- [x] T041 [P] [US5] Author `notebook/edge-ai-for-beginners/19-models-as-tools-intelligent-routing-and-multi-agent-edge.ipynb` (Colab Free CPU notebook implementing intent-based Models-as-Tools routing, Gemini hybrid escalation, and multi-agent coordinator).
- [x] T042 [P] [US5] Author `src/content/lessons/edge-ai-for-beginners/19-models-as-tools-intelligent-routing-and-multi-agent-edge.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `Module08/05..06`, `samples/05,06,09,10`, `Workshop/Session05..06`).
- [x] T043 [P] [US5] Author `notebook/edge-ai-for-beginners/20-capstone-local-multi-agent-ai-podcast-studio.ipynb` (Colab Free T4 GPU notebook executing the 3-Act "Future Bytes" Multi-Agent AI Podcast Studio pipeline with Research Agent, Scriptwriter Agent, HITL gate, and multi-speaker audio synthesis).
- [x] T044 [P] [US5] Author `src/content/lessons/edge-ai-for-beginners/20-capstone-local-multi-agent-ai-podcast-studio.mdx` (practical `<PythonRunner />` + `<ColabButton />` + `<QuizCard />`, grounded in `WorkshopForAgentic/README.md` & `md/01..03`).
- [x] T045 [US5] **Checkpoint**: Verify Lessons 17–20 `<PythonRunner />` snippets, Notebooks 17–20 JSON validity, and `pnpm astro check`.

---

## Phase 8: Polish, Cross-Cutting Verification & A11Y Gate

- [x] T046 Run automated verification script across all 20 `.mdx` files and 16 `.ipynb` notebooks confirming:
  - 20 `.mdx` files exist with sequential `order` `1..20` and valid `prerequisites` chain
  - Every lesson has `>= 350` words of prose, `<PythonRunner />`, and `<QuizCard />`
  - Every `<PythonRunner />` `initialCode` matches `expectedOutput` 100% in `< 500ms`
  - Lessons `01, 02, 04, 08` have 0 `<ColabButton />`; Lessons `03, 05..07, 09..20` have valid `<ColabButton />` pointing to existing `.ipynb` files
  - Zero occurrences of `.ref` or `edgeai-for-beginners` in `src/content/lessons/edge-ai-for-beginners/` and `notebook/edge-ai-for-beginners/`
- [x] T047 Run `pnpm astro check` and `pnpm build` via `terminal-runner` to verify zero TypeScript, Zod schema, MDX, or KaTeX build errors.
- [x] T048 Run `buddhi scripts verify-a11y` via `terminal-runner` to confirm WCAG 2.2 AA compliance across the updated course routes.
