# Feature Specification: Course 01 — AI for Beginners (`ai-for-beginners`)

**Feature Branch**: `011-create-full-course`

**Created**: 2026-11-21

**Status**: Approved for Planning

**Input**: User description: "Create full course for 'AI for Beginners' based on `.ref/AI-For-Beginners` repo project."

## 1. Course Overview & Scope

This specification defines the complete 26-lesson curriculum for **Course 01: AI for Beginners** (`track: "ai-for-beginners"`), the second course in Buddhilive Academy's 9-course sequential AI Engineering learning path (`00 python` → `01 ai-for-beginners` → `02 data-science-for-beginners`).

Every lesson is grounded in the reference curriculum (`.ref/AI-For-Beginners/lessons/`), authored in the developer-friendly, pragmatic persona of `.agents/skills/my-writing-style/SKILL.md`, and adapts any proprietary Microsoft Foundry / Azure services or cloud model dependencies to open-source Python frameworks (`NumPy`, `PyTorch`, `OpenCV`, `HuggingFace Transformers`, `Gymnasium`, `Fairlearn`, `RDFLib`) running on **Google Colab Free Tier** (CPU or T4 GPU) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai` SDK).

### Complete 26-Lesson Syllabus & Reference Mapping

| Order | Lesson Slug (`src/content/lessons/ai-for-beginners/<slug>.mdx`) | Title | Category | Reference Source (`.ref/AI-For-Beginners/lessons/`) | Companion Notebook (`./notebook/ai-for-beginners/<slug>.ipynb`) | Runtime & Interactive Components |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `00-course-setup-and-colab-environment` | Course Setup, Google Colab & Google AI Studio Free Tier | Module 1: Symbolic AI & Foundations | `0-course-setup/setup.md`, `0-course-setup/how-to-run.md` | `00-course-setup-and-colab-environment.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU / T4 GPU" />` + `<QuizCard />` |
| `2` | `01-introduction-and-history-of-ai` | Introduction and History of Artificial Intelligence | Module 1: Symbolic AI & Foundations | `1-Intro/README.md`, `1-Intro/assignment.md` | — (Conceptual + Pyodide Sandbox) | `<PythonRunner />` + `<QuizCard />` |
| `3` | `02-knowledge-representation-and-expert-systems` | Knowledge Representation, Ontologies & Expert Systems | Module 1: Symbolic AI & Foundations | `2-Symbolic/README.md`, `Animals.ipynb`, `FamilyOntology.ipynb`, `MSConceptGraph.ipynb` | `02-knowledge-representation-and-expert-systems.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `4` | `03-the-perceptron` | The Perceptron: Linear Binary Classification from Scratch | Module 2: Neural Networks from Scratch | `3-NeuralNetworks/03-Perceptron/README.md`, `Perceptron.ipynb`, `lab/PerceptronMultiClass.ipynb` | `03-the-perceptron.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `5` | `04-multi-layered-perceptron-and-own-framework` | Multi-Layered Perceptrons & Building Your Own Neural Framework | Module 2: Neural Networks from Scratch | `3-NeuralNetworks/04-OwnFramework/README.md`, `OwnFramework.ipynb`, `lab/MyFW_MNIST.ipynb` | `04-multi-layered-perceptron-and-own-framework.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `6` | `05-deep-learning-frameworks-and-overfitting` | Deep Learning with PyTorch & Controlling Overfitting | Module 2: Neural Networks from Scratch | `3-NeuralNetworks/05-Frameworks/README.md`, `IntroPyTorch.ipynb`, `lab/LabFrameworks.ipynb` | `05-deep-learning-frameworks-and-overfitting.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `7` | `06-introduction-to-computer-vision-and-opencv` | Introduction to Computer Vision & Image Processing with OpenCV | Module 3: Computer Vision | `4-ComputerVision/06-IntroCV/README.md`, `OpenCV.ipynb`, `lab/MovementDetection.ipynb` | `06-introduction-to-computer-vision-and-opencv.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `8` | `07-convolutional-neural-networks` | Convolutional Neural Networks (CNNs) & Classic Architectures | Module 3: Computer Vision | `4-ComputerVision/07-ConvNets/README.md`, `CNN_Architectures.md`, `ConvNetsPyTorch.ipynb`, `lab/PetFaces.ipynb` | `07-convolutional-neural-networks.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `9` | `08-pretrained-networks-and-transfer-learning` | Pre-Trained Networks, Transfer Learning & Training Tricks | Module 3: Computer Vision | `4-ComputerVision/08-TransferLearning/README.md`, `TrainingTricks.md`, `TransferLearningPyTorch.ipynb`, `lab/OxfordPets.ipynb` | `08-pretrained-networks-and-transfer-learning.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `10` | `09-autoencoders-and-vaes` | Autoencoders & Variational Autoencoders (VAEs) | Module 3: Computer Vision | `4-ComputerVision/09-Autoencoders/README.md`, `AutoEncodersPyTorch.ipynb` | `09-autoencoders-and-vaes.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `11` | `10-gans-and-artistic-style-transfer` | Generative Adversarial Networks (GANs) & Neural Style Transfer | Module 3: Computer Vision | `4-ComputerVision/10-GANs/README.md`, `GANPyTorch.ipynb`, `StyleTransfer.ipynb` | `10-gans-and-artistic-style-transfer.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `12` | `11-object-detection` | Object Detection: Bounding Boxes, R-CNN, YOLO & RetinaNet | Module 3: Computer Vision | `4-ComputerVision/11-ObjectDetection/README.md`, `ObjectDetectionPyTorch.ipynb`, `lab/README.md` | `11-object-detection.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `13` | `12-semantic-segmentation-and-unet` | Semantic Segmentation & U-Net Architecture | Module 3: Computer Vision | `4-ComputerVision/12-Segmentation/README.md`, `SemanticSegmentationPytorch.ipynb`, `lab/BodySegmentation.ipynb` | `12-semantic-segmentation-and-unet.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `14` | `13-text-representation-bow-and-tfidf` | Text Representation: Tokenization, Bag-of-Words, N-Grams & TF-IDF | Module 4: Natural Language Processing | `5-NLP/13-TextRep/README.md`, `TextRepresentationPyTorch.ipynb`, `assignment.md` | `13-text-representation-bow-and-tfidf.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `15` | `14-semantic-word-embeddings` | Semantic Word Embeddings: Word2Vec, Skip-Gram & GloVe | Module 4: Natural Language Processing | `5-NLP/14-Embeddings/README.md`, `EmbeddingsPyTorch.ipynb`, `assignment.md` | `14-semantic-word-embeddings.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `16` | `15-language-modeling-and-custom-embeddings` | Language Modeling & Training Custom CBoW / Skip-Gram Embeddings | Module 4: Natural Language Processing | `5-NLP/15-LanguageModeling/README.md`, `CBoW-PyTorch.ipynb`, `lab/README.md` | `15-language-modeling-and-custom-embeddings.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `17` | `16-recurrent-neural-networks` | Recurrent Neural Networks (RNNs), LSTMs & GRUs | Module 4: Natural Language Processing | `5-NLP/16-RNN/README.md`, `RNNPyTorch.ipynb`, `assignment.md` | `16-recurrent-neural-networks.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `18` | `17-generative-recurrent-networks` | Character-Level & Word-Level Text Generation with Recurrent Networks | Module 4: Natural Language Processing | `5-NLP/17-GenerativeNetworks/README.md`, `GenerativePyTorch.ipynb`, `lab/README.md` | `17-generative-recurrent-networks.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `19` | `18-transformers-and-bert` | Attention Mechanisms, Transformers & BERT | Module 4: Natural Language Processing | `5-NLP/18-Transformers/README.md`, `TransformersPyTorch.ipynb`, `assignment.md` | `18-transformers-and-bert.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `20` | `19-named-entity-recognition` | Named Entity Recognition (NER) & Token Classification | Module 4: Natural Language Processing | `5-NLP/19-NER/README.md`, `NER-TF.ipynb` (converted to PyTorch/Transformers), `lab/README.md` | `19-named-entity-recognition.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |
| `21` | `20-large-language-models-and-prompting` | Large Language Models, Perplexity, Few-Shot Prompting & Gemini API | Module 4: Natural Language Processing | `5-NLP/20-LangModels/README.md`, `GPT-PyTorch.ipynb` (+ Google AI Studio Free Tier `google-genai`) | `20-large-language-models-and-prompting.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU + Gemini API" />` + `<QuizCard />` |
| `22` | `21-genetic-algorithms` | Genetic Algorithms & Evolutionary Optimization | Module 5: Alternative Paradigms & Ethics | `6-Other/21-GeneticAlgorithms/README.md`, `Diophantine.ipynb`, `Genetic.ipynb` | `21-genetic-algorithms.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `23` | `22-deep-reinforcement-learning` | Deep Reinforcement Learning: Q-Learning & Policy Gradients | Module 5: Alternative Paradigms & Ethics | `6-Other/22-DeepRL/README.md`, `CartPole-RL-PyTorch.ipynb`, `lab/MountainCar.ipynb` | `22-deep-reinforcement-learning.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU / T4 GPU" />` + `<QuizCard />` |
| `24` | `23-multi-agent-systems` | Multi-Agent Systems, NetLogo Emergent Behavior & Cooperative Intelligence | Module 5: Alternative Paradigms & Ethics | `6-Other/23-MultiagentSystems/README.md`, `assignment.md` | `23-multi-agent-systems.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `25` | `24-ai-ethics-and-responsible-ai` | AI Ethics, Fairness, Interpretability & Responsible AI | Module 5: Alternative Paradigms & Ethics | `7-Ethics/README.md` (+ open-source `fairlearn` & `interpret` evaluation) | `24-ai-ethics-and-responsible-ai.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier CPU" />` + `<QuizCard />` |
| `26` | `25-multimodal-networks-clip-and-vqgan` | Multi-Modal Networks: Contrastive Language-Image Pre-Training (CLIP) & VQGAN | Module 5: Alternative Paradigms & Ethics | `X-Extras/X1-MultiModal/README.md`, `Clip.ipynb` | `25-multimodal-networks-clip-and-vqgan.ipynb` | `<PythonRunner />` + `<ColabButton runtime="Free Tier T4 GPU" />` + `<QuizCard />` |

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Module 1: Course Setup, Symbolic AI & Curriculum Registry Integration (Priority: P1)

