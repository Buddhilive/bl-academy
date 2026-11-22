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
    plannedLessonCount: 13,
    difficulty: 'Intermediate',
    runtimeBadges: ['Google AI Studio Free Tier', 'Colab Free CPU'],
    usesGeminiApi: true,
    prerequisiteTrack: 'generative-ai-for-beginners',
    nextTrack: 'ai-agents-for-beginners',
    summary:
      'Learn the Model Context Protocol (MCP) from wire concepts to building, securing, testing, and connecting Python MCP servers and Gemini LLM clients.',
    pedagogyFocus: 'Standardize how models discover and invoke external tools, resources, and prompts.',
    syllabusModules: [
      {
        title: 'MCP Architecture & Security',
        topics: [
          'Why MCP Matters & Core Primitives (Tools, Resources, Prompts)',
          'MCP Security Best Practices & Threat Controls',
        ],
      },
      {
        title: 'Building Servers, Clients & Transports',
        topics: [
          'First Python MCP Server with FastMCP',
          'Building Clients & Gemini LLM Host Integration',
          'stdio vs Streamable HTTP Transports & Testing',
        ],
      },
      {
        title: 'Advanced Patterns & Case Studies',
        topics: [
          'Pagination, Sampling, Context Engineering & Root Contexts',
          'Real-World MCP Server Hands-On Labs',
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
    plannedLessonCount: 18,
    difficulty: 'Advanced',
    runtimeBadges: ['Google AI Studio Free Tier', 'Colab Free CPU'],
    usesGeminiApi: true,
    prerequisiteTrack: 'mcp-for-beginners',
    nextTrack: 'harness-engineering',
    summary:
      'Design autonomous agentic systems: ReAct & planning patterns, tool use, Agentic RAG, multi-agent orchestration, context engineering, and long-term memory.',
    pedagogyFocus: 'Move from single-turn prompts to bounded, observable, multi-step agent loops.',
    syllabusModules: [
      {
        title: 'Agentic Foundations & Patterns',
        topics: [
          'Intro to AI Agents & Open-Source Frameworks',
          'Agentic Design Patterns & Tool Use',
          'Planning Design & Metacognition',
        ],
      },
      {
        title: 'Memory, Protocols & Multi-Agent Systems',
        topics: [
          'Agentic RAG & Context Engineering',
          'Persistent Agent Memory & Multi-Agent Orchestration',
          'MCP & Agent-to-Agent (A2A) Protocols',
        ],
      },
      {
        title: 'Trust, Local Agents & Production',
        topics: [
          'Human-in-the-Loop, Signed Receipts & Securing Agents',
          'Local Agents with Ollama & Scalable Production Patterns',
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
    plannedLessonCount: 22,
    difficulty: 'Advanced',
    runtimeBadges: ['Google AI Studio Free Tier', 'Colab Free CPU'],
    usesGeminiApi: true,
    prerequisiteTrack: 'ai-agents-for-beginners',
    nextTrack: 'edge-ai-for-beginners',
    summary:
      'Engineer the environment around AI coding agents: modular AGENTS.md rules, initialization phases, feature lists, verification gates, loop & graph engineering.',
    pedagogyFocus: 'Strong models fail without a harness; control state, scope, and verification.',
    syllabusModules: [
      {
        title: 'Harness Anatomy & Repository as Truth',
        topics: [
          'Why Capable Agents Fail & The 5 Harness Subsystems',
          'Repository as System of Record & Split Instructions',
        ],
      },
      {
        title: 'Continuity, Scope & Verification Gates',
        topics: [
          'Initialization Phases & Multi-Session Progress Logs',
          'Feature Lists as Scope Primitives',
          'E2E Verification Gates & Runtime Observability',
        ],
      },
      {
        title: 'Loop, Graph & Frontier Harness Designs',
        topics: [
          'Clean Session Handoffs & Loop Engineering',
          'Graph Engineering (Nodes, Edges, Shared State)',
          'Frontier Harness Breakdowns',
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
    runtimeBadges: ['Colab Free T4 GPU', 'Colab Free CPU'],
    usesGeminiApi: false,
    prerequisiteTrack: 'harness-engineering',
    nextTrack: null,
    summary:
      'Optimize and deploy Small Language Models (Gemma, Qwen, Phi, BitNet) on edge devices using INT4/GGUF quantization, llama.cpp, ONNX Runtime, and SLMOps.',
    pedagogyFocus: 'Quantize, distill, and run private, low-latency agentic SLMs on local hardware.',
    syllabusModules: [
      {
        title: 'Edge AI & Small Language Models',
        topics: [
          'Edge AI Fundamentals & Deployment Constraints',
          'SLM Families: Gemma, Qwen, Phi & BitNet',
        ],
      },
      {
        title: 'Quantization & Inference Runtimes',
        topics: [
          'INT8/INT4 Quantization & GGUF Conversion',
          'llama.cpp, OpenVINO, ONNX Runtime & Apple MLX',
        ],
      },
      {
        title: 'SLMOps, Distillation & Edge Agents',
        topics: [
          'Knowledge Distillation & SLM Fine-Tuning',
          'On-Device Function Calling & Local MCP Agents',
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
