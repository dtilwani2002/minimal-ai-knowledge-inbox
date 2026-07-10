const db = require('../db/database');
const config = require('../config');

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Naive full-scan search: loads every chunk embedding and scores it
 * against the query. Fine for a few thousand chunks. See README for
 * what breaks at scale and how you'd fix it (ANN index / pgvector / etc).
 */
const MIN_RELEVANCE = 0.35;

function searchSimilarChunks(queryEmbedding, topK = config.topK) {
  const rows = db
    .prepare(
      `SELECT chunks.id, chunks.content, chunks.embedding, chunks.item_id as itemId,
       items.source_type as sourceType, items.source_url as sourceUrl
       FROM chunks JOIN items ON chunks.item_id = items.id`
    )
    .all();

  const scored = rows.map((row) => ({
    chunkId: row.id,
    itemId: row.itemId,
    content: row.content,
    sourceType: row.sourceType,
    sourceUrl: row.sourceUrl,
    score: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding)),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter((chunk) => chunk.score >= MIN_RELEVANCE)
    .slice(0, topK);
}

module.exports = { searchSimilarChunks, cosineSimilarity };
