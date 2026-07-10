const OpenAI = require('openai');
const config = require('../config');
const logger = require('../logger');
const AppError = require('../utils/AppError');

const client = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function answerFromContext(question, contextChunks) {
  const contextBlock = contextChunks
    .map((c, i) => `[Source ${i + 1}]\n${c.content}`)
    .join('\n\n');

  const systemPrompt = `You are a precise assistant answering questions using only the provided sources.
Rules:
- Only use information found in the sources below.
- If the sources don't contain the answer, say so plainly.
- When you use a fact, cite it inline like [Source 1].
- Be concise.`;

  const userPrompt = `Sources:\n${contextBlock}\n\nQuestion: ${question}`;

  try {
    const response = await client.chat.completions.create({
      model: config.chatModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
    });
    return response.choices[0].message.content;
  } catch (err) {
    logger.error({ err }, 'LLM request failed');
    throw new AppError('Failed to generate answer', 502, err.message);
  }
}

module.exports = { answerFromContext };