#!/bin/bash

# Install Tesseract OCR and dependencies
echo "Installing Tesseract OCR..."

# Update package list
apt-get update

# Install Tesseract and language data
apt-get install -y tesseract-ocr tesseract-ocr-eng

# Verify installation
echo "Tesseract version:"
tesseract --version

# Install additional dependencies that might be needed
apt-get install -y libtesseract-dev libleptonica-dev

echo "Tesseract installation complete!" 