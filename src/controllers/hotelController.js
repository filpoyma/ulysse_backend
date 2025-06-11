import Hotel from '../models/hotelModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все отели
const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find();
  res.status(200).json({ success: true, data: hotels });
});

// Получить один отель по id
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, data: hotel });
});

// Создать отель
const createHotel = asyncHandler(async (req, res) => {
  const { name, country, link, region } = req.body;
  if (!name || !country || !link || !region) throw new ApiError(400, 'All fields are required');
  const hotel = await Hotel.create({ name, country, link, region });
  res.status(201).json({ success: true, data: hotel });
});

// Обновить отель
const updateHotel = asyncHandler(async (req, res) => {
  const updateData = {};
  
  // Список полей, которые могут быть обновлены
  const allowedFields = [
    'name', 'country', 'region', 'link', 'address',
    'hotelInfo', 'roomInfo', 'pros', 'shortInfo', 'coordinates', 'mainImage'
  ];

  // Проверяем каждое поле и добавляем его в updateData только если оно есть в req.body
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const hotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, data: hotel });
});

// Удалить отель
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, message: 'Hotel deleted' });
});

export default {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
