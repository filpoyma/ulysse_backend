import Info from '../models/infoModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import { newInfoDefault } from '../constants/placeholders.js';

// Получить все информационные блоки
const getAllInfo = asyncHandler(async (req, res) => {
  const info = await Info.find().populate('titleImage');
  res.status(200).json({ success: true, data: info });
});

// Получить один информационный блок по id или name_eng
const getInfoById = asyncHandler(async (req, res) => {
  const info =
    (await Info.findOne({ name_eng: req.params.id }).populate('titleImage')) ||
    (await Info.findById(req.params.id).populate('titleImage'));
  if (!info) throw new ApiError(404, 'Info not found');
  res.status(200).json({ success: true, data: info });
});

// Создать информационный блок
const createInfo = asyncHandler(async (req, res) => {
  const { name, title } = req.body;
  if (!name) throw new ApiError(400, 'Name is required');
  const info = new Info(newInfoDefault(name, title, req.user.email));
  await info.save();
  res.status(201).json({ success: true, data: info });
});

// Обновить информационный блок
const updateInfo = asyncHandler(async (req, res) => {
  const updateData = {};

  // Список полей, которые могут быть обновлены
  const allowedFields = ['name', 'title', 'description', 'titleImage', 'listInfo'];

  // Проверяем каждое поле и добавляем его в updateData только если оно есть в req.body
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const info = await Info.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('titleImage');

  if (!info) throw new ApiError(404, 'Info not found');
  res.status(200).json({ success: true, data: info });
});

// Удалить информационный блок
const deleteInfo = asyncHandler(async (req, res) => {
  const info = await Info.findByIdAndDelete(req.params.id);
  if (!info) throw new ApiError(404, 'Info not found');
  res.status(200).json({ success: true, message: 'Info deleted' });
});

// Обновить главное изображение информационного блока
const updateTitleImage = asyncHandler(async (req, res) => {
  const { infoId, imageId } = req.body;

  if (!infoId || !imageId) {
    throw new ApiError(400, 'Info ID and Image ID are required');
  }

  const info = await Info.findByIdAndUpdate(
    infoId,
    { titleImage: imageId },
    { new: true, runValidators: true },
  ).populate('titleImage');

  if (!info) {
    throw new ApiError(404, 'Info not found');
  }

  res.status(200).json({
    success: true,
    data: info,
  });
});

export default {
  getAllInfo,
  getInfoById,
  createInfo,
  updateInfo,
  deleteInfo,
  updateTitleImage,
};
