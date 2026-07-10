const { randomUUID } = require('crypto');
const db = require('../db/database');
const { chunkText } = require('./chunking');
const { embedTexts } = require('./embeddings');
const { fetchUrlContent } = require('./urlFetcher');
const logger = require('../logger');
const AppError = require('../utils/AppError');

async function ingestNote(text) {
  return ingestItem({ sourceType: 'note', sourceUrl: null, rawContent: text });
}

async function ingestUrl(url) {
  const { title, content } = await fetchUrlContent(url);
  const prefixed = title ? `${title}\n\n${content}` : content;
  return ingestItem({ sourceType: 'url', sourceUrl: url, rawContent: prefixed });
}

async function ingestItem({ sourceType, sourceUrl, rawContent }) {
  const itemId = randomUUID();
  const createdAt = new Date().toISOString();

  const chunks = chunkText(rawContent);
  if (chunks.length === 0) {
    throw new AppError('Content produced no chunks (empty or too short)', 422);
  }

  const embeddings = await embedTexts(chunks);

  const insertItem = db.prepare(
    `INSERT INTO items (id, source_type, source_url, raw_content, created_at) VALUES (?, ?, ?, ?, ?)`
  );
  const insertChunk = db.prepare(
    `INSERT INTO chunks (id, item_id, chunk_index, content, embedding, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );

  const transaction = db.transaction(() => {
    insertItem.run(itemId, sourceType, sourceUrl, rawContent, createdAt);
    chunks.forEach((chunk, i) => {
      insertChunk.run(randomUUID(), itemId, i, chunk, JSON.stringify(embeddings[i]), createdAt);
    });
  });
  transaction();

  logger.info({ itemId, sourceType, chunkCount: chunks.length }, 'Item ingested');

  return { id: itemId, sourceType, sourceUrl, createdAt, chunkCount: chunks.length };
}

function listItems() {
  return db
    .prepare(
      `SELECT id, source_type as sourceType, source_url as sourceUrl, raw_content as rawContent,
       created_at as createdAt,
       (SELECT COUNT(*) FROM chunks WHERE chunks.item_id = items.id) as chunkCount
       FROM items ORDER BY created_at DESC`
    )
    .all();
}

function deleteItem(id) {
  const result = db.prepare(`DELETE FROM items WHERE id = ?`).run(id);
  if (result.changes === 0) {
    throw new AppError(`Item not found: ${id}`, 404);
  }
  logger.info({ itemId: id }, 'Item deleted');
}

module.exports = { ingestNote, ingestUrl, listItems, deleteItem };