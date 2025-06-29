import HotelsList from '../models/hotelsListModel.js';
import Hotel from '../models/hotelModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все списки отелей
const getAllHotelsLists = asyncHandler(async (req, res) => {
  const { active, withHotels } = req.query;

  let query = {};
  if (active === 'true') query.isActive = true;

  let hotelsLists;
  if (withHotels === 'true') {
    hotelsLists = await HotelsList.findWithHotels(query);
  } else {
    hotelsLists = await HotelsList.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    results: hotelsLists.length,
    data: hotelsLists,
  });
});

// Получить список отелей по ID
const getHotelsListById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullData } = req.query;
  console.log('file-hotelsListController.js id:', typeof id);

  const populateQuery =
    fullData === 'true'
      ? {
          path: ['mainImage', 'roomInfo.gallery', 'hotelInfo.gallery'],
          select: 'path filename',
        }
      : {
          path: 'mainImage',
          select: 'path filename',
        };

  const hotelsList = await HotelsList.findById(id).populate({
    path: 'hotels',
    populate: populateQuery,
  });

  if (!hotelsList) throw new ApiError(404, 'Список отелей не найден');

  res.status(200).json({
    success: true,
    data: hotelsList,
  });
});

// Создать новый список отелей
const createHotelsList = asyncHandler(async (req, res) => {
  const { name, description, hotels, sortOrder } = req.body;

  if (!name) {
    throw new ApiError(400, 'Название списка обязательно');
  }

  // Проверяем, что все указанные отели существуют
  if (hotels && hotels.length > 0) {
    const existingHotels = await Hotel.find({ _id: { $in: hotels } });
    if (existingHotels.length !== hotels.length) {
      throw new ApiError(400, 'Некоторые отели не найдены');
    }
  }

  const hotelsList = await HotelsList.create({
    name,
    description,
    hotels: hotels || [],
    sortOrder: sortOrder || 0,
  });

  res.status(201).json({
    success: true,
    data: hotelsList,
  });
});

// Обновить список отелей
const updateHotelsList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, hotels, isActive, sortOrder } = req.body;

  const hotelsList = await HotelsList.findById(id);
  if (!hotelsList) {
    throw new ApiError(404, 'Список отелей не найден');
  }

  // Проверяем, что все указанные отели существуют
  if (hotels && hotels.length > 0) {
    const existingHotels = await Hotel.find({ _id: { $in: hotels } });
    if (existingHotels.length !== hotels.length) {
      throw new ApiError(400, 'Некоторые отели не найдены');
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (hotels !== undefined) updateData.hotels = hotels;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

  const updatedHotelsList = await HotelsList.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedHotelsList,
  });
});

// Удалить список отелей
const deleteHotelsList = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hotelsList = await HotelsList.findByIdAndDelete(id);
  if (!hotelsList) {
    throw new ApiError(404, 'Список отелей не найден');
  }

  res.status(200).json({
    success: true,
    message: 'Список отелей удален',
  });
});

// Добавить отель в список
const addHotelToList = asyncHandler(async (req, res) => {
  const { listId, hotelId } = req.params;

  const hotelsList = await HotelsList.findById(listId);
  if (!hotelsList) {
    throw new ApiError(404, 'Список отелей не найден');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, 'Отель не найден');
  }

  await hotelsList.addHotel(hotelId);

  res.status(200).json({
    success: true,
    message: 'Отель добавлен в список',
    data: hotelsList,
  });
});

// Удалить отель из списка
const removeHotelFromList = asyncHandler(async (req, res) => {
  const { listId, hotelId } = req.params;

  const hotelsList = await HotelsList.findById(listId);
  if (!hotelsList) {
    throw new ApiError(404, 'Список отелей не найден');
  }

  await hotelsList.removeHotel(hotelId);

  res.status(200).json({
    success: true,
    message: 'Отель удален из списка',
    data: hotelsList,
  });
});

// Получить статистику списков отелей
const getHotelsListsStats = asyncHandler(async (req, res) => {
  const stats = await HotelsList.aggregate([
    {
      $group: {
        _id: null,
        totalLists: { $sum: 1 },
        activeLists: {
          $sum: { $cond: ['$isActive', 1, 0] },
        },
        totalHotels: { $sum: '$metadata.totalHotels' },
        avgHotelsPerList: { $avg: '$metadata.totalHotels' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalLists: 0,
      activeLists: 0,
      totalHotels: 0,
      avgHotelsPerList: 0,
    },
  });
});

export default {
  getAllHotelsLists,
  getHotelsListById,
  createHotelsList,
  updateHotelsList,
  deleteHotelsList,
  addHotelToList,
  removeHotelFromList,
  getHotelsListsStats,
};
