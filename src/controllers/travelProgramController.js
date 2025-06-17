import asyncHandler from 'express-async-handler';
import TravelProgram from '../models/travelProgram.js';
import Image from '../models/imageModel.js';
import ApiError from '../utils/apiError.js';
import { transliterate } from '../utils/transliterate.js';
import MapData from '../models/mapModel.js';

// Get travel program by name
const getTravelProgramByName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) throw new ApiError(400, 'Program name is required');

  const program = await TravelProgram.findOne({ name_eng: name }).populate([
    'bgImages',
    'thirdPageMap',
    'fourthPageDay.gallery',
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found1');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Get travel program by ID
const getTravelProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id).populate([
    'bgImages',
    'thirdPageMap',
    'fourthPageDay.gallery',
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found2');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Create travel program template
const createTemplate = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) throw new ApiError(400, 'Program name is required');

  // Check if program with this name already exists
  const existingProgram = await TravelProgram.findOne({ name });
  if (existingProgram) throw new ApiError(400, 'Program with this name already exists');

  const name_eng = transliterate(name);

  // Check if program with this name_eng already exists
  const existingProgramEng = await TravelProgram.findOne({ name_eng });
  if (existingProgramEng) throw new ApiError(400, 'Program with this English name already exists');

  const program = new TravelProgram({
    name,
    name_eng,
    bgImages: [],
    secondPageTables: {
      routeDetailsTable: {
        review: [...Array(3)].map((_, i) => ({
          day: new Date(),
          numOfDay: i + 1,
          activity: [...Array(3)].map((_, i) => ({
            icon: i === 1 ? 'plane' : 'none',
            dayActivity: {
              line1: 'title',
              line2: 'subtitle',
              line3: 'one more line',
              more: 'more info',
              isFlight: i === 1,
            },
          })),
        })),
      },

      accommodation: [...Array(3)].map((_, i) => ({
        period: `${i + 1} - ${i + 2}`,
        hotelName: 'Hotel Name' + (i + 1),
        details: 'Details' + (i + 1),
        numOfNights: 3,
      })),
    },
  });

  const mapData = new MapData({
    logistics: [
      {
        city: 'Tokyo',
        coordinates: [139.7671, 35.6812],
        routeType: 'flight',
        markerColor: '',
        sourceMapIcon: 'startPoint',
        sourceListIcon: 'flightArrivalMarker',
        time: '0ч 00мин',
        distance: '000км',
        hotel: 'Hotel name',
      },
      {
        city: 'Osaka',
        coordinates: [135.5023, 34.6937],
        routeType: 'driving',
        markerColor: '',
        sourceMapIcon: 'startPoint',
        sourceListIcon: 'hotelMarker',
        time: '0ч 00мин',
        distance: '000км',
        hotel: 'Hotel name',
      },
      {
        city: 'Kyoto',
        coordinates: [135.7681, 35.0116],
        routeType: 'flight',
        markerColor: '',
        sourceMapIcon: 'startPoint',
        sourceListIcon: 'hotelMarker',
        time: '0ч 00мин',
        distance: '000км',
        hotel: 'Hotel name',
      },
    ],
    mapCenter: [138.46675563464663, 36.35583007420196],
    zoom: 6,
  });

  program.thirdPageMap = mapData._id;

  await Promise.all([program.save(), mapData.save()]);

  res.status(201).json({
    success: true,
    data: program,
  });
});

// Get all travel programs
const getAllTravelPrograms = asyncHandler(async (req, res) => {
  const programs = await TravelProgram.find({});

  if (!programs) throw new ApiError(404, 'No travel programs found');

  res.status(200).json({
    success: true,
    data: programs,
  });
});

