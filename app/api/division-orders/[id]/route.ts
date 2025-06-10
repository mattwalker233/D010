import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DivisionOrder } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json() as Partial<DivisionOrder>;
    const db = await getDb();

    // Start a transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Update division order
      if (data.status || data.operator || data.entity || data.county || data.state || data.effectiveDate) {
        const updates = [];
        const values = [];

        if (data.status) {
          updates.push('status = ?');
          values.push(data.status);
        }
        if (data.operator) {
          updates.push('operator = ?');
          values.push(data.operator);
        }
        if (data.entity) {
          updates.push('entity = ?');
          values.push(data.entity);
        }
        if (data.county) {
          updates.push('county = ?');
          values.push(data.county);
        }
        if (data.state) {
          updates.push('state = ?');
          values.push(data.state);
        }
        if (data.effectiveDate) {
          updates.push('effective_date = ?');
          values.push(data.effectiveDate);
        }

        if (updates.length > 0) {
          values.push(params.id);
          await db.run(
            `UPDATE division_orders SET ${updates.join(', ')} WHERE id = ?`,
            values
          );
        }
      }

      // Update wells if provided
      if (data.wells) {
        // Delete existing wells
        await db.run('DELETE FROM wells WHERE division_order_id = ?', [params.id]);

        // Insert new wells
        for (const well of data.wells) {
          await db.run(
            `INSERT INTO wells (id, division_order_id, well_name, property_description, decimal_interest)
             VALUES (?, ?, ?, ?, ?)`,
            [
              well.id || uuidv4(),
              params.id,
              well.wellName,
              well.propertyDescription,
              well.decimalInterest
            ]
          );
        }
      }

      // Commit the transaction
      await db.run('COMMIT');

      return NextResponse.json({ 
        success: true, 
        message: "Division order updated successfully" 
      });
    } catch (error) {
      // Rollback on error
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating division order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update division order' },
      { status: 500 }
    );
  }
} 