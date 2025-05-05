import app from './app.js';
import connectDB from './config/db.js';
import config from './config/config.js';
import logger from './utils/logger.js';

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle server errors
server.on('error', (e) => {
  logger.error(`Server error: ${e.message}`);
  
  if (e.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  }
  
  process.exit(1);
});