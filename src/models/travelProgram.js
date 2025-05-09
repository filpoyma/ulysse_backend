import mongoose from "mongoose";

const dayActivitySchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
      default: "none",
    },
    dayActivity: [dayActivitySchema],
  },
  { _id: false }
);

const reviewDaySchema = new mongoose.Schema(
  {
    day: {
      type: Date,
      required: true,
      default: new Date(),
    },
    activity: [activitySchema],
  },
  { _id: false }
);

const flightDaySchema = new mongoose.Schema(
  {
    day: {
      type: Date,
      required: true,
      default: new Date(),
    },
    flight: [activitySchema],
  },
  { _id: false }
);

const accommodationSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    hotelName: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    numOfNights: {
      type: Number,
      default: 3,
    },
  },
  { _id: false }
);

const routeDetailsTableSchema = new mongoose.Schema(
  {
    review: [reviewDaySchema],
  },
  { _id: false }
);

const tablesSchema = new mongoose.Schema(
  {
    routeDetailsTable: {
      type: routeDetailsTableSchema,
      // default: () => ({}),
    },
    flights: {
      type: [flightDaySchema],
      // default: [],
    },
    accommodation: {
      type: [accommodationSchema],
      // default: [],
    },
  },
  { _id: false }
);

const firstPageSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

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
    firstPage: {
      type: firstPageSchema,
      default: () => ({}),
    },
    secondPageTables: {
      type: tablesSchema,
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