A learner finishing Course 00 (`python-zero-to-hero/12-installing-third-party-packages-with-pip`) transitions directly into Course 01 (`ai-for-beginners`), configures their free Google Colab runtime and Google AI Studio free-tier API key (`GEMINI_API_KEY`), explores the history of AI (Turing Test, Dartmouth Workshop, AI Winters, GOFAI vs Connectionism), and builds symbolic AI expert systems, ontologies, and semantic concept graphs.

**Why this priority**: Establishes the entry bridge from Course 00 (`python`), updates `src/lib/curriculum.ts` (`plannedLessonCount: 26`, runtime badges, and syllabus modules), and delivers the foundational setup and Symbolic AI module (`Lessons 00–02`) as an immediately navigable, build-verified MVP slice.

**Independent Test**: Navigate to `/learn/ai-for-beginners`, verify 26 planned lessons in the course hub, click into `00-course-setup-and-colab-environment`, `01-introduction-and-history-of-ai`, and `02-knowledge-representation-and-expert-systems`, run each lesson's in-browser `<PythonRunner />` sandbox, verify `<ColabButton />` links to `./notebook/ai-for-beginners/*.ipynb`, and complete the `<QuizCard />` checkpoints.

**Acceptance Scenarios**:

1. **Given** a learner on the final lesson of Course 00 (`python`), **When** they click the "Next Course: 01 AI Intro" button, **Then** they land directly on `/learn/ai-for-beginners/ai-for-beginners/00-course-setup-and-colab-environment`.
2. **Given** a learner reading Lesson 00 (`00-course-setup-and-colab-environment`), **When** they follow the setup guide, **Then** they find a step-by-step walkthrough for launching Google Colab Free Tier (CPU & T4 GPU), obtaining a free `GEMINI_API_KEY` from Google AI Studio, storing it in Colab Secrets (`google.colab.userdata`), and testing an open-source environment check in `<PythonRunner />`.
3. **Given** a learner studying Lesson 02 (`02-knowledge-representation-and-expert-systems`), **When** they run the in-browser backward/forward chaining expert system and open `notebook/ai-for-beginners/02-knowledge-representation-and-expert-systems.ipynb`, **Then** all symbolic reasoning rules, RDF ontology queries (`rdflib` / `owlready2`), and open-source ConceptNet/Wikidata graph explorations execute without proprietary Microsoft Concept Graph dependencies.

