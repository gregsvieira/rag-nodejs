import { QdrantClient } from "@qdrant/js-client-rest";
import { COLLECTION, QDRANT_URL } from "./config";

const client = new QdrantClient({ url: QDRANT_URL });

export async function ensureCollection(vectorSize) {
  await client.createCollection(COLLECTION, {
    vectors: { size: vectorSize, distance: "Cosine" },
  });
}

export async function upsert(points) {
  return client.upsert(COLLECTION, { wait: true, points });
}

export async function search(vector, limit = 5) {
  return client.search(COLLECTION, {
    vector,
    limit,
    with_payload: true,
  });
}

export async function deleteCollection() {
  await client.deleteCollection(COLLECTION);
}
