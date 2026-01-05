"""
API Routes for mdLaTeX2Word backend
"""
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

from controllers import (
    upload_file,
    convert_file,
    convert_content,
    download_file,
    health_check
)


# Create router
router = APIRouter(prefix="/api")


# Request models
class ConvertFileRequest(BaseModel):
    filename: str


class ConvertContentRequest(BaseModel):
    content: str
    filename: str = "converted"


# Routes
@router.post("/upload")
async def upload_endpoint(file: UploadFile = File(...)):
    """Upload a markdown file"""
    return await upload_file(file)


@router.post("/convert")
async def convert_endpoint(request: ConvertFileRequest):
    """Convert an uploaded markdown file to DOCX"""
    return await convert_file(request.filename)


@router.post("/convert-content")
async def convert_content_endpoint(request: ConvertContentRequest):
    """Convert markdown content directly to DOCX"""
    return await convert_content(request.content, request.filename)


@router.get("/download/{filename}")
async def download_endpoint(filename: str):
    """Download a converted DOCX file"""
    return await download_file(filename)


@router.get("/health")
async def health_endpoint():
    """Health check endpoint"""
    return await health_check()
