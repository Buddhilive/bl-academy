# Tasks: Course 04 — Generative AI for Beginners (`generative-ai-for-beginners`)

**Input**: Design documents from `.buddhi/specs/014-create-full-course/`
**Prerequisites**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/014-create-full-course/spec.md), [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/014-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/generative-ai-for-beginners/` and `notebook/generative-ai-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_04.py` validating frontmatter schema (`src/content.config.ts`), word count (`>= 350` words), `H2` → `H3` heading hierarchy, `<PythonRunner />` `initialCode` vs `expectedOutput` deterministic execution (`< 2.0s`), `<ColabButton />` & `<QuizCard />` presence, `nbformat == 4` `.ipynb` JSON validity & self-contained dataset/fallback checks, and zero forbidden `.ref/` or proprietary Microsoft Foundry / Azure / GitHub Models / Power Platform / PromptFlow terms

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `generative-ai-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 22`, `runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free T4 GPU', 'Colab Free CPU']`, `usesGeminiApi: true`, and 5 `syllabusModules` matching Lessons `01`–`22`)

## Phase 3: User Story 1 - Module 1: GenAI Setup & Foundations (Priority: P1) 🎯 MVP

- [x] T004 [P] [US1] Author Lesson 01 (`src/content/lessons/generative-ai-for-beginners/01-course-setup-and-google-ai-studio.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/01-course-setup-and-google-ai-studio.ipynb`) covering Google AI Studio Free Tier (`GEMINI_API_KEY`, `google-genai`), Colab Secrets (`userdata.get`), local `.env` setup, rate limits, and exponential backoff
- [x] T005 [P] [US1] Author Lesson 02 (`src/content/lessons/generative-ai-for-beginners/02-introduction-to-generative-ai-and-llms.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/02-introduction-to-generative-ai-and-llms.ipynb`) covering AI/ML/DL/GenAI evolution, subword tokenization, Transformer self-attention, autoregressive expanding-window prediction, softmax temperature scaling, and EdTech startup scenarios
- [x] T006 [P] [US1] Author Lesson 03 (`src/content/lessons/generative-ai-for-beginners/03-exploring-and-comparing-different-llms.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/03-exploring-and-comparing-different-llms.ipynb`) covering modalities, foundation vs. instruction-tuned models, Encoder-only vs. Decoder-only vs. Encoder-Decoder architectures, open weights vs. hosted APIs, and the 4-tier adaptation hierarchy
- [x] T007 [P] [US1] Author Lesson 04 (`src/content/lessons/generative-ai-for-beginners/04-using-generative-ai-responsibly.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/04-using-generative-ai-responsibly.ipynb`) covering the 6 Responsible AI principles, Titanic survivor hallucination trap, Measure-Mitigate-Operate lifecycle, 4-layer mitigation stack, and `google-genai` `SafetySetting` controls
- [x] T008 [US1] Verify US1 MVP slice (`01`–`04`) via `python verify_course_04.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Prompt Engineering & Text/Chat Applications (Priority: P2)

- [x] T009 [P] [US2] Author Lesson 05 (`src/content/lessons/generative-ai-for-beginners/05-prompt-engineering-fundamentals.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/05-prompt-engineering-fundamentals.ipynb`) covering `tiktoken` / `count_tokens` on Jupiter text, base vs. RLHF models, Martian War of 2076 fabrication guard, prompt anatomy (instruction, primary/supporting content, examples, cues), and multi-turn personas
- [x] T010 [P] [US2] Author Lesson 06 (`src/content/lessons/generative-ai-for-beginners/06-creating-advanced-prompts.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/06-creating-advanced-prompts.ipynb`) covering Few-Shot sonnets, Chain-of-Thought (Lisa & Alice apples), Generated Knowledge (`ACME Insurance`), Least-to-Most, Maieutic prompting, $T=0.1$ vs $T=0.9$, and the Flask Self-Refine security upgrade
- [x] T011 [P] [US2] Author Lesson 07 (`src/content/lessons/generative-ai-for-beginners/07-building-text-generation-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/07-building-text-generation-applications.ipynb`) covering regex input sanitization, multi-step Recipe + Shopping List prompt chainer, Abraham Lincoln History Bot, and Python Study Buddy with `google-genai`
- [x] T012 [P] [US2] Author Lesson 08 (`src/content/lessons/generative-ai-for-beginners/08-building-chat-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/08-building-chat-applications.ipynb`) covering the 4-part System Message Framework, 4-dimension accessibility, 10 operational/ML metrics (Precision, Recall, $F_1$, Perplexity), `tl;dr`/classification/product naming, and `automobile`/`vehicle` + 3-news-article cosine similarity
- [x] T013 [US2] Verify US2 slice (`05`–`08`) via `python verify_course_04.py`

## Phase 5: User Story 3 - Module 3: Semantic Search, RAG & Function Calling (Priority: P3)

- [x] T014 [P] [US3] Author Lesson 09 (`src/content/lessons/generative-ai-for-beginners/09-building-semantic-search-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/09-building-semantic-search-applications.ipynb`) with self-contained video transcript segments, 3-minute 20-word-overlap chunking, `gemini-embedding-001` / `sentence-transformers` cosine similarity ($\ge 0.35$), and timestamped `youtu.be/{id}?t={seconds}` links
- [x] T015 [P] [US3] Author Lesson 10 (`src/content/lessons/generative-ai-for-beginners/10-integrating-with-function-calling.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/10-integrating-with-function-calling.ipynb`) covering uniform `Emily Johnson` / `Michael Lee` JSON extraction, JSON Schema function declarations, and the 4-stage `search_courses(role, product, level)` `google-genai` tool-calling lifecycle
- [x] T016 [P] [US3] Author Lesson 11 (`src/content/lessons/generative-ai-for-beginners/11-rag-and-vector-databases.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/11-rag-and-vector-databases.ipynb`) embedding `perceptron.md`, `own_framework.md`, and `frameworks.md` inline, running `split_text(400, 300)`, `NearestNeighbors(algorithm='ball_tree')` & `ChromaDB`, and 4-query Mean Average Precision (MAP) evaluation
- [x] T017 [US3] Verify US3 slice (`09`–`11`) via `python verify_course_04.py`

## Phase 6: User Story 4 - Module 4: Multimodal Apps, Low-Code UI, AI UX, Security & LLMOps (Priority: P4)

- [x] T018 [P] [US4] Author Lesson 12 (`src/content/lessons/generative-ai-for-beginners/12-building-image-generation-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/12-building-image-generation-applications.ipynb`) covering latent diffusion, base64 PNG decoding, mask-based inpainting (`sunlit_lounge` + `mask`), child-safe monument metaprompts (`disallow_list`), Hugging Face `diffusers` on T4 GPU, and `google-genai` Imagen
- [x] T019 [P] [US4] Author Lesson 13 (`src/content/lessons/generative-ai-for-beginners/13-building-low-code-ai-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/13-building-low-code-ai-applications.ipynb`) replacing Power Platform with open-source **Gradio + SQLite + `google-genai` structured outputs** for the Student Assignment Tracker and Automated Invoice Processing pipeline
- [x] T020 [P] [US4] Author Lesson 14 (`src/content/lessons/generative-ai-for-beginners/14-designing-ux-for-ai-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/14-designing-ux-for-ai-applications.ipynb`) covering the 4 AI UX pillars, Trust Calibration Matrix, persona-aware Socratic scaffolding (student vs. teacher), data opt-in controls, out-of-scope Geography refusal, and feedback loops
- [x] T021 [P] [US4] Author Lesson 15 (`src/content/lessons/generative-ai-for-beginners/15-securing-generative-ai-applications.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/15-securing-generative-ai-applications.ipynb`) covering the 4 data poisoning attacks, MITRE ATLAS, OWASP Top 10 for LLMs, PII scrubbing, prompt injection detection, and `MakeMeSay` red-team evaluation
- [x] T022 [P] [US4] Author Lesson 16 (`src/content/lessons/generative-ai-for-beginners/16-the-generative-ai-application-lifecycle.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/16-the-generative-ai-application-lifecycle.ipynb`) covering MLOps vs. LLMOps, 3 lifecycle stages, DAG orchestration, and the 5-metric evaluation harness (Quality, Harm, Honesty, Token Cost, Latency)
- [x] T023 [US4] Verify US4 slice (`12`–`16`) via `python verify_course_04.py`

## Phase 7: User Story 5 - Module 5: Open-Source Models, AI Agents, LoRA Fine-Tuning & SLMs (Priority: P5)

- [x] T024 [P] [US5] Author Lesson 17 (`src/content/lessons/generative-ai-for-beginners/17-open-source-models-and-hugging-face.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/17-open-source-models-and-hugging-face.ipynb`) covering OSI open-source (OLMo) vs. open-weight models, MQA/GQA KV-cache VRAM savings, FlashAttention, Sparse MoE, and Hugging Face benchmarks (Llama, Mistral, Falcon, Gemma)
- [x] T025 [P] [US5] Author Lesson 18 (`src/content/lessons/generative-ai-for-beginners/18-ai-agents-and-multi-agent-workflows.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/18-ai-agents-and-multi-agent-workflows.ipynb`) covering $\text{LLM} + \text{State} + \text{Tools}$, LangChain/AutoGen/TaskWeaver/JARVIS DAG planning, Sequential & Concurrent workflows, and the Multi-Agent EdTech Startup Pitch Boardroom
- [x] T026 [P] [US5] Author Lesson 19 (`src/content/lessons/generative-ai-for-beginners/19-fine-tuning-llms-with-lora.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/19-fine-tuning-llms-with-lora.ipynb`) covering SFT, DPO, RFT, LoRA/QLoRA math, inline "Elle" Periodic Table Limerick `training-data.jsonl` & `validation-data.jsonl`, and `peft` + `trl` `SFTTrainer` fine-tuning on Colab T4 GPU
- [x] T027 [P] [US5] Author Lesson 20 (`src/content/lessons/generative-ai-for-beginners/20-building-with-small-language-models.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/20-building-with-small-language-models.ipynb`) covering SLM vs. LLM 5-dimension comparison, Instruct SLMs, OpenCV histogram keyframe extraction, Sparse MoE top-2 expert routing, and `onnxruntime-genai`
- [x] T028 [P] [US5] Author Lesson 21 (`src/content/lessons/generative-ai-for-beginners/21-building-with-mistral-models.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/21-building-with-mistral-models.ipynb`) covering Mistral Large 3 / Small 3.1 / NeMo, cross-language Korean-to-English FAISS (`IndexFlatL2`) RAG over Paul Graham's essay, `FizzBuzz` latency benchmarking, and local `mistral-common` Tekken tokenization
- [x] T029 [P] [US5] Author Lesson 22 (`src/content/lessons/generative-ai-for-beginners/22-building-with-meta-llama-models.mdx`) + Colab notebook (`notebook/generative-ai-for-beginners/22-building-with-meta-llama-models.ipynb`) covering the Llama Herd (3.1/3.2/3.3/4 Scout), `<|python_tag|>` native tool calling (`brave_search`, `wolfram_alpha`), multimodal vision analysis, and handoff to Course 05 (`mcp-for-beginners`)
- [x] T030 [US5] Verify US5 slice (`17`–`22`) via `python verify_course_04.py`

## Phase 8: Polish & Cross-Cutting Verification

- [x] T031 Run full-course validation script `python verify_course_04.py` across all 22 `.mdx` files and 22 `.ipynb` notebooks (`0` errors, `0` forbidden terms)
- [x] T032 Run `pnpm astro check` and `pnpm build` via `terminal-runner` (`0` errors, static HTML generated for `/learn/generative-ai-for-beginners` and all 22 lessons)
- [x] T033 Run design & A11Y static checks (`detect_design_md.py --lint` and `buddhi scripts verify-a11y`) via `terminal-runner`
- [x] T034 Clean up temporary workspace verification script `verify_course_04.py` and confirm clean git status
