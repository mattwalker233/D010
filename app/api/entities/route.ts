import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/entities - Get all entities
export async function GET() {
  try {
    const entities = await prisma.entity.findMany({
      orderBy: {
        entity_name: 'asc'
      }
    });
    return NextResponse.json(entities);
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
    const { entity_name, sticker_info, signature } = body;

    if (!entity_name) {
      return NextResponse.json(
        { error: 'Entity name is required' },
        { status: 400 }
      );
    }

    if (!sticker_info) {
      return NextResponse.json(
        { error: 'Sticker info is required' },
        { status: 400 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature is required' },
        { status: 400 }
      );
    }

    const entity = await prisma.entity.create({
      data: {
        entity_name,
        sticker_info,
        signature,
      },
    });

    return NextResponse.json(entity);
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

    await prisma.entity.delete({
      where: {
        id: id
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting entity:', error);
    return NextResponse.json(
      { error: 'Failed to delete entity' },
      { status: 500 }
    );
  }
} 