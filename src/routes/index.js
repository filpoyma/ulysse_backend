import express from "express";
import authRoutes from "./authRoutes.js";
import travelProgramRoutes from "./travelProgramRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import hotelRoutes from "./hotel.routes.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    time: new Date().toISOString(),
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/travel-program", travelProgramRoutes);
router.use("/upload", uploadRoutes);
router.use("/hotels", hotelRoutes);

export default router;
