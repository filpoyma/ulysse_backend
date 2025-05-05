import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => `${error.path}: ${error.msg}`).join(', ');
    throw new ApiError(400, errorMessages);
  }
  next();
};