# 8-Course AI Engineering Curriculum Manifest (Courses 01–08)

> **Entry Prerequisite**: Course 00 — `python` (`src/content/lessons/python-zero-to-hero/`, 12 live lessons)  
> **Central Registry**: `src/lib/curriculum.ts`  
> **Notebook Convention**: `./notebook/<course_name>/<lesson_slug>.ipynb` linked via `<ColabButton course="<course_name>" notebook="<lesson_slug>.ipynb" runtime="..." />`  
> **Writing Style**: `.agents/skills/my-writing-style/SKILL.md`  
> **Attribution**: Never cite `.ref/` or upstream repos in lesson prose; all credits live in `ACKNOWLEDGEMENTS.md`.

---

## Course 01: AI for Beginners (`ai-for-beginners`)
- **Reference Repo**: `.ref/AI-For-Beginners/lessons/`
- **Notebooks**: `./notebook/ai-for-beginners/`
- **Connects From**: `python` (`python-zero-to-hero/12-installing-third-party-packages-with-pip`) → **Leads To**: `data-science-for-beginners`
- **Modules & Source Mapping**:
  1. **Foundations & Symbolic AI**: `1-Intro/README.md`, `2-Symbolic/README.md` (`Pyodide` + `Colab CPU`)
  2. **Neural Networks from Scratch**: `3-NeuralNetworks/03-Perceptron`, `04-OwnFramework`, `05-Frameworks` (`Pyodide` + `Colab CPU/T4 GPU` with `NumPy` & `PyTorch`)
  3. **Computer Vision**: `4-ComputerVision/06-IntroCV`, `07-ConvNets`, `08-TransferLearning`, `09-Autoencoders`, `10-GANs`, `11-ObjectDetection`, `12-Segmentation` (`Colab T4 GPU` with `PyTorch` & `OpenCV`)
  4. **Natural Language Processing**: `5-NLP/13-TextRep`, `14-Embeddings`, `15-LanguageModeling`, `16-RNN`, `17-GenerativeNetworks`, `18-Transformers`, `19-NER`, `20-LangModels` (`Colab T4 GPU` with `PyTorch` & `Transformers`)
  5. **Alternative Paradigms & Ethics**: `6-Other/21-GeneticAlgorithms`, `22-DeepRL`, `23-MultiagentSystems`, `7-Ethics/README.md`, `X-Extras/X1-MultiModal` (`Colab CPU/T4 GPU`)

## Course 02: Data Science for Beginners (`data-science-for-beginners`)
- **Reference Repo**: `.ref/Data-Science-For-Beginners/`
- **Notebooks**: `./notebook/data-science-for-beginners/`
- **Connects From**: `ai-for-beginners` → **Leads To**: `ml-for-beginners`
- **Modules & Source Mapping**:
  1. **Introduction & Statistics**: `1-Introduction/01-defining-data-science`, `02-ethics`, `03-defining-data`, `04-stats-and-probability`
  2. **Working with Data**: `2-Working-With-Data/05-relational-databases` (`sqlite3`), `06-non-relational` (`JSON/MongoDB` concepts), `07-python` (`Pandas`), `08-data-preparation`
  3. **Data Visualization**: `3-Data-Visualization/09-visualization-quantities`, `10-visualization-distributions`, `11-visualization-proportions`, `12-visualization-relationships`, `13-meaningful-visualizations` (`Matplotlib` / `Seaborn`)
  4. **Data Science Lifecycle & Cloud Alternatives**: `4-Data-Science-Lifecycle/14-Introduction`, `15-analyzing`, `16-communication`, `5-Data-Science-In-Cloud/17-Introduction`, `18-Low-Code`, `19-Azure` (adapted to **Google Colab + HuggingFace/Gradio + Scikit-Learn**), `6-Data-Science-In-Wild/20-Real-World-Examples`

