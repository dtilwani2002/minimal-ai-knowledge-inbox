const config = require('../config');

/**
 * Splits text into overlapping fixed-size chunks.
 * Simple by design: character-based windows with overlap.
 * Doesn't respect sentence/paragraph boundaries — fine at this scale,
 * called out as a limitation in the README.
 */
function chunkText(text, chunkSize = config.chunkSize, overlap = config.chunkOverlap) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.slice(start, end));
    if (end === cleaned.length) break;
    start = end - overlap;
  }

  return chunks;
}

module.exports = { chunkText };