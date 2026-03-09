import { embed } from "./embedding";
import { generateAnswer } from "./generator";
import { search } from "./retrieval";

async function ask(question) {
  const qVec = await embed(question);
  const hits = await search(qVec, 4);
  const answer = await generateAnswer(question, hits);
  console.log("\n===== ANSWER =====\n");
  console.log(answer);
}

const query = process.argv.slice(2).join(" ") || "what is AI?";
ask(query).catch(console.error);