## Course 03: ML for Beginners (`ml-for-beginners`)
- **Reference Repo**: `.ref/ML-For-Beginners/ML-For-Beginners-main/`
- **Notebooks**: `./notebook/ml-for-beginners/`
- **Connects From**: `data-science-for-beginners` → **Leads To**: `generative-ai-for-beginners`
- **Modules & Source Mapping**:
  1. **ML Foundations**: `1-Introduction/1-intro-to-ML`, `2-history-of-ML`, `3-fairness`, `4-techniques-of-ML`
  2. **Regression & Web Deployment**: `2-Regression/1-Tools`, `2-Data`, `3-Linear`, `4-Logistic`, `3-Web-App/1-Web-App` (`Scikit-Learn` + `Gradio/FastAPI`)
  3. **Classification & Clustering**: `4-Classification/1-Introduction`..`4-Applied`, `5-Clustering/1-Visualize`, `2-K-Means`
  4. **Classical NLP & Time Series**: `6-NLP/1-Introduction-to-NLP`..`5-Hotel-Reviews-2`, `7-TimeSeries/1-Introduction`..`3-SVR` (`statsmodels`, `Scikit-Learn`)
  5. **Reinforcement Learning & Real-World ML**: `8-Reinforcement/1-QLearning`, `2-Gym`, `9-Real-World/1-Applications`, `2-Debugging-ML-Models`

## Course 04: Generative AI for Beginners (`generative-ai-for-beginners`)
- **Reference Repo**: `.ref/generative-ai-for-beginners/`
- **Notebooks**: `./notebook/generative-ai-for-beginners/`
- **Connects From**: `ml-for-beginners` → **Leads To**: `mcp-for-beginners`
- **Cloud/API Replacement**: Replace Azure OpenAI / GitHub Models with **Google AI Studio Free Tier** (`google-genai`, `GEMINI_API_KEY` guide) and open-source models (`HuggingFace`, `ChromaDB`, `PEFT/LoRA`).
- **Modules & Source Mapping**:
  1. **GenAI Setup & Foundations**: `00-course-setup` (Google AI Studio API Key Guide + Colab Setup), `01-introduction-to-genai`, `02-exploring-and-comparing-different-llms`, `03-using-generative-ai-responsibly`
  2. **Prompting & Text Apps**: `04-prompt-engineering-fundamentals`, `05-advanced-prompts`, `06-text-generation-apps`, `07-building-chat-applications`
  3. **Search, RAG & Function Calling**: `08-building-search-applications`, `11-integrating-with-function-calling`, `15-rag-and-vector-databases` (`ChromaDB` / `FAISS` + Gemini Embeddings)
  4. **Multimodal, UX, Security & Lifecycle**: `09-building-image-applications` (open-source Diffusers / Gemini Imagen), `10-building-low-code-ai-applications`, `12-designing-ux-for-ai-applications`, `13-securing-ai-applications`, `14-the-generative-ai-application-lifecycle`
  5. **Open-Source Models, Fine-Tuning & SLMs**: `16-open-source-models`, `17-ai-agents`, `18-fine-tuning` (`PEFT`/`LoRA` on Colab T4), `19-slm`, `20-mistral`, `21-meta`

## Course 05: MCP for Beginners (`mcp-for-beginners`)
- **Reference Repo**: `.ref/mcp-for-beginners/`
- **Notebooks**: `./notebook/mcp-for-beginners/`
- **Connects From**: `generative-ai-for-beginners` → **Leads To**: `ai-agents-for-beginners`
- **Cloud/API Replacement**: Replace Azure Content Safety / Azure Container Apps / Foundry Agent Integration with open-source `mcp` Python SDK, `FastMCP`, `google-genai` LLM host client, and local/Colab `stdio` & Streamable HTTP transports.
- **Modules & Source Mapping**:
  1. **Introduction, Core Concepts & Security**: `00-Introduction`, `01-CoreConcepts`, `02-Security`
  2. **Getting Started**: `03-GettingStarted/01-first-server`..`15-mcp-apps` (servers, clients, LLM host with Gemini, stdio, HTTP streaming, testing, auth, Inspector, sampling)
  3. **Practical & Advanced Topics**: `04-PracticalImplementation`, `05-AdvancedTopics` (context engineering, root contexts, routing, sampling, scaling, security)
  4. **Best Practices, Case Studies & Hands-On Labs**: `06-CommunityContributions`, `07-LessonsfromEarlyAdoption`, `08-BestPractices`, `09-CaseStudy`, `11-MCPServerHandsOnLabs`

