import asyncHandler from 'express-async-handler';
import TravelProgram from '../models/travelProgram.js';
import Image from '../models/imageModel.js';
import ApiError from '../utils/apiError.js';
import { transliterate } from '../utils/transliterate.js';

// Get travel program by name
export const getTravelProgramByName = asyncHandler(async (req, res) => {
    const { name } = req.params;

    if (!name) {
        throw new ApiError(400, 'Program name is required');
    }

    const program = await TravelProgram.findOne({ name }).populate('bgImages');

    if (!program) {
        throw new ApiError(404, 'Travel program not found');
    }

    res.status(200).json({
        success: true,
        data: program
    });
});

// Get travel program by ID
export const getTravelProgramById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const program = await TravelProgram.findById(id).populate('bgImages');

    if (!program) {
        throw new ApiError(404, 'Travel program not found');
    }

    res.status(200).json({
        success: true,
        data: program
    });
});

// Create travel program template
export const createTemplate = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, 'Program name is required');
    }

    // Check if program with this name already exists
    const existingProgram = await TravelProgram.findOne({ name });
    if (existingProgram) {
        throw new ApiError(400, 'Program with this name already exists');
    }

    const name_eng = transliterate(name);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', name,name_eng);
    console.log('transliterate input:', name, typeof name, name.length, JSON.stringify(name));

    // Check if program with this name_eng already exists
    const existingProgramEng = await TravelProgram.findOne({ name_eng });
    if (existingProgramEng) {
        throw new ApiError(400, 'Program with this English name already exists');
    }

    const program = await TravelProgram.create({
        name,
        name_eng,
        bgImages: []
    });

    res.status(201).json({
        success: true,
        data: program
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
        data: programs
    });
});

// Add image to travel program's bgImages
export const addImageToBgImages = asyncHandler(async (req, res) => {
    const { programName, imageId, imageNumber } = req.body;

    if (!programName || !imageId) {
        throw new ApiError(400, 'Program name and image ID are required');
    }

    // Check if both program and image exist
    const [program, image] = await Promise.all([
        TravelProgram.findOne({ name: programName }),
        Image.findById(imageId)
    ]);

    if (!program) {
        throw new ApiError(404, 'Travel program not found');
    }

    if (!image) {
        throw new ApiError(404, 'Image not found');
    }

    // If imageNumber is provided, validate it
    if (imageNumber !== undefined) {
        if (imageNumber < 0) {
            throw new ApiError(400, 'Image number cannot be negative');
        }
        
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

    if (!updatedProgram) {
        throw new ApiError(500, 'Failed to retrieve updated program');
    }

    res.status(200).json({
        success: true,
        data: {
            message: 'Image added to bgImages successfully',
            program: updatedProgram
        }
    });
});

// Delete travel program
export const deleteTravelProgram = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const program = await TravelProgram.findById(id);

    if (!program) {
        throw new ApiError(404, 'Travel program not found');
    }

    await program.deleteOne();

    res.status(200).json({
        success: true,
        data: {
            message: 'Travel program deleted successfully'
        }
    });
}); 