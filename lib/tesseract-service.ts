import { createWorker } from 'tesseract.js';

export interface TesseractResponse {
  text: string;
  confidence: number;
  formFields: Record<string, string>;
  preview?: {
    tractSize: string | null;
    royaltyInterest: string | null;
    sectionNumber: string | null;
    ownerNames: string[];
  };
}

// Initialize worker for each request (serverless environment)
async function initializeWorker() {
  const worker = await createWorker({
    // Use web assembly for better compatibility
    workerPath: 'https://unpkg.com/tesseract.js@v4.1.1/dist/worker.min.js',
    corePath: 'https://unpkg.com/tesseract.js-core@v4.0.3/tesseract-core.wasm',
    logger: m => console.log('Tesseract Progress:', m)
  });

  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
}

/**
 * Process a document using Tesseract OCR and prepare preview data
 * @param buffer Document buffer
 * @returns Extracted text, confidence score, form fields, and preview data
 */
export async function processDocument(buffer: Buffer): Promise<TesseractResponse> {
  let worker = null;
  try {
    console.log('Initializing OCR worker...');
    worker = await initializeWorker();

    console.log('Processing document with OCR...');
    const { data: { text, confidence } } = await worker.recognize(buffer, {
      // Configure recognition parameters
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,%$-: ',
      preserve_interword_spaces: '1',
    });
    console.log('OCR processing complete. Confidence:', confidence);

    // Extract form fields using pattern matching
    const formFields: Record<string, string> = {};
    const lines = text.split('\n');
    
    console.log('Extracting form fields...');
    
    // Preview data structure
    const preview = {
      tractSize: null as string | null,
      royaltyInterest: null as string | null,
      sectionNumber: null as string | null,
      ownerNames: [] as string[],
    };

    // Process each line for both form fields and preview data
    for (const line of lines) {
      // Look for patterns like "Field: Value" or "Field - Value"
      const matches = line.match(/^([^:|-]+)[:|-]\s*(.+)$/);
      if (matches) {
        const [, key, value] = matches;
        formFields[key.toLowerCase().trim()] = value.trim();
      }

      // Extract tract size (e.g., "320 acres", "160.5 acres")
      const tractSizeMatch = line.match(/(\d+(?:\.\d+)?)\s*acres?/i);
      if (tractSizeMatch && !preview.tractSize) {
        preview.tractSize = tractSizeMatch[0];
      }

      // Extract royalty interest (e.g., "18.75%", "0.1875")
      const royaltyMatch = line.match(/(\d+(?:\.\d+)?)\s*%|\b0?\.\d+\b/);
      if (royaltyMatch && !preview.royaltyInterest) {
        preview.royaltyInterest = royaltyMatch[0];
      }

      // Extract section numbers (e.g., "Section 14", "Sec. 23")
      const sectionMatch = line.match(/(?:section|sec\.?)\s*(\d+)/i);
      if (sectionMatch && !preview.sectionNumber) {
        preview.sectionNumber = `Section ${sectionMatch[1]}`;
      }

      // Look for potential owner names (capitalized words)
      if (/^[A-Z][A-Za-z\s,\.]+$/.test(line.trim())) {
        preview.ownerNames.push(line.trim());
      }
    }

    return {
      text,
      confidence,
      formFields,
      preview
    };
  } catch (error) {
    console.error('Error processing document with Tesseract:', error);
    throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Always cleanup worker in serverless environment
    if (worker) {
      await worker.terminate();
    }
  }
} 