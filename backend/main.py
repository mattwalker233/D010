from fastapi import FastAPI, UploadFile, File, HTTPException
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
from PIL import ImageEnhance
import re

# Set Tesseract path
try:
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    # Verify Tesseract installation
    version = pytesseract.get_tesseract_version()
    print(f"Tesseract version: {version}")
except Exception as e:
    print(f"Error initializing Tesseract: {str(e)}")
    print("Please ensure Tesseract is installed at: C:\\Program Files\\Tesseract-OCR\\tesseract.exe")
    print("You can download it from: https://github.com/UB-Mannheim/tesseract/wiki")
    raise Exception("Tesseract initialization failed. Please check installation.")

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create dashboard_data directory if it doesn't exist
DASHBOARD_DATA_DIR = pathlib.Path(__file__).parent / "dashboard_data"
DASHBOARD_DATA_DIR.mkdir(exist_ok=True)
print(f"Dashboard data directory: {DASHBOARD_DATA_DIR}")

# Initialize Claude client
api_key = os.getenv("ANTHROPIC_API_KEY")
claude = anthropic.Anthropic(api_key=api_key)

# Define system prompt for Claude
system_prompt = """You are a specialized assistant for extracting information from division orders. Your task is to analyze the provided text and extract specific information into a JSON object.

Key points to look for:
1. Operator: Usually found near the beginning of the document, often in the header or first paragraph
2. Entity/Owner: Look for ownership information, often near the operator information
3. State: Usually found in the property description or location section
4. Effective Date: Look for dates, especially those labeled as "effective" or "commencement"
5. Wells Information: Look for sections listing multiple wells, each with:
   - Property Name/Well Name
   - Property Description
   - Decimal Interest (often shown as a decimal or percentage)
   - County: Extract ONLY the county name, not the word "County". For example, if you see "Smith County", extract just "Smith"

Format the response as a JSON object with this exact structure:
{
    "operator": "string",
    "entity": "string",
    "state": "string",
    "effectiveDate": "string",
    "wells": [
        {
            "propertyName": "string",
            "propertyDescription": "string",
            "decimalInterest": "string",
            "county": "string"
        }
    ]
}

CRITICAL INSTRUCTIONS FOR WELL EXTRACTION:
1. You MUST process EVERY well in the document, no exceptions
2. Look for these patterns in the text:
   - Tables with well information
   - Numbered lists of wells
   - Bulleted lists of wells
   - Paragraphs containing well information
   - Sections with multiple wells
3. For each well, you MUST extract:
   - The complete property name
   - The complete property description
   - The exact decimal interest
   - The correct county
4. If you find a pattern of wells (e.g., similar names with numbers), you MUST include ALL wells that follow that pattern
5. If you're unsure about a well's information, include it anyway and mark any uncertain fields
6. DO NOT stop after finding a few wells - continue until you've processed the ENTIRE document
7. If you find a table of wells, process EVERY row in the table
8. If you find a list of wells, process EVERY item in the list
9. If you find wells in paragraphs, process EVERY well mentioned
10. If you find wells in sections, process EVERY well in EVERY section

Remember: Your primary goal is to extract EVERY well from the document, no matter how many there are or how they are formatted."""

# US state name to abbreviation mapping
STATE_ABBREVIATIONS = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
    'district of columbia': 'DC', 'dc': 'DC',
}
for abbr in list(STATE_ABBREVIATIONS.values()):
    STATE_ABBREVIATIONS[abbr.lower()] = abbr

def normalize_state(state):
    if not state:
        return state
    s = str(state).strip().lower()
    return STATE_ABBREVIATIONS.get(s, state)

