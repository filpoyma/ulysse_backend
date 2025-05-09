import mongoose from "mongoose";

const dayActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: "Title",
  },
  subtitle: {
    type: String,
    trim: true,
    default: "Subtitle",
  },
  more: {
    type: String,
    trim: true,
    default: "Подробнее",
  },
});

const activitySchema = new mongoose.Schema({
  icon: {
    type: String,
    trim: true,
  },
  dayActivity: [dayActivitySchema],
});

const reviewDaySchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true,
  },
  activity: [activitySchema],
});

const flightDaySchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true,
  },
  flight: [activitySchema],
});

const accommodationSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    trim: true,
  },
  hotelName: {
    type: String,
    trim: true,
    default: "Hotel Name",
  },
  details: {
    type: String,
    trim: true,
    default: "Details",
  },
  numOfNights: {
    type: Number,
    default: 3,
  },
});

const routeDetailsTableSchema = new mongoose.Schema({
  review: [reviewDaySchema],
});

const tablesSchema = new mongoose.Schema({
  routeDetailsTable: {
    type: routeDetailsTableSchema,
    default: () => ({}),
  },
  flights: {
    type: [flightDaySchema],
    default: [],
  },
  accommodation: {
    type: [accommodationSchema],
    default: [],
  },
});

const firstPageSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: "Заголовок",
  },
  subtitle: {
    type: String,
    trim: true,
    default: "Подзаголовок",
  },
  footer: {
    type: String,
    trim: true,
    default: "Футер",
  },
});

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
    days: { type: Number, default: 3 },
    bgImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    secondPageTables: {
      type: tablesSchema,
      default: () => ({}),
    },
    firstPage: {
      type: firstPageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TravelProgram = mongoose.model("TravelProgram", travelProgramSchema);

export default TravelProgram;
