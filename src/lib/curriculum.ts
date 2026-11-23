import type { CollectionEntry } from 'astro:content';

export type RuntimeBadge =
  | 'In-Browser Pyodide'
  | 'Colab Free CPU'
  | 'Colab Free T4 GPU'
  | 'Google AI Studio Free Tier';

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export interface CourseMeta {
  order: number;
  stepCode: string;
  track: string;
  shortLabel: string;
  title: string;
  folder: string;
  notebookFolder?: string;
  plannedLessonCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  runtimeBadges: RuntimeBadge[];
  usesGeminiApi: boolean;
  prerequisiteTrack: string | null;
  nextTrack: string | null;
  summary: string;
  pedagogyFocus: string;
  syllabusModules: SyllabusModule[];
}

export const CURRICULUM_COURSES: CourseMeta[] = [
  {
    order: 0,
    stepCode: '00',
    track: 'python',
    shortLabel: '00 Python',
    title: 'Python Zero to Hero',
    folder: 'python-zero-to-hero',
    plannedLessonCount: 12,
    difficulty: 'Beginner',
    runtimeBadges: ['In-Browser Pyodide'],
    usesGeminiApi: false,
    prerequisiteTrack: null,
    nextTrack: 'ai-for-beginners',
    summary:
      'Master Python syntax, control flow, data structures, functions, OOP, file I/O, and package management directly in your browser.',
    pedagogyFocus: 'Core programming fluency before touching matrices, models, or APIs.',
    syllabusModules: [
      {
        title: 'Python Fundamentals & Control Flow',
        topics: [
          'Setting Up Python & First Script',
          'Variables, Types & Expressions',
          'Strings & Text Formatting',
          'Conditionals & Loops',
        ],
      },
      {
        title: 'Data Structures, Functions & Modules',
        topics: [
          'Lists, Tuples, Sets & Dictionaries',
          'Functions, Scope & Modules',
          'Error Handling & Exceptions',
          'Object-Oriented Programming',
          'File I/O & Pip Package Management',
        ],
      },
    ],
  },
  {
    order: 1,
    stepCode: '01',
    track: 'ai-for-beginners',
    shortLabel: '01 AI Intro',
    title: 'AI for Beginners',
    folder: 'ai-for-beginners',
    notebookFolder: 'ai-for-beginners',
    plannedLessonCount: 26,
    difficulty: 'Beginner',
    runtimeBadges: [
      'In-Browser Pyodide',
      'Colab Free CPU',
      'Colab Free T4 GPU',
      'Google AI Studio Free Tier',
    ],
    usesGeminiApi: true,
    prerequisiteTrack: 'python',
    nextTrack: 'data-science-for-beginners',
    summary:
      'Build intuition across symbolic AI, perceptrons, backpropagation from scratch, PyTorch, computer vision CNNs, NLP Transformers, LLMs, RL, and AI ethics.',
    pedagogyFocus: 'Write neural nets from scratch in NumPy before scaling up with PyTorch and Transformers.',
    syllabusModules: [
      {
        title: 'Module 1: Symbolic AI & Foundations',
        topics: [
          'Course Setup, Colab & Google AI Studio Free Tier',
          'History of AI & Turing Test',
          'Knowledge Representation, Ontologies & Expert Systems',
        ],
      },
      {
        title: 'Module 2: Neural Networks from Scratch',
        topics: [
          'The Perceptron & Multi-Class Classification',
          'Multi-Layered Perceptrons & Own Neural Framework',
          'PyTorch Autograd & Controlling Overfitting',
        ],
      },
      {
        title: 'Module 3: Computer Vision',
        topics: [
          'OpenCV Image Processing & Motion Detection',
          'Convolutional Neural Networks (CNNs) & Transfer Learning',
          'Autoencoders, VAEs, GANs & Style Transfer',
          'Object Detection (R-CNN, YOLO) & U-Net Segmentation',
        ],
      },
      {
        title: 'Module 4: Natural Language Processing',
        topics: [
          'Bag-of-Words, TF-IDF & Word Embeddings (Word2Vec/GloVe)',
          'Language Modeling, RNNs, LSTMs & Generative Text',
          'Attention, Transformers, BERT & Named Entity Recognition',
          'Large Language Models, Perplexity & Gemini API Prompting',
        ],
      },
      {
        title: 'Module 5: Alternative Paradigms & Ethics',
        topics: [
          'Genetic Algorithms & Deep Reinforcement Learning',
          'Multi-Agent Systems & AI Ethics (Fairlearn / InterpretML)',
          'Multimodal Networks: CLIP & VQGAN',
        ],
      },
    ],
  },
  {
    order: 2,
    stepCode: '02',
    track: 'data-science-for-beginners',
    shortLabel: '02 Data Science',
    title: 'Data Science for Beginners',
    folder: 'data-science-for-beginners',
    notebookFolder: 'data-science-for-beginners',
    plannedLessonCount: 20,
    difficulty: 'Beginner',
    runtimeBadges: [
      'In-Browser Pyodide',
      'Colab Free CPU',
      'Google AI Studio Free Tier',
    ],
    usesGeminiApi: true,
    prerequisiteTrack: 'ai-for-beginners',
    nextTrack: 'ml-for-beginners',
    summary:
      'Learn data ethics, probability, SQLite & JSON data wrangling, Pandas data cleaning, exploratory visualization, and open-source cloud AutoML pipelines.',
    pedagogyFocus: 'Clean, inspect, and visualize raw data before feeding it to any model.',
    syllabusModules: [
      {
        title: 'Module 1: Data Foundations & Statistics',
        topics: [
          'Defining Data Science, Paradigms & Colab Setup',
          'Data Science Ethics, Privacy & Governance',
          'Quantitative, Qualitative & Structural Data Taxonomies',
          'Statistics, Probability, Confidence Intervals & Hypothesis Testing',
        ],
      },
      {
        title: 'Module 2: Working with Data',
        topics: [
          'Relational Databases & SQL Joins in Python',
          'Non-Relational Data, Spreadsheets & JSON Document Stores',
          'Python Series, Pandas DataFrames & Text Extraction',
          'Data Preparation, Missing Values & Deduplication',
        ],
      },
      {
        title: 'Module 3: Data Visualization',
        topics: [
          'Visualizing Quantities with Matplotlib',
          'Visualizing Distributions with Histograms & Seaborn KDE',
          'Visualizing Proportions: Pie, Donut & Waffle Charts',
          'Visualizing Relationships & Meaningful Anti-Deception Charts',
        ],
      },
      {
        title: 'Module 4: Data Science Lifecycle & Cloud Alternatives',
        topics: [
          'Data Science Lifecycle: Capturing, Analyzing & Storytelling',
          'Cloud Data Science with Google Colab & Gemini API',
          'Low-Code AutoML, Gradio, Scikit-Learn Pipelines & MLflow',
          'Data Science in the Wild: Industry, Research & Sustainability',
        ],
      },
    ],
  },
  {
    order: 3,
    stepCode: '03',
    track: 'ml-for-beginners',
    shortLabel: '03 Machine Learning',
    title: 'ML for Beginners',
    folder: 'ml-for-beginners',
    notebookFolder: 'ml-for-beginners',
    plannedLessonCount: 27,
    difficulty: 'Intermediate',
    runtimeBadges: ['In-Browser Pyodide', 'Colab Free CPU', 'Google AI Studio Free Tier'],
    usesGeminiApi: true,
    prerequisiteTrack: 'data-science-for-beginners',
    nextTrack: 'generative-ai-for-beginners',
    summary:
      'Master classical machine learning with Scikit-Learn: regression, web deployment, SMOTE classification, ONNX, K-Means clustering, classical NLP, ARIMA/SVR time series, Q-Learning, and model debugging.',
    pedagogyFocus: 'Establish strong classical baselines, evaluation metrics, and Responsible AI debugging discipline.',
    syllabusModules: [
      {
        title: 'Module 1: ML Foundations, History, Fairness & Techniques',
        topics: [
          'Introduction to Machine Learning & Colab Setup',
          'History of Machine Learning: Bayes to Modern ML',
          'Fairness & Responsible ML Audits with Fairlearn',
          '7-Step ML Workflow, Splits & Overfitting',
        ],
      },
      {
        title: 'Module 2: Regression Models & Web App Deployment',
        topics: [
          'Scikit-Learn Regression Tools (Diabetes Dataset)',
          'Preparing & Visualizing Pumpkin Market Data',
          'Linear & Polynomial Regression Four Ways',
          'Logistic Regression, Confusion Matrices & ROC-AUC',
          'Web App Deployment with Pickle, Flask, FastAPI & Gradio',
        ],
      },
      {
        title: 'Module 3: Classification & Unsupervised Clustering',
        topics: [
          'Asian & Indian Cuisines Classification with SMOTE',
          'Multiclass Logistic Regression & Solvers (OvR vs Multinomial)',
          'Comparing Linear SVC, KNN, SVM, Random Forest & AdaBoost',
          'Cuisine Recommender Export with skl2onnx & ONNX Runtime',
          'Clustering Taxonomies & Visualizing Nigerian Music Tastes',
          'K-Means Clustering, Silhouette Score & WCSS Elbow Method',
        ],
      },
      {
        title: 'Module 4: Classical NLP & Time Series Forecasting',
        topics: [
          'Intro to NLP: Turing Test, ELIZA & Marvin the Bot',
          'Common NLP Tasks, N-Grams & Noun Phrases with TextBlob',
          'Translation & Sentiment Analysis with TextBlob & Gemini API',
          'Exploring 515K European Hotel Reviews (EDA & Vectorization)',
          'Hotel Reviews Tag Filtering, NLTK VADER & Gemini Sarcasm Audit',
          'Time Series Forecasting & GEFCom2014 Power Usage Data',
          'ARIMA & SARIMAX Walk-Forward Validation & MAPE',
          'Support Vector Regressor (SVR) & Sliding Time-Steps',
        ],
      },
      {
        title: 'Module 5: Reinforcement Learning & Real-World ML',
        topics: [
          'Reinforcement Learning & Q-Learning (Peter and the Wolf)',
          'Continuous-State CartPole Balancing with Gymnasium',
          'Real-World Classical ML Across 8 Industries',
          'Debugging ML Models: Cohort Error Analysis, Fairlearn & SHAP',
        ],
      },
    ],
  },
  {
    order: 4,
    stepCode: '04',
    track: 'generative-ai-for-beginners',
    shortLabel: '04 GenAI',
    title: 'Generative AI for Beginners',
    folder: 'generative-ai-for-beginners',
    notebookFolder: 'generative-ai-for-beginners',
    plannedLessonCount: 22,
    difficulty: 'Intermediate',
    runtimeBadges: [
      'In-Browser Pyodide',
      'Google AI Studio Free Tier',
      'Colab Free T4 GPU',
      'Colab Free CPU',
    ],
    usesGeminiApi: true,
    prerequisiteTrack: 'ml-for-beginners',
    nextTrack: 'mcp-for-beginners',
    summary:
      'Build production LLM applications using Google AI Studio Free Tier (Gemini API), prompt engineering, function calling, ChromaDB/FAISS RAG, Gradio low-code apps, and LoRA fine-tuning.',
    pedagogyFocus: 'Ground LLM outputs with retrieval, structured schemas, safety layers, and open-source fine-tuning.',
    syllabusModules: [
      {
        title: 'Module 1: GenAI Setup & Foundations',
        topics: [
          'Google AI Studio Free API Key & Colab Setup',
          'Generative AI, Transformers, Tokenization & Temperature',
          'Comparing LLMs, Architectures & Adaptation Hierarchy',
          'Responsible GenAI & 4-Layer Safety Architecture',
        ],
      },
      {
        title: 'Module 2: Prompt Engineering & Text/Chat Applications',
        topics: [
          'Prompt Engineering Fundamentals & Token Counting',
          'Advanced Prompts: CoT, Few-Shot, Self-Refine & Maieutic',
          'Text Generation Apps: Recipe Chainer, History Bot & Study Buddy',
          'Chat Apps: System Message Framework & Perplexity/Cosine Metrics',
        ],
      },
      {
        title: 'Module 3: Semantic Search, RAG & Function Calling',
        topics: [
          'Semantic Video Search with Embeddings & Cosine Similarity',
          'Integrating External APIs with Function Calling & Schemas',
          'RAG & Vector Databases (BallTree, ChromaDB & MAP Evaluation)',
        ],
      },
      {
        title: 'Module 4: Multimodal Apps, Low-Code UI, AI UX, Security & LLMOps',
        topics: [
          'Image Generation, Mask Inpainting & Child-Safe Metaprompts',
          'Low-Code AI Apps with Gradio, SQLite & Multimodal Gemini',
          'Designing Trust-Calibrated, Persona-Aware AI UX',
          'Securing AI Apps: Data Poisoning, OWASP LLM & Red-Teaming',
          'The GenAI Application Lifecycle & 5-Metric LLMOps',
        ],
      },
      {
        title: 'Module 5: Open-Source Models, AI Agents, LoRA Fine-Tuning & SLMs',
        topics: [
          'Open-Source vs. Open-Weight Models, MQA & Sparse MoE',
          'AI Agents, Sequential/Concurrent Workflows & JARVIS DAGs',
          'Fine-Tuning LLMs with LoRA/QLoRA on Colab T4 GPU',
          'Small Language Models (Instruct, Vision Keyframes, MoE & ONNX)',
          'Mistral Models: Cross-Language FAISS RAG & Tekken Tokenizer',
          'Meta Llama Herd: Native Tool Calling & Multimodal Vision',
        ],
      },
    ],
  },
  {
    order: 5,
    stepCode: '05',
    track: 'mcp-for-beginners',
    shortLabel: '05 MCP',
    title: 'MCP for Beginners',
    folder: 'mcp-for-beginners',
    notebookFolder: 'mcp-for-beginners',
    plannedLessonCount: 22,
    difficulty: 'Intermediate',
    runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU'],
    usesGeminiApi: true,
    prerequisiteTrack: 'generative-ai-for-beginners',
    nextTrack: 'ai-agents-for-beginners',
    summary:
      'Learn the Model Context Protocol (MCP) from the 2026-07-28 stateless specification and OWASP security to FastMCP servers, Gemini LLM hosts, OAuth 2.1, reliability sidecars, and the Zava Retail vector-search database capstone.',
    pedagogyFocus: 'Standardize how models discover and invoke external tools, resources, and prompts.',
    syllabusModules: [
      {
        title: 'Module 1: MCP Foundations, Specification 2026-07-28 & Security',
        topics: [
          'Introduction to MCP, Two-Layer Architecture & Google AI Studio Setup',
          'Core Concepts: Hosts, Clients, Primitives, Tool Annotations & JSON-RPC 2.0',
          'MCP 2026-07-28: Stateless Requests, Multi-Round-Trip Elicitation & Extensions',
          'MCP Security: OWASP MCP Top 10, Tool Poisoning, Spotlighting & CIMD vs. DCR',
        ],
      },
      {
        title: 'Module 2: Building MCP Servers, Clients, Gemini Hosts & Transports',
        topics: [
          'Building Your First MCP Server with FastMCP & Polyglot SDK Comparison',
          'Building MCP Clients & Autonomous Gemini 2.5 Flash LLM Hosts',
          'stdio Subprocess Isolation vs. Stateless Streamable HTTP & SSE Transports',
          'Testing, Protocol Conformance & Debugging with MCP Inspector',
          'Simple Auth, RBAC Middleware, IDE Hosts (VS Code/Claude/Cursor) & Docker',
          'Client Sampling Migration & Interactive Sandboxed MCP Apps (SEP-1865)',
        ],
      },
      {
        title: 'Module 3: Practical Implementation, Pagination & Protocol Features',
        topics: [
          'Practical SDK Workflows & Open-Source FastAPI MCP Reverse-Proxy Gateways',
          'Cursor-Based Pagination, Base64 Cursors & ttlMs List Caching',
          'Progress Notifications, Cooperative Cancellation, RFC 6570 Templates & Tasks',
        ],
      },
      {
        title: 'Module 4: Advanced Topics: Multi-Modal, OAuth 2.1, Context Engineering & Debate Agents',
        topics: [
          'Multi-Modal MCP Workflows, Realtime Streaming & Web Search Orchestration',
          'Enterprise OAuth 2.1, S256 PKCE, JWKS Verification & RFC 9207 Hardening',
          'Context Engineering, Token Packing & Root/Sampling Migration',
          'MCP Routing, Horizontal Scaling, Custom Transports & Adversarial Debate Agents',
        ],
      },
      {
        title: 'Module 5: Best Practices, Case Studies & Zava Retail Database Capstone Labs',
        topics: [
          'Community SEPs, Early Adopter Architectures & SQLite Reliability Sidecars',
          'Real-World Case Studies, Workshops & Safe Write-Capable MCP Servers',
          'Zava Retail Capstone (Part 1): 4-Layer Architecture & Multi-Tenant RLS Schema',
          'Zava Retail Capstone (Part 2): FastMCP Introspection & Hybrid Semantic Search',
          'Zava Retail Capstone (Part 3): Security Testing, OpenTelemetry & Optimization',
        ],
      },
    ],
  },
  {
    order: 6,
    stepCode: '06',
    track: 'ai-agents-for-beginners',
    shortLabel: '06 AI Agents',
    title: 'AI Agents for Beginners',
    folder: 'ai-agents-for-beginners',
    notebookFolder: 'ai-agents-for-beginners',
    plannedLessonCount: 19,
    difficulty: 'Advanced',
    runtimeBadges: [
      'In-Browser Pyodide',
      'Google AI Studio Free Tier',
      'Colab Free CPU',
      'Colab Free T4 GPU',
    ],
    usesGeminiApi: true,
    prerequisiteTrack: 'mcp-for-beginners',
    nextTrack: 'harness-engineering',
    summary:
      'Design autonomous agentic systems: 7 agent taxonomies, tool use & MCP tools, Agentic RAG, planning & multi-agent topologies, metacognition, context engineering, Mem0/Cognee memory, LangGraph workflows, computer use, Ollama local SLMs, and Ed25519 cryptographic receipts.',
    pedagogyFocus: 'Move from single-turn prompts to bounded, observable, cryptographically verifiable multi-step agent loops.',
    syllabusModules: [
      {
        title: 'Module 1: Agent Foundations, Frameworks & Core Design Patterns',
        topics: [
          'Course Setup: Google AI Studio Free Tier, Colab & Open-Source Stack',
          'Introduction to AI Agents, Sensors/Actuators & 7 Agent Taxonomies',
          'Exploring Agentic Frameworks: Modular SDKs vs. Stateful Runtimes',
          'AI Agentic Design Principles: Space, Time & Core Uncertainty',
        ],
      },
      {
        title: 'Module 2: Tool Use, Agentic RAG & Trustworthy Agents',
        topics: [
          'Tool Use Design Pattern: Function Schemas, MCP Tools & Read-Only SQL',
          'Agentic RAG: Iterative Maker-Checker Loops & Query Self-Correction',
          'Building Trustworthy AI Agents: Meta Prompts, Threats & HITL Gates',
        ],
      },
      {
        title: 'Module 3: Planning, Multi-Agent Systems, Metacognition & Production Observability',
        topics: [
          'Planning Design Pattern: Pydantic Decomposition & Iterative Re-Planning',
          'Multi-Agent Design Patterns: Group Chat, Handoff & 15-Agent Topologies',
          'Metacognition in AI Agents: Self-Reflection, Corrective RAG & SQL RAG',
          'AI Agents in Production: OpenTelemetry, Eval Loops & Cost Routing',
        ],
      },
      {
        title: 'Module 4: Agentic Protocols, Context Engineering, Memory & Graph Workflows',
        topics: [
          'Using Agentic Protocols: MCP, Agent-to-Agent (A2A) & NLWeb',
          'Context Engineering: Scratchpads, Inspection & 4 Failure Mitigations',
          'Managing Agentic Memory: Mem0 Two-Phase & Cognee Knowledge Graphs',
          'Open-Source Agent Workflows, Middleware, LangGraph & /responses Hosting',
        ],
      },
      {
        title: 'Module 5: Computer Use, Scalable Deployment, Local SLM Agents & Cryptographic Security',
        topics: [
          'Building Computer Use Agents (CUA): Browser-Use, Playwright & Guardrails',
          'Deploying Scalable Agents: Routing, Caching, Eval Gates & Smoke Tests',
          'Creating Local AI Agents with Ollama, Qwen2.5 & Sandboxed RAG',
          'Securing AI Agents with RFC 8785 JCS & Ed25519 Cryptographic Receipts',
        ],
      },
    ],
  },
  {
    order: 7,
    stepCode: '07',
    track: 'harness-engineering',
    shortLabel: '07 Harnesses',
    title: 'Harness Engineering',
    folder: 'harness-engineering',
    notebookFolder: 'harness-engineering',
    plannedLessonCount: 24,
    difficulty: 'Advanced',
    runtimeBadges: ['In-Browser Pyodide', 'Google AI Studio Free Tier', 'Colab Free CPU'],
    usesGeminiApi: true,
    prerequisiteTrack: 'ai-agents-for-beginners',
    nextTrack: 'edge-ai-for-beginners',
    summary:
      'Engineer reliable AI coding environments around models: 5-subsystem harnesses, modular AGENTS.md/GEMINI.md rules, session continuity, feature-list pass gating, verification & observability, autonomous loops, multi-agent graphs, and Google Antigravity + frontier harness architectures.',
    pedagogyFocus: 'Strong models fail without a harness; control state, scope, verification, and autonomous loops.',
    syllabusModules: [
      {
        title: 'Module 1: Harness Anatomy & Foundations',
        topics: [
          'Why Capable Agents Still Fail & The 5-Layer Diagnostic Loop',
          'The 5-Subsystem Harness Model (Instructions, Tools, Environment, State, Feedback)',
          'Project 01: Prompt-Only vs. Rules-First Knowledge Base Harness',
        ],
      },
      {
        title: 'Module 2: System of Record & Modular Instructions',
        topics: [
          'Repository as System of Record, Fresh Session Test & ACID State',
          'Splitting Instructions, Lost in the Middle & Antigravity Progressive Disclosure',
          'Project 02: Agent-Readable Workspace & Cross-Session Handoffs',
        ],
      },
      {
        title: 'Module 3: Continuity, Scope & Feature Lists',
        topics: [
          'Multi-Session Continuity, Context Anxiety & Compaction vs. Reset',
          'Dedicated Initialization Phase & Antigravity SessionStart Hooks',
          'Task Boundaries, Little’s Law & WIP=1 Scope Control',
          'Feature Lists as Pass-Gated Harness Primitives',
          'Project 03: Multi-Session RAG Continuity & Pass-State Gating',
          'Project 04: Structured Runtime Feedback & Architectural Boundary Guards',
        ],
      },
      {
        title: 'Module 4: Verification Gates, Observability & Clean State',
        topics: [
          'Preventing Premature Victory, Calibration Bias & Antigravity Stop Hooks',
          'End-to-End Verification, Agent-Oriented Errors & Review Feedback Promotion',
          'Project 05: Planner-Generator-Evaluator Role Separation Ablation',
          'Runtime & Process Observability (Sprint Contracts, Rubrics & OpenTelemetry)',
          'Clean Session Exits, Quality Documents & Codebase Entropy Control',
          'Project 06 (Capstone): Complete Agent Harness & 5-Subsystem Ablation',
        ],
      },
      {
        title: 'Module 5: Loop, Graph & Frontier Harness Engineering',
        topics: [
          'Loop Engineering: /goal, /schedule, Maker-Checker & Karpathy’s Autoresearch',
          'Project 07: Building Automated Goal, Timer & Maker-Checker Loops',
          'Graph Engineering: Nodes, Edges, Shared State, Anchors & Orchestration Tax',
          'Project 08: Multi-Agent Graph Workflows, Parallelism & HITL Approval',
          'Google Antigravity Harness Architecture Deep-Dive',
          'Frontier Harness Breakdowns: Claude Code, Codex, DeepSeek & Pi',
        ],
      },
    ],
  },
  {
    order: 8,
    stepCode: '08',
    track: 'edge-ai-for-beginners',
    shortLabel: '08 Edge AI',
    title: 'Edge AI for Beginners',
    folder: 'edge-ai-for-beginners',
    notebookFolder: 'edge-ai-for-beginners',
    plannedLessonCount: 20,
    difficulty: 'Advanced',
    runtimeBadges: [
      'In-Browser Pyodide',
      'Colab Free T4 GPU',
      'Colab Free CPU',
      'Google AI Studio Free Tier',
    ],
    usesGeminiApi: true,
    prerequisiteTrack: 'harness-engineering',
    nextTrack: null,
    summary:
      'Optimize and deploy Small Language Models (Phi, Qwen, Gemma, BitNet) on edge devices using GGUF/INT4 quantization, llama.cpp, ONNX Runtime, OpenVINO, SLMOps distillation, on-device MCP agents, RAGAS evaluation, and a multi-agent AI Podcast Studio capstone.',
    pedagogyFocus: 'Quantize, distill, and run private, low-latency agentic SLMs on local hardware.',
    syllabusModules: [
      {
        title: 'Module 1: Edge AI Foundations, Case Studies & Hardware Platforms',
        topics: [
          'Introduction to Edge AI: The On-Device Intelligence Paradigm',
          'Real-World Edge AI Case Studies: QuaRot, Micro-Models & Enterprise Aviation',
          'Edge AI Development Stack: Colab T4 GPU, Open-Source Runtimes & Google AI Studio',
          'Edge Deployment Hardware Platforms: NPUs, Mobile SoCs & Embedded Accelerators',
        ],
      },
      {
        title: 'Module 2: Small Language Model (SLM) Families & Architectures',
        topics: [
          'The Phi SLM Family: Textbook-Quality Data, Dense Reasoning & Edge Variants',
          'The Qwen SLM Family: Dual Thinking Modes, MoE & Multilingual Edge Scaling',
          'The Gemma SLM Family: MatFormer, Per-Layer Embeddings (PLE) & Mobile Multimodal AI',
          'BitNet b1.58 & NPU Micro-Models: Ternary Weights, Mu Architecture & Hardware Co-Design',
        ],
      },
      {
        title: 'Module 3: Local & Containerized SLM Deployment, Quantization & Runtimes',
        topics: [
          'Local SLM Deployment: Parameter Tiers, Ollama Modelfiles & OpenAI-Compatible Serving',
          'Containerized SLM Serving: High-Throughput vLLM, PagedAttention & ONNX Runtime GenAI',
          'Quantization Foundations & llama.cpp: Precision Tiers, GGUF Conversion & K-Quants',
          'Hardware-Aware Model Optimization: ONNX Graph Passes, OpenVINO NNCF, Apple MLX & Qualcomm QNN',
        ],
      },
      {
        title: 'Module 4: SLMOps, Knowledge Distillation, LoRA Fine-Tuning & Edge Agents',
        topics: [
          'SLMOps & Knowledge Distillation: Transferring Gemini Teacher Reasoning to Edge Student SLMs',
          'Parameter-Efficient Fine-Tuning (LoRA & QLoRA) and Quantized Edge Export',
          'Edge AI Agents & SLM Function Calling: Deterministic JSON Schemas, Tool Loops & Guardrails',
          'On-Device Model Context Protocol (MCP): Connecting Local SLMs to STDIO & HTTP Tool Servers',
        ],
      },
      {
        title: 'Module 5: Production Edge AI Toolkits, Hybrid Routing & AI Podcast Studio Capstone',
        topics: [
          'Local Edge RAG Pipelines: On-Device Embeddings, Semantic Retrieval & RAGAS Evaluation',
          'Multi-Model Edge Benchmarking: TTFT, Throughput, Perplexity & SLM vs. Cloud LLM Trade-offs',
          'Models-as-Tools: Task-Based SLM Routers, Hybrid Gemini Fallback & Multi-Agent Edge Coordinators',
          'Capstone Workshop: Building the "Future Bytes" Local Multi-Agent AI Podcast Studio',
        ],
      },
    ],
  },
];

