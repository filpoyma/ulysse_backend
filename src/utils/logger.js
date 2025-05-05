import winston from 'winston';
import config from '../config/config.js';

const { combine, timestamp, printf, colorize } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger
const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    }),
    // Add file transport in production
    ...(config.isProduction
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' })
        ]
      : [])
  ]
});

export default logger;