import asyncHandler from 'express-async-handler';
import MapData from '../models/mapModel.js';
import TravelProgram from '../models/travelProgram.js';
import ApiError from '../utils/apiError.js';

// Update logistics for a travel program
const updateLogistics = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  const { logistics } = req.body;

  if (!logistics) {
    throw new ApiError(404, 'Logistics not found');
  }

  // Find the travel program
  const travelProgram = await TravelProgram.findById(programId);
  if (!travelProgram) {
    throw new ApiError(404, 'Travel program not found');
  }

  // Find and update the map data
  const mapData = await MapData.findById(travelProgram.thirdPageMap);
  if (!mapData) {
    throw new ApiError(404, 'Map data not found');
  }

  // Update logistics
  mapData.logistics = logistics;
  await mapData.save();

  res.status(200).json({
    success: true,
    data: mapData.logistics,
  });
});

export default {
  updateLogistics,
};
