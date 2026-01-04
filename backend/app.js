const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const { logger, initializeDirectories, scheduleCleanup } = require('./utils');

const app = express();

// Initialize directories
initializeDirectories();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Mount API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'mdLaTeX2Word API Server',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /api/upload',
            convert: 'POST /api/convert',
            download: 'GET /api/download/:filename',
            health: 'GET /api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Schedule cleanup job
    scheduleCleanup();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
