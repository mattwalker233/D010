import type { DivisionOrder } from '../types'

export async function loadDivisionOrder(data: {
  fileName: string;
  extractedData: {
    operator: string;
    entity: string;
    effectiveDate: string;
    county: string;
    wells: Array<{
      wellName: string;
      propertyDescription: string;
      royaltyInterest?: number;
      tractAcres?: number;
    }>;
    confidence: number;
    additionalDetails?: Record<string, any>;
  };
}) {
  try {
    const response = await fetch('/api/division-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data as DivisionOrder;
  } catch (error) {
    console.error('Error loading division order:', error);
    throw error;
  }
}

// Example usage:
/*
const newDivisionOrder = await loadDivisionOrder({
  fileName: "MultiWell_DivisionOrder_2024.pdf",
  extractedData: {
    operator: "XYZ Energy Corporation",
    entity: "Blackrock Minerals LLC",
    effectiveDate: "2024-03-15",
    county: "Midland",
    wells: [
      {
        wellName: "Bobcat 23-1H",
        propertyDescription: "Section 23, Block 4, 160 acres",
        royaltyInterest: 0.125,
        tractAcres: 160
      },
      {
        wellName: "Bobcat 23-2H",
        propertyDescription: "Section 23, Block 4, 160 acres",
        royaltyInterest: 0.125,
        tractAcres: 160
      }
    ],
    confidence: 0.95,
    additionalDetails: {
      leaseNumber: "L-12345",
      fieldName: "Permian Basin"
    }
  }
});
*/ 