---

### User Story 2 - Module 2: Neural Networks from Scratch & PyTorch Foundations (Priority: P2)

A learner progresses from biological/mathematical neuron intuition to implementing a binary and multi-class Perceptron in pure Python/NumPy, builds their own modular neural network framework from scratch (forward pass, cross-entropy loss, analytical backpropagation gradients, SGD optimizer), and transitions to PyTorch tensors, ` autograd`, `nn.Module`, and overfitting regularization techniques.

**Why this priority**: Forms the mathematical and architectural backbone of modern deep learning (`Lessons 03–05`), fulfilling the course's core pedagogical promise: *"Write neural nets from scratch in NumPy before scaling up with PyTorch."*

**Independent Test**: Open Lessons `03-the-perceptron`, `04-multi-layered-perceptron-and-own-framework`, and `05-deep-learning-frameworks-and-overfitting`; execute the pure-Python/NumPy Perceptron and MLP backpropagation sandboxes inside `<PythonRunner />`; verify companion notebooks (`03`, `04`, `05`) include complete code + integrated lab exercises (Multi-class MNIST Perceptron, Custom Framework on MNIST, PyTorch Classification & Overfitting).

**Acceptance Scenarios**:

1. **Given** a learner on Lesson 03 (`03-the-perceptron`), **When** they inspect the mathematical formulation and click Run on the `<PythonRunner />` sandbox, **Then** the perceptron weights update via $\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} + \eta (y_i - \hat{y}_i)\mathbf{x}_i$ and converge on a linearly separable dataset in under 5 seconds.
2. **Given** a learner on Lesson 04 (`04-multi-layered-perceptron-and-own-framework`), **When** they study why linear models fail on XOR and run the custom layered framework (`Linear`, `ReLU`, `Softmax`, `CrossEntropyLoss`), **Then** the forward and backward passes train a two-layer network in-browser and the companion Colab notebook trains the same custom framework on MNIST.
3. **Given** a learner on Lesson 05 (`05-deep-learning-frameworks-and-overfitting`), **When** they open the lesson and Colab notebook, **Then** they compare manual gradients against PyTorch `autograd`, train `nn.Module` classifiers, and diagnose overfitting using validation curves, L2 weight decay, and dropout.

