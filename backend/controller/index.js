const path = require('path');
const fs = require('fs');
const config = require('../config');
const { logger, generateUniqueFilename } = require('../utils');
const { convertMarkdownToWord } = require('../model');

/**
 * Handle file upload
 */
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            logger.warn('Upload attempt with no file');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        logger.info(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: req.file.path
            }
        });
    } catch (error) {
        logger.error('Error in uploadFile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
};

/**
 * Handle file conversion
 */
const convertFile = async (req, res) => {
    try {
        const { filename } = req.body;

        if (!filename) {
            logger.warn('Conversion attempt with no filename');
            return res.status(400).json({
                success: false,
                message: 'Filename is required'
            });
        }

        const inputPath = path.join(config.uploadDir, filename);

        // Check if file exists
        if (!fs.existsSync(inputPath)) {
            logger.warn(`Conversion attempt for non-existent file: ${filename}`);
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        logger.info(`Starting conversion for: ${filename}`);

        // Generate output filename
        const outputFilename = generateUniqueFilename(
            path.basename(filename, path.extname(filename)) + '.docx'
        );
        const outputPath = path.join(config.outputDir, outputFilename);

        // Convert markdown to Word
        await convertMarkdownToWord(inputPath, outputPath);

        logger.info(`Conversion completed: ${outputFilename}`);

        res.json({
            success: true,
            message: 'File converted successfully',
            data: {
                outputFilename: outputFilename,
                downloadUrl: `/api/download/${outputFilename}`
            }
        });
    } catch (error) {
        logger.error('Error in convertFile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to convert file',
            error: error.message
        });
    }
};

/**
 * Handle file download
 */
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            logger.warn('Download attempt with no filename');
            return res.status(400).json({
                success: false,
                message: 'Filename is required'
            });
        }

        const filePath = path.join(config.outputDir, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            logger.warn(`Download attempt for non-existent file: ${filename}`);
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        logger.info(`Downloading file: ${filename}`);

        // Set headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Stream file to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
            logger.info(`Download completed: ${filename}`);
        });

        fileStream.on('error', (error) => {
            logger.error(`Error streaming file ${filename}:`, error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to download file',
                    error: error.message
                });
            }
        });
    } catch (error) {
        logger.error('Error in downloadFile:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Failed to download file',
                error: error.message
            });
        }
    }
};

/**
 * Health check endpoint
 */
const healthCheck = (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
};

/**
 * Handle direct markdown content conversion
 */
const convertContent = async (req, res) => {
    try {
        const { content, filename } = req.body;

        if (!content) {
            logger.warn('Content conversion attempt with no content');
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const baseName = filename ? path.basename(filename, path.extname(filename)) : 'converted';
        const outputFilename = generateUniqueFilename(baseName + '.docx');
        const outputPath = path.join(config.outputDir, outputFilename);

        const { convertMarkdownContentToWord } = require('../model');
        await convertMarkdownContentToWord(content, outputPath);

        logger.info(`Content conversion completed: ${outputFilename}`);

        res.json({
            success: true,
            message: 'Content converted successfully',
            data: {
                outputFilename: outputFilename,
                downloadUrl: `/api/download/${outputFilename}`
            }
        });
    } catch (error) {
        logger.error('Error in convertContent:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to convert content',
            error: error.message
        });
    }
};

module.exports = {
    uploadFile,
    convertFile,
    downloadFile,
    convertContent,
    healthCheck
};
