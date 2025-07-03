import pytesseract
from PIL import Image
import pathlib

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Test configurations
configs = [
    '--oem 1 --psm 6',  # Legacy engine, default page segmentation
    '--oem 1 --psm 3',  # Legacy engine, automatic page segmentation
    '--oem 3 --psm 6',  # LSTM engine, default
    '--oem 3 --psm 3',  # LSTM engine, automatic page segmentation
]

print("Testing OCR configurations:")
for i, config in enumerate(configs):
    print(f"{i+1}. {config}")

# Test with a simple image if available
debug_dir = pathlib.Path(__file__).parent / "debug_images"
if debug_dir.exists():
    image_files = list(debug_dir.glob("*.png"))
    if image_files:
        test_image = image_files[0]
        print(f"\nTesting with image: {test_image}")
        
        img = Image.open(test_image)
        img = img.convert('L')  # Convert to grayscale
        
        for config in configs[:2]:  # Test first 2 configs
            try:
                text = pytesseract.image_to_string(img, config=config)
                print(f"\nConfig: {config}")
                print(f"Text length: {len(text.strip())}")
                print(f"First 100 chars: {text[:100]}")
            except Exception as e:
                print(f"Error with {config}: {e}")
else:
    print("No debug images found for testing") 