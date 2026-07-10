const { pipeline } = require('@xenova/transformers');
const config = require('../config');
const logger = require('../logger');
const AppError = require('../utils/AppError');

// Model loads once and stays in memory (lazy singleton) — loading it
// on every call would be far too slow.
let embedderPromise = null;

function getEmbedder() {
  if (!embedderPromise) {
    logger.info({ model: config.embeddingModel }, 'Loading local embedding model (first request only)...');
    embedderPromise = pipeline('feature-extraction', config.embeddingModel);
  }
  return embedderPromise;
}

async function embedTexts(texts) {
  try {
    const embedder = await getEmbedder();
    const embeddings = [];
    for (const text of texts) {
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }
    return embeddings;
  } catch (err) {
    logger.error({ err }, 'Local embedding generation failed');
    throw new AppError('Failed to generate embeddings', 500, err.message);
  }
}

async function embedText(text) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}

module.exports = { embedTexts, embedText };