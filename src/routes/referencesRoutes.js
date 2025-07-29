import express from 'express';
import referencesController from '../controllers/referencesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все справочники
router.get('/', referencesController.getAllReferences);
// Получить один справочник по id
router.get('/:id', referencesController.getReferencesById);
// Создать справочник
router.post('/', protect, referencesController.createReferences);
// Обновить справочник
router.put('/:id', protect, referencesController.updateReferences);
// Обновить главное изображение
router.patch('/title-image', protect, referencesController.updateTitleImage);
// Удалить справочник
router.delete('/:id', protect, referencesController.deleteReferences);

export default router; 