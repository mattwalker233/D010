import type { DivisionOrder } from '../types'

export async function loadDivisionOrder(data: {
  fileName: string;
  extractedData: {
    operator_name: string;
    entity_name: string;
    effective_date: string;
    county: string;
    state: string;
    well_information: Array<{
      name: string;
      property_description: string;
      decimal_interest: string;
    }>;
  };
}) {
  try {
    console.log('Expected data structure:', {
      fileName: 'string',
      extractedData: {
        operator_name: 'string',
        entity_name: 'string',
        effective_date: 'string',
        county: 'string',
        state: 'string',
        well_information: [{
          name: 'string',
          property_description: 'string',
          decimal_interest: 'string'
        }]
      }
    });
    
    console.log('Received data:', data);

    // Transform the data to match the database schema
    const transformedData = {
      operator: data.extractedData.operator_name,
      entity: data.extractedData.entity_name,
      effectiveDate: data.extractedData.effective_date,
      county: data.extractedData.county,
      state: data.extractedData.state,
      wells: data.extractedData.well_information.map(well => ({
        wellName: well.name,
        propertyDescription: well.property_description,
        decimalInterest: parseFloat(well.decimal_interest)
      }))
    };

    console.log('Transformed data for database:', transformedData);

    const response = await fetch('/api/division-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
    operator_name: "XYZ Energy Corporation",
    entity_name: "Blackrock Minerals LLC",
    effective_date: "2024-03-15",
    county: "Midland",
    state: "Texas",
    well_information: [
      {
        name: "Bobcat 23-1H",
        property_description: "Section 23, Block 4, 160 acres",
        decimal_interest: "0.125"
      },
      {
        name: "Bobcat 23-2H",
        property_description: "Section 23, Block 4, 160 acres",
        decimal_interest: "0.125"
      }
    ]
  }
});
*/ 