---

### User Story 3 - Module 3: Computer Vision — OpenCV, CNNs, Transfer Learning, Generative Vision, Detection & Segmentation (Priority: P3)

A learner masters classical image preprocessing with OpenCV and deep computer vision with PyTorch across 7 comprehensive lessons (`Lessons 06–12`): image filters/motion detection, 2D convolutions and classic CNN architectures (LeNet, AlexNet, VGG, ResNet), pre-trained ImageNet transfer learning and training tricks (batch norm, dropout, adversarial examples), Autoencoders/VAEs, GANs and Neural Style Transfer, Object Detection (R-CNN, YOLO, RetinaNet), and U-Net Semantic Segmentation.

**Why this priority**: Delivers the entire 7-lesson Computer Vision module (`Lessons 06–12`) grounded in `.ref/AI-For-Beginners/lessons/4-ComputerVision/`, consolidating all `pytorchcv.py` helpers directly inside self-contained Colab T4 GPU notebooks.

**Independent Test**: Verify Lessons `06` through `12` build cleanly, render mathematical convolution/loss equations with KaTeX, provide runnable `<PythonRunner />` algorithm demonstrations (e.g., 2D kernel convolution, IoU/NMS calculation, Dice coefficient, VAE KL-divergence), and link to 7 valid `.ipynb` notebooks in `./notebook/ai-for-beginners/`.

