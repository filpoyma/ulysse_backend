import mongoose from "mongoose";

const travelProgramSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a travel program name"],
      trim: true,
      unique: true,
    },
    name_eng: {
      type: String,
      required: [true, "Please add a travel program name_en"],
      trim: true,
      unique: true,
    },
    bgImages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }]
    // description: {
    //   type: String,
    //   required: [true, 'Please add a product description']
    // },
    // price: {
    //   type: Number,
    //   required: [true, 'Please add a product price'],
    //   default: 0
    // },
    // category: {
    //   type: String,
    //   required: [true, 'Please add a product category'],
    //   enum: ['Electronics', 'Books', 'Clothing', 'Food', 'Other']
    // },
    // inStock: {
    //   type: Boolean,
    //   default: true
    // }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add unique indexes for name and name_eng
travelProgramSchema.index({ name: 1 }, { unique: true });
travelProgramSchema.index({ name_eng: 1 }, { unique: true });

const TravelProgram = mongoose.model("TravelProgram", travelProgramSchema);

export default TravelProgram;
