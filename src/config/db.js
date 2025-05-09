import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "./config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.isProduction
        ? process.env.MONGODB_URI
        : process.env.MONGODB_URI_DEV
    );

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle MongoDB connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
