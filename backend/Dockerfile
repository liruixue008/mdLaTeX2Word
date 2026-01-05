# Use Python 3.12.12 slim image
FROM python:3.12.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed for LaTeX processing)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads outputs logs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3000"]