def is_scanned_pdf(pdf_content: bytes) -> bool:
    """Check if the PDF is scanned (image-based) or text-based."""
    try:
        pdf_file = io.BytesIO(pdf_content)
        reader = PdfReader(pdf_file)
        
        # Try to extract text from first page
        first_page = reader.pages[0]
        text = first_page.extract_text()
        print(f"Initial text extraction length: {len(text.strip())} characters")
        
        # If we get very little text, it's likely scanned
        if len(text.strip()) < 100:
            print("PDF appears to be scanned (little text extracted)")
            return True
            
        # Additional check: look for images in the PDF
        if '/XObject' in first_page['/Resources']:
            x_objects = first_page['/Resources']['/XObject'].get_object()
            for obj in x_objects:
                if x_objects[obj]['/Subtype'] == '/Image':
                    print("PDF contains images, likely scanned")
                    return True
        
        print("PDF appears to be text-based")
        return False
    except Exception as e:
        print(f"Error in is_scanned_pdf: {str(e)}")
        print("Assuming PDF is scanned due to error")
        return True

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF, handling both scanned and text-based PDFs."""
    try:
        # First try direct text extraction
        pdf_file = io.BytesIO(pdf_content)
        reader = PdfReader(pdf_file)
        direct_text = ""
        for page in reader.pages:
            try:
                page_text = page.extract_text()
                if page_text:
                    direct_text += page_text + "\n"
            except Exception as e:
                print(f"Error in direct text extraction: {str(e)}")
                continue
        
        # If we got substantial text directly, use it
        if len(direct_text.strip()) > 100:
            print("Successfully extracted text directly from PDF")
            return direct_text
            
        print("Direct text extraction yielded little text, trying OCR...")
        
        # If direct extraction didn't work well, try OCR
        doc = fitz.open(stream=pdf_file, filetype="pdf")
        text = ""
        total_pages = len(doc)
        print(f"Total pages in PDF: {total_pages}")
        
        for page_num, page in enumerate(doc):
            print(f"\nProcessing page {page_num + 1} of {total_pages}")
            try:
                # Get page as image with higher resolution
                pix = page.get_pixmap(matrix=fitz.Matrix(4, 4))  # Increased resolution
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                print(f"Image size: {img.size}")
                
                # Enhanced image preprocessing
                img = img.convert('L')  # Convert to grayscale
                enhancer = ImageEnhance.Contrast(img)
                img = enhancer.enhance(3.0)  # Increased contrast
                enhancer = ImageEnhance.Sharpness(img)
                img = enhancer.enhance(2.0)  # Added sharpness
                img = img.point(lambda x: 0 if x < 128 else 255, '1')  # Adjusted threshold
                
                # Save debug image
                debug_dir = pathlib.Path(__file__).parent / "debug_images"
                debug_dir.mkdir(exist_ok=True)
                debug_path = debug_dir / f"page_{page_num + 1}.png"
                img.save(debug_path)
                print(f"Saved debug image to: {debug_path}")
                
                # Try different OCR configurations for different content types
                configs = [
                    # Default config for general text
                    r'--oem 3 --psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%()/-: " --dpi 400',
                    # Config for tables
                    r'--oem 3 --psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%()/-: " --dpi 400 -c tessedit_do_invert=0',
                    # Config for lists
                    r'--oem 3 --psm 4 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%()/-: " --dpi 400',
                    # Config for single column text
                    r'--oem 3 --psm 3 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%()/-: " --dpi 400'
                ]
                
                best_text = ""
                for config in configs:
                    try:
                        page_text = pytesseract.image_to_string(img, config=config)
                        if len(page_text.strip()) > len(best_text.strip()):
                            best_text = page_text
                    except Exception as e:
                        print(f"Error with OCR config: {str(e)}")
                        continue
                
                if best_text.strip():
                    print(f"Successfully extracted text from page {page_num + 1}")
                    print(f"Text length: {len(best_text)} characters")
                    text += best_text + "\n"
                else:
                    print(f"Warning: No text extracted from page {page_num + 1}")
                
            except Exception as e:
                print(f"Error processing page {page_num + 1}: {str(e)}")
                print("Full traceback:")
                import traceback
                print(traceback.format_exc())
                continue
        
        if not text.strip():
            raise Exception("No text could be extracted from the PDF using either method")
        
        # Post-process the text to better handle tables and lists
        lines = text.split('\n')
        processed_lines = []
        current_well = []
        well_count = 0
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if line might be part of a well entry
            if any(keyword in line.lower() for keyword in ['well', 'property', 'interest', 'decimal', 'section', 'township', 'range', 'lease', 'unit']):
                if current_well:
                    processed_lines.append(' '.join(current_well))
                    well_count += 1
                    current_well = []
                current_well.append(line)
            else:
                if current_well:
                    processed_lines.append(' '.join(current_well))
                    well_count += 1
                    current_well = []
                processed_lines.append(line)
        
        if current_well:
            processed_lines.append(' '.join(current_well))
            well_count += 1
        
        print(f"Found {well_count} potential well entries in the text")
        return '\n'.join(processed_lines)
        
    except Exception as e:
        print(f"Error in extract_text_from_pdf: {str(e)}")
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        raise

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"\n=== Processing PDF Upload ===")
        print(f"Received file: {file.filename}")
        
        # Read file content
        content = await file.read()
        print(f"File size: {len(content)} bytes")
        
        # Check if it's a scanned PDF
        is_scanned = is_scanned_pdf(content)
        print(f"PDF is {'scanned' if is_scanned else 'text-based'}")
        
        # Extract text
        try:
            text = extract_text_from_pdf(content)
            print(f"Extracted text length: {len(text)} characters")
            
            # Save extracted text for debugging
            debug_dir = pathlib.Path(__file__).parent / "debug"
            debug_dir.mkdir(exist_ok=True)
            debug_path = debug_dir / "extracted_text.txt"
            with open(debug_path, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Saved extracted text to: {debug_path}")
            
            # Process with Claude
            print("Sending text to Claude for processing...")
            try:
                message = claude.messages.create(
                    model="claude-3-7-sonnet-20250219",
                    max_tokens=15000,  # Increased from 4000 to handle large documents
                    temperature=0,
                    system=system_prompt,
                    messages=[
                        {
                            "role": "user",
                            "content": f"Please analyze this division order and extract the information:\n\n{text}"
                        }
                    ]
                )
                
                # Parse Claude's response
                response_text = message.content[0].text
                print("Claude response received, length:", len(response_text))
                
                # Save Claude's response for debugging
                claude_debug_path = debug_dir / "claude_response.txt"
                with open(claude_debug_path, "w", encoding="utf-8") as f:
                    f.write(response_text)
                print(f"Saved Claude response to: {claude_debug_path}")
                
                # Extract JSON from response
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if not json_match:
                    raise ValueError("No JSON object found in Claude's response")
                
                parsed_data = json.loads(json_match[0])
                print(f"Parsed data: {json.dumps(parsed_data, indent=2)}")
                
                # Save parsed data for debugging
                parsed_debug_path = debug_dir / "parsed_data.json"
                with open(parsed_debug_path, "w", encoding="utf-8") as f:
                    json.dump(parsed_data, f, indent=2)
                print(f"Saved parsed data to: {parsed_debug_path}")
                
                return {
                    "success": True,
                    "data": parsed_data,
                    "is_scanned": is_scanned
                }
                
            except Exception as claude_error:
                print(f"Error in Claude processing: {str(claude_error)}")
                print("Full traceback:")
                import traceback
                print(traceback.format_exc())
                raise HTTPException(
                    status_code=500,
                    detail=f"Error processing with Claude: {str(claude_error)}"
                )
                
        except Exception as text_error:
            print(f"Error in text extraction: {str(text_error)}")
            print("Full traceback:")
            import traceback
            print(traceback.format_exc())
            raise HTTPException(
                status_code=500,
                detail=f"Error extracting text: {str(text_error)}"
            )
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

@app.post("/api/upload-multiple")
async def upload_multiple_files(files: list[UploadFile] = File(...)):
    try:
        print(f"\n=== Processing Multiple PDF Upload ===")
        print(f"Received {len(files)} files")
        
        results = []
        
        for i, file in enumerate(files):
            try:
                print(f"\n--- Processing file {i + 1}/{len(files)}: {file.filename} ---")
                
                # Read file content
                content = await file.read()
                print(f"File size: {len(content)} bytes")
                
                # Check if it's a scanned PDF
                is_scanned = is_scanned_pdf(content)
                print(f"PDF is {'scanned' if is_scanned else 'text-based'}")
                
                # Extract text
                try:
                    text = extract_text_from_pdf(content)
                    print(f"Extracted text length: {len(text)} characters")
                    
                    # Save extracted text for debugging
                    debug_dir = pathlib.Path(__file__).parent / "debug"
                    debug_dir.mkdir(exist_ok=True)
                    debug_path = debug_dir / f"extracted_text_{i}_{file.filename}.txt"
                    with open(debug_path, "w", encoding="utf-8") as f:
                        f.write(text)
                    print(f"Saved extracted text to: {debug_path}")
                    
                    # Process with Claude
                    print("Sending text to Claude for processing...")
                    try:
                        message = claude.messages.create(
                            model="claude-3-7-sonnet-20250219",
                            max_tokens=15000,
                            temperature=0,
                            system=system_prompt,
                            messages=[
                                {
                                    "role": "user",
                                    "content": f"Please analyze this division order and extract the information:\n\n{text}"
                                }
                            ]
                        )
                        
                        # Parse Claude's response
                        response_text = message.content[0].text
                        print("Claude response received, length:", len(response_text))
                        
                        # Save Claude's response for debugging
                        claude_debug_path = debug_dir / f"claude_response_{i}_{file.filename}.txt"
                        with open(claude_debug_path, "w", encoding="utf-8") as f:
                            f.write(response_text)
                        print(f"Saved Claude response to: {claude_debug_path}")
                        
                        # Extract JSON from response
                        json_match = re.search(r'\{[\s\S]*\}', response_text)
                        if not json_match:
                            raise ValueError("No JSON object found in Claude's response")
                        
                        parsed_data = json.loads(json_match[0])
                        print(f"Parsed data: {json.dumps(parsed_data, indent=2)}")
                        
                        # Save parsed data for debugging
                        parsed_debug_path = debug_dir / f"parsed_data_{i}_{file.filename}.json"
                        with open(parsed_debug_path, "w") as f:
                            json.dump(parsed_data, f, indent=2)
                        print(f"Saved parsed data to: {parsed_debug_path}")
                        
                        results.append({
                            "fileName": file.filename,
                            "success": True,
                            "data": parsed_data,
                            "is_scanned": is_scanned
                        })
                        
                        print(f"Successfully processed {file.filename}")
                        
                    except Exception as claude_error:
                        print(f"Error in Claude processing for {file.filename}: {str(claude_error)}")
                        results.append({
                            "fileName": file.filename,
                            "success": False,
                            "error": f"Error processing with Claude: {str(claude_error)}"
                        })
                        
                except Exception as text_error:
                    print(f"Error in text extraction for {file.filename}: {str(text_error)}")
                    results.append({
                        "fileName": file.filename,
                        "success": False,
                        "error": f"Error extracting text: {str(text_error)}"
                    })
                    
            except Exception as file_error:
                print(f"Error processing file {file.filename}: {str(file_error)}")
                results.append({
                    "fileName": file.filename,
                    "success": False,
                    "error": f"Error processing file: {str(file_error)}"
                })
        
        successful_results = [r for r in results if r["success"]]
        failed_results = [r for r in results if not r["success"]]
        
        print(f"\n=== Processing Complete ===")
        print(f"Total files: {len(files)}")
        print(f"Successful: {len(successful_results)}")
        print(f"Failed: {len(failed_results)}")
        
        return {
            "success": True,
            "results": results,
            "summary": {
                "total": len(files),
                "successful": len(successful_results),
                "failed": len(failed_results)
            }
        }
        
    except Exception as e:
        print(f"Error processing multiple files: {str(e)}")
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error processing multiple files: {str(e)}"
        )

def clean_decimal_interest(value):
    """Clean decimal interest value by removing percentage signs and ensuring proper format."""
    if not value:
        return value
    
    if isinstance(value, str):
        # Remove percentage sign if present
        cleaned = value.replace('%', '').strip()
        return cleaned
    
    return value

@app.post("/api/deploy")
async def deploy_to_dashboard(data: dict):
    try:
        print("\n=== Deploy to Dashboard Request ===")
        print("Received data:", json.dumps(data, indent=2))
        
        new_records = data.get("records", [])
        if not new_records:
            print("No records provided in deploy request")
            return {"error": "No records provided"}
        
        print(f"Processing {len(new_records)} new records")
        
        # Clean decimal interests and normalize state in new records
        for record in new_records:
            if 'decimalInterest' in record:
                original_value = record['decimalInterest']
                cleaned_value = clean_decimal_interest(original_value)
                if original_value != cleaned_value:
                    print(f"Cleaned decimal interest: '{original_value}' -> '{cleaned_value}'")
                record['decimalInterest'] = cleaned_value
            if 'state' in record:
                orig_state = record['state']
                abbr = normalize_state(orig_state)
                if abbr != orig_state:
                    print(f"Normalized state: '{orig_state}' -> '{abbr}'")
                record['state'] = abbr
        
        # Ensure the dashboard data directory exists
        if not DASHBOARD_DATA_DIR.exists():
            print(f"Creating dashboard data directory: {DASHBOARD_DATA_DIR}")
            DASHBOARD_DATA_DIR.mkdir(parents=True, exist_ok=True)
        
        # Find the most recent file or create a new one
        json_files = glob.glob(str(DASHBOARD_DATA_DIR / "*.json"))
        existing_records = []
        
        if json_files:
            # Use the most recent file
            latest_file = max(json_files, key=lambda x: os.path.getctime(x))
            print(f"Using existing file: {latest_file}")
            try:
                with open(latest_file, 'r') as f:
                    file_data = json.load(f)
                    if isinstance(file_data, list):
                        existing_records = file_data
                    else:
                        existing_records = [file_data]
                    print(f"Loaded {len(existing_records)} existing records from {latest_file}")
            except Exception as e:
                print(f"Error reading existing file {latest_file}: {str(e)}")
                existing_records = []
        else:
            print("No existing dashboard files found, will create new one")
        
        # Create a unique key for each record to detect duplicates
        def get_record_key(record):
            return (
                record.get('propertyName', '').strip().lower(),
                record.get('operator', '').strip().lower(),
                record.get('entity', '').strip().lower(),
                record.get('effectiveDate', '').strip().lower()
            )
        
        # Create a set of existing record keys
        existing_keys = {get_record_key(rec) for rec in existing_records}
        print(f"Found {len(existing_keys)} unique existing records")
        
        # Filter out new records that are duplicates
        unique_new_records = []
        duplicates_found = 0
        
        for new_record in new_records:
            new_key = get_record_key(new_record)
            if new_key in existing_keys:
                print(f"Duplicate found and skipped: {new_record.get('propertyName', 'Unknown')}")
                duplicates_found += 1
            else:
                unique_new_records.append(new_record)
                existing_keys.add(new_key)
        
        print(f"Found {duplicates_found} duplicates, adding {len(unique_new_records)} unique records")
        
        # Combine existing records with unique new records
        combined_records = existing_records + unique_new_records
        
        # Determine the filename
        if json_files:
            # Update the existing file
            filename = latest_file
            print(f"Updating existing file: {filename}")
        else:
            # Create a new file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = DASHBOARD_DATA_DIR / f"dashboard_data_{timestamp}.json"
            print(f"Creating new file: {filename}")
        
        print(f"\nSaving {len(combined_records)} records to {filename}")
        print("First record example:", json.dumps(combined_records[0] if combined_records else {}, indent=2))
        
        # Save the combined records to the file
        try:
            with open(filename, "w") as f:
                json.dump(combined_records, f, indent=2)
            print(f"\nSuccessfully saved {len(combined_records)} records to {filename}")
            
            # Verify the file was written correctly
            with open(filename, 'r') as f:
                saved_data = json.load(f)
                if len(saved_data) != len(combined_records):
                    raise Exception(f"Data verification failed: expected {len(combined_records)} records, found {len(saved_data)}")
                print("Data verification successful")
            
            return {
                "message": f"Successfully deployed to dashboard ({duplicates_found} duplicates skipped)",
                "records_count": len(combined_records),
                "duplicates_skipped": duplicates_found,
                "new_records_added": len(unique_new_records),
                "filename": str(filename)
            }
        except Exception as e:
            print(f"Error saving to file: {str(e)}")
            print("Full traceback:")
            import traceback
            print(traceback.format_exc())
            raise
        
    except Exception as e:
        error_msg = f"Error deploying to dashboard: {str(e)}"
        print("\nError:", error_msg)
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        return {"error": error_msg}

@app.get("/api/dashboard")
async def get_dashboard_data():
    try:
        # Get all JSON files in the dashboard_data directory
        json_files = glob.glob(str(DASHBOARD_DATA_DIR / "*.json"))
        print(f"Found {len(json_files)} JSON files in {DASHBOARD_DATA_DIR}")
        
        if not json_files:
            return {"records": []}
        
        # Read only the most recent file
        latest_file = max(json_files, key=lambda x: os.path.getctime(x))
        print(f"Reading from most recent file: {latest_file}")
        
        with open(latest_file, 'r') as f:
            data = json.load(f)
            if isinstance(data, list):
                all_records = data
            else:
                all_records = [data]
        
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
        status = data.get('status', '')
        
        # Validate status if provided
        valid_statuses = ['Executed', 'Curative', 'Title issue', 'Pending Review']
        if status and status not in valid_statuses:
            return {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}
        
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
            # Update notes if provided
            if 'notes' in data:
                records[index]['notes'] = notes
            
            # Update status if provided
            if 'status' in data:
                records[index]['status'] = status
            
            # Save the updated records back to the file
            with open(file_path, 'w') as f:
                json.dump(records, f, indent=2)
                
            return {"success": True, "message": "Record updated successfully"}
        else:
            return {"error": "Invalid record index"}
            
    except Exception as e:
        print(f"Error updating dashboard record: {str(e)}")
        return {"error": str(e)}

@app.delete("/api/dashboard/delete")
async def delete_record(index: int):
    print("=" * 50)
    print("DELETE REQUEST RECEIVED!")
    print("=" * 50)
    try:
        print(f"Delete request received for index: {index}")
        print(f"Index type: {type(index)}")
        
        # Get all JSON files in the dashboard data directory
        try:
            json_files = [f for f in os.listdir(DASHBOARD_DATA_DIR) if f.endswith('.json')]
            print(f"Found {len(json_files)} JSON files: {json_files}")
        except Exception as e:
            print(f"Error listing files in {DASHBOARD_DATA_DIR}: {e}")
            raise HTTPException(status_code=500, detail=f"Error accessing dashboard data directory: {str(e)}")
        
        if not json_files:
            print("No JSON files found")
            raise HTTPException(status_code=404, detail="No dashboard data found")
            
        # Read the most recent file - use a more robust method
        try:
            latest_file = max(json_files, key=lambda x: os.path.getctime(os.path.join(DASHBOARD_DATA_DIR, x)))
        except Exception as e:
            print(f"Error finding latest file with getctime: {e}")
            # Fallback: use the last file alphabetically (should be the most recent timestamp)
            try:
                latest_file = sorted(json_files)[-1]
                print(f"Using fallback method, latest file: {latest_file}")
            except Exception as e2:
                print(f"Error with fallback method: {e2}")
                raise HTTPException(status_code=500, detail=f"Error finding latest file: {str(e2)}")
        
        file_path = os.path.join(DASHBOARD_DATA_DIR, latest_file)
        print(f"Using file: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"File does not exist: {file_path}")
            raise HTTPException(status_code=404, detail=f"Dashboard file not found: {latest_file}")
        
        # Read the file
        try:
            with open(file_path, 'r') as f:
                records = json.load(f)
        except Exception as e:
            print(f"Error reading file {file_path}: {e}")
            raise HTTPException(status_code=500, detail=f"Error reading dashboard file: {str(e)}")
            
        print(f"Loaded {len(records)} records from file")
        print(f"Attempting to delete record at index {index}")
        print(f"Records type: {type(records)}")
        
        # Validate index
        if not isinstance(index, int):
            print(f"Index is not an integer: {index} (type: {type(index)})")
            raise HTTPException(status_code=400, detail=f"Invalid index type: {type(index)}")
        
        if 0 <= index < len(records):
            try:
                deleted_record = records.pop(index)
                print(f"Deleted record: {deleted_record.get('propertyName', 'Unknown')}")
                
                # Save the updated records back to the file
                with open(file_path, 'w') as f:
                    json.dump(records, f, indent=2)
                    
                print(f"Successfully saved {len(records)} records back to file")
                return {"message": "Record deleted successfully"}
            except Exception as e:
                print(f"Error during delete operation: {e}")
                raise HTTPException(status_code=500, detail=f"Error during delete operation: {str(e)}")
        else:
            print(f"Invalid index {index}, records length: {len(records)}")
            raise HTTPException(status_code=404, detail=f"Record not found at index {index}")
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Unexpected error deleting record: {str(e)}")
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/dashboard/deduplicate")
async def deduplicate_dashboard():
    try:
        print("\n=== Deduplication Request ===")
        
        # Get all JSON files in the dashboard data directory
        json_files = glob.glob(str(DASHBOARD_DATA_DIR / "*.json"))
        if not json_files:
            return {"error": "No dashboard data found"}
        
        # Use the most recent file
        latest_file = max(json_files, key=lambda x: os.path.getctime(x))
        print(f"Deduplicating file: {latest_file}")
        
        # Load records
        with open(latest_file, 'r') as f:
            records = json.load(f)
        
        print(f"Loaded {len(records)} records for deduplication")
        
        # Create a unique key for each record to detect duplicates
        def get_record_key(record):
            return (
                record.get('propertyName', '').strip().lower(),
                record.get('operator', '').strip().lower(),
                record.get('entity', '').strip().lower(),
                record.get('effectiveDate', '').strip().lower()
            )
        
        # Deduplicate by keeping the first occurrence of each unique key
        seen_keys = set()
        deduped = []
        duplicates_removed = 0
        
        for record in records:
            key = get_record_key(record)
            if key in seen_keys:
                print(f"Removing duplicate: {record.get('propertyName', 'Unknown')} - {record.get('operator', 'Unknown')}")
                duplicates_removed += 1
            else:
                seen_keys.add(key)
                deduped.append(record)
        
        print(f"Removed {duplicates_removed} duplicates, keeping {len(deduped)} unique records")
        
        # Save the deduplicated records back to the same file
        with open(latest_file, 'w') as f:
            json.dump(deduped, f, indent=2)
        
        return {
            "message": f"Successfully deduplicated dashboard data",
            "duplicates_removed": duplicates_removed,
            "records_remaining": len(deduped),
            "file": latest_file
        }
    except Exception as e:
        print(f"Error during deduplication: {str(e)}")
        print("Full traceback:")
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 