import mongoose from 'mongoose';

const imageSchema = mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Image = mongoose.model('Image', imageSchema);

export default Image; 