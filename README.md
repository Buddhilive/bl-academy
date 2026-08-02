# Buddhi AI OS

> Privacy-focused, edge-first AI workstation and local knowledge operating system powered by Google's LiteRT LM, Next.js 16, FastAPI, and Google's **Open Knowledge Format (OKF)**.

---

## 🌟 Overview

**Buddhi AI OS** is a high-performance local AI assistant and knowledge management workstation. Designed for privacy, offline execution, and high performance, it combines local LLM inference via Google LiteRT LM (running Gemma models) with real-time web search grounding (SearXNG), interactive Knowledge Graph exploration based on **Google's Open Knowledge Format (OKF)**, and rich streaming output.

---

## ✨ Features

- **Google Open Knowledge Format (OKF) Graph Engine**: Native support for [Google's Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/README.md). Ingested documents (parsed via `edgeparse`) are transformed into structured OKF concepts with YAML frontmatter metadata, source provenance, and typed graph links.
- **Edge-First Local Inference**: OpenAI-compatible Python API built on FastAPI and Google's [LiteRT LM](https://github.com/google-ai-edge/litert-lm) with XNNPACK acceleration and program caching for low-latency local model execution (e.g. Gemma 4-E4B-it).
- **AI Streaming Interface**: Built with Next.js 16 (App Router), React 19, and Vercel AI SDK. Supports reasoning models (`<think>` tags), streaming deltas, and native tool execution.
- **Interactive OKF Graph Visualizer**: Interactive concept exploration and visual graph navigation powered by Cytoscape.js and Cytoscape-fcose over the ingested OKF knowledge catalog.
- **Privacy Web Grounding**: Real-time web search synthesis powered by a self-hosted [SearXNG](https://searxng.org/) engine.
- **Rich Markdown & Visual Output**: Native rendering via Streamdown with Shiki code syntax highlighting, KaTeX mathematical expressions, and Mermaid diagrams.
- **PostgreSQL Persistence**: Persistent chat sessions, message history, and context summaries managed via Drizzle ORM.

---

## 🧠 Open Knowledge Format (OKF) Integration

Buddhi AI OS structures all knowledge base concepts using **Google's Open Knowledge Format (OKF)** standard:

1. **Structured Concept Files**: Every extracted concept is stored as an OKF markdown document containing standardized YAML frontmatter metadata:
   ```yaml
   type: concept
   title: Newton's Second Law
   description: Core law of classical mechanics defining F = ma.
   resource: physics-101
   tags: [physics, mechanics, forces]
   generated:
     by: buddhi-ai/ingest+gemma-4-e4b-it
     at: "2026-08-02T19:00:00Z"
   sources:
     - id: original-pdf
       resource: physics-101.pdf
       title: Physics Fundamentals
   status: stable
   ```
2. **Graph Relationships**: Cross-concept graph edges are derived from relative markdown link relationships (`[Title](./slug.md)`) within `## Related` sections.
3. **Grounding & Citations**: The AI agent queries OKF concept files using the `searchKnowledgeBase` tool and grounds its responses with verifiable inline citation tags (`[cite:concept-id]`).

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Next.js 16 Web App      │
                          │ (React 19 / Cytoscape OKF)│
                          │      http://localhost:3000│
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Python Inference API│    │   PostgreSQL 16 DB   │    │    SearXNG Engine    │
│ (FastAPI + LiteRT LM)│    │    (Drizzle ORM)     │    │   (Privacy Search)   │
│ http://localhost:8000│    │ http://localhost:5432│    │ http://localhost:8080│
└──────────┬───────────┘    └──────────────────────┘    └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│  Local Model Storage │
│ (./models/*.litertlm)│
└──────────────────────┘
```

---

## 📂 Project Structure

```
buddhi-ai-os/
├── api/                       # Python FastAPI backend (LiteRT LM inference & EdgeParse)
│   ├── app/
│   │   ├── engine.py          # LiteRT LM engine loader and tool execution wrapper
│   │   ├── main.py            # OpenAI-compatible API routes (/v1/chat/completions, /health)
│   │   └── routers/
│   │       └── knowledge.py   # PDF text extraction & OKF concept extraction routes
│   └── pyproject.toml         # Python dependencies (managed via uv)
├── models/                    # Local LiteRT model binaries (*.litertlm)
├── searxng/                   # SearXNG configuration files
├── src/                       # Next.js 16 Frontend Web Application
│   ├── app/                   # App Router pages and API endpoints (/api/chat, /api/knowledge)
│   ├── components/            # UI Components (Chat, OKF Knowledge Graph, Navigation)
│   │   ├── chat/              # Chat message list, context management, & input forms
│   │   └── knowledge/         # Cytoscape graph canvas, PDF dropzone, & concept editor
│   ├── lib/                   # Utility libraries, DB client, OKF bundling, & search
│   │   ├── db/                # Drizzle ORM database client & schema definitions
│   │   ├── knowledge/         # OKF frontmatter parsing, bundling, slugging, & search
│   │   └── search/            # SearXNG integration
├── docker-compose.dev.yml     # Local services (PostgreSQL 16 + SearXNG)
├── drizzle.config.ts          # Drizzle ORM configuration
└── package.json               # Node.js project scripts and dependencies
```

---

## 🚀 Quick Start & Setup

### Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`
- **Python**: `>= 3.10`
- **uv**: Python package and environment manager (`pip install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Docker & Docker Compose**: For database and search services

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Buddhilive/buddhi-ai-os.git
cd buddhi-ai-os

# Install Node.js dependencies
pnpm install

# Install Python backend dependencies
cd api && uv sync && cd ..
```

---

### Step 2: Environment Configuration

Copy the sample environment file to `.env.local`:

```bash
cp .env.example .env.local
```

Update your `.env.local` if needed:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://buddhi:Admin@123@localhost:5432/buddhi-ai` |
| `API_BASE_URL` | Python Inference API URL | `http://localhost:8000` |
| `SEARXNG_BASE_URL` | SearXNG Search Engine URL | `http://localhost:8080` |
| `SEARXNG_SECRET_KEY` | Secret key for SearXNG instance | `changeme-generate-a-random-string` |

---

### Step 3: Start Infrastructure (PostgreSQL & SearXNG)

Launch local containerized services using Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up -d
```

---

### Step 4: Database Setup

Apply the Drizzle ORM database schema to PostgreSQL:

```bash
# Push database schema
pnpm db:push
```

---

### Step 5: Model Setup

Ensure your LiteRT LM model file (e.g., `gemma-4-E4B-it.litertlm`) is placed in the `./models/` directory.

---

### Step 6: Start Development Server

Run both the Next.js frontend and Python FastAPI backend concurrently:

```bash
pnpm dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Inference API**: [http://localhost:8000](http://localhost:8000) (Docs at `http://localhost:8000/docs`)
- **SearXNG Search**: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Developer Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Starts Next.js and FastAPI dev servers concurrently |
| `pnpm dev:web` | Starts Next.js dev server only |
| `pnpm dev:api` | Starts FastAPI uvicorn server via `uv` only |
| `pnpm build` | Builds production Next.js application |
| `pnpm start` | Starts Next.js production server |
| `pnpm lint` | Runs ESLint checks |
| `pnpm db:generate` | Generates SQL migrations using Drizzle Kit |
| `pnpm db:push` | Pushes schema changes directly to PostgreSQL |
| `pnpm db:studio` | Opens Drizzle Studio GUI for database management |

---

## 📄 License

Private repository. All rights reserved.
