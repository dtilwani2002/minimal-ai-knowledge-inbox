const { embedText } = require('./embeddings');
const { searchSimilarChunks } = require('./vectorStore');
const { answerFromContext } = require('./llmService');
const logger = require('../logger');
const AppError = require('../utils/AppError');

async function answerQuestion(question) {
  if (!question || !question.trim()) {
    throw new AppError('Question must not be empty', 400);
  }

  const queryEmbedding = await embedText(question);
  const topChunks = searchSimilarChunks(queryEmbedding);

  if (topChunks.length === 0) {
    return {
      answer: "I don't have any saved content to answer from yet. Add a note or URL first.",
      sources: [],
    };
  }

  const answer = await answerFromContext(question, topChunks);

  const sources = topChunks.map((c, i) => ({
    label: `Source ${i + 1}`,
    itemId: c.itemId,
    sourceType: c.sourceType,
    sourceUrl: c.sourceUrl,
    snippet: c.content.slice(0, 240),
    score: Number(c.score.toFixed(4)),
  }));

  logger.info({ question, topScore: sources[0]?.score }, 'Query answered');

  return { answer, sources };
}

module.exports = { answerQuestion };