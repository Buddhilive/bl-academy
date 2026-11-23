# Implementation Plan: Course 01 — AI for Beginners (`ai-for-beginners`)

**Branch**: `011-create-full-course` | **Date**: 2026-11-21 | **Spec**: [spec.md](file:///C:/DevDojo/Buddhi/bl-academy/.buddhi/specs/011-create-full-course/spec.md)

**Input**: Feature specification from `/.buddhi/specs/011-create-full-course/spec.md`

---

## Summary

Deliver the complete 26-lesson **Course 01: AI for Beginners** (`track: "ai-for-beginners"`) curriculum and 25 companion **Google Colab Free Tier** Jupyter notebooks (`./notebook/ai-for-beginners/<slug>.ipynb`), grounded in `.ref/AI-For-Beginners/lessons/`. Every lesson is authored as an Astro Content Collection `.mdx` file under `src/content/lessons/ai-for-beginners/` using the `my-writing-style` skill, includes KaTeX mathematical definitions, structured reference tables, a fast pure-Python `<PythonRunner client:visible />` in-browser sandbox, a `<ColabButton />` deep-link to its self-contained PyTorch/open-source Colab notebook, and a `<QuizCard client:visible />` assessment. Proprietary cloud references (Azure OpenAI, Microsoft Foundry, Cognitive Services, Microsoft Concept Graph) are replaced with open-source frameworks (`NumPy`, `PyTorch`, `OpenCV`, `HuggingFace Transformers`, `Gymnasium`, `Fairlearn`, `InterpretML`, `RDFLib`) and **Google AI Studio Free Tier** (`GEMINI_API_KEY` via `google-genai`).

---

## Technical Context

**Language/Version**: TypeScript 5.9.3, Astro 7.4.4, React 19.3.1, MDX (`@astrojs/mdx` 8.1.2), Python 3.11+ (Pyodide v0.26+ in-browser Web Worker & Jupyter `nbformat` v4 notebooks)

**Primary Dependencies**:
- **Frontend / SSG**: `astro`, `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`, `remark-math`, `rehype-katex`, `katex`, `@uiw/react-codemirror`
- **Colab Notebook Stack (Free Tier)**: `numpy`, `torch`, `torchvision`, `opencv-python`, `transformers`, `datasets`, `gymnasium`, `fairlearn`, `interpret`, `rdflib`, `google-genai`

**Storage**: Static Git-tracked files (`src/content/lessons/ai-for-beginners/*.mdx`, `notebook/ai-for-beginners/*.ipynb`, `src/lib/curriculum.ts`) + browser `localStorage` for Pathfinder XP progress

**Testing & Verification**:
- `pnpm astro check` (Astro content collection Zod schema + TypeScript validation)
- `pnpm build` (Static site generation across all 26 new lesson routes + course hub `/learn/ai-for-beginners`)
- Automated Python verification script (`verify_course_01.py`) checking all 26 `.mdx` files (frontmatter, word count >= 350 words, component imports/usages, deterministic execution of `initialCode` matching `expectedOutput`, zero forbidden upstream/Azure terms) and all 25 `.ipynb` notebooks (valid JSON `nbformat: 4`, self-contained helpers, zero broken local imports)
- Accessibility & Design Token Gates: `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint` and `buddhi scripts verify-a11y`

**Target Platform**: Static Web (SSG) + In-Browser WebAssembly (`Pyodide` Web Worker) + Google Colab Free Tier (CPU / T4 GPU)

**Project Type**: Static Educational Web Application & Interactive Curriculum Platform

**Performance Goals**:
- Zero main-thread blocking on page load (`client:visible` hydration for `PythonRunner` and `QuizCard`)
- Every `<PythonRunner />` `initialCode` executes deterministically in `< 2.0s` (well inside the hard 5-second `pyodide.worker.ts` timeout)
- Zero Cumulative Layout Shift (`CLS = 0`) across lesson pages and `AdSlot` containers

**Constraints**:
- Zero mentions of `.ref/`, `microsoft/AI-For-Beginners`, Microsoft Learn, Azure OpenAI, or Microsoft Foundry in lesson prose or notebooks (credits live solely in `ACKNOWLEDGEMENTS.md`)
- Self-contained `.ipynb` notebooks: must inline helper utilities (replacing external `pytorchcv.py` and `torchnlp.py` files) and replace deprecated `torchtext.legacy` / `gym` with modern `torch`, `transformers`, and `gymnasium`
- Strict WCAG 2.2 AA contrast and heading hierarchy (`H1` rendered by `LessonLayout.astro`, so MDX bodies use `H2` → `H3` without skipping levels)

**Scale/Scope**:
- 1 curriculum registry update (`src/lib/curriculum.ts`)
- 26 `.mdx` tutorial lessons (`src/content/lessons/ai-for-beginners/00-*.mdx` through `25-*.mdx`)
- 25 `.ipynb` companion Google Colab notebooks (`notebook/ai-for-beginners/00-*.ipynb`, `02-*.ipynb` through `25-*.ipynb`)

---

## Multi-Angle Architectural Evaluation & System Design

### 1. Architectural Lenses
- **Fewest-Slices Lens**: Reuse existing, battle-tested layout and interactive components (`LessonLayout.astro`, `LessonSidebar.astro`, `ColabButton.astro`, `PythonRunner.tsx`, `QuizCard.tsx`) with zero new runtime dependencies or UI component churn. Updating `src/lib/curriculum.ts` and dropping `.mdx` files into `src/content/lessons/ai-for-beginners/` automatically populates `/learn/ai-for-beginners`, the left sidebar, the Pathfinder progress bar, and the cross-course handoff links from Course 00 (`python`) and into Course 02 (`data-science-for-beginners`).
- **Risk-First Lens**:
  1. *Pyodide 5s Timeout & Missing C-Extensions*: Deep learning frameworks (`torch`, `cv2`, `transformers`) cannot load in the browser worker. **Mitigation**: Each lesson's `<PythonRunner />` implements the core mathematical algorithm in pure Python (e.g., perceptron weight update, 2-layer MLP backpropagation, 2D convolution kernel, IoU/NMS, TF-IDF, scaled dot-product attention, Bellman Q-update, genetic crossover, demographic parity) with deterministic seed and exact `expectedOutput`, while the full dataset/GPU training runs in the companion Colab `.ipynb` notebook.
  2. *Broken Relative Imports in Colab*: Reference notebooks in `.ref/AI-For-Beginners` import local files (`wget pytorchcv.py`, `torchnlp.py`) or obsolete libraries (`torchtext.legacy`). **Mitigation**: Every notebook in `./notebook/ai-for-beginners/` embeds a self-contained setup cell that installs modern packages (`!pip install -q ...`) and defines clean helper functions inline.
- **Seam-Quality Lens**: Clean separation between in-browser conceptual verification (`<PythonRunner />` in `.mdx`) and cloud GPU execution (`./notebook/ai-for-beginners/<slug>.ipynb` via `<ColabButton />`), joined by identical lesson slugs (`<slug>.mdx` ↔ `<slug>.ipynb`).

### 2. System Design Trade-Off Analysis (`system-design`)

| Decision Area | Option A (Chosen) | Option B (Rejected) | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **In-Browser `<PythonRunner />` Code Design** | Pure-Python standard-library implementations of each lesson's core mathematical algorithm with deterministic `expectedOutput` | Loading `numpy`/`scikit-learn` via `micropip` inside Pyodide on every lesson | Pure Python runs in `< 150ms` after Pyodide init, never hits the 5s Web Worker timeout or network failures, and exposes the real math transparently to learners. |
| **Colab Notebook Organization** | One unified, self-contained PyTorch `.ipynb` per lesson (`notebook/ai-for-beginners/<slug>.ipynb`) integrating both theory and the lesson's lab exercise | Multiple framework variants (`*TF.ipynb`, `*Keras.ipynb`, `*PyTorch.ipynb`, `lab/*.ipynb`) per lesson | Matches `ColabButton.astro` 1-to-1 slug convention, eliminates framework fragmentation, and aligns with Courses 04–08 which standardize on PyTorch + HuggingFace + Gemini. |
| **LLM & Cloud Service Adaptation (Lessons 00, 02, 20, 24)** | Open-source libraries (`rdflib`, `transformers`, `fairlearn`, `interpret`) + **Google AI Studio Free Tier** (`google-genai` with `GEMINI_API_KEY` stored in Colab Secrets) | Paid OpenAI API / Azure Cognitive Services / deprecated MS Concept Graph dumps | Zero cost for students, 100% reproducible on Google Colab Free Tier, and prepares students for Courses 04–07 which use `GEMINI_API_KEY`. |

---

## AGENTS.md & DESIGN.md Compliance Check

*GATE: Verified against `AGENTS.md`, `DESIGN.md`, `A11Y-DECISIONS.md`, and `.agents/rules/`.*

- [x] **Project build & test commands adhered to**: Uses `pnpm astro check` and `pnpm build`.
- [x] **9-Course Sequential Learning Path & Grounding**: Course 01 (`ai-for-beginners`) connects directly from `python-zero-to-hero/12-installing-third-party-packages-with-pip` (`Course 00`) and hands off to `data-science-for-beginners` (`Course 02`). All 26 lessons are grounded in `.ref/AI-For-Beginners/lessons/` with zero `.ref/` mentions in lesson prose.
- [x] **Content Generation Contract**: Every `.mdx` file validates against `src/content.config.ts`, uses `my-writing-style`, and includes opening hook, KaTeX math, `<PythonRunner client:visible />`, `<ColabButton />` (for lessons with notebooks), reference tables, `<QuizCard client:visible />`, and 350+ words of explanatory prose.
- [x] **Open-Source Colab Free Tier & Google AI Studio Free Tier Stack**: Replaces Azure/Foundry with open-source Python on Colab Free Tier and Google AI Studio Free Tier (`GEMINI_API_KEY` via `google-genai`).
- [x] **Zero-Backend Browser Execution**: Pure client-side Pyodide execution in `/src/workers/pyodide.worker.ts`; zero server-side execution dependencies.
- [x] **Theme, Contrast & Accessibility (`DESIGN.md` & `A11Y-DECISIONS.md`)**:
  - Reuses accessible `<PythonRunner client:visible />` (Escape focus-trap release, `aria-live="polite"` output region), `<QuizCard client:visible />` (`role="radiogroup"`, `aria-checked`, polite explanation region), and `<ColabButton />` (`min-h-[44px]`, forced-colors-safe focus outline, `.sr-only` new-tab announcement).
  - Maintains strict `H2` → `H3` heading hierarchy inside MDX articles (since `LessonLayout.astro` renders `H1`).
  - Uses standard Markdown tables (rendered with semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`) and fences all shell commands with ```` ```bash ```` so `$` never collides with KaTeX math delimiters.
  - Preserves fixed-height `AdSlot.astro` containers for zero CLS.

---

## Project Structure

### Documentation (this feature)

```text
.buddhi/specs/011-create-full-course/
├── spec.md              # Feature specification (26 lessons, 5 user stories, requirements)
├── plan.md              # This implementation plan (/spec-plan output)
└── tasks.md             # Actionable task list (/spec-tasks output)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                                    # Zod schema for lessons collection
├── lib/
│   └── curriculum.ts                                    # Update ai-for-beginners: plannedLessonCount: 26, usesGeminiApi: true, runtimeBadges, syllabusModules
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
        └── ai-for-beginners/                            # 26 MDX lessons (order: 1..26)
            ├── 00-course-setup-and-colab-environment.mdx
            ├── 01-introduction-and-history-of-ai.mdx
            ├── 02-knowledge-representation-and-expert-systems.mdx
            ├── 03-the-perceptron.mdx
            ├── 04-multi-layered-perceptron-and-own-framework.mdx
            ├── 05-deep-learning-frameworks-and-overfitting.mdx
            ├── 06-introduction-to-computer-vision-and-opencv.mdx
            ├── 07-convolutional-neural-networks.mdx
            ├── 08-pretrained-networks-and-transfer-learning.mdx
            ├── 09-autoencoders-and-vaes.mdx
            ├── 10-gans-and-artistic-style-transfer.mdx
            ├── 11-object-detection.mdx
            ├── 12-semantic-segmentation-and-unet.mdx
            ├── 13-text-representation-bow-and-tfidf.mdx
            ├── 14-semantic-word-embeddings.mdx
            ├── 15-language-modeling-and-custom-embeddings.mdx
            ├── 16-recurrent-neural-networks.mdx
            ├── 17-generative-recurrent-networks.mdx
            ├── 18-transformers-and-bert.mdx
            ├── 19-named-entity-recognition.mdx
            ├── 20-large-language-models-and-prompting.mdx
            ├── 21-genetic-algorithms.mdx
            ├── 22-deep-reinforcement-learning.mdx
            ├── 23-multi-agent-systems.mdx
            ├── 24-ai-ethics-and-responsible-ai.mdx
            └── 25-multimodal-networks-clip-and-vqgan.mdx

notebook/
└── ai-for-beginners/                                    # 25 self-contained Colab notebooks (nbformat v4)
    ├── 00-course-setup-and-colab-environment.ipynb
    ├── 02-knowledge-representation-and-expert-systems.ipynb
    ├── 03-the-perceptron.ipynb
    ├── 04-multi-layered-perceptron-and-own-framework.ipynb
    ├── 05-deep-learning-frameworks-and-overfitting.ipynb
    ├── 06-introduction-to-computer-vision-and-opencv.ipynb
    ├── 07-convolutional-neural-networks.ipynb
    ├── 08-pretrained-networks-and-transfer-learning.ipynb
    ├── 09-autoencoders-and-vaes.ipynb
    ├── 10-gans-and-artistic-style-transfer.ipynb
    ├── 11-object-detection.ipynb
    ├── 12-semantic-segmentation-and-unet.ipynb
    ├── 13-text-representation-bow-and-tfidf.ipynb
    ├── 14-semantic-word-embeddings.ipynb
    ├── 15-language-modeling-and-custom-embeddings.ipynb
    ├── 16-recurrent-neural-networks.ipynb
    ├── 17-generative-recurrent-networks.ipynb
    ├── 18-transformers-and-bert.ipynb
    ├── 19-named-entity-recognition.ipynb
    ├── 20-large-language-models-and-prompting.ipynb
    ├── 21-genetic-algorithms.ipynb
    ├── 22-deep-reinforcement-learning.ipynb
    ├── 23-multi-agent-systems.ipynb
    ├── 24-ai-ethics-and-responsible-ai.ipynb
    └── 25-multimodal-networks-clip-and-vqgan.ipynb
```

**Structure Decision**: Uses Astro's existing file-based content collection (`src/content/lessons/ai-for-beginners/<slug>.mdx`) and top-level `./notebook/ai-for-beginners/<slug>.ipynb` directory so `ColabButton.astro` resolves `https://colab.research.google.com/github/buddhilive/bl-academy/blob/main/notebook/ai-for-beginners/<slug>.ipynb` without modifying any routing or component code.

---

## Detailed Module & Lesson Implementation Blueprint

### Module 1: Symbolic AI & Foundations (`category: "Module 1: Symbolic AI & Foundations"`)
1. **Lesson 00 (`00-course-setup-and-colab-environment`, `order: 1`, `xp: 40`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["python-zero-to-hero/12-installing-third-party-packages-with-pip"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/0-course-setup/setup.md`, `how-to-run.md`
   - **Content**: Navigating the 26-lesson AI for Beginners roadmap; In-Browser Pyodide vs Google Colab Free Tier (CPU vs T4 GPU runtimes); step-by-step guide to creating a free **Google AI Studio API Key** (`GEMINI_API_KEY`), storing it in Colab Secrets (`google.colab.userdata.get('GEMINI_API_KEY')`), and verifying PyTorch + Gemini SDK (`google-genai`).
   - **Pyodide Sandbox**: Pure-Python hardware/precision estimator calculating model parameter memory footprints (`FP32`, `FP16`, `INT8`) across CPU and Colab T4 GPU (16 GB VRAM).
   - **Colab Notebook**: `00-course-setup-and-colab-environment.ipynb` (GPU check with `torch.cuda.is_available()`, tensor smoke test, and `google-genai` free-tier API key test).
2. **Lesson 01 (`01-introduction-and-history-of-ai`, `order: 2`, `xp: 50`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ai-for-beginners/00-course-setup-and-colab-environment"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/1-Intro/README.md`, `assignment.md`
   - **Content**: Defining Intelligence vs Artificial Intelligence; Weak/Narrow AI vs Strong AI (AGI); Alan Turing's 1950 Imitation Game & Chinese Room argument; Top-Down (Symbolic Reasoning / GOFAI) vs Bottom-Up (Connectionist Neural Networks); History of AI timeline (1956 Dartmouth Workshop, ELIZA, Expert Systems, AI Winters, 2012 ImageNet AlexNet breakthrough, Foundation Models).
   - **Pyodide Sandbox**: Interactive ELIZA-style rule-based pattern matcher vs statistical feature scorer comparing Symbolic vs Empirical AI approaches.
3. **Lesson 02 (`02-knowledge-representation-and-expert-systems`, `order: 3`, `xp: 60`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ai-for-beginners/01-introduction-and-history-of-ai"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/2-Symbolic/README.md`, `Animals.ipynb`, `FamilyOntology.ipynb`, `MSConceptGraph.ipynb`
   - **Content**: Algorithmic vs Declarative knowledge; Taxonomies, Semantic Networks, Frames, and RDF Triples (Subject–Predicate–Object); Web Ontology Language (OWL); Production Rule Expert Systems (Working Memory, Rule Base, Forward Chaining vs Backward Chaining); Open-source Concept Graphs (ConceptNet / Wikidata `is-a` probabilities replacing Microsoft Concept Graph).
   - **Pyodide Sandbox**: Forward-chaining and Backward-chaining inference engine on the Animals expert system knowledge base.
   - **Colab Notebook**: `02-knowledge-representation-and-expert-systems.ipynb` (Full Animals Expert System, GEDCOM Family Ontology inference with `rdflib`, and open-source Concept Graph taxonomic reasoning).

### Module 2: Neural Networks from Scratch (`category: "Module 2: Neural Networks from Scratch"`)
4. **Lesson 03 (`03-the-perceptron`, `order: 4`, `xp: 70`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ai-for-beginners/02-knowledge-representation-and-expert-systems"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/03-Perceptron/README.md`, `Perceptron.ipynb`, `lab/PerceptronMultiClass.ipynb`
   - **Content**: Biological neuron vs Frank Rosenblatt's Mark 1 Perceptron (1957); Linear discriminant function $y(\mathbf{x}) = f(\mathbf{w}^{\top}\mathbf{x} + b)$; Step activation function; Homogeneous coordinates $\langle \mathbf{w}, \mathbf{x} \rangle$; Perceptron Learning Rule $\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} + \eta (y_i - \hat{y}_i)\mathbf{x}_i$; Multi-class one-vs-rest classification.
   - **Pyodide Sandbox**: Pure-Python binary Perceptron training loop with live weight updates and 100% classification accuracy evaluation.
   - **Colab Notebook**: `03-the-perceptron.ipynb` (Vectorized NumPy Perceptron, decision boundary plotting, and integrated Lab: Multi-Class MNIST Digit Classification with One-vs-Rest Perceptrons).
5. **Lesson 04 (`04-multi-layered-perceptron-and-own-framework`, `order: 5`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ai-for-beginners/03-the-perceptron"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/04-OwnFramework/README.md`, `OwnFramework.ipynb`, `lab/MyFW_MNIST.ipynb`
   - **Content**: Why single-layer perceptrons fail on non-linear problems (Minsky & Papert's XOR problem); Multi-Layered Perceptrons (MLPs) and non-linear activation functions ($\text{Sigmoid}$, $\tanh$, $\text{ReLU}$); Softmax probability distribution and Cross-Entropy Loss; Chain Rule and Backpropagation ($\frac{\partial \mathcal{L}}{\partial W} = \frac{\partial \mathcal{L}}{\partial z}\frac{\partial z}{\partial W}$); Engineering a modular neural framework (`Linear`, `Tanh`/`ReLU`, `Softmax`, `CrossEntropyLoss`, `Net.forward()`, `Net.backward()`).
   - **Pyodide Sandbox**: Complete pure-Python modular 2-layer neural network framework training on the non-linear XOR problem via backpropagation.
   - **Colab Notebook**: `04-multi-layered-perceptron-and-own-framework.ipynb` (Building our own NumPy neural framework from scratch, decision boundary visualization, and integrated Lab: Training our custom framework on MNIST).
6. **Lesson 05 (`05-deep-learning-frameworks-and-overfitting`, `order: 6`, `xp: 75`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ai-for-beginners/04-multi-layered-perceptron-and-own-framework"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/3-NeuralNetworks/05-Frameworks/README.md`, `IntroPyTorch.ipynb`, `lab/LabFrameworks.ipynb`
   - **Content**: Why deep learning frameworks exist (GPU tensor acceleration & automatic differentiation); Computational graphs and PyTorch `autograd` (`requires_grad=True`, `.backward()`); PyTorch `nn.Module`, `nn.Sequential`, loss functions, and optimizers (`SGD`, `Adam`); Bias-Variance Trade-off, Underfitting vs Overfitting; Regularization techniques (Early Stopping, L2 Weight Decay, Dropout, Data Augmentation).
   - **Pyodide Sandbox**: Simulating gradient descent with L2 weight decay regularization ($\mathcal{L}_{\text{reg}} = \mathcal{L} + \frac{\lambda}{2}\|\mathbf{w}\|_2^2$) and comparing validation vs training loss curves.
   - **Colab Notebook**: `05-deep-learning-frameworks-and-overfitting.ipynb` (PyTorch Tensors, Autograd gradient descent, `nn.Module` classification, overfitting experiments, and integrated Lab: Solving classification problems with PyTorch).

### Module 3: Computer Vision (`category: "Module 3: Computer Vision"`)
7. **Lesson 06 (`06-introduction-to-computer-vision-and-opencv`, `order: 7`, `xp: 65`, `difficulty: "beginner"`)**:
   - **Prerequisites**: `["ai-for-beginners/05-deep-learning-frameworks-and-overfitting"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/06-IntroCV/README.md`, `OpenCV.ipynb`, `lab/MovementDetection.ipynb`
   - **Content**: Digital images as 3D tensors $(H \times W \times C)$; Color spaces (RGB, BGR, Grayscale, HSV); Classical image processing with OpenCV (resizing, cropping, affine transformations, histogram equalization, Gaussian blur, Canny edge detection, thresholding); Braille dot extraction; Video frame differencing for motion detection.
   - **Pyodide Sandbox**: Pure-Python grayscale conversion, histogram equalization, and frame-difference motion detection on synthetic image matrices.
   - **Colab Notebook**: `06-introduction-to-computer-vision-and-opencv.ipynb` (OpenCV image operations, Braille image preprocessing, and integrated Lab: Video Frame Differencing & Palm Movement Detection).
8. **Lesson 07 (`07-convolutional-neural-networks`, `order: 8`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ai-for-beginners/06-introduction-to-computer-vision-and-opencv"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/07-ConvNets/README.md`, `CNN_Architectures.md`, `ConvNetsPyTorch.ipynb`, `lab/PetFaces.ipynb`
   - **Content**: Why dense layers struggle with spatial invariance; 2D Convolution filters/kernels ($S(i,j) = (I * K)(i,j)$), Stride, Padding, and output dimension formula $O = \lfloor\frac{W - K + 2P}{S}\rfloor + 1$; Max and Average Pooling; Pyramid CNN hierarchy; Evolution of classic CNN architectures (LeNet-5, AlexNet, VGG-16, GoogLeNet Inception, ResNet skip connections $\mathcal{F}(\mathbf{x}) + \mathbf{x}$).
   - **Pyodide Sandbox**: Pure-Python 2D Convolution (`Conv2D` with vertical/horizontal Sobel edge kernels) + `MaxPool2D` spatial downsampling inspector.
   - **Colab Notebook**: `07-convolutional-neural-networks.ipynb` (Self-contained PyTorch CNN visualization, multi-filter MNIST/CIFAR training, and integrated Lab: Oxford-IIIT Pet Faces Classification with CNNs).
9. **Lesson 08 (`08-pretrained-networks-and-transfer-learning`, `order: 9`, `xp: 80`, `difficulty: "intermediate"`)**:
   - **Prerequisites**: `["ai-for-beginners/07-convolutional-neural-networks"]`
   - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/08-TransferLearning/README.md`, `TrainingTricks.md`, `TransferLearningPyTorch.ipynb`, `Dropout.ipynb`, `AdversarialCat_TF.ipynb`, `lab/OxfordPets.ipynb`
   - **Content**: ImageNet and pre-trained feature extractors (`torchvision.models`); Transfer Learning workflows (freezing convolutional backbones vs fine-tuning top layers); Deep Learning Training Tricks (Batch Normalization, Dropout, Learning Rate Schedulers, Data Augmentation); Adversarial attacks ($\mathbf{x}_{\text{adv}} = \mathbf{x} + \epsilon \cdot \text{sign}(\nabla_{\mathbf{x}}\mathcal{L})$) and model robustness.
   - **Pyodide Sandbox**: Batch Normalization ($\hat{x}_i = \frac{x_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}$) and Inverted Dropout simulator demonstrating activation variance stability.
   - **Colab Notebook**: `08-pretrained-networks-and-transfer-learning.ipynb` (VGG-16 / ResNet-18 feature extraction & fine-tuning on Cats-vs-Dogs, BatchNorm/Dropout experiments, Adversarial example generation in PyTorch, and integrated Lab: 37-Class Oxford Pets Transfer Learning).
10. **Lesson 09 (`09-autoencoders-and-vaes`, `order: 10`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/08-pretrained-networks-and-transfer-learning"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/09-Autoencoders/README.md`, `AutoEncodersPyTorch.ipynb`
    - **Content**: Self-supervised learning and Encoder–Latent Bottleneck–Decoder architecture; Reconstruction loss (MSE / Binary Cross-Entropy); Applications (Denoising Autoencoders, Anomaly Detection, Super-Resolution); Variational Autoencoders (VAEs): learning latent distributions $\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\sigma}^2)$, the Reparameterization Trick ($\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\epsilon}$), and ELBO loss (Reconstruction + Kullback-Leibler Divergence $D_{\text{KL}}$).
    - **Pyodide Sandbox**: Pure-Python VAE Reparameterization Trick and closed-form KL-Divergence loss calculator ($D_{\text{KL}} = -\frac{1}{2}\sum (1 + \log \sigma^2 - \mu^2 - \sigma^2)$).
    - **Colab Notebook**: `09-autoencoders-and-vaes.ipynb` (Dense & Convolutional Autoencoders, Denoising Autoencoder, and PyTorch Variational Autoencoder latent space sampling on MNIST).
11. **Lesson 10 (`10-gans-and-artistic-style-transfer`, `order: 11`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/09-autoencoders-and-vaes"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/10-GANs/README.md`, `GANPyTorch.ipynb`, `StyleTransfer.ipynb`
    - **Content**: Generative Adversarial Networks (Generator $G(\mathbf{z})$ vs Discriminator $D(\mathbf{x})$); Minimax two-player game $\min_G \max_D V(D,G) = \mathbb{E}[\log D(\mathbf{x})] + \mathbb{E}[\log(1 - D(G(\mathbf{z})))]$; DCGAN architecture (`ConvTranspose2d`); Mode Collapse and training instability; Neural Artistic Style Transfer (Content Loss vs Gram Matrix Style Loss $G_{ij}^l = \sum_k F_{ik}^l F_{jk}^l$).
    - **Pyodide Sandbox**: Pure-Python Gram Matrix style correlation calculator and minimax discriminator/generator loss evaluator.
    - **Colab Notebook**: `10-gans-and-artistic-style-transfer.ipynb` (PyTorch DCGAN image synthesis + VGG-based Neural Artistic Style Transfer optimization).
12. **Lesson 11 (`11-object-detection`, `order: 12`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/10-gans-and-artistic-style-transfer"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/11-ObjectDetection/README.md`, `ObjectDetectionPyTorch.ipynb`, `lab/README.md`
    - **Content**: Image Classification vs Localization vs Object Detection; Bounding Box parameterization $(x_{\min}, y_{\min}, x_{\max}, y_{\max})$; Evaluation Metrics: Intersection over Union ($\text{IoU} = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)}$), Precision, Recall, Average Precision ($\text{AP}$), and Mean Average Precision ($\text{mAP}$); Two-Stage Detectors (R-CNN, Fast R-CNN, Faster R-CNN Region Proposal Networks) vs One-Stage Detectors (YOLO grid cells, SSD, RetinaNet Focal Loss); Non-Maximum Suppression (NMS).
    - **Pyodide Sandbox**: Complete pure-Python Bounding Box $\text{IoU}$ and Non-Maximum Suppression (NMS) filter algorithm.
    - **Colab Notebook**: `11-object-detection.ipynb` (Sliding window naïve detection, PyTorch Faster R-CNN / RetinaNet inference, mAP evaluation, and integrated Lab: Counting & Detecting Objects in Complex Scenes).
13. **Lesson 12 (`12-semantic-segmentation-and-unet`, `order: 13`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/11-object-detection"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/4-ComputerVision/12-Segmentation/README.md`, `SemanticSegmentationPytorch.ipynb`, `lab/BodySegmentation.ipynb`
    - **Content**: Pixel-level classification (Semantic vs Instance vs Panoptic Segmentation); Fully Convolutional Networks (FCNs); U-Net Architecture (Contracting Encoder path, Expanding Decoder path, and Skip Concatenation connections preserving fine spatial borders); Pixel Cross-Entropy, Jaccard Index ($\text{IoU}$), and Sørensen–Dice Coefficient ($\text{Dice} = \frac{2|X \cap Y|}{|X| + |Y|}$); Medical imagery and human body segmentation.
    - **Pyodide Sandbox**: Pure-Python pixel mask evaluator computing Confusion Matrix, Pixel Accuracy, Intersection over Union ($\text{IoU}$), and Dice Loss.
    - **Colab Notebook**: `12-semantic-segmentation-and-unet.ipynb` (PyTorch U-Net architecture from scratch, Oxford Pet Mask / Shape segmentation training, and integrated Lab: Human Body Semantic Segmentation).

### Module 4: Natural Language Processing (`category: "Module 4: Natural Language Processing"`)
14. **Lesson 13 (`13-text-representation-bow-and-tfidf`, `order: 14`, `xp: 70`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["ai-for-beginners/12-semantic-segmentation-and-unet"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/13-TextRep/README.md`, `TextRepresentationPyTorch.ipynb`, `assignment.md`
    - **Content**: Character vs Word vs Subword Tokenization (ASCII, Unicode, UTF-8); Text normalization (lowercasing, stop-words, stemming vs lemmatization); Bag-of-Words (BoW) sparse vectors; N-Grams (bigrams, trigrams) for local phrase order; Term Frequency–Inverse Document Frequency ($\text{TF-IDF}(t,d) = \text{tf}(t,d) \times \log\frac{N}{1 + \text{df}(t)}$); AG News topic classification.
    - **Pyodide Sandbox**: Pure-Python Tokenizer, Bigram generator, and TF-IDF Document-Term Matrix builder with linear text classifier.
    - **Colab Notebook**: `13-text-representation-bow-and-tfidf.ipynb` (BoW, Bi-grams, and TF-IDF news classification with PyTorch & Scikit-Learn on AG News).
15. **Lesson 14 (`14-semantic-word-embeddings`, `order: 15`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/13-text-representation-bow-and-tfidf"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/14-Embeddings/README.md`, `EmbeddingsPyTorch.ipynb`, `assignment.md`
    - **Content**: Why sparse one-hot/BoW vectors fail to capture synonymy and high-dimensionality issues; Distributed dense semantic representations ($\mathbb{R}^d$); Cosine Similarity ($\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}$); Word2Vec intuition and vector arithmetic ($\mathbf{v}_{\text{king}} - \mathbf{v}_{\text{man}} + \mathbf{v}_{\text{woman}} \approx \mathbf{v}_{\text{queen}}$); GloVe (Global Vectors for Word Representation) and FastText subword embeddings; `nn.Embedding` lookup layers in PyTorch.
    - **Pyodide Sandbox**: Pure-Python Semantic Embedding Vector Space with Cosine Similarity search and Analogy Solver (`king - man + woman -> queen`).
    - **Colab Notebook**: `14-semantic-word-embeddings.ipynb` (PyTorch `nn.Embedding` classifier, pre-trained Word2Vec/GloVe exploration, and embedding space visualization with PCA/t-SNE).
16. **Lesson 15 (`15-language-modeling-and-custom-embeddings`, `order: 16`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/14-semantic-word-embeddings"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/15-LanguageModeling/README.md`, `CBoW-PyTorch.ipynb`, `lab/README.md`
    - **Content**: Self-supervised Language Modeling objective; Continuous Bag-of-Words (CBoW: predicting center word $w_t$ from context window $w_{t-C}, \dots, w_{t+C}$) vs Skip-Gram (predicting surrounding context words from center word $w_t$); Negative Sampling and Hierarchical Softmax efficiency; Training domain-specific Word2Vec embeddings in PyTorch.
    - **Pyodide Sandbox**: Pure-Python sliding-window CBoW and Skip-Gram training dataset generator + single-step embedding gradient update.
    - **Colab Notebook**: `15-language-modeling-and-custom-embeddings.ipynb` (Training CBoW and Skip-Gram Word2Vec models in PyTorch from scratch + integrated Lab: Custom Skip-Gram Embeddings andNearest-Neighbor Evaluation).
17. **Lesson 16 (`16-recurrent-neural-networks`, `order: 17`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/15-language-modeling-and-custom-embeddings"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/16-RNN/README.md`, `RNNPyTorch.ipynb`, `assignment.md`
    - **Content**: Modeling sequential dependencies across time steps; Simple RNN cell ($\mathbf{h}_t = \tanh(W_{hh}\mathbf{h}_{t-1} + W_{xh}\mathbf{x}_t + \mathbf{b})$); Backpropagation Through Time (BPTT) and the Vanishing / Exploding Gradient problem; Long Short-Term Memory (LSTM: Forget Gate $f_t$, Input Gate $i_t$, Cell State $c_t$, Output Gate $o_t$) and Gated Recurrent Units (GRU); Packed padded sequences and Bidirectional RNNs.
    - **Pyodide Sandbox**: Pure-Python Recurrent Neural Cell and Gated LSTM Step forward pass comparing short-term vs long-term memory retention across sequence steps.
    - **Colab Notebook**: `16-recurrent-neural-networks.ipynb` (PyTorch Simple RNN, LSTM, Bidirectional LSTM, and Packed Sequence text classifiers).
18. **Lesson 17 (`17-generative-recurrent-networks`, `order: 18`, `xp: 85`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/16-recurrent-neural-networks"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/17-GenerativeNetworks/README.md`, `GenerativePyTorch.ipynb`, `lab/README.md`
    - **Content**: Many-to-One vs Many-to-Many vs One-to-Many recurrent topologies; Autoregressive character-level and word-level text generation; Teacher Forcing during training; Sampling strategies: Greedy Decoding vs Multinomial Sampling with Temperature scaling ($P_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$) and Top-$k$ filtering.
    - **Pyodide Sandbox**: Pure-Python Autoregressive Text Generator with Temperature Scaling ($T \in \{0.2, 0.7, 1.5\}$) demonstrating deterministic vs creative token sampling.
    - **Colab Notebook**: `17-generative-recurrent-networks.ipynb` (Character-level and Word-level LSTM text generator in PyTorch with temperature sampling + integrated Lab: Creative Text Generation).
19. **Lesson 18 (`18-transformers-and-bert`, `order: 19`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ai-for-beginners/17-generative-recurrent-networks"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/18-Transformers/README.md`, `TransformersPyTorch.ipynb`, `assignment.md`
    - **Content**: Encoder–Decoder sequence bottleneck and why RNNs cannot parallelize across time; Attention is All You Need (2017): Queries ($Q$), Keys ($K$), Values ($V$), and Scaled Dot-Product Attention $\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V$; Multi-Head Attention, Positional Encoding ($\sin/\cos$), Residual LayerNorm; BERT (Bidirectional Encoder Representations from Transformers): Masked Language Modeling (MLM) & Next Sentence Prediction (NSP) with HuggingFace `transformers`.
    - **Pyodide Sandbox**: Pure-Python Scaled Dot-Product Self-Attention ($\text{softmax}(QK^{\top}/\sqrt{d_k})V$) and attention weight matrix inspector.
    - **Colab Notebook**: `18-transformers-and-bert.ipynb` (Implementing Multi-Head Self-Attention in PyTorch + Fine-Tuning Pre-Trained DistilBERT/BERT for Text Classification with HuggingFace `transformers`).
20. **Lesson 19 (`19-named-entity-recognition`, `order: 20`, `xp: 80`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/18-transformers-and-bert"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/19-NER/README.md`, `NER-TF.ipynb`, `lab/README.md`
    - **Content**: Token Classification and Named Entity Recognition (Persons, Organizations, Locations, Dates, Medical entities); BIO / IOB2 Tagging Schema (`B-PER`, `I-PER`, `B-LOC`, `O`); CoNLL-2003 dataset format; Architecture comparison: Bi-LSTM-CRF vs Transformer Token Classification (`AutoModelForTokenClassification`); Precision, Recall, and Entity-Level $F_1$ evaluation.
    - **Pyodide Sandbox**: Pure-Python BIO Span Extractor and Entity-Level Precision / Recall / $F_1$ evaluator handling multi-token entity boundaries.
    - **Colab Notebook**: `19-named-entity-recognition.ipynb` (Modern PyTorch + HuggingFace BERT Token Classification for NER, replacing legacy TensorFlow-only code, + integrated Lab: Medical & News Entity Extraction).
21. **Lesson 20 (`20-large-language-models-and-prompting`, `order: 21`, `xp: 90`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/19-named-entity-recognition"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/5-NLP/20-LangModels/README.md`, `GPT-PyTorch.ipynb`
    - **Content**: From task-specific fine-tuning (BERT) to Unsupervised Multitask Learners (GPT causal decoder-only architecture); Conditional next-token probability $P(w_N \mid w_0, \dots, w_{N-1})$; Intrinsic evaluation via Perplexity $\text{PPL}(W) = \sqrt[N]{\prod_{i=1}^N \frac{1}{P(w_i \mid w_{<i})}} = \exp\left(-\frac{1}{N}\sum_{i=1}^N \log P(w_i \mid w_{<i})\right)$; Zero-Shot, One-Shot, and Few-Shot In-Context Learning & Prompt Engineering; Local open-source generation with HuggingFace GPT-2 AND Cloud LLM prompting using **Google AI Studio Free Tier** (`google-genai` SDK with `GEMINI_API_KEY`).
    - **Pyodide Sandbox**: Pure-Python Language Model Perplexity ($\text{PPL}$) calculator and Few-Shot Prompt Template builder.
    - **Colab Notebook**: `20-large-language-models-and-prompting.ipynb` (Open-source GPT-2 causal generation & perplexity evaluation on Colab T4 + **Google AI Studio Free Tier** `gemini-2.5-flash` zero-shot and few-shot prompt engineering lab).

### Module 5: Alternative Paradigms & Ethics (`category: "Module 5: Alternative Paradigms & Ethics"`)
22. **Lesson 21 (`21-genetic-algorithms`, `order: 22`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/20-large-language-models-and-prompting"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/6-Other/21-GeneticAlgorithms/README.md`, `Diophantine.ipynb`, `Genetic.ipynb`
    - **Content**: Nature-inspired evolutionary search when gradients are unavailable; Chromosomes, Genes, Population, and Fitness Functions; Evolutionary operators: Selection (Tournament / Roulette Wheel), Crossover (Single-point / Uniform), and Mutation; Solving discrete Diophantine equations ($3a + 2b + 5c + d = 30$) and continuous multivariable function optimization.
    - **Pyodide Sandbox**: Complete pure-Python Genetic Algorithm evolving a population to solve the Diophantine equation with zero error in `< 50` generations.
    - **Colab Notebook**: `21-genetic-algorithms.ipynb` (Diophantine Equation solver + Continuous 2D Function & Knapsack Optimization with Genetic Algorithms).
23. **Lesson 22 (`22-deep-reinforcement-learning`, `order: 23`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ai-for-beginners/21-genetic-algorithms"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/6-Other/22-DeepRL/README.md`, `CartPole-RL-PyTorch.ipynb`, `notebook.ipynb`, `lab/MountainCar.ipynb`
    - **Content**: Reinforcement Learning formulation: Agent, Environment, State $s_t$, Action $a_t$, Reward $r_t$, and discounted cumulative return $G_t = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}$; Markov Decision Processes (MDPs) and the Bellman Equation $Q(s,a) \leftarrow (1-\alpha)Q(s,a) + \alpha\left[r + \gamma \max_{a'} Q(s',a')\right]$; Exploration vs Exploitation ($\epsilon$-greedy); From Tabular Q-Learning (Peter & the Wolf gridworld) to Deep Q-Networks (DQN) and Policy Gradients (REINFORCE) in `Gymnasium`.
    - **Pyodide Sandbox**: Pure-Python Tabular Q-Learning agent solving the Peter & the Wolf 2D gridworld (apple reward, wolf penalty) via the Bellman update rule.
    - **Colab Notebook**: `22-deep-reinforcement-learning.ipynb` (Peter & the Wolf Q-Learning, PyTorch Policy Gradient REINFORCE on `Gymnasium` CartPole-v1, and integrated Lab: Solving MountainCar with Shaping Rewards).
24. **Lesson 23 (`23-multi-agent-systems`, `order: 24`, `xp: 75`, `difficulty: "intermediate"`)**:
    - **Prerequisites**: `["ai-for-beginners/22-deep-reinforcement-learning"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/6-Other/23-MultiagentSystems/README.md`, `assignment.md`
    - **Content**: Decentralized Intelligence and Multi-Agent Systems (MAS); Taxonomy of agents (Reactive vs Deliberative BDI, Cooperative vs Competitive, Centralized vs Decentralized coordination); Emergent Behavior and Stigmergy (Ant Colony foraging, Craig Reynolds' Boids Flocking rules: Separation, Alignment, Cohesion, and Lotka-Volterra Predator–Prey ecosystems).
    - **Pyodide Sandbox**: Pure-Python Multi-Agent Boids / Foraging Simulation demonstrating emergent group alignment and resource clustering from local neighbor rules.
    - **Colab Notebook**: `23-multi-agent-systems.ipynb` (Python Multi-Agent Flocking, Ant Colony Pheromone Stigmergy, and Predator-Prey Ecosystem Simulation with Matplotlib animations).
25. **Lesson 24 (`24-ai-ethics-and-responsible-ai`, `order: 25`, `xp: 75`, `difficulty: "beginner"`)**:
    - **Prerequisites**: `["ai-for-beginners/23-multi-agent-systems"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/7-Ethics/README.md`
    - **Content**: Science-fiction myths vs mathematical reality of AI systems; The 6 Core Principles of Responsible AI (Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency & Interpretability, Accountability); Measuring Algorithmic Bias mathematically (Selection Rate, Demographic Parity Difference $\Delta_{\text{DP}}$, Disparate Impact Ratio $\text{DI} = \frac{P(\hat{Y}=1 \mid A=0)}{P(\hat{Y}=1 \mid A=1)}$, Equalized Odds); Open-source Responsible AI tooling (`Fairlearn`, `InterpretML`, and Counterfactual Explanations with `DiCE`).
    - **Pyodide Sandbox**: Pure-Python Algorithmic Fairness Auditor computing Selection Rates, Demographic Parity Difference, Disparate Impact Ratio (80% four-fifths rule), and False Negative Rate disparity across demographic groups.
    - **Colab Notebook**: `24-ai-ethics-and-responsible-ai.ipynb` (Auditing & Mitigating Model Bias with open-source `fairlearn` and Glass-Box Explainability with `interpret`).
26. **Lesson 25 (`25-multimodal-networks-clip-and-vqgan`, `order: 26`, `xp: 90`, `difficulty: "advanced"`)**:
    - **Prerequisites**: `["ai-for-beginners/24-ai-ethics-and-responsible-ai"]`
    - **Reference**: `.ref/AI-For-Beginners/lessons/X-Extras/X1-MultiModal/README.md`, `Clip.ipynb`
    - **Content**: Bridging Vision and Language in a shared embedding space; Contrastive Language-Image Pre-Training (CLIP): Image Encoder + Text Encoder trained via symmetric InfoNCE contrastive loss over $(N \times N)$ cosine similarity matrices; Zero-Shot Image Classification via text prompts (`"a photo of a {label}"`); Text-guided image generation (VQGAN + CLIP and open-source latent diffusion pipelines); Course 01 wrap-up and handoff to **Course 02: Data Science for Beginners**.
    - **Pyodide Sandbox**: Pure-Python CLIP Contrastive Cosine Similarity Matrix ($(N \times N)$ image-text logits) and Zero-Shot Prompt Classifier with softmax temperature scaling.
    - **Colab Notebook**: `25-multimodal-networks-clip-and-vqgan.ipynb` (Zero-Shot Image Classification, Image-Text Retrieval, and Open-Source Multimodal Synthesis with HuggingFace `CLIPModel` & `CLIPProcessor` on Colab T4 GPU).

---

## Verification & Quality Gates

1. **Automated Content & Sandbox Validator**:
   - Validate every `.mdx` frontmatter against `src/content.config.ts`.
   - Confirm each `.mdx` has `>= 350` words of prose, `<PythonRunner`, `<QuizCard`, markdown table headers (`| :---`), and `<ColabButton` (for the 25 notebook lessons).
   - Execute every `<PythonRunner />` `initialCode` snippet in Python 3 and verify `stdout.strip() == expectedOutput.strip()`.
   - Parse every `.ipynb` file in `notebook/ai-for-beginners/` as JSON (`nbformat == 4`) and scan for forbidden terms (`.ref/`, `Azure OpenAI`, `Microsoft Foundry`, `learn.microsoft.com`, `pytorchcv`, `torchnlp`).
2. **Build & Type Verification**:
   - `pnpm astro check` (0 errors, 0 warnings)
   - `pnpm build` (0 errors, static HTML generated for `/learn/ai-for-beginners/` and all 26 lessons)
3. **Accessibility & Design Token Verification**:
   - `uv run --with "buddhi-ai[MCP]" python .agents/skills/design-md/scripts/detect_design_md.py --lint`
   - `buddhi scripts verify-a11y` via `terminal-runner`

---

## Complexity Tracking

No `AGENTS.md` or `DESIGN.md` violations exist. Zero new npm dependencies or architectural layers are introduced.
