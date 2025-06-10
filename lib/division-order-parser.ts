import { DivisionOrderData } from '../types/division-order';

export function extractDivisionOrderData(text: string): DivisionOrderData {
  try {
    // Extract operator name from text if possible
    const operatorMatch = text.match(/(?:Operator|Company):\s*([A-Za-z\s]+)/i) ||
                         text.match(/([A-Za-z\s]+)(?:\s*[-_]\s*|\s+)(?:DO|Division\s*Order)/i);
    const operator = operatorMatch ? operatorMatch[1].trim() : 'Unknown Operator';

    // Extract entity name if possible
    const entityMatch = text.match(/(?:Entity|Interest Owner):\s*([A-Za-z\s]+)/i);
    const entity = entityMatch ? entityMatch[1].trim() : 'Unknown Entity';

    // Extract county if possible
    const countyMatch = text.match(/(?:County):\s*([A-Za-z\s]+)/i);
    const county = countyMatch ? countyMatch[1].trim() : 'Unknown County';

    // Extract state if possible
    const stateMatch = text.match(/(?:State):\s*([A-Z]{2})/i);
    const state = stateMatch ? stateMatch[1].toUpperCase() : 'TX';

    // Extract effective date if possible
    const dateMatch = text.match(/(?:Effective Date|Date):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    const effectiveDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    const timestamp = Date.now();
    return {
      id: `do_${timestamp}`,
      status: 'in_process',
      operator: operator || 'Unknown Operator', // Ensure this is never null
      entity: entity || 'Unknown Entity',       // Ensure this is never null
      county: county || 'Unknown County',       // Ensure this is never null
      state: state || 'TX',                     // Ensure this is never null
      effective_date: effectiveDate,
      notes: 'Data extracted from PDF'
    };
  } catch (error) {
    console.error('Error parsing division order data:', error);
    // Return fallback data if parsing fails
    const timestamp = Date.now();
    return {
      id: `do_${timestamp}`,
      status: 'in_process',
      operator: 'Unknown Operator', // Ensure this is never null
      entity: 'Unknown Entity',     // Ensure this is never null
      county: 'Unknown County',     // Ensure this is never null
      state: 'TX',                  // Ensure this is never null
      effective_date: new Date().toISOString().split('T')[0],
      notes: 'Data extracted from PDF (fallback)'
    };
  }
} 