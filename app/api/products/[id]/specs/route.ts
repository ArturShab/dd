// app/api/products/[id]/specs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type AddProductSpecsPayload = {
  specs: Array<{
    specID: number;
    value: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // В Next.js 15 params может быть промисом
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id, 10);
    
    if (Number.isNaN(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = (await request.json()) as AddProductSpecsPayload;
    const { specs } = body;

    if (!Array.isArray(specs) || specs.length === 0) {
      return NextResponse.json({ error: 'specs must be a non-empty array' }, { status: 400 });
    }

    // Validate specs format
    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      if (!spec.specID || typeof spec.specID !== 'number' || spec.specID <= 0) {
        return NextResponse.json(
          { error: `specs[${i}].specID must be a valid positive number` },
          { status: 400 }
        );
      }
      if (!spec.value || typeof spec.value !== 'string' || spec.value.trim() === '') {
        return NextResponse.json(
          { error: `specs[${i}].value must be a non-empty string` },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, typeID: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const specIDs = specs.map((s) => s.specID);
    const dbSpecs = await prisma.spec.findMany({
      where: { id: { in: specIDs } },
      select: { id: true, typeID: true },
    });

    const foundSpecIDs = new Set(dbSpecs.map((s) => s.id));
    const missingSpecs = specIDs.filter((id) => !foundSpecIDs.has(id));
    
    if (missingSpecs.length > 0) {
      return NextResponse.json(
        { error: 'Some specs were not found', missingSpecIDs: missingSpecs },
        { status: 404 }
      );
    }

    const invalidTypeSpecs = dbSpecs.filter((s) => s.typeID !== product.typeID).map((s) => s.id);
    if (invalidTypeSpecs.length > 0) {
      return NextResponse.json(
        {
          error: 'Specs must belong to the same type as the product',
          invalidSpecIDs: invalidTypeSpecs,
        },
        { status: 400 }
      );
    }

    const existingSpecValues = await prisma.specValue.findMany({
      where: {
        productID: productId,
        specID: { in: specIDs },
      },
      select: { specID: true },
    });

    const existingSpecIDs = new Set(existingSpecValues.map((v) => v.specID));
    const specsToAdd = specs.filter((s) => !existingSpecIDs.has(s.specID));

    if (specsToAdd.length === 0) {
      return NextResponse.json({ message: 'No new spec values were added', added: 0 });
    }

    const createdSpecs = await prisma.$transaction(
      specsToAdd.map((spec) =>
        prisma.specValue.create({
          data: {
            product: { connect: { id: productId } },
            spec: { connect: { id: spec.specID } },
            value: spec.value.trim(),
          },
          include: { spec: true },
        })
      )
    );

    return NextResponse.json(
      { added: createdSpecs.length, specValues: createdSpecs },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding product spec values:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}