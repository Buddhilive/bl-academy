# Buddhi AI OS

> Privacy-focused AI workstation powered by Next.js 16, FastAPI, and a swappable OpenAI-compatible inference backend.

---

## 🌟 Overview

**Buddhi AI OS** is a local-first AI assistant workstation. It pairs an OpenAI-compatible chat backend (point it at any compatible inference server via a single env var) with real-time web search grounding (SearXNG) and rich streaming output.

---

## ✨ Features

- **AI Streaming Interface**: Built with Next.js 16 (App Router), React 19, and Vercel AI SDK. Supports reasoning models (`<think>` tags), streaming deltas, and native tool execution.
- **Swappable Inference Backend**: Chat calls an OpenAI-compatible API at a configurable `INFERENCE_BASE_URL`, so you can point it at any compatible local or hosted inference server.
- **Privacy Web Grounding**: Real-time web search synthesis powered by a self-hosted [SearXNG](https://searxng.org/) engine.
- **Rich Markdown & Visual Output**: Native rendering via Streamdown with Shiki code syntax highlighting, KaTeX mathematical expressions, and Mermaid diagrams.
- **PostgreSQL Persistence**: Persistent chat sessions, message history, and context summaries managed via Drizzle ORM.

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Next.js 16 Web App      │
                          │        (React 19)         │
                          │      http://localhost:3000│
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ OpenAI-compatible API│    │   PostgreSQL 16 DB   │    │    SearXNG Engine    │
│ (INFERENCE_BASE_URL) │    │    (Drizzle ORM)     │    │   (Privacy Search)   │
│                       │    │ http://localhost:5432│    │ http://localhost:8080│
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

---

## 📂 Project Structure

```
buddhi-ai-os/
├── api/                       # Minimal Python FastAPI backend skeleton
│   ├── app/
│   │   └── main.py            # CORS + /health route
│   └── pyproject.toml         # Python dependencies (managed via uv)
├── searxng/                   # SearXNG configuration files
├── src/                       # Next.js 16 Frontend Web Application
│   ├── app/                   # App Router pages and API endpoints (/api/chat)
│   ├── components/            # UI Components (Chat, Navigation)
│   │   └── chat/               # Chat message list, context management, & input forms
│   ├── lib/                   # Utility libraries, DB client, inference client, & search
│   │   ├── db/                # Drizzle ORM database client & schema definitions
│   │   ├── inference-client.ts # OpenAI-compatible inference client (INFERENCE_BASE_URL)
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
| `INFERENCE_BASE_URL` | OpenAI-compatible inference server URL | `http://localhost:8000/v1` |
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

### Step 5: Inference Backend

Point `INFERENCE_BASE_URL` at any OpenAI-compatible inference server (local or hosted). The bundled `api/` FastAPI project is just a health-check skeleton — it does not serve inference itself.

---

### Step 6: Start Development Server

Run both the Next.js frontend and the FastAPI skeleton concurrently:

```bash
pnpm dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Skeleton**: [http://localhost:8000](http://localhost:8000) (Docs at `http://localhost:8000/docs`)
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
