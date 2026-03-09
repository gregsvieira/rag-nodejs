# RAG with Node.js

This is a RAG (Retrieval-Augmented Generation) example using Node.js with markdown files. To run the project locally, follow the steps below:

## Stack in this project

- Node.js v22 and Express.js.
- `Ollama` with the following models:
  - `nomic-embed-text` for text embedding during ingestion
  - `TinyLlama` for generating responses
- `qDrant` for vector storage and search

## Requirements

First, make sure you have the following requirements installed:

- Node.js v22 or higher
- NPM (Node.js package manager)
- Docker installed
- At least 4GB of RAM available

## Installation

1. Clone the repository:

```bash
git clone git@github.com:gregsvieira/rag-nodejs.git
cd rag-nodejs
```

2. Install the project dependencies:

```bash
npm install
```

3. Configure Docker to have at least 4GB of RAM available. You can do this by editing the Docker Desktop settings or using the command:

4. Start the `Ollama` and `qDrant` services using Docker Compose:

```bash
docker-compose up -d
```

5. Install the Ollama models:

```bash
docker exec -it ollama ollama pull nomic-embed-text
docker exec -it ollama ollama pull TinyLlama
```

6. Start the application:

```bash
npm start
```

7. Add some markdown files to the `source` folder. You can use the provided example files or create your own.

8. Execute the ingestion script.

```bash
npm run ingest
```

9. Now you can test the application by sending a POST request to the `/chat` endpoint with a JSON body containing your question:

```bash
curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d '{"question": "What is RAG?"}'
```
