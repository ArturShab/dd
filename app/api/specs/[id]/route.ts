import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const spec = await prisma.spec.findUnique({
      where: { id },
      include: {
        type: {
          include: {
            category: true,
          },
        },
        value: true,
      },
    });

    if (!spec) {
      return NextResponse.json({ error: 'Spec not found' }, { status: 404 });
    }

    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error fetching spec:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, typeID } = body;

    const updateData: { name?: string; typeID?: number } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: 'Name must be a non-empty string' }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (typeID !== undefined) {
      if (typeof typeID !== 'number' || typeID <= 0) {
        return NextResponse.json({ error: 'Valid typeID is required' }, { status: 400 });
      }

      // Check if type exists
      const type = await prisma.type.findUnique({
        where: { id: typeID },
      });

      if (!type) {
        return NextResponse.json({ error: 'Type not found' }, { status: 404 });
      }

      updateData.typeID = typeID;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least one field must be provided for update' }, { status: 400 });
    }

    const spec = await prisma.spec.update({
      where: { id },
      data: updateData,
      include: {
        type: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error updating spec:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Spec not found' }, { status: 404 });
      }
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Spec name must be unique' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.spec.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Spec deleted successfully' });
  } catch (error) {
    console.error('Error deleting spec:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Spec not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}