// Add image to travel program's bgImages
const addImageToBgImages = asyncHandler(async (req, res) => {
  const { programName, imageId, imageNumber } = req.body;
  if (!programName || !imageId) throw new ApiError(400, 'Program name and image ID are required');

  // Check if both program and image exist
  const [program, image] = await Promise.all([
    TravelProgram.findOne({ name_eng: programName }),
    Image.findById(imageId),
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found3');

  if (!image) throw new ApiError(404, 'Image not found');

  // If imageNumber is provided, validate it
  if (imageNumber !== undefined) {
    if (imageNumber < 0) throw new ApiError(400, 'Image number cannot be negative');

    // Ensure the array is long enough
    while (program.bgImages.length < imageNumber) {
      program.bgImages.push(null);
    }
    // Insert image at specified position
    program.bgImages[imageNumber] = imageId;
  } else {
    // If no position specified, add to the end
    program.bgImages.push(imageId);
  }

  await program.save();

  // Return updated program with populated bgImages
  const updatedProgram = await TravelProgram.findById(program._id).populate('bgImages');

  if (!updatedProgram) throw new ApiError(500, 'Failed to retrieve updated program');

  res.status(200).json({
    success: true,
    data: {
      message: 'Image added to bgImages successfully',
      program: updatedProgram,
    },
  });
});

const addImagesToGallery = asyncHandler(async (req, res) => {
  const { programId, imageIds } = req.body;

  if (!programId || !Array.isArray(imageIds)) {
    throw new ApiError(400, 'Program ID and image IDs array are required');
  }

  // Проверяем существование программы
  const program = await TravelProgram.findById(programId);
  if (!program) {
    throw new ApiError(404, 'Travel program not found');
  }

  // Проверяем существование всех изображений
  const images = await Image.find({ _id: { $in: imageIds } });
  if (images.length !== imageIds.length) {
    throw new ApiError(404, 'One or more images not found');
  }

  // Добавляем новые изображения в галерею
  program.fourthPageDay.gallery = [...program.fourthPageDay.gallery, ...imageIds];

  // Сохраняем изменения
  await program.save();

  // Возвращаем обновленную программу с заполненными данными изображений
  const updatedProgram = await TravelProgram.findById(programId).populate('fourthPageDay.gallery');

  res.status(200).json({
    success: true,
    data: {
      message: 'Images added to gallery successfully',
      fourthPageDay: updatedProgram.fourthPageDay,
    },
  });
});

// Delete travel program
const deleteTravelProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id);

  if (!program) throw new ApiError(404, 'Travel program not found4');

  await program.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: 'Travel program deleted successfully',
    },
  });
});

const updateFirstPage = asyncHandler(async (req, res) => {
  const { title, subtitle, footer } = req.body;
  let travelProgram = await TravelProgram.findOne({ name_eng: req.params.id });

  if (!travelProgram)
    throw new ApiError(404, `Travel program not found with id of ${req.params.id}`);

  travelProgram.firstPage = {
    title,
    subtitle,
    footer,
  };
  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: travelProgram.firstPage,
  });
});

const updateReviewDay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;
  const { day, activity, numOfDay } = req.body;

  const travelProgram = await TravelProgram.findById(id);

  if (!travelProgram) throw new ApiError(404, `Travel program not found with id of ${id}`);

  if (!travelProgram.secondPageTables?.routeDetailsTable?.review)
    throw new ApiError(404, 'Review data not found');

  const reviewData = travelProgram.secondPageTables.routeDetailsTable.review;

  reviewData[dayIndex] = {
    day: day || reviewData[dayIndex].day,
    numOfDay: Number(numOfDay) || reviewData[dayIndex].numOfDay,
    activity: activity || reviewData[dayIndex].activity,
  };

  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: reviewData[dayIndex],
  });
});

const updateAccommodationRow = asyncHandler(async (req, res) => {
  const { id, rowIndex } = req.params;
  const updatedRow = req.body; // { period, hotelName, details, numOfNights }

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.secondPageTables || !Array.isArray(program.secondPageTables.accommodation))
    throw new ApiError(400, `Accommodation not found with id of ${id}`);

  program.secondPageTables.accommodation[rowIndex] = updatedRow;
  await program.save();

  res.json({ data: program.secondPageTables.accommodation[rowIndex], success: true });
});

const deleteAccommodationRow = asyncHandler(async (req, res) => {
  const { id, rowIndex } = req.params;

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.secondPageTables || !Array.isArray(program.secondPageTables.accommodation))
    throw new ApiError(400, `Accommodation not found with id of ${id}`);

  // Удаляем строку из массива
  program.secondPageTables.accommodation.splice(rowIndex, 1);
  await program.save();

  res.json({
    success: true,
    data: program.secondPageTables.accommodation,
  });
});

export default {
  addImageToBgImages,
  addImagesToGallery,
  getAllTravelPrograms,
  createTemplate,
  getTravelProgramById,
  getTravelProgramByName,
  deleteTravelProgram,
  updateFirstPage,
  updateReviewDay,
  updateAccommodationRow,
  deleteAccommodationRow,
};
