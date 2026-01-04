const fs = require('fs');
const path = require('path');
const winston = require('winston');
const schedule = require('node-schedule');
const config = require('../config');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'mdlatex2word' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                })
            )
        }),
        // Write all logs to file
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log')
        })
    ]
});

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.info(`Created directory: ${dirPath}`);
    }
};

// Initialize required directories
const initializeDirectories = () => {
    ensureDirectoryExists(config.uploadDir);
    ensureDirectoryExists(config.outputDir);
    ensureDirectoryExists(path.join(__dirname, '../logs'));
    logger.info('All required directories initialized');
};

// Clean up old files
const cleanupOldFiles = () => {
    const directories = [config.uploadDir, config.outputDir];
    const now = Date.now();
    let totalDeleted = 0;

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const fileAge = now - stats.mtimeMs;

            if (fileAge > config.fileMaxAge) {
                fs.unlinkSync(filePath);
                totalDeleted++;
                logger.info(`Deleted old file: ${filePath}`);
            }
        });
    });

    if (totalDeleted > 0) {
        logger.info(`Cleanup completed: ${totalDeleted} files deleted`);
    }
};

// Schedule cleanup job
const scheduleCleanup = () => {
    // Run cleanup every hour
    schedule.scheduleJob('0 * * * *', () => {
        logger.info('Running scheduled cleanup...');
        cleanupOldFiles();
    });
    logger.info('Cleanup scheduler initialized');
};

// Validate file extension
const isValidFileExtension = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return config.allowedExtensions.includes(ext);
};

// Sanitize filename
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
    const ext = path.extname(originalName);
    const basename = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${sanitizeFilename(basename)}_${timestamp}_${random}${ext}`;
};

module.exports = {
    logger,
    ensureDirectoryExists,
    initializeDirectories,
    cleanupOldFiles,
    scheduleCleanup,
    isValidFileExtension,
    sanitizeFilename,
    generateUniqueFilename
};
