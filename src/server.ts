import cors from "cors";
import express from "express";
import { PORT } from "./config";
import { embed } from "./embedding";
import { generateAnswer } from "./generator";
import { runIngest } from "./ingest";
import { search } from "./retrieval";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    console.log(req.body);

    const { question, limit = 4 } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is obligated" });
    }
    console.log(`Pergunta: ${question}`);

    const qVec = await embed(question);

    console.log(`quantity vectors: ${qVec.length}`);

    const hits = await search(qVec, limit);

    console.log(`hits: ${hits.length}`);

    const answer = await generateAnswer(question, hits);

    console.log(`answer: ${answer}`);

    res.json({
      question,
      answer,
      souces: hits.map((hit) => ({
        file: hit.payload?.file,
        score: hit.score.toFixed(4),
        preview: hit.payload.text.substring(0, 150) + "...",
      })),
    });
  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ingest", async (req, res) => {
  try {
    console.log("Initializing ingest through api");
    const result = await runIngest();

    res.json({
      message: "Ingest successfully concluded",
      ...result,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`RAG API running on port ${PORT}`);
  console.log(`\nComandos úteis:`);
  console.log(` Ingest: curl -X POST http://localhost:${PORT}/api/ingest`);
  console.log(
    ` Question: curl -X POST http://localhost:${PORT}/api/chat -H "Content-Type: application/json" -d '{"question": "your question"}'`,
  );
});
