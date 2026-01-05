"""
mdLaTeX2Word Backend - FastAPI Application
Main application entry point
"""
import signal
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import config
from utils import log, initialize_directories, schedule_cleanup, shutdown_scheduler
from routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    log.info("Starting mdLaTeX2Word backend server")
    initialize_directories()
    schedule_cleanup()
    log.info(f"Server running on port {config.PORT}")
    log.info(f"Environment: {config.ENVIRONMENT}")
    
    yield
    
    # Shutdown
    log.info("Shutting down server")
    shutdown_scheduler()
    log.info("Server shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="mdLaTeX2Word API",
    description="Backend server for converting Markdown with LaTeX to Word documents",
    version="1.0.0",
    lifespan=lifespan
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    log.info(
        f"{request.method} {request.url.path}",
        extra={
            "ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown")
        }
    )
    response = await call_next(request)
    return response


# Mount API routes
app.include_router(router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "mdLaTeX2Word API Server",
        "version": "1.0.0",
        "endpoints": {
            "upload": "POST /api/upload",
            "convert": "POST /api/convert",
            "convertContent": "POST /api/convert-content",
            "download": "GET /api/download/:filename",
            "health": "GET /api/health"
        }
    }


# 404 handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handle 404 errors"""
    log.warning(f"404 Not Found: {request.method} {request.url.path}")
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "Endpoint not found"
        }
    )


# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions"""
    log.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if config.ENVIRONMENT == 'development' else None
        }
    )


# Graceful shutdown handlers
def signal_handler(sig, frame):
    """Handle shutdown signals"""
    log.info(f"Received signal {sig}, shutting down gracefully")
    shutdown_scheduler()
    sys.exit(0)


signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)


# Run the application
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=config.ENVIRONMENT == 'development',
        log_level="info"
    )
