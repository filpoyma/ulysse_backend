import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Get all products and create a product
router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    admin,
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('description').notEmpty().withMessage('Description is required'),
      body('price').isNumeric().withMessage('Price must be a number'),
      body('category')
        .isIn(['Electronics', 'Books', 'Clothing', 'Food', 'Other'])
        .withMessage('Invalid category')
    ],
    validate,
    createProduct
  );

// Get, update and delete a product by ID
router
  .route('/:id')
  .get(getProductById)
  .put(
    protect,
    admin,
    [
      body('name').optional(),
      body('description').optional(),
      body('price').optional().isNumeric().withMessage('Price must be a number'),
      body('category')
        .optional()
        .isIn(['Electronics', 'Books', 'Clothing', 'Food', 'Other'])
        .withMessage('Invalid category'),
      body('inStock').optional().isBoolean().withMessage('inStock must be a boolean')
    ],
    validate,
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

export default router;