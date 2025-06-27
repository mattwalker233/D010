import pytesseract
from PIL import Image
import os

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def test_tesseract():
    try:
        # Get Tesseract version
        version = pytesseract.get_tesseract_version()
        print(f"Tesseract version: {version}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_tesseract() 