"""
Utility functions for mdLaTeX2Word backend
Includes logging, file handling, and cleanup scheduling
"""
import os
import re
import time
from pathlib import Path
from datetime import datetime
from typing import Optional
from loguru import logger
from apscheduler.schedulers.background import BackgroundScheduler

import config


# Configure loguru logger
def setup_logger():
    """Configure logger with file and console output"""
    # Remove default handler
    logger.remove()
    
    # Add console handler with colors
    logger.add(
        lambda msg: print(msg, end=''),
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
        level="INFO",
        colorize=True
    )
    
    # Add file handler for errors
    logger.add(
        config.LOGS_DIR / "error.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function} - {message}",
        level="ERROR",
        rotation="10 MB",
        retention="7 days"
    )
    
    # Add file handler for all logs
    logger.add(
        config.LOGS_DIR / "combined.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function} - {message}",
        level="INFO",
        rotation="10 MB",
        retention="7 days"
    )
    
    return logger


# Initialize logger
log = setup_logger()


def ensure_directory_exists(dir_path: Path) -> None:
    """Ensure a directory exists, create if it doesn't"""
    if not dir_path.exists():
        dir_path.mkdir(parents=True, exist_ok=True)
        log.info(f"Created directory: {dir_path}")


def initialize_directories() -> None:
    """Initialize all required directories"""
    ensure_directory_exists(config.UPLOAD_DIR)
    ensure_directory_exists(config.OUTPUT_DIR)
    ensure_directory_exists(config.LOGS_DIR)
    log.info("All required directories initialized")


def is_valid_file_extension(filename: str) -> bool:
    """Check if file has a valid extension"""
    ext = Path(filename).suffix.lower()
    return ext in config.ALLOWED_EXTENSIONS


def sanitize_filename(filename: str) -> str:
    """Sanitize filename by replacing invalid characters"""
    # Replace any character that's not alphanumeric, dot, underscore, or hyphen
    return re.sub(r'[^a-zA-Z0-9._-]', '_', filename)


def generate_unique_filename(original_name: str) -> str:
    """Generate a unique filename with timestamp and random string"""
    path = Path(original_name)
    ext = path.suffix
    basename = path.stem
    timestamp = int(time.time() * 1000)
    random_str = os.urandom(3).hex()
    
    sanitized_base = sanitize_filename(basename)
    return f"{sanitized_base}_{timestamp}_{random_str}{ext}"


def cleanup_old_files() -> None:
    """Clean up old files from upload and output directories"""
    directories = [config.UPLOAD_DIR, config.OUTPUT_DIR]
    now = time.time()
    total_deleted = 0
    
    for directory in directories:
        if not directory.exists():
            continue
        
        for file_path in directory.iterdir():
            if not file_path.is_file():
                continue
            
            file_age = now - file_path.stat().st_mtime
            
            if file_age > config.FILE_MAX_AGE_SECONDS:
                try:
                    file_path.unlink()
                    total_deleted += 1
                    log.info(f"Deleted old file: {file_path}")
                except Exception as e:
                    log.error(f"Failed to delete file {file_path}: {e}")
    
    if total_deleted > 0:
        log.info(f"Cleanup completed: {total_deleted} files deleted")


# Global scheduler instance
_scheduler: Optional[BackgroundScheduler] = None


def schedule_cleanup() -> None:
    """Schedule periodic cleanup job"""
    global _scheduler
    
    if _scheduler is not None:
        log.warning("Cleanup scheduler already initialized")
        return
    
    _scheduler = BackgroundScheduler()
    
    # Schedule cleanup to run every hour
    _scheduler.add_job(
        cleanup_old_files,
        'interval',
        seconds=config.CLEANUP_INTERVAL_SECONDS,
        id='cleanup_job',
        name='Cleanup old files'
    )
    
    _scheduler.start()
    log.info("Cleanup scheduler initialized (runs every hour)")


def shutdown_scheduler() -> None:
    """Shutdown the cleanup scheduler"""
    global _scheduler
    
    if _scheduler is not None:
        _scheduler.shutdown()
        _scheduler = None
        log.info("Cleanup scheduler shutdown")
