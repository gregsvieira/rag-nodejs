import axios from "axios";
import { GEN_MODEL, OLLAMA_URL } from "./config";

export async function generateAnswer(question: string, contexts: any[]) {
  const contextBlock = contexts
    .map((c, i) => `[Doc ${i + 1}]\n${c.payload.text}`)
    .join("\n\n");

  const fullPrompt = `Use only the documents information to answer.
    Docs:
    ${contextBlock}
    Question: ${question}
    Answer:
    `;

  const { data } = await axios.post(`${OLLAMA_URL}/api/generate`, {
    model: GEN_MODEL,
    prompt: fullPrompt,
    stream: false,
  });

  return data.response.trim();
}
