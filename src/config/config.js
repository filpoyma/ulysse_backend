import dotenv from "dotenv";

// Load env vars
dotenv.config();

const env = process.env.NODE_ENV || "development";

const config = {
  env,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
  logLevel: process.env.LOG_LEVEL || "info",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "15000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  isDevelopment: env === "development",
  isProduction: env === "production",
  isTest: env === "test",
  frontendHost:
    env === "development"
      ? process.env.FRONTEND_HOST_DEV
      : process.env.FRONTEND_HOST_PROD,
};

export default config;
