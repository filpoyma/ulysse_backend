import asyncHandler from 'express-async-handler';
import TravelProgram from '../models/travelProgram.js';
import Image from '../models/imageModel.js';
import ApiError from '../utils/apiError.js';
import { transliterate } from '../utils/transliterate.js';

// Get travel program by name
export const getTravelProgramByName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) throw new ApiError(400, 'Program name is required');

  const program = await TravelProgram.findOne({ name_eng: name }).populate('bgImages');

  if (!program) throw new ApiError(404, 'Travel program not found1');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Get travel program by ID
export const getTravelProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id).populate('bgImages');

  if (!program) throw new ApiError(404, 'Travel program not found2');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Create travel program template
export const createTemplate = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) throw new ApiError(400, 'Program name is required');

  // Check if program with this name already exists
  const existingProgram = await TravelProgram.findOne({ name });
  if (existingProgram) {
    throw new ApiError(400, 'Program with this name already exists');
  }

  const name_eng = transliterate(name);

  // Check if program with this name_eng already exists
  const existingProgramEng = await TravelProgram.findOne({ name_eng });
  if (existingProgramEng) {
    throw new ApiError(400, 'Program with this English name already exists');
  }

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

  await program.save();

  res.status(201).json({
    success: true,
    data: program,
  });
});

// Get all travel programs
export const getAllTravelPrograms = asyncHandler(async (req, res) => {
  const programs = await TravelProgram.find({});

  if (!programs) {
    throw new ApiError(404, 'No travel programs found');
  }

  res.status(200).json({
    success: true,
    data: programs,
  });
});

// Add image to travel program's bgImages
export const addImageToBgImages = asyncHandler(async (req, res) => {
  const { programName, imageId, imageNumber } = req.body;
  if (!programName || !imageId) throw new ApiError(400, 'Program name and image ID are required');

  // Check if both program and image exist
  const [program, image] = await Promise.all([
    TravelProgram.findOne({ name_eng: programName }),
    Image.findById(imageId),
  ]);

  if (!program) {
    throw new ApiError(404, 'Travel program not found3');
  }

  if (!image) {
    throw new ApiError(404, 'Image not found');
  }

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

  try {
    await program.save();
  } catch (error) {
    throw new ApiError(500, 'Failed to save travel program');
  }

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

// Delete travel program
export const deleteTravelProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id);

  if (!program) {
    throw new ApiError(404, 'Travel program not found4');
  }

  await program.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: 'Travel program deleted successfully',
    },
  });
});

// @desc    Update travel program first page
// @route   PUT /api/v1/travel-program/:id/first-page
// @access  Private
export const updateFirstPage = asyncHandler(async (req, res) => {
  const { title, subtitle, footer } = req.body;
  let travelProgram = await TravelProgram.findOne({ name_eng: req.params.id });

  if (!travelProgram) {
    throw new ApiError(404, `Travel program not found with id of ${req.params.id}`);
  }

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

// @desc    Update travel program review day
// @route   PUT /api/v1/travel-program/:id/review-day/:dayIndex
// @access  Private
export const updateReviewDay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;
  const { day, activity, numOfDay } = req.body;
  console.log('file-travelProgramController.js day:', day);
  // return res.end();
  const travelProgram = await TravelProgram.findById(id);

  if (!travelProgram) {
    throw new ApiError(404, `Travel program not found with id of ${id}`);
  }

  if (!travelProgram.secondPageTables?.routeDetailsTable?.review) {
    throw new ApiError(404, 'Review data not found');
  }

  const reviewData = travelProgram.secondPageTables.routeDetailsTable.review;
  // if (!reviewData[dayIndex]) {
  //   throw new ApiError(404, `Day with index ${dayIndex} not found`);
  // }
  // console.log('file-travelProgramController.js reviewData:', reviewData);

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

export const updateAccommodationRow = asyncHandler(async (req, res) => {
  const { id, rowIndex } = req.params;
  const updatedRow = req.body; // { period, hotelName, details, numOfNights }

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.secondPageTables || !Array.isArray(program.secondPageTables.accommodation)) {
    throw new ApiError(400, `Accommodation not found with id of ${id}`);
  }

  // if (rowIndex < 0 || rowIndex >= program.secondPageTables.accommodation.length) {
  //   throw new ApiError(400, 'Invalid row index');
  // }

  program.secondPageTables.accommodation[rowIndex] = updatedRow;
  await program.save();

  res.json({ data: program.secondPageTables.accommodation[rowIndex], success: true });
});
