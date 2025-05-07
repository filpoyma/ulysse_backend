import express from "express";
import authRoutes from "./authRoutes.js";
import travelProgramRoutes from "./travelProgramRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

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

export default router;
