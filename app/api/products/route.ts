import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ProductCreatePayload = {
  name: string;
  typeID: number;
  price: number;
  quantity: number;
  description?: string;
  specs?: Array<{
    specID: number;
    value: string;
  }>;
};

type PrismaError = {
  code?: string;
};

const isPrismaError = (error: unknown): error is PrismaError =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  typeof (error as { code?: unknown }).code === 'string';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        type: true,
        specs: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProductCreatePayload;
    const { name, typeID, price, quantity, description, specs } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required and must be a non-empty string' }, { status: 400 });
    }

    if (!typeID || typeof typeID !== 'number' || typeID <= 0) {
      return NextResponse.json({ error: 'Valid typeID is required' }, { status: 400 });
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Description must be a string' }, { status: 400 });
    }

    const type = await prisma.type.findUnique({ where: { id: typeID } });
    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    // Validate specs if provided
    if (specs !== undefined) {
      if (!Array.isArray(specs)) {
        return NextResponse.json({ error: 'specs must be an array' }, { status: 400 });
      }
      for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        if (!spec.specID || typeof spec.specID !== 'number' || spec.specID <= 0) {
          return NextResponse.json({ error: `specs[${i}].specID must be a valid positive number` }, { status: 400 });
        }
        if (!spec.value || typeof spec.value !== 'string' || spec.value.trim() === '') {
          return NextResponse.json({ error: `specs[${i}].value must be a non-empty string` }, { status: 400 });
        }
      }

      // Verify all specs exist and belong to the correct type
      const specIDs = specs.map((s) => s.specID);
      const dbSpecs: Array<{ id: number; typeID: number }> = await prisma.spec.findMany({
        where: { id: { in: specIDs } },
        select: { id: true, typeID: true },
      });

      const foundSpecIDs = new Set(dbSpecs.map((s) => s.id));
      const missingSpecs = specIDs.filter((id) => !foundSpecIDs.has(id));
      if (missingSpecs.length > 0) {
        return NextResponse.json({ error: 'Some specs were not found', missingSpecIDs: missingSpecs }, { status: 404 });
      }

      const invalidTypeSpecs = dbSpecs.filter((s) => s.typeID !== typeID).map((s) => s.id);
      if (invalidTypeSpecs.length > 0) {
        return NextResponse.json({
          error: 'Specs must belong to the same type as the product',
          invalidSpecIDs: invalidTypeSpecs,
        }, { status: 400 });
      }
    }

    // Create product with specs
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        quantity,
        description: description?.trim() || undefined,
        type: { connect: { id: typeID } },
        specs: specs
          ? {
              create: specs.map((s) => ({
                spec: { connect: { id: s.specID } },
                value: s.value.trim(),
              })),
            }
          : undefined,
      },
      include: {
        type: true,
        specs: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (isPrismaError(error) && error.code === 'P2002') {
      return NextResponse.json({ error: 'Product name must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
