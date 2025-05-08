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
  const { name, country, type, region } = req.body;
  if (!name || !country || !type || !region) throw new ApiError(400, 'All fields are required');
  const hotel = await Hotel.create({ name, country, type, region });
  res.status(201).json({ success: true, data: hotel });
});

// Обновить отель
const updateHotel = asyncHandler(async (req, res) => {
  const { name, country, type, region } = req.body;
  const hotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { name, country, type, region },
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