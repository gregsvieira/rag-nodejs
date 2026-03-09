import axios from "axios";
import { EMBED_MODEL, OLLAMA_URL } from "./config";

export async function embed(text: string) {
  const { data } = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
    model: EMBED_MODEL,
    prompt: text,
  });
  return data.embedding;
}
