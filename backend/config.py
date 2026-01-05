"""
Configuration settings for mdLaTeX2Word backend
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Server configuration
PORT = int(os.getenv('PORT', 3000))

# File upload configuration
UPLOAD_DIR = BASE_DIR / 'uploads'
OUTPUT_DIR = BASE_DIR / 'outputs'
LOGS_DIR = BASE_DIR / 'logs'

# File size limits (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Allowed file extensions
ALLOWED_EXTENSIONS = ['.md', '.markdown', '.tex']

# File cleanup configuration (files older than 1 hour)
CLEANUP_INTERVAL_SECONDS = 60 * 60  # 1 hour
FILE_MAX_AGE_SECONDS = 60 * 60  # 1 hour

# CORS configuration
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
CORS_ORIGINS = [FRONTEND_URL]
CORS_CREDENTIALS = True

# Environment
ENVIRONMENT = os.getenv('NODE_ENV', 'development')
