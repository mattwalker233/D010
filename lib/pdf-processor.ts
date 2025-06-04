/**
 * This is a temporary implementation that returns mock data.
 * It will be replaced with actual OCR and Claude API integration later.
 */

import type { DivisionOrder } from './types';
import { PDFExtract } from 'pdf.js-extract';

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

export interface ExtractedPDFData {
  text: string;
  pageCount: number;
  metadata?: {
    info?: {
      PDFFormatVersion?: string;
      IsAcroFormPresent?: boolean;
      IsCollectionPresent?: boolean;
      IsLinearized?: boolean;
      IsXFAPresent?: boolean;
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
    };
  };
}

/**
 * Process a PDF file and extract text and metadata
 * @param buffer PDF file buffer
 * @returns Extracted PDF data including text and metadata
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedPDFData> {
  try {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(buffer);

    // Combine all page content into a single string
    const fullText = data.pages
      .map(page => 
        page.content
          .map(item => item.str)
          .join(' ')
      )
      .join('\n\n');

    return {
      text: fullText,
      pageCount: data.pages.length,
      metadata: {
        info: data.meta?.info
      }
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
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
