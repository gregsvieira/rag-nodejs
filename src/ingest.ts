import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import { embed } from "./embedding";
import { deleteCollection, ensureCollection, upsert } from "./retrieval.js";

const VECTOR_SIZE = 768;
const SOURCE_DIR = path.resolve("source");

function chunk(text, size = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export async function runIngest() {
  console.log("- Initializing ingest...");

  await deleteCollection();
  await ensureCollection(VECTOR_SIZE);

  const files = await fs.readdir(SOURCE_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  if (mdFiles.length === 0) {
    throw new Error("No one file found");
  }

  let totalChunks = 0;
  let id = 1;

  for (const file of mdFiles) {
    console.log(`-- Processing: ${file}`);

    const fullPath = path.join(SOURCE_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { content, data } = matter(raw);

    const chunks = chunk(content);

    for (const part of chunks) {
      const vec = await embed(part);
      await upsert([
        {
          id: id++,
          vector: vec,
          payload: {
            file,
            ...data,
            text: part,
            ingestedAt: new Date().toISOString(),
          },
        },
      ]);
      totalChunks++;
    }

    console.log(`-- ${file}: ${chunks.length} chunks`);
  }

  console.log(
    `-- Ingest concluded! ${mdFiles.length} files, ${totalChunks} chunks`,
  );
  return { filesProcessed: mdFiles.length, totalChunks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runIngest().catch(console.error);
}
