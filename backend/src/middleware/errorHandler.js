const logger = require('../logger');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';

  logger.error({ err, path: req.path, statusCode }, message);

  res.status(statusCode).json({
    error: {
      message,
      ...(err instanceof AppError && err.details ? { details: err.details } : {}),
    },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.path}` } });
}

module.exports = { errorHandler, notFoundHandler };