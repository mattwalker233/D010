/**
 * This is a temporary implementation that returns mock data.
 * It will be replaced with actual OCR and Claude API integration later.
 */

import type { DivisionOrder } from './types';

interface ExtractedText {
  text: string;
  confidence: number;
  pageCount: number;
}

interface ProcessedData {
  text: string;
  entity?: string;
  wellName?: string;
  county?: string;
  decimalInterest?: number;
  section?: string;
  propertyDescription?: string;
  effectiveDate?: string;
  preparedDate?: string;
  township?: string;
  range?: string;
  confidenceScore: number;
}

/**
 * Process a PDF file and extract structured data using OCR and Claude
 * @param buffer PDF file buffer
 * @param fileType File MIME type
 * @param stateCode Two-letter state code
 * @returns Processed division order data
 */
export async function processPDF(buffer: Buffer, fileType: string, stateCode: string): Promise<ProcessedData> {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Please set CLAUDE_API_KEY in your environment variables.');
  }

  if (!process.env.OCR_API_KEY) {
    throw new Error('OCR API key not configured. Please set OCR_API_KEY in your environment variables.');
  }

  try {
    // TODO: Implement OCR processing
    // const extractedText = await performOCR(buffer);

    // TODO: Process extracted text with Claude
    // const structuredData = await processWithClaude(extractedText.text, stateCode);

    throw new Error('PDF processing not yet implemented. Please configure OCR and Claude API integration.');
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

/**
 * Get default county for a state
 */
export function getDefaultCounty(stateCode: string): string {
  const countyMap: Record<string, string> = {
    TX: "Reeves County",
    OK: "Kingfisher County",
    NM: "Lea County",
    ND: "McKenzie County",
    PA: "Washington County",
    OH: "Belmont County",
    LA: "Caddo Parish",
    WV: "Doddridge County",
  }
  return countyMap[stateCode] || "Unknown County"
}

/**
 * Create fallback data for error cases
 */
export function createFallbackData(stateCode: string, operatorName: string): DivisionOrder {
  const county = getDefaultCounty(stateCode)

  return {
    id: `DO-${Date.now()}`,
    operator: operatorName,
    entity: "Error Processing Document",
    county: county,
    state: stateCode,
    effectiveDate: new Date().toISOString().split('T')[0],
    status: "title_issue" as const,
    wells: [{
      wellName: "Error Processing Well",
      propertyDescription: "Error processing document. Please try again or contact support.",
      decimalInterest: 0
    }],
    notes: "Error occurred during document processing"
  }
}
