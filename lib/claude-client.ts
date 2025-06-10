import { DivisionOrder } from './types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function extractDivisionOrderData(text: string): Promise<DivisionOrder> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const systemPrompt = `You are an expert at extracting structured data from division order documents. 
Extract the following information from the provided text:
- Operator name
- Entity name
- County
- State (two-letter code)
- Effective date
- Well information: For each well mentioned in the document, extract:
  * wellName: The name or identifier of the well
  * propertyDescription: The legal description or location of the property
  * decimalInterest: The decimal interest (as a number between 0 and 1)

Format the response as a JSON object with these fields. The wells field should be an array of objects, each containing wellName, propertyDescription, and decimalInterest.

Example format:
{
  "operator": "Example Operator",
  "entity": "Example Entity",
  "county": "Example County",
  "state": "TX",
  "effectiveDate": "2024-03-20",
  "wells": [
    {
      "wellName": "Smith #1",
      "propertyDescription": "Section 1, Block A, Survey 123",
      "decimalInterest": 0.125
    }
  ]
}`;

  try {
    console.log('Sending request to Claude API...');
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please analyze this division order document and extract the key information:\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error response:', errorData);
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Claude API response received');

    const extractedText = data.content[0]?.text;
    if (!extractedText) {
      throw new Error('No response content from Claude API');
    }

    // Find the JSON object in the response
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Raw Claude response:', extractedText);
      throw new Error('No JSON found in Claude response');
    }

    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('Parsed Claude response:', parsedData);

      // Ensure the data matches our DivisionOrder type
      const divisionOrder: DivisionOrder = {
        id: `DO-${Date.now()}`,
        operator: parsedData.operator || 'Unknown Operator',
        entity: parsedData.entity || 'Unknown Entity',
        effectiveDate: parsedData.effectiveDate || new Date().toISOString().split('T')[0],
        county: parsedData.county || 'Unknown County',
        state: parsedData.state || 'TX',
        status: "in_process" as const,
        wells: (parsedData.wells || []).map((well: any) => ({
          id: `well-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orderId: `DO-${Date.now()}`,
          wellName: well.wellName || 'Unknown Well',
          propertyDescription: well.propertyDescription || 'No description available',
          decimalInterest: well.decimalInterest || 0
        })),
        notes: parsedData.notes || 'Data extracted from PDF'
      };

      return divisionOrder;
    } catch (parseError: unknown) {
      console.error('Error parsing Claude response:', parseError);
      throw new Error(`Failed to parse Claude response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    console.error('Error in Claude API integration:', error);
    throw error;
  }
} 