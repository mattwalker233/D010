import { Anthropic } from '@anthropic-ai/sdk';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface WellInfo {
  wellName?: string;
  apiNumber?: string;
  county?: string;
  state?: string;
  field?: string;
  operator?: string;
}

interface InterestOwner {
  name?: string;
  decimalInterest?: string;
  address?: string;
  taxId?: string;
}

interface DivisionOrder {
  wellInfo: WellInfo;
  interestOwners: InterestOwner[];
  effectiveDate?: string;
  specialProvisions?: string[];
}

export async function processPDF(buffer: Buffer): Promise<DivisionOrder> {
  try {
    console.log('=== Starting PDF processing ===');
    console.log('Input buffer size:', buffer.length);

    // First parse the PDF to get text content
    console.log('Parsing PDF with pdf-parse...');
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;
    console.log('PDF parsed successfully. Text length:', text.length);
    
    // Write extracted text to a file for debugging
    const debugDir = path.join(process.cwd(), 'debug');
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir);
    }
    fs.writeFileSync(path.join(debugDir, 'extracted-text.txt'), text);
    console.log('Extracted text written to debug/extracted-text.txt');

    // First try to extract basic information using regex
    console.log('Extracting basic information with regex...');
    const extractedData: DivisionOrder = {
      wellInfo: extractWellInfo(text),
      interestOwners: extractInterestOwners(text),
      effectiveDate: extractEffectiveDate(text),
      specialProvisions: extractSpecialProvisions(text)
    };
    console.log('Basic information extracted:', JSON.stringify(extractedData, null, 2));

    // Write extracted data to a file for debugging
    fs.writeFileSync(
      path.join(debugDir, 'extracted-data.json'),
      JSON.stringify(extractedData, null, 2)
    );
    console.log('Extracted data written to debug/extracted-data.json');

    // Then use Claude to verify and enhance the extracted data
    try {
      console.log('Starting Claude analysis...');
      // Truncate text if it's too long to avoid rate limits
      const maxTextLength = 2000; // Reduced from 4000 to avoid rate limits
      const truncatedText = text.length > maxTextLength 
        ? text.substring(0, maxTextLength) + '...' 
        : text;
      console.log('Text truncated to length:', truncatedText.length);

      const enhancedData = await analyzeWithClaude(truncatedText, extractedData);
      console.log('Claude analysis completed:', JSON.stringify(enhancedData, null, 2));
      
      // Validate that enhancedData is actually JSON
      if (typeof enhancedData === 'string') {
        console.log('Claude returned string response, attempting to parse as JSON...');
        try {
          const parsedData = JSON.parse(enhancedData);
          console.log('Successfully parsed Claude response as JSON');
          return {
            ...extractedData,
            ...parsedData,
            interestOwners: parsedData.interestOwners || extractedData.interestOwners,
            wellInfo: { ...extractedData.wellInfo, ...parsedData.wellInfo }
          };
        } catch (parseError) {
          console.warn('Failed to parse Claude response as JSON:', parseError);
          return extractedData;
        }
      }

      console.log('Returning enhanced data from Claude');
      return {
        ...extractedData,
        ...enhancedData,
        interestOwners: enhancedData.interestOwners || extractedData.interestOwners,
        wellInfo: { ...extractedData.wellInfo, ...enhancedData.wellInfo }
      };
    } catch (error) {
      console.warn('Claude analysis failed, using regex-extracted data:', error);
      // If Claude fails, return the regex-extracted data
      return extractedData;
    }
  } catch (error) {
    console.error('=== Error in processPDF ===');
    console.error('Error details:', error);
    throw error;
  }
}

