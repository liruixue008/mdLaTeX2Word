const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const { logger, isValidFileExtension, generateUniqueFilename } = require('../utils');
const controller = require('../controller');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname);
        logger.info(`Generating filename: ${file.originalname} -> ${uniqueFilename}`);
        cb(null, uniqueFilename);
    }
});

const fileFilter = (req, file, cb) => {
    if (isValidFileExtension(file.originalname)) {
        cb(null, true);
    } else {
        logger.warn(`Rejected file with invalid extension: ${file.originalname}`);
        cb(new Error(`Invalid file type. Allowed types: ${config.allowedExtensions.join(', ')}`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config.maxFileSize
    }
});

// Routes
router.post('/upload', upload.single('file'), controller.uploadFile);
router.post('/convert', controller.convertFile);
router.get('/download/:filename', controller.downloadFile);
router.get('/health', controller.healthCheck);

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        logger.error('Multer error:', error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    } else if (error) {
        logger.error('Upload error:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
});

module.exports = router;
