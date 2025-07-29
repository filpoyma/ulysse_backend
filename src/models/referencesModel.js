import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const referencesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    name_eng: {
      type: String,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    manager: {
      type: String,
      trim: true,
    },
    titleImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
    listInfo: [listSchema],
  },
  {
    timestamps: true,
  },
);

const Info = mongoose.model('References', referencesSchema);

export default Info;