export function getCourseByTrack(track: string): CourseMeta | undefined {
  return CURRICULUM_COURSES.find((c) => c.track === track);
}

export function getAdjacentCourses(track: string): {
  prevCourse: CourseMeta | null;
  nextCourse: CourseMeta | null;
} {
  const index = CURRICULUM_COURSES.findIndex((c) => c.track === track);
  if (index === -1) {
    return { prevCourse: null, nextCourse: null };
  }
  return {
    prevCourse: index > 0 ? CURRICULUM_COURSES[index - 1] : null,
    nextCourse: index < CURRICULUM_COURSES.length - 1 ? CURRICULUM_COURSES[index + 1] : null,
  };
}

export function getSortedLessonsForTrack(
  track: string,
  allLessons: CollectionEntry<'lessons'>[],
): CollectionEntry<'lessons'>[] {
  return allLessons
    .filter((l) => l.data.track === track)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

export function resolveCourseEntryUrl(
  track: string,
  allLessons: CollectionEntry<'lessons'>[],
): string {
  const lessons = getSortedLessonsForTrack(track, allLessons);
  if (lessons.length > 0) {
    return `/learn/${track}/${lessons[0].id}`;
  }
  return `/learn/${track}`;
}

export function buildTrackUrlMap(
  allLessons: CollectionEntry<'lessons'>[],
): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const course of CURRICULUM_COURSES) {
    urls[course.track] = resolveCourseEntryUrl(course.track, allLessons);
  }
  return urls;
}