## Course 06: AI Agents for Beginners (`ai-agents-for-beginners`)
- **Reference Repo**: `.ref/ai-agents-for-beginners/ai-agents-for-beginners-main/`
- **Notebooks**: `./notebook/ai-agents-for-beginners/`
- **Connects From**: `mcp-for-beginners` → **Leads To**: `harness-engineering`
- **Cloud/API Replacement**: Replace Azure AI Foundry / Azure AI Search with `google-genai` (`GEMINI_API_KEY`), `LangGraph` / pure Python ReAct loops, `ChromaDB`, and `MCP` tools.
- **Modules & Source Mapping**:
  1. **Agent Foundations & Frameworks**: `00-course-setup`, `01-intro-to-ai-agents`, `02-explore-agentic-frameworks`, `03-agentic-design-patterns`, `04-tool-use`
  2. **RAG, Trust & Planning**: `05-agentic-rag`, `06-building-trustworthy-agents`, `07-planning-design`
  3. **Multi-Agent, Metacognition & Protocols**: `08-multi-agent`, `09-metacognition`, `11-agentic-protocols` (`MCP` & `A2A`)
  4. **Context, Memory, Browser Use & Production**: `12-context-engineering`, `13-agent-memory`, `15-browser-use`, `10-ai-agents-production`, `16-deploying-scalable-agents`, `17-creating-local-ai-agents` (Ollama/Colab), `18-securing-ai-agents`

## Course 07: Harness Engineering (`harness-engineering`)
- **Reference Repo**: `.ref/learn-harness-engineering/learn-harness-engineering-main/docs/en/`
- **Notebooks**: `./notebook/harness-engineering/`
- **Connects From**: `ai-agents-for-beginners` → **Leads To**: `edge-ai-for-beginners`
- **Modules & Source Mapping**:
  1. **Why Agents Fail & Harness Anatomy**: `lectures/lecture-01`..`lecture-02`, `projects/project-01`
  2. **Repo as System of Record & Modular Instructions**: `lectures/lecture-03`..`lecture-04`, `projects/project-02`
  3. **Multi-Session Continuity, Scope & Feature Lists**: `lectures/lecture-05`..`lecture-08`, `projects/project-03`..`project-04`
  4. **Verification Gates, Observability & Clean Handoffs**: `lectures/lecture-09`..`lecture-12`, `projects/project-05`..`project-06`
  5. **Loop Engineering, Graph Engineering & Frontier Breakdowns**: `lectures/lecture-13`..`lecture-14`, `projects/project-07`..`project-08`, `harness-designs/` (`claude-code`, `codex`, `deepseek`, `pi`)

## Course 08: Edge AI for Beginners (`edge-ai-for-beginners`)
- **Reference Repo**: `.ref/edgeai-for-beginners/edgeai-for-beginners-main/`
- **Notebooks**: `./notebook/edge-ai-for-beginners/`
- **Connects From**: `harness-engineering` → **Capstone Completion**
- **Cloud/API Replacement**: Replace Microsoft Foundry Local / Azure AI Foundry / Olive-only steps with open-source `llama.cpp`, `GGUF`, `HuggingFace Transformers`, `bitsandbytes`, `ONNX Runtime`, `OpenVINO`, and `Ollama` on Colab Free T4 GPU & local machines.
- **Modules & Source Mapping**:
  1. **Edge AI & SLM Families**: `Module01` (Fundamentals, Case Studies, Edge Deployment), `Module02` (`Phi`, `Qwen`, `Gemma`, `BitNet`)
  2. **Local & Cloud SLM Deployment**: `Module03` (`SLMAdvancedLearning`, `DeployingSLMinLocalEnv`, `DeployingSLMinCloud`)
  3. **Quantization & Runtimes**: `Module04` (`Introduce`, `Llamacpp`, `OpenVINO`, `AppleMLX`, `WorkflowSynthesis`)
  4. **SLMOps, Distillation & Fine-Tuning**: `Module05` (`IntroduceSLMOps`, `Distillation`, `Finetuning`, `Deployment`)
  5. **Edge Agents, MCP & Capstone Workshops**: `Module06` (`IntroduceAgent`, `FunctionCalling`, `IntroduceMCP`), `Workshop/` & `WorkshopForAgentic/`
