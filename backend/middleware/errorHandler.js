import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.errors && { errors: err.errors }), // Add validation errors array if it exists
    });
  }

  // Log unexpected errors
  logger.error({
    err: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    requestId: req.id, // Comes from pino-http
  });

  // Don't leak error details in production
  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(500).json({
    status: 'error',
    message,
  });
};
