const env = require('../config/env');
const apiResponse = require('../utils/apiResponse');

/**
 * Global Error Handling Middleware
 * 
 * Catches all errors passed to next(err) and returns a standardized 
 * JSON response with correct status codes.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for developers
  if (env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.url} — ${statusCode} ${message}`);
    if (err.stack) console.error(err.stack);
  }

  // Final API response
  res.status(statusCode).json(
    apiResponse.error(
      message, 
      env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
};

module.exports = errorHandler;
