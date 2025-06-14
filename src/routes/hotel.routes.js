import express from 'express';
import hotelController from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все отели
router.get('/', hotelController.getAllHotels);
// Получить один отель по id
router.get('/:id', hotelController.getHotelById);
// Создать отель
router.post('/', protect, hotelController.createHotel);
// Обновить отель
router.put('/:id', protect, hotelController.updateHotel);

router.patch('/main-image', protect, hotelController.updateMainImage);
router.patch('/gallery', hotelController.updateGallery);

// Удалить отель
router.delete('/:id', protect, hotelController.deleteHotel);

export default router;
