import Image from '../models/imageModel.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const image = await Image.create({
      filename: req.file.filename,
      path: `/upload/${req.file.filename}`,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      image,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadMultiplyImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const images = await Promise.all(
      req.files.map(file =>
        Image.create({
          filename: file.filename,
          path: `/upload/${file.filename}`,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        }),
      ),
    );

    res.status(200).json({
      message: 'Files uploaded successfully',
      images,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImagesByIds = async (req, res) => {
  try {
    const images = await Image.find({ _id: { $in: req.params.ids } });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(uploadDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
  // filename: function (req, file, cb) {
  //   let baseName = req.body.filename || file.originalname.split('.')[0];
  //   // Очищаем имя от опасных символов
  //   baseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '');
  //   const ext = path.extname(file.originalname);
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //   cb(null, baseName + '-' + uniqueSuffix + ext);
  // }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default {
  uploadSingleImage,
  uploadMultiplyImage,
  getAllImages,
  getImageById,
  deleteImage,
  upload,
};