**Acceptance Scenarios**:

1. **Given** a learner on Lesson 07 (`07-convolutional-neural-networks`) or Lesson 08 (`08-pretrained-networks-and-transfer-learning`), **When** they run the in-browser sandbox and open the companion Colab notebook, **Then** the notebook is 100% self-contained (no external `pytorchcv.py` missing-file errors) and includes the Oxford-IIIT Pet Faces / Cats-vs-Dogs lab exercises on Colab T4 GPU.
2. **Given** a learner on Lesson 11 (`11-object-detection`) or Lesson 12 (`12-semantic-segmentation-and-unet`), **When** they run the `<PythonRunner />` sandbox, **Then** they can execute Intersection over Union ($\text{IoU}$) + Non-Maximum Suppression (NMS) and U-Net Dice loss calculations in-browser, and run PyTorch RetinaNet/Faster R-CNN and U-Net segmentation in Google Colab.

---

### User Story 4 - Module 4: Natural Language Processing — BoW to Transformers, NER & LLMs with Gemini API (Priority: P4)

A learner journeys through the evolution of Natural Language Processing across 8 lessons (`Lessons 13–20`): tokenization, Bag-of-Words, N-grams, and TF-IDF; Word2Vec and GloVe semantic embeddings; custom CBoW and Skip-Gram language modeling; RNNs, LSTMs, and GRUs for sequence classification; character- and word-level generative RNNs; Self-Attention, Multi-Head Transformers, and BERT fine-tuning; Named Entity Recognition (NER); and Pre-Trained Large Language Models (GPT, Perplexity, Zero/Few-Shot Prompt Engineering) using open-source HuggingFace `transformers` and **Google AI Studio Free Tier** (`google-genai` with `GEMINI_API_KEY`).

**Why this priority**: Covers the complete 8-lesson NLP progression (`Lessons 13–20`) from `.ref/AI-For-Beginners/lessons/5-NLP/`, converting legacy `torchtext` / TensorFlow-only notebooks (`19-NER`) and Azure OpenAI references (`20-LangModels`) into modern PyTorch + HuggingFace + Google AI Studio Free Tier workflows.

**Independent Test**: Verify Lessons `13` through `20` render all prose, tables, quizzes, `<PythonRunner />` sandboxes (TF-IDF vectorizer, cosine similarity analogy solver, scaled dot-product attention $\text{Attention}(Q,K,V)$, BIO tag evaluator, perplexity calculator), and companion Colab notebooks (`13`–`20`).

**Acceptance Scenarios**:

1. **Given** a learner on Lesson 18 (`18-transformers-and-bert`) or Lesson 19 (`19-named-entity-recognition`), **When** they open the companion Colab notebook, **Then** the notebook uses modern HuggingFace `transformers` and PyTorch (replacing deprecated `torchtext.legacy` and TensorFlow-only NER code) and runs cleanly on Colab Free Tier.
2. **Given** a learner on Lesson 20 (`20-large-language-models-and-prompting`), **When** they reach the cloud LLM and prompt programming section, **Then** all Azure OpenAI cognitive service references are replaced with open-source HuggingFace GPT-2 generation AND a hands-on **Google AI Studio Free Tier** (`google-genai` SDK + `GEMINI_API_KEY`) zero-shot/few-shot prompt engineering workflow.

