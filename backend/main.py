from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import pytesseract
from PIL import Image
import io
import anthropic
import os
from dotenv import load_dotenv
import tempfile
import fitz  # PyMuPDF
import json
from datetime import datetime
import pathlib
import glob

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create dashboard_data directory if it doesn't exist
DASHBOARD_DATA_DIR = pathlib.Path("dashboard_data")
DASHBOARD_DATA_DIR.mkdir(exist_ok=True)

# Initialize Claude client
api_key = os.getenv("ANTHROPIC_API_KEY")
claude = anthropic.Anthropic(api_key=api_key)

def is_scanned_pdf(pdf_content: bytes) -> bool:
    """Check if the PDF is scanned (image-based) or text-based."""
    try:
        pdf_file = io.BytesIO(pdf_content)
        reader = PdfReader(pdf_file)
        text = reader.pages[0].extract_text()
        return len(text.strip()) < 100  # If text is short or empty, assume it's scanned
    except:
        return True

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF, handling both scanned and text-based PDFs."""
    if is_scanned_pdf(pdf_content):
        print("Processing as scanned PDF")
        # For scanned PDFs, use OCR
        pdf_file = io.BytesIO(pdf_content)
        doc = fitz.open(stream=pdf_file, filetype="pdf")
        text = ""
        for page in doc:
            # Increase the resolution for better quality
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better resolution
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # Convert to grayscale
            img = img.convert('L')
            
            # Increase contrast
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2.0)  # Increase contrast
            
            # Apply threshold to make text more distinct
            img = img.point(lambda x: 0 if x < 128 else 255, '1')
            
            # Use Tesseract with improved configuration
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%()/- "'
            text += pytesseract.image_to_string(img, config=custom_config) + "\n"
        return text
    else:
        print("Processing as text-based PDF")
        # For text-based PDFs, extract text directly
        pdf_file = io.BytesIO(pdf_content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Received file: {file.filename}")
        content = await file.read()
        print(f"File size: {len(content)} bytes")
        
        # Extract text from PDF
        text = extract_text_from_pdf(content)
        print(f"Extracted text length: {len(text)} characters")
        print("\nFirst 1000 characters of extracted text:")
        print("-" * 80)
        print(text[:1000])
        print("-" * 80)
        
        # Process with Claude
        system_prompt = """You are a specialized assistant for extracting information from division orders. Your task is to analyze the provided text and extract specific information into a JSON object.

Key points to look for:
1. Operator: Usually found near the beginning of the document, often in the header or first paragraph
2. Entity/Owner: Look for ownership information, often near the operator information
3. State and County: Usually found in the property description or location section
4. Effective Date: Look for dates, especially those labeled as "effective" or "commencement"
5. Wells Information: Look for sections listing multiple wells, each with:
   - Property Name/Well Name
   - Property Description
   - Decimal Interest (often shown as a decimal or percentage)

Format the response as a JSON object with this exact structure:
{
    "operator": "string",
    "entity": "string",
    "state": "string",
    "county": "string",
    "effectiveDate": "string",
    "wells": [
        {
            "propertyName": "string",
            "propertyDescription": "string",
            "decimalInterest": "string"
        }
    ]
}

Important:
- Only include fields that are explicitly found in the document
- If a field is not found, omit it from the JSON
- Return ONLY the JSON object, no markdown or additional text
- Ensure the JSON is properly formatted and valid"""

        print("\nSending text to Claude for processing...")
        message = claude.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4000,
            temperature=0,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"Please analyze this division order and extract the required information:\n\n{text}"
                }
            ]
        )
        
        print("\nClaude's response:")
        print("-" * 80)
        print(message.content[0].text)
        print("-" * 80)
        
        # Parse the response to ensure it's valid JSON
        try:
            result = json.loads(message.content[0].text)
            print("\nParsed JSON result:")
            print(json.dumps(result, indent=2))
            return {"result": json.dumps(result)}
        except json.JSONDecodeError as e:
            print("\nError parsing JSON response:")
            print(message.content[0].text)
            raise Exception("Invalid JSON response from Claude")
        
    except Exception as e:
        print(f"\nError processing file: {str(e)}")
        return {"error": str(e)}

@app.post("/api/deploy")
async def deploy_to_dashboard(data: dict):
    try:
        print("\n=== Deploy to Dashboard Request ===")
        print("Received data:", json.dumps(data, indent=2))
        
        records = data.get("records", [])
        if not records:
            print("No records provided in deploy request")
            return {"error": "No records provided"}
        
        # Create a timestamp for the filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = DASHBOARD_DATA_DIR / f"dashboard_data_{timestamp}.json"
        
        print(f"\nSaving {len(records)} records to {filename}")
        print("Records data:", json.dumps(records, indent=2))
        
        # Save the records to a JSON file
        with open(filename, "w") as f:
            json.dump(records, f, indent=2)
        
        print(f"\nSuccessfully saved {len(records)} records to {filename}")
        return {
            "message": "Successfully deployed to dashboard",
            "records_count": len(records),
            "filename": str(filename)
        }
    except Exception as e:
        error_msg = f"Error deploying to dashboard: {str(e)}"
        print("\nError:", error_msg)
        return {"error": error_msg}

@app.get("/api/dashboard")
async def get_dashboard_data():
    try:
        # Get all JSON files in the dashboard_data directory
        json_files = glob.glob(str(DASHBOARD_DATA_DIR / "*.json"))
        print(f"Found {len(json_files)} JSON files in {DASHBOARD_DATA_DIR}")
        
        # Combine all records from all files
        all_records = []
        for file_path in json_files:
            print(f"Reading file: {file_path}")
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_records.extend(data)
                else:
                    all_records.append(data)
        
        print(f"Total records found: {len(all_records)}")
        
        # Sort records by effective date (newest first)
        all_records.sort(key=lambda x: x.get('effectiveDate', ''), reverse=True)
        
        return {"records": all_records}
    except Exception as e:
        error_msg = f"Error fetching dashboard data: {str(e)}"
        print(error_msg)
        return {"error": error_msg}

@app.post("/api/dashboard/update")
async def update_dashboard_record(data: dict):
    try:
        index = data.get('index')
        notes = data.get('notes', '')
        
        # Get all JSON files in the dashboard data directory
        json_files = [f for f in os.listdir(DASHBOARD_DATA_DIR) if f.endswith('.json')]
        if not json_files:
            return {"error": "No dashboard data found"}
            
        # Read the most recent file
        latest_file = max(json_files, key=lambda x: os.path.getctime(os.path.join(DASHBOARD_DATA_DIR, x)))
        file_path = os.path.join(DASHBOARD_DATA_DIR, latest_file)
        
        with open(file_path, 'r') as f:
            records = json.load(f)
            
        if 0 <= index < len(records):
            records[index]['notes'] = notes
            
            # Save the updated records back to the file
            with open(file_path, 'w') as f:
                json.dump(records, f, indent=2)
                
            return {"success": True, "message": "Notes updated successfully"}
        else:
            return {"error": "Invalid record index"}
            
    except Exception as e:
        print(f"Error updating dashboard record: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 