import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import uploadController from './../controllers/uploadController.js';

const router = express.Router();

// Route for single image upload
router.post(
  '/image',
  protect,
  uploadController.upload.single('image'),
  uploadController.uploadSingleImage,
);

// Route for multiple image upload
router.post(
  '/images',
  protect,
  uploadController.upload.array('images', 5),
  uploadController.uploadMultiplyImage,
);

// Get all images
router.get('/images', uploadController.getAllImages);

// Get image by ID
router.get('/image/:id', uploadController.getImageById);

// Delete image by ID
router.delete('/image/:id', protect, uploadController.deleteImage);

export default router;
