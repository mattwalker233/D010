import type { DivisionOrder } from './types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface ClaudeResponse {
  content: Array<{
    text: string;
    type: 'text';
  }>;
  role: string;
  model: string;
  id: string;
}

export async function extractDivisionOrderData(text: string, stateCode: string): Promise<DivisionOrder> {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not configured');
  }

  const systemPrompt = `You are an expert at analyzing division order documents. Extract key information from the provided text into a structured format.
Focus on identifying:
- Operator name
- Entity/Owner name
- Effective date
- County and state
- Well information (name, property description, decimal interest)
- Any additional relevant details

Format the information exactly as shown in this example:
{
  "operator": "Example Oil Co",
  "entity": "John Smith Trust",
  "effectiveDate": "2024-03-20",
  "county": "Reeves County",
  "state": "TX",
  "wells": [
    {
      "wellName": "Smith 1H",
      "propertyDescription": "Section 14, Block A",
      "decimalInterest": 0.125
    }
  ],
  "notes": "Additional relevant details"
}`;

  const userMessage = `Please analyze this division order document text and extract the key information in the specified JSON format. State code: ${stateCode}\n\nDocument text:\n${text}`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data: ClaudeResponse = await response.json();
    const extractedText = data.content[0]?.text;

    if (!extractedText) {
      throw new Error('No response content from Claude API');
    }

    // Find the JSON object in the response
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Ensure the data matches our DivisionOrder type
    const divisionOrder: DivisionOrder = {
      id: `DO-${Date.now()}`,
      operator: parsedData.operator,
      entity: parsedData.entity,
      effectiveDate: parsedData.effectiveDate,
      county: parsedData.county,
      state: stateCode,
      status: "in_process" as const,
      wells: parsedData.wells.map((well: any) => ({
        wellName: well.wellName,
        propertyDescription: well.propertyDescription,
        decimalInterest: well.decimalInterest
      })),
      notes: parsedData.notes
    };

    return divisionOrder;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
} 