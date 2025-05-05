import express from 'express';
import { body } from 'express-validator';
import { 
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Register user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  validate,
  registerUser
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  validate,
  loginUser
);

// User profile routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(
    protect,
    [
      body('name').optional(),
      body('email').optional().isEmail().withMessage('Please include a valid email'),
      body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
    ],
    validate,
    updateUserProfile
  );

export default router;