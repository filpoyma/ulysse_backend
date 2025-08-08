import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import config from './config/config.js';
import logger from './utils/logger.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Express
const app = express();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirname = path.resolve();

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files from upload directory
app.use('/upload', express.static(path.join(__dirname, '../upload')));

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
);

// CORS
app.use(cors({
  origin: [config.frontendHost],
  credentials: true
}));
console.log('config.frontendHost', config.frontendHost);

// Request logging
// if (config.isDevelopment) {
//   app.use(morgan('dev'));
// }

app.use(morgan('dev'));

// Apply rate limiting
// const limiter = rateLimit({
//   windowMs: config.rateLimitWindowMs,
//   max: config.rateLimitMax,
//   standardHeaders: true,
//   legacyHeaders: false,
//   trustProxy: true,
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// });
// app.use('/api', limiter);

// Compression middleware
app.use(compression());

// Mount API routes
app.use('/api/v1', routes);

// Serve static files from client/dist
app.use(express.static(path.join(dirname, "client", "dist")));

// Serve index.html for all non-API routes (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client", "dist", "index.html"));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

export default app;
