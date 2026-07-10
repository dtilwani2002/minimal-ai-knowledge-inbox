// require('dotenv').config();

// const config = {
//   port: process.env.PORT || 3001,
//   openaiApiKey: process.env.OPENAI_API_KEY,
//   embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
//   chatModel: process.env.CHAT_MODEL || 'gpt-4o-mini',
//   dbPath: process.env.DB_PATH || './data/inbox.db',
//   chunkSize: parseInt(process.env.CHUNK_SIZE || '800', 10),
//   chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '100', 10),
//   topK: parseInt(process.env.TOP_K || '5', 10),
// };

// if (!config.openaiApiKey) {
//   throw new Error('Missing OPENAI_API_KEY in environment. Copy .env.example to .env and set it.');
// }

// module.exports = config;
require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  groqApiKey: process.env.GROQ_API_KEY,
  embeddingModel: 'Xenova/all-MiniLM-L6-v2',
  chatModel: process.env.CHAT_MODEL || 'llama-3.1-8b-instant',
  dbPath: process.env.DB_PATH || './data/inbox.db',
  chunkSize: parseInt(process.env.CHUNK_SIZE || '800', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '100', 10),
  topK: parseInt(process.env.TOP_K || '5', 10),
};

if (!config.groqApiKey) {
  throw new Error('Missing GROQ_API_KEY in environment. Copy .env.example to .env and set it.');
}

module.exports = config;