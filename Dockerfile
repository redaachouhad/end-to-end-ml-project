# Use lightweight Python image
FROM python:3.11-slim

# Avoid buffering (better logs)
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies (needed for sklearn/numpy)
RUN apt-get update && apt-get install -y \
    gcc \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependencies first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy ONLY required files (not everything)
COPY app.py .
COPY src/ ./src/
COPY artifacts/model.pkl ./artifacts/
COPY artifacts/preprocessor.pkl ./artifacts/
COPY templates/ ./templates/

# Expose port
EXPOSE 5000

# Run app with production server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
