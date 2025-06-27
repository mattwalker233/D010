import os
from main import extract_text_from_pdf, is_scanned_pdf

def test_pdf_processing():
    # Test file path - using relative path
    test_file = "test.pdf"
    
    if not os.path.exists(test_file):
        print(f"Error: Test file {test_file} not found")
        print("Please make sure the PDF file exists at the specified path")
        return
    
    try:
        # Read the file
        with open(test_file, "rb") as f:
            content = f.read()
        
        print(f"File size: {len(content)} bytes")
        
        # Check if it's scanned
        is_scanned = is_scanned_pdf(content)
        print(f"PDF is {'scanned' if is_scanned else 'text-based'}")
        
        # Extract text
        text = extract_text_from_pdf(content)
        print(f"Extracted text length: {len(text)} characters")
        print("\nFirst 500 characters of extracted text:")
        print("-" * 80)
        print(text[:500])
        print("-" * 80)
        
        # Save extracted text
        with open("extracted_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("\nSaved extracted text to extracted_text.txt")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    test_pdf_processing() 