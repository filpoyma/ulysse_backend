import ApiError from '../utils/apiError.js';
import logger from '../utils/logger.js';
import config from '../config/config.js';

/**
 * Handle route not found
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Handle validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again.');

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () => new ApiError(401, 'Your token has expired. Please log in again.');

/**
 * Error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  logger.error(`${err.name || 'Error'}: ${err.message}`);
  
  // Convert mongoose validation error
  if (err.name === 'ValidationError') error = handleValidationError(err);
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  // Check if error has statusCode or use 500
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Server Error';
  }

  const response = {
    success: false,
    status: error.statusCode,
    message: error.message,
    ...(config.isDevelopment && { stack: error.stack })
  };

  return res.status(error.statusCode).json(response);
};