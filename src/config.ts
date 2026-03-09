import "dotenv/config";

export const {
  QDRANT_URL = "http://localhost:6333",
  OLLAMA_URL = "http://localhost:11434",
  COLLECTION = "docs_md",
  EMBED_MODEL = "nomic-embed-text",
  GEN_MODEL = "TinyLlama",
  PORT = 3000,
} = process.env;