---

### User Story 5 - Module 5: Alternative AI Paradigms, Responsible AI Ethics & Multimodal CLIP/VQGAN (Priority: P5)

A learner completes the final 5 lessons (`Lessons 21–25`): Genetic Algorithms and evolutionary optimization (Diophantine equations & knapsack/function optimization); Deep Reinforcement Learning (Bellman equation, Q-Learning tables, Policy Gradients on Gymnasium `CartPole` & `MountainCar`); Multi-Agent Systems (Boids flocking, emergent behavior, predator-prey/cooperative agents); AI Ethics and Responsible AI (Fairness, Reliability, Privacy, Inclusiveness, Transparency, Accountability with open-source `fairlearn` and `interpret`); and Multi-Modal Networks (CLIP contrastive image-text alignment and VQGAN/Diffusers open-source synthesis), concluding with a seamless handoff to **Course 02: Data Science for Beginners**.

**Why this priority**: Completes all remaining lessons (`6-Other`, `7-Ethics`, `X-Extras/X1-MultiModal`) and connects the final lesson (`25-multimodal-networks-clip-and-vqgan`) to Course 02 (`data-science-for-beginners`).

**Independent Test**: Verify Lessons `21` through `25` render cleanly, execute genetic algorithm evolution, tabular Q-learning, multi-agent simulation, demographic parity/disparate impact fairness metrics, and contrastive cosine similarity matrix computation inside `<PythonRunner />`, and hand off to Course 02 via the lesson footer.

**Acceptance Scenarios**:

1. **Given** a learner on Lesson 24 (`24-ai-ethics-and-responsible-ai`), **When** they study Responsible AI principles and tools, **Then** they can run bias and fairness metrics (Demographic Parity Difference, Equalized Odds) in `<PythonRunner />` and audit model fairness using open-source `fairlearn` and `interpret` in Google Colab without requiring Azure cloud subscriptions.
2. **Given** a learner on Lesson 25 (`25-multimodal-networks-clip-and-vqgan`), **When** they finish the final lesson of Course 01, **Then** the bottom navigation (`LessonFooter`) displays "Complete & Continue to Course 02" linking to `/learn/data-science-for-beginners`.

---

### Edge Cases & Boundary Conditions

- **Pyodide 5-Second Execution Timeout & Pure-Python Constraints**: Heavy deep learning frameworks (`torch`, `transformers`, `cv2`) cannot be downloaded or trained inside the browser's 5-second Pyodide Web Worker (`src/workers/pyodide.worker.ts`). Every `<PythonRunner />` code block in Lessons `00–25` MUST use pure Python standard library (`math`, `random`, `collections`, `json`) to demonstrate the exact mathematical algorithm (e.g., 2D convolution kernel, backpropagation step, scaled dot-product attention, TF-IDF, Q-learning update, genetic crossover, fairness metrics) deterministically within `< 2` seconds, while delegating full GPU dataset training to the linked `./notebook/ai-for-beginners/<slug>.ipynb` Colab notebook.
- **Deprecated Upstream Dependencies (`torchtext.legacy`, `gym`, missing `pytorchcv.py` / `torchnlp.py`)**: Reference notebooks in `.ref/AI-For-Beginners` rely on external helper files (`pytorchcv.py`, `torchnlp.py`) and deprecated APIs (`torchtext.legacy`, `openai/gym`). Every generated notebook in `./notebook/ai-for-beginners/` MUST inline all helper utilities and use current open-source packages (`torch`, `torchvision`, `transformers`, `datasets`, `gymnasium`) so clicking "Open with Google Colab" works out of the box without cloning external repositories.
- **Zero Reference Repository Mentions**: Lesson prose and notebooks MUST NEVER mention `.ref/`, `microsoft/AI-For-Beginners`, Microsoft Learn URLs, or Azure Cognitive Services. Upstream attribution remains exclusively in `ACKNOWLEDGEMENTS.md`.
- **Cross-Course Navigation Boundaries**: Lesson `00-course-setup-and-colab-environment` (`order: 1`) must link back to `Course 00: 00 Python` (`python-zero-to-hero/12-installing-third-party-packages-with-pip`), and Lesson `25-multimodal-networks-clip-and-vqgan` (`order: 26`) must link forward to `Course 02: 02 Data Science` (`/learn/data-science-for-beginners`).

