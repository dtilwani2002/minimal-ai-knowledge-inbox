const AppError = require('../utils/AppError');

function validateIngestBody(req, res, next) {
  const { type, content } = req.body || {};

  if (!type || !['note', 'url'].includes(type)) {
    return next(new AppError("Field 'type' must be 'note' or 'url'", 400));
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return next(new AppError("Field 'content' must be a non-empty string", 400));
  }
  if (type === 'url') {
    try {
      new URL(content);
    } catch {
      return next(new AppError("Field 'content' must be a valid URL when type is 'url'", 400));
    }
  }
  next();
}

function validateQueryBody(req, res, next) {
  const { question } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return next(new AppError("Field 'question' must be a non-empty string", 400));
  }
  next();
}

module.exports = { validateIngestBody, validateQueryBody };