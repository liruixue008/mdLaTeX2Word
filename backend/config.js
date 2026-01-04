const path = require('path');

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  
  // File upload configuration
  uploadDir: path.join(__dirname, 'uploads'),
  outputDir: path.join(__dirname, 'outputs'),
  
  // File size limits (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Allowed file extensions
  allowedExtensions: ['.md', '.markdown', '.tex'],
  
  // File cleanup configuration (files older than 1 hour)
  cleanupInterval: 60 * 60 * 1000, // 1 hour in milliseconds
  fileMaxAge: 60 * 60 * 1000, // 1 hour
  
  // CORS configuration
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
};