---

## 3. Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (26 MDX Lessons)**: System MUST provide 26 `.mdx` tutorial files under `src/content/lessons/ai-for-beginners/` covering Lessons `00` through `25` in sequential `order` (`1` through `26`) with `track: "ai-for-beginners"`.
- **FR-002 (Schema Validation)**: Every `.mdx` lesson frontmatter MUST strictly validate against `src/content.config.ts` (`title`, `track: "ai-for-beginners"`, `category`, `order`, `difficulty`, `xp`, `description` >= 30 characters, `topic`, and `prerequisites` array chaining each lesson to its predecessor, starting from `["python-zero-to-hero/12-installing-third-party-packages-with-pip"]` for Lesson `00`).
- **FR-003 (Reference Grounding & Zero Upstream Mentions)**: Every lesson MUST include full conceptual, mathematical, architectural, and practical depth grounded in its mapped `.ref/AI-For-Beginners/lessons/` directory (including `CNN_Architectures.md`, `TrainingTricks.md`, and lab problems), while containing **zero** mentions of `.ref/`, Microsoft Learn, Azure, or upstream GitHub repositories in lesson prose.
- **FR-004 (Signature Authoring Voice)**: All tutorial prose MUST be authored using the `.agents/skills/my-writing-style/SKILL.md` skill (direct 2–3 sentence opening hook, conversational first-person developer enthusiasm, clean `H2`/`H3` sectional headings, pragmatic takeaways, and zero generic AI slop).
- **FR-005 (Pedagogical Structure & Depth)**: Each lesson MUST contain:
  1. Direct opening hook and conceptual summary (`350+` words minimum of clear explanatory prose; target `600–1,200+` words per lesson to capture full reference depth).
  2. Mathematical/architectural definitions rendered with KaTeX (`$$...$$` and `$...$`) and ASCII/Markdown architecture diagrams where applicable.
  3. Copyable code examples plus at least one interactive in-browser `<PythonRunner client:visible />` sandbox with verified `expectedOutput` that executes in `< 2` seconds in Pyodide.
  4. Structured reference/parameter markdown tables explaining hyperparameters, tensor shapes, layer architectures, or edge cases.
  5. At least one interactive `<QuizCard client:visible />` self-check assessment grounded in the lesson's pre/post-lecture concepts.
- **FR-006 (25 Self-Contained Google Colab Notebooks)**: System MUST create 25 valid Jupyter notebooks (`.ipynb`, nbformat v4) under `./notebook/ai-for-beginners/<lesson_slug>.ipynb` (for Lessons `00` and `02–25`) that inline any helper functions, standardize on PyTorch + open-source tools, include the lesson's hands-on lab exercise, and are linked inside each corresponding `.mdx` file via `<ColabButton course="ai-for-beginners" notebook="<lesson_slug>.ipynb" runtime="..." />`.
- **FR-007 (Open-Source Colab & Google AI Studio Free-Tier Replacement)**:
  - All Microsoft Concept Graph, Azure Cognitive Services, Azure Machine Learning, or Azure OpenAI references MUST be replaced with open-source Python tools (`rdflib`, `PyTorch`, `torchvision`, `OpenCV`, `HuggingFace Transformers`, `Gymnasium`, `Fairlearn`, `InterpretML`) running on Google Colab Free Tier (CPU or T4 GPU).
  - Lesson `00` and Lesson `20` MUST include a clear, step-by-step guide for obtaining a free API key from **Google AI Studio** (`GEMINI_API_KEY`), configuring it in Google Colab Secrets, and calling Gemini models with the `google-genai` SDK.
