import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import ApiError from '../utils/apiError.js';
import config from '../config/config.js';

/**
 * Protect routes - Middleware to verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new ApiError(401, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Not authorized, invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Not authorized, token expired');
      } else {
        throw new ApiError(401, 'Not authorized');
      }
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }
});

/**
 * Admin middleware
 */
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as an admin');
  }
});