# RAG Node.js

A Retrieval-Augmented Generation (RAG) application built with Node.js that enables question-answering over markdown documents using local AI models and vector search.

## Main Objective

This project demonstrates a complete RAG pipeline that allows users to ask questions about their own documents. The system:

1. **Ingests** markdown files from a `source/` directory
2. **Embeds** text chunks using local Ollama embeddings (`nomic-embed-text`)
3. **Stores** vectors in Qdrant vector database for similarity search
4. **Retrieves** relevant context based on user queries
5. **Generates** answers using a local LLM (`TinyLlama`)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Express   │────▶│   Ollama    │
│  (cURL/UI)  │     │   Server    │     │ (Embed+LLM)│
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   Qdrant    │
                    │   (Vectors) │
                    └─────────────┘
```

### Components

| File | Responsibility |
|------|----------------|
| `src/server.ts` | Express API with `/api/chat` and `/api/ingest` endpoints |
| `src/ingest.ts` | Reads markdown files, chunks them, embeds and stores in Qdrant |
| `src/embedding.ts` | Calls Ollama API to generate text embeddings |
| `src/retrieval.ts` | Qdrant client for vector operations (upsert, search, collection management) |
| `src/generator.ts` | Builds prompt with retrieved context and calls Ollama to generate answer |
| `src/rag.ts` | CLI script for testing RAG pipeline directly |

### Data Flow

1. **Ingestion**: Markdown files → Chunking → Embedding → Qdrant storage
2. **Query**: User question → Embed → Vector search (Qdrant) → Context retrieval → LLM generation → Response

### Technology Stack

- **Runtime**: Node.js v22+
- **Server**: Express.js
- **Embedding Model**: `nomic-embed-text` (768-dim vectors)
- **Generation Model**: `TinyLlama`
- **Vector Database**: Qdrant
- **AI Runtime**: Ollama (local)

## Setup

### Prerequisites

- Node.js v22+
- Docker & Docker Compose
- 4GB+ RAM available

### Installation

```bash
# Install dependencies
npm install

# Start services (Qdrant + Ollama)
docker-compose up -d

# Pull required models
docker exec -it ollama ollama pull nomic-embed-text
docker exec -it ollama ollama pull TinyLlama

# Add markdown files to source/ directory

# Run ingestion to index documents
npm run ingest

# Start the server
npm start
```

### Configuration

Copy `.env.example` to `.env` and adjust if needed:

```
QDRANT_URL=http://localhost:6333
OLLAMA_URL=http://localhost:11434
COLLECTION=docs_md
EMBED_MODEL=nomic-embed-text
GEN_MODEL=TinyLlama
PORT=3000
```

## Usage

### API Endpoints

```bash
# Ingest documents
curl -X POST http://localhost:3000/api/ingest

# Ask a question
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is RAG?"}'
```

### CLI

```bash
# Ask a question via CLI (reads from rag.ts)
npm run rag -- "What is RAG?"
```

## Extending the Project

### Adding New Features

1. **Different embedding models**: Update `EMBED_MODEL` in `.env` and call `docker exec -it ollama ollama pull <model-name>`

2. **Different LLMs**: Change `GEN_MODEL` in `.env` and pull the model

3. **Web UI**: Add a frontend that calls the `/api/chat` endpoint

4. **Document loaders**: Extend `src/ingest.ts` to support PDF, DOCX, or other formats using libraries like `pdf-parse` or `mammoth`

5. **Chunking strategies**: Modify the `chunk()` function in `ingest.ts` for semantic chunking, overlapping chunks, or sliding window approaches

6. **Hybrid search**: Add keyword search (BM25) alongside vector search for better results

7. **Reranking**: Add a reranking model (e.g., `bge-reranker`) after initial retrieval

### Testing

Add test files to `source/` directory. Each markdown file's frontmatter (YAML) is preserved in the payload:

```markdown
---
title: My Document
author: John Doe
---
# Content here...
```