"""
API Controllers for mdLaTeX2Word backend
"""
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse

import config
from utils import log, generate_unique_filename, is_valid_file_extension
from models.converter import convert_markdown_to_word, convert_markdown_content_to_word


async def upload_file(file: UploadFile) -> dict:
    """Handle file upload"""
    try:
        if not file:
            log.warning("Upload attempt with no file")
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Validate file extension
        if not is_valid_file_extension(file.filename):
            log.warning(f"Rejected file with invalid extension: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(config.ALLOWED_EXTENSIONS)}"
            )
        
        # Generate unique filename
        unique_filename = generate_unique_filename(file.filename)
        file_path = config.UPLOAD_DIR / unique_filename
        
        # Save file
        content = await file.read()
        
        # Check file size
        if len(content) > config.MAX_FILE_SIZE:
            log.warning(f"File too large: {len(content)} bytes")
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {config.MAX_FILE_SIZE / 1024 / 1024}MB"
            )
        
        with open(file_path, 'wb') as f:
            f.write(content)
        
        log.info(f"File uploaded: {file.filename} ({len(content)} bytes)")
        
        return {
            "success": True,
            "message": "File uploaded successfully",
            "data": {
                "filename": unique_filename,
                "originalName": file.filename,
                "size": len(content),
                "path": str(file_path)
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error in upload_file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


async def convert_file(filename: str) -> dict:
    """Handle file conversion"""
    try:
        if not filename:
            log.warning("Conversion attempt with no filename")
            raise HTTPException(status_code=400, detail="Filename is required")
        
        input_path = config.UPLOAD_DIR / filename
        
        # Check if file exists
        if not input_path.exists():
            log.warning(f"Conversion attempt for non-existent file: {filename}")
            raise HTTPException(status_code=404, detail="File not found")
        
        log.info(f"Starting conversion for: {filename}")
        
        # Generate output filename
        output_filename = generate_unique_filename(
            Path(filename).stem + '.docx'
        )
        output_path = config.OUTPUT_DIR / output_filename
        
        # Convert markdown to Word
        convert_markdown_to_word(str(input_path), str(output_path))
        
        log.info(f"Conversion completed: {output_filename}")
        
        return {
            "success": True,
            "message": "File converted successfully",
            "data": {
                "outputFilename": output_filename,
                "downloadUrl": f"/api/download/{output_filename}"
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error in convert_file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to convert file: {str(e)}")


async def convert_content(content: str, filename: Optional[str] = None) -> dict:
    """Handle direct markdown content conversion"""
    try:
        content_len = len(content) if content else 0
        log.info(f"Starting direct content conversion (length: {content_len}, filename: {filename})")
        
        if not content:
            log.warning("Content conversion attempt with no content")
            raise HTTPException(status_code=400, detail="Content is required")
        
        base_name = Path(filename).stem if filename else 'converted'
        output_filename = generate_unique_filename(base_name + '.docx')
        output_path = config.OUTPUT_DIR / output_filename
        
        # Convert markdown content to Word
        convert_markdown_content_to_word(content, str(output_path))
        
        log.info(f"Content conversion completed: {output_filename}")
        
        return {
            "success": True,
            "message": "Content converted successfully",
            "data": {
                "outputFilename": output_filename,
                "downloadUrl": f"/api/download/{output_filename}"
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error in convert_content: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to convert content: {str(e)}")


async def download_file(filename: str) -> FileResponse:
    """Handle file download"""
    try:
        if not filename:
            log.warning("Download attempt with no filename")
            raise HTTPException(status_code=400, detail="Filename is required")
        
        file_path = config.OUTPUT_DIR / filename
        
        # Check if file exists
        if not file_path.exists():
            log.warning(f"Download attempt for non-existent file: {filename}")
            raise HTTPException(status_code=404, detail="File not found")
        
        log.info(f"Downloading file: {filename}")
        
        return FileResponse(
            path=str(file_path),
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            filename=filename
        )
    
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error in download_file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to download file: {str(e)}")


async def health_check() -> dict:
    """Health check endpoint"""
    from datetime import datetime
    
    return {
        "success": True,
        "message": "Server is running",
        "timestamp": datetime.utcnow().isoformat() + 'Z'
    }
