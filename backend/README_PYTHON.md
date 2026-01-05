# mdLaTeX2Word Backend (Python)

Python 3.12.12 backend implementation for converting Markdown with LaTeX formulas to Word documents.

## Features

- **File Upload**: Upload markdown files (.md, .markdown, .tex)
- **Markdown to DOCX Conversion**: Convert markdown with LaTeX formulas to Word documents
- **LaTeX Support**: Inline and block LaTeX formulas rendered as native Word equations
- **Direct Content Conversion**: Convert markdown content without file upload
- **File Download**: Download generated DOCX files
- **Automatic Cleanup**: Scheduled cleanup of old files (1 hour retention)
- **Health Check**: API health monitoring endpoint

## Technology Stack

- **FastAPI**: Modern, high-performance web framework
- **python-docx**: Word document generation
- **markdown-it-py**: Markdown parsing
- **latex2mathml**: LaTeX to MathML conversion
- **lxml**: XML processing for OMML conversion
- **APScheduler**: Background job scheduling
- **loguru**: Advanced logging

## Installation

### Prerequisites

- Python 3.12.12
- pip

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:3000`

### Development Mode

For auto-reload during development:
```bash
uvicorn app:app --reload --port 3000
```

## Docker Deployment

Build the Docker image:
```bash
docker build -t mdlatex2word-backend-python .
```

Run the container:
```bash
docker run -p 3000:3000 mdlatex2word-backend-python
```

## API Endpoints

### POST /api/upload
Upload a markdown file

**Request**: Multipart form data with `file` field

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "unique_filename.md",
    "originalName": "original.md",
    "size": 1234,
    "path": "/path/to/file"
  }
}
```

### POST /api/convert
Convert an uploaded file to DOCX

**Request**:
```json
{
  "filename": "unique_filename.md"
}
```

**Response**:
```json
{
  "success": true,
  "message": "File converted successfully",
  "data": {
    "outputFilename": "output.docx",
    "downloadUrl": "/api/download/output.docx"
  }
}
```

### POST /api/convert-content
Convert markdown content directly to DOCX

**Request**:
```json
{
  "content": "# Markdown content with $LaTeX$ formulas",
  "filename": "optional_name"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Content converted successfully",
  "data": {
    "outputFilename": "output.docx",
    "downloadUrl": "/api/download/output.docx"
  }
}
```

### GET /api/download/{filename}
Download a converted DOCX file

**Response**: DOCX file download

### GET /api/health
Health check endpoint

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-05T15:30:00.000Z"
}
```

## Configuration

Configuration is managed in `config.py`:

- `PORT`: Server port (default: 3000)
- `UPLOAD_DIR`: Upload directory (default: ./uploads)
- `OUTPUT_DIR`: Output directory (default: ./outputs)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 10MB)
- `ALLOWED_EXTENSIONS`: Allowed file extensions (default: .md, .markdown, .tex)
- `CLEANUP_INTERVAL_SECONDS`: Cleanup interval (default: 3600 seconds)
- `FILE_MAX_AGE_SECONDS`: File retention time (default: 3600 seconds)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

## Project Structure

```
backend/
├── app.py                 # Main FastAPI application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
├── controllers/
│   └── __init__.py      # API endpoint handlers
├── models/
│   ├── __init__.py      # Models package
│   └── converter.py     # Markdown to DOCX conversion
├── routes/
│   └── __init__.py      # API route definitions
├── utils/
│   └── __init__.py      # Utility functions
├── uploads/             # Uploaded files (auto-created)
├── outputs/             # Generated DOCX files (auto-created)
└── logs/                # Application logs (auto-created)
```

## Logging

Logs are written to:
- Console (colored output)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

## Migration from Node.js

This Python implementation maintains API compatibility with the original Node.js backend:

- All endpoints have the same paths and request/response formats
- CORS configuration is identical
- File upload/download behavior is the same
- LaTeX formula conversion produces equivalent results

The frontend can use this Python backend as a drop-in replacement for the Node.js version.

## License

MIT