function extractWellInfo(text: string): WellInfo {
  const wellInfo: WellInfo = {};
  
  // Extract API Number (typically 10 digits)
  const apiMatch = text.match(/API\s*#?\s*(\d{10})/i);
  if (apiMatch) wellInfo.apiNumber = apiMatch[1];

  // Extract Well Name (typically after "Well Name:" or similar)
  const wellNameMatch = text.match(/Well\s*Name:?\s*([^\n]+)/i);
  if (wellNameMatch) wellInfo.wellName = wellNameMatch[1].trim();

  // Extract County and State
  const countyStateMatch = text.match(/([A-Za-z\s]+)\s*County,\s*([A-Z]{2})/i);
  if (countyStateMatch) {
    wellInfo.county = countyStateMatch[1].trim();
    wellInfo.state = countyStateMatch[2];
  }

  // Extract Field
  const fieldMatch = text.match(/Field:?\s*([^\n]+)/i);
  if (fieldMatch) wellInfo.field = fieldMatch[1].trim();

  // Extract Operator
  const operatorMatch = text.match(/Operator:?\s*([^\n]+)/i);
  if (operatorMatch) wellInfo.operator = operatorMatch[1].trim();

  return wellInfo;
}

function extractInterestOwners(text: string): InterestOwner[] {
  const owners: InterestOwner[] = [];
  
  // Look for sections that typically contain interest owner information
  const ownerSections = text.split(/(?:Interest Owner|Owner|Party):/i);
  
  for (const section of ownerSections.slice(1)) {
    const owner: InterestOwner = {};
    
    // Extract name (typically first line)
    const nameMatch = section.match(/^([^\n]+)/);
    if (nameMatch) owner.name = nameMatch[1].trim();
    
    // Extract decimal interest
    const interestMatch = section.match(/(\d+\.\d+)\s*%/);
    if (interestMatch) owner.decimalInterest = interestMatch[1];
    
    // Extract address (typically multiple lines)
    const addressMatch = section.match(/(?:Address|Location):\s*([^\n]+(?:\n[^\n]+){0,3})/i);
    if (addressMatch) owner.address = addressMatch[1].trim();
    
    // Extract Tax ID
    const taxIdMatch = section.match(/(?:Tax ID|EIN|SSN):\s*([^\n]+)/i);
    if (taxIdMatch) owner.taxId = taxIdMatch[1].trim();
    
    if (owner.name || owner.decimalInterest) {
      owners.push(owner);
    }
  }
  
  return owners;
}

function extractEffectiveDate(text: string): string | undefined {
  const dateMatch = text.match(/(?:Effective|Commencement)\s*Date:?\s*([^\n]+)/i);
  return dateMatch ? dateMatch[1].trim() : undefined;
}

function extractSpecialProvisions(text: string): string[] {
  const provisions: string[] = [];
  
  // Look for sections that typically contain special provisions
  const provisionSections = text.split(/(?:Special Provisions|Notes|Remarks):/i);
  
  if (provisionSections.length > 1) {
    const provisionText = provisionSections[1].split(/\n\n/)[0];
    const lines = provisionText.split('\n').map(line => line.trim()).filter(line => line);
    provisions.push(...lines);
  }
  
  return provisions;
}

async function analyzeWithClaude(text: string, extractedData: DivisionOrder): Promise<any> {
  try {
    // Create message for Claude with a more concise prompt
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 2048, // Reduced from 4096
      messages: [{
        role: 'user',
        content: `Verify and enhance this division order data. Extracted data:
${JSON.stringify(extractedData, null, 2)}

Text:
${text}

Return JSON with corrections or additions.`
      }]
    });

    // Extract the JSON response
    const response = message.content[0].text;
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.warn('Failed to parse Claude response as JSON:', parseError);
      return extractedData;
    }
  } catch (error: any) {
    if (error.status === 429) {
      console.warn('Rate limit exceeded, using regex-extracted data');
      return extractedData;
    }
    throw error;
  }
}

// Custom page renderer to handle worker script errors
async function renderPage(pageData: any) {
  try {
    return pageData.getTextContent();
  } catch (error) {
    console.warn('Error rendering page:', error);
    return { items: [] };
  }
} 