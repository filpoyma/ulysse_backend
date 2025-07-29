import express from 'express';
import infoController from '../controllers/infoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все информационные блоки
router.get('/', infoController.getAllInfo);
// Получить один информационный блок по id
router.get('/:id', infoController.getInfoById);
// Создать информационный блок
router.post('/', protect, infoController.createInfo);
// Обновить информационный блок
router.put('/:id', protect, infoController.updateInfo);
// Обновить главное изображение
router.patch('/title-image', protect, infoController.updateTitleImage);
// Удалить информационный блок
router.delete('/:id', protect, infoController.deleteInfo);

export default router; 