import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const specs = await prisma.spec.findMany({
      include: {
        type: {
          include: {
            category: true,
          },
        },
        value: true,
      },
    });
    return NextResponse.json(specs);
  } catch (error) {
    console.error('Error fetching specs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, typeID } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required and must be a non-empty string' }, { status: 400 });
    }

    if (!typeID || typeof typeID !== 'number' || typeID <= 0) {
      return NextResponse.json({ error: 'Valid typeID is required' }, { status: 400 });
    }

    // Check if type exists
    const type = await prisma.type.findUnique({
      where: { id: typeID },
    });

    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    const spec = await prisma.spec.create({
      data: {
        name: name.trim(),
        typeID,
      },
      include: {
        type: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(spec, { status: 201 });
  } catch (error) {
    console.error('Error creating spec:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Spec name must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}