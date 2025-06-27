import express from 'express';
import hotelsListController from '../controllers/hotelsListController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публичные маршруты
router.get('/', hotelsListController.getAllHotelsLists);
router.get('/stats', hotelsListController.getHotelsListsStats);
router.get('/:id', hotelsListController.getHotelsListById);

// Защищенные маршруты (требуют аутентификации)
router.use(protect);

// Маршруты для администраторов
//router.use(admin);

router.post('/', hotelsListController.createHotelsList);
router.patch('/:id', hotelsListController.updateHotelsList);
router.delete('/:id', hotelsListController.deleteHotelsList);

// Маршруты для управления отелями в списках
router.post('/:listId/hotels/:hotelId', hotelsListController.addHotelToList);
router.delete('/:listId/hotels/:hotelId', hotelsListController.removeHotelFromList);

export default router;
