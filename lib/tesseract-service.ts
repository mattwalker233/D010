import { createWorker, PSM } from 'tesseract.js';
import type { ExtractedData } from './types';

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

export async function extractTextFromImage(buffer: Buffer): Promise<ExtractedData> {
  console.log('Starting OCR processing...');
  const worker = await createWorker();

  try {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text, confidence } } = await worker.recognize(buffer);
    console.log('OCR processing complete. Confidence:', confidence);

    // Extract specific fields from the text
    const extractedData = extractFieldsFromText(text);
    
    return {
      text: text || '',
      confidence: confidence || 0,
      tractSize: extractedData.tractSize || '',
      royaltyInterest: extractedData.royaltyInterest || '',
      sectionNumber: extractedData.sectionNumber || '',
      county: extractedData.county || '',
      operator: extractedData.operator || '',
      propertyDescription: extractedData.propertyDescription || '',
      entity: extractedData.entity || '',
      effectiveDate: extractedData.effectiveDate || '',
      preparedDate: extractedData.preparedDate || '',
      ownerNames: extractedData.ownerNames || [],
      wellNames: extractedData.wellNames || [],
      totalTractAcreage: extractedData.totalTractAcreage || 0,
      averageRoyaltyRate: extractedData.averageRoyaltyRate || 0,
      sectionBreakdowns: extractedData.sectionBreakdowns || [],
      allocationValid: extractedData.allocationValid || false,
      confidenceScores: extractedData.confidenceScores || {}
    };
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw error;
  } finally {
    await worker.terminate();
  }
}

function extractFieldsFromText(text: string): Partial<ExtractedData> {
  // Initialize extracted data with default values
  const extractedData: Partial<ExtractedData> = {
    tractSize: '',
    royaltyInterest: '',
    sectionNumber: '',
    county: '',
    ownerNames: [],
    wellNames: [],
  };

  // Extract tract size (looking for patterns like "320 acres" or "160.5 acres")
  const tractSizeMatch = text.match(/(\d+(?:\.\d+)?)\s*acres?/i);
  if (tractSizeMatch) {
    extractedData.tractSize = tractSizeMatch[0];
    extractedData.totalTractAcreage = parseFloat(tractSizeMatch[1]);
  }

  // Extract royalty interest (looking for patterns like "18.75%" or "3/16")
  const royaltyMatch = text.match(/(\d+(?:\.\d+)?%)|(\d+\/\d+)/);
  if (royaltyMatch) {
    extractedData.royaltyInterest = royaltyMatch[0];
    // Convert fraction to decimal if necessary
    if (royaltyMatch[2]) {
      const [numerator, denominator] = royaltyMatch[2].split('/').map(Number);
      extractedData.averageRoyaltyRate = numerator / denominator;
    } else if (royaltyMatch[1]) {
      extractedData.averageRoyaltyRate = parseFloat(royaltyMatch[1]) / 100;
    }
  }

  // Extract section number (looking for patterns like "Section 14" or "Sec. 23")
  const sectionMatch = text.match(/(?:section|sec\.?)\s*(\d+)/i);
  if (sectionMatch) {
    extractedData.sectionNumber = `Section ${sectionMatch[1]}`;
  }

  // Extract county (looking for "County" or "Parish")
  const countyMatch = text.match(/([A-Za-z]+)\s+(?:County|Parish)/i);
  if (countyMatch) {
    extractedData.county = countyMatch[0];
  }

  // Extract operator name (looking for common operator indicators)
  const operatorMatch = text.match(/(?:operated by|operator:?)\s+([A-Za-z\s]+)(?:,|\.|$)/i);
  if (operatorMatch) {
    extractedData.operator = operatorMatch[1].trim();
  }

  // Extract property description
  const propertyMatch = text.match(/(?:property description:?|legal description:?)\s+([^.]+)/i);
  if (propertyMatch) {
    extractedData.propertyDescription = propertyMatch[1].trim();
  }

  // Extract effective date
  const effectiveDateMatch = text.match(/(?:effective date:?|as of:?)\s+(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/i);
  if (effectiveDateMatch) {
    extractedData.effectiveDate = effectiveDateMatch[1];
  }

  // Extract prepared date
  const preparedDateMatch = text.match(/(?:prepared:?|dated:?)\s+(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/i);
  if (preparedDateMatch) {
    extractedData.preparedDate = preparedDateMatch[1];
  }

  // Extract entity name
  const entityMatch = text.match(/(?:entity:?|company:?|corporation:?)\s+([A-Za-z\s,\.]+)(?:,|\.|$)/i);
  if (entityMatch) {
    extractedData.entity = entityMatch[1].trim();
  }

  return extractedData;
} 