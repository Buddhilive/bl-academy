# Tasks: Course 01 — AI for Beginners (`ai-for-beginners`)

**Input**: Design documents from `.buddhi/specs/011-create-full-course/`
**Prerequisites**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/011-create-full-course/spec.md), [plan.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/011-create-full-course/plan.md)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create course directories `src/content/lessons/ai-for-beginners/` and `notebook/ai-for-beginners/`
- [x] T002 [P] Create automated course verification script `verify_course_01.py`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Update `ai-for-beginners` entry in `src/lib/curriculum.ts` (`plannedLessonCount: 26`, `'Google AI Studio Free Tier'`, `usesGeminiApi: true`, `syllabusModules`)

## Phase 3: User Story 1 - Module 1: Course Setup, Symbolic AI & Curriculum Registry Integration (Priority: P1) 🎯 MVP

- [x] T004 [P] [US1] Author Lesson 00 in `src/content/lessons/ai-for-beginners/00-course-setup-and-colab-environment.mdx`
- [x] T005 [P] [US1] Create Colab notebook `notebook/ai-for-beginners/00-course-setup-and-colab-environment.ipynb`
- [x] T006 [P] [US1] Author Lesson 01 in `src/content/lessons/ai-for-beginners/01-introduction-and-history-of-ai.mdx`
- [x] T007 [P] [US1] Author Lesson 02 in `src/content/lessons/ai-for-beginners/02-knowledge-representation-and-expert-systems.mdx`
- [x] T008 [P] [US1] Create Colab notebook `notebook/ai-for-beginners/02-knowledge-representation-and-expert-systems.ipynb`
- [x] T009 [US1] Verify US1 MVP slice via `verify_course_01.py` and `pnpm astro check`

## Phase 4: User Story 2 - Module 2: Neural Networks from Scratch & PyTorch Foundations (Priority: P2)

- [x] T010 [P] [US2] Author Lesson 03 in `src/content/lessons/ai-for-beginners/03-the-perceptron.mdx`
- [x] T011 [P] [US2] Create Colab notebook `notebook/ai-for-beginners/03-the-perceptron.ipynb`
- [x] T012 [P] [US2] Author Lesson 04 in `src/content/lessons/ai-for-beginners/04-multi-layered-perceptron-and-own-framework.mdx`
- [x] T013 [P] [US2] Create Colab notebook `notebook/ai-for-beginners/04-multi-layered-perceptron-and-own-framework.ipynb`
- [x] T014 [P] [US2] Author Lesson 05 in `src/content/lessons/ai-for-beginners/05-deep-learning-frameworks-and-overfitting.mdx`
- [x] T015 [P] [US2] Create Colab notebook `notebook/ai-for-beginners/05-deep-learning-frameworks-and-overfitting.ipynb`
- [x] T016 [US2] Verify US2 slice via `verify_course_01.py`

## Phase 5: User Story 3 - Module 3: Computer Vision (Priority: P3)

- [x] T017 [P] [US3] Author Lesson 06 + notebook (`06-introduction-to-computer-vision-and-opencv`)
- [x] T018 [P] [US3] Author Lesson 07 + notebook (`07-convolutional-neural-networks`)
- [x] T019 [P] [US3] Author Lesson 08 + notebook (`08-pretrained-networks-and-transfer-learning`)
- [x] T020 [P] [US3] Author Lesson 09 + notebook (`09-autoencoders-and-vaes`)
- [x] T021 [P] [US3] Author Lesson 10 + notebook (`10-gans-and-artistic-style-transfer`)
- [x] T022 [P] [US3] Author Lesson 11 + notebook (`11-object-detection`)
- [x] T023 [P] [US3] Author Lesson 12 + notebook (`12-semantic-segmentation-and-unet`)
- [x] T024 [US3] Verify US3 slice via `verify_course_01.py`

## Phase 6: User Story 4 - Module 4: Natural Language Processing (Priority: P4)

- [x] T025 [P] [US4] Author Lesson 13 + notebook (`13-text-representation-bow-and-tfidf`)
- [x] T026 [P] [US4] Author Lesson 14 + notebook (`14-semantic-word-embeddings`)
- [x] T027 [P] [US4] Author Lesson 15 + notebook (`15-language-modeling-and-custom-embeddings`)
- [x] T028 [P] [US4] Author Lesson 16 + notebook (`16-recurrent-neural-networks`)
- [x] T029 [P] [US4] Author Lesson 17 + notebook (`17-generative-recurrent-networks`)
- [x] T030 [P] [US4] Author Lesson 18 + notebook (`18-transformers-and-bert`)
- [x] T031 [P] [US4] Author Lesson 19 + notebook (`19-named-entity-recognition`)
- [x] T032 [P] [US4] Author Lesson 20 + notebook (`20-large-language-models-and-prompting` with HuggingFace GPT-2 + Google AI Studio `google-genai`)
- [x] T033 [US4] Verify US4 slice via `verify_course_01.py`

## Phase 7: User Story 5 - Module 5: Alternative Paradigms, AI Ethics & Multimodal CLIP/VQGAN (Priority: P5)

- [x] T034 [P] [US5] Author Lesson 21 + notebook (`21-genetic-algorithms`)
- [x] T035 [P] [US5] Author Lesson 22 + notebook (`22-deep-reinforcement-learning`)
- [x] T036 [P] [US5] Author Lesson 23 + notebook (`23-multi-agent-systems`)
- [x] T037 [P] [US5] Author Lesson 24 + notebook (`24-ai-ethics-and-responsible-ai`)
- [x] T038 [P] [US5] Author Lesson 25 + notebook (`25-multimodal-networks-clip-and-vqgan`)
- [x] T039 [US5] Verify US5 slice via `verify_course_01.py`

## Phase 8: Polish & Cross-Cutting Verification

- [x] T040 Run full-course validation script `verify_course_01.py` across all 26 `.mdx` files and 25 `.ipynb` notebooks
- [x] T041 Run `pnpm astro check` and `pnpm build` (0 errors, 52 pages built)
- [x] T042 Run design & A11Y static checks
- [x] T043 Clean up temporary workspace verification script and confirm clean status
