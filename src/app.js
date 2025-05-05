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

// Initialize Express
const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Set security HTTP headers
app.use(helmet());

// CORS
app.use(cors());

// Request logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
}

// Apply rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Compression middleware
app.use(compression());

// Mount API routes
app.use('/api/v1', routes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
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