- **FR-008 (Curriculum Registry Synchronization)**: `src/lib/curriculum.ts` MUST be updated for `track: 'ai-for-beginners'` so `plannedLessonCount` is `26`, `runtimeBadges` includes `'Google AI Studio Free Tier'`, `usesGeminiApi` is `true`, and `syllabusModules` accurately reflects all 26 lessons across the modules.
- **FR-009 (Accessibility, Theme & Layout Stability)**: All lesson content and interactive islands MUST conform to `DESIGN.md` and `.agents/skills/a11y/SKILL.md` (WCAG 2.2 AA contrast ratios in light/dark mode with `#A7452A` / `#E07A5F`, semantic heading hierarchy `H2` → `H3` inside `<article>`, accessible tables, keyboard-operable `<PythonRunner />`, `<ColabButton />`, and `<QuizCard />`, and zero CLS in `AdSlot` containers).

### Key Entities

- **Lesson MDX Document (`src/content/lessons/ai-for-beginners/<slug>.mdx`)**: Astro Content Collection entry validated by `src/content.config.ts`, rendered at `/learn/ai-for-beginners/ai-for-beginners/<slug>`.
- **Companion Colab Notebook (`notebook/ai-for-beginners/<slug>.ipynb`)**: Valid JSON Jupyter Notebook (`nbformat: 4`) hosted in the repository and opened directly in Google Colab via `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-for-beginners/<slug>.ipynb`.
- **Curriculum Course Registry (`src/lib/curriculum.ts`)**: Central TypeScript metadata registry driving the Course Hub (`/learn/ai-for-beginners`), sidebar grouping (`LessonSidebar.astro`), progress bar (`LessonProgressPanel.tsx`), and cross-course footer handoffs (`LessonLayout.astro`).

---

## 4. Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (100% Curriculum Completeness)**: All 26 `.mdx` lessons (`00` through `25`) exist in `src/content/lessons/ai-for-beginners/` and all 25 companion `.ipynb` notebooks exist in `notebook/ai-for-beginners/` as valid JSON notebooks.
- **SC-002 (Zero Build, Type, or Schema Errors)**: `pnpm astro check` and `pnpm build` succeed with `0` errors and generate static HTML routes for `/learn/ai-for-beginners` and all 26 lesson pages.
- **SC-003 (100% Sandbox & Content Contract Compliance)**: Every one of the 26 `.mdx` lessons contains `>= 350` words of prose in `my-writing-style`, at least one `<PythonRunner client:visible />` whose `initialCode` deterministically produces its `expectedOutput`, at least one markdown reference table, and at least one `<QuizCard client:visible />`.
- **SC-004 (Zero Upstream/Proprietary Leakage)**: Automated search across `src/content/lessons/ai-for-beginners/` and `notebook/ai-for-beginners/` returns `0` references to `.ref/`, `Azure OpenAI`, `Microsoft Foundry`, `Cognitive Services`, or `learn.microsoft.com`.
- **SC-005 (Accessibility Verification Gate)**: Running `buddhi scripts verify-a11y` and `detect_design_md.py --lint` passes with `0` WCAG 2.2 AA violations.

---

## 5. Assumptions

- The GitHub repository slug used by `<ColabButton />` (`https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-for-beginners/<notebook>`) remains the canonical target URL for opening notebooks in Google Colab.
- Existing Astro islands (`PythonRunner.tsx`, `QuizCard.tsx`, `LessonProgressPanel.tsx`, `LessonFooter.tsx`) and static components (`ColabButton.astro`, `LessonSidebar.astro`, `AdSlot.astro`) require no breaking prop changes and will be reused across all 26 lessons.
