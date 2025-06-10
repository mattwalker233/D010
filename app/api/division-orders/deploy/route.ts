import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { DivisionOrderInput } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data = await request.json() as DivisionOrderInput;
    
    // Basic validation
    if (!data.operator || !data.entity || !data.county || !data.state || !data.effectiveDate || !Array.isArray(data.wells) || data.wells.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Start a transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Create the division order
      const orderId = uuidv4();
      await db.run(
        `INSERT INTO division_orders (id, status, operator, entity, county, state, effective_date)
         VALUES (?, 'in_process', ?, ?, ?, ?, ?)`,
        [
          orderId,
          data.operator,
          data.entity,
          data.county,
          data.state,
          data.effectiveDate
        ]
      );

      // Create the wells
      for (const well of data.wells) {
        await db.run(
          `INSERT INTO wells (id, division_order_id, well_name, property_description, decimal_interest)
           VALUES (?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            orderId,
            well.wellName,
            well.propertyDescription,
            well.decimalInterest
          ]
      );
    }

      // Commit the transaction
      await db.run('COMMIT');

      // Verify the order was created
      const createdOrder = await db.get('SELECT * FROM division_orders WHERE id = ?', [orderId]);
      if (!createdOrder) {
        throw new Error('Failed to create division order');
      }

    return NextResponse.json({
      success: true,
        message: "Division order created successfully",
        orderId 
    });
    } catch (error) {
      // Rollback on error
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deploying division order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to deploy division order',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 