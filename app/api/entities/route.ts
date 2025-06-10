import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { entities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/entities - Get all entities
export async function GET() {
  try {
    const allEntities = await db.select().from(entities);
    return NextResponse.json(allEntities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    );
  }
}

// POST /api/entities - Create a new entity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, taxId, phone, email, address } = body;

    if (!name || !taxId) {
      return NextResponse.json(
        { error: 'Name and Tax ID are required' },
        { status: 400 }
      );
    }

    const newEntity = await db.insert(entities).values({
      name,
      taxId,
      phone,
      email,
      address,
    }).returning();

    return NextResponse.json(newEntity[0]);
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json(
      { error: 'Failed to create entity' },
      { status: 500 }
    );
  }
}

// DELETE /api/entities?id=123 - Delete an entity
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entity ID is required' },
        { status: 400 }
      );
    }

    await db.delete(entities).where(eq(entities.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting entity:', error);
    return NextResponse.json(
      { error: 'Failed to delete entity' },
      { status: 500 }
    );
  }
} 