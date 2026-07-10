const cheerio = require('cheerio');
const logger = require('../logger');
const AppError = require('../utils/AppError');

async function fetchUrlContent(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIKnowledgeInbox/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    logger.warn({ url, err: err.message }, 'URL fetch failed');
    throw new AppError(`Could not reach URL: ${url}`, 400, err.message);
  }

  if (!response.ok) {
    throw new AppError(`URL returned status ${response.status}`, 400);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new AppError(`Unsupported content type: ${contentType}`, 400);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  $('script, style, noscript, nav, footer, header, svg').remove();

  const title = $('title').first().text().trim();
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  if (!bodyText) {
    throw new AppError('No readable text content found at URL', 422);
  }

  return { title, content: bodyText };
}

module.exports = { fetchUrlContent };