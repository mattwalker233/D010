import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DivisionOrder, Well } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface DbOrder {
  id: string;
  status: string;
  operator: string;
  entity: string;
  county: string;
  state: string;
  effective_date: string;
  notes: string | null;
  wells: string;
}

export async function GET() {
  try {
    const db = await getDb();

    // Get all division orders with their wells
    const orders = await db.all(`
      SELECT 
        d.*,
        json_group_array(
          json_object(
            'id', w.id,
            'orderId', w.division_order_id,
            'wellName', w.well_name,
            'propertyDescription', w.property_description,
            'decimalInterest', w.decimal_interest
          )
        ) as wells
      FROM division_orders d
      LEFT JOIN wells w ON w.division_order_id = d.id
      GROUP BY d.id
    `) as DbOrder[];

    // Parse the wells JSON string for each order
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      operator: order.operator,
      entity: order.entity,
      county: order.county,
      state: order.state,
      effectiveDate: order.effective_date,
      notes: order.notes || '',
      wells: JSON.parse(order.wells || '[]') as Well[]
    })) as DivisionOrder[];

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching division orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch division orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
    console.error('Error creating division order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create division order' },
      { status: 500 }
    );
  }
}
