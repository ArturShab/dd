import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/app/generated/prisma/client';
import prisma from '@/lib/prisma';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        type: true,
        specs: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

type ProductUpdatePayload = {
  name?: string;
  typeID?: number;
  price?: number;
  quantity?: number;
  description?: string | null;
};

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = (await request.json()) as ProductUpdatePayload;
    const { name, typeID, price, quantity, description } = body;
    const updateData: Prisma.ProductUpdateInput = {};

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

      const type = await prisma.type.findUnique({ where: { id: typeID } });
      if (!type) {
        return NextResponse.json({ error: 'Type not found' }, { status: 404 });
      }

      updateData.type = { connect: { id: typeID } };
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
      }
      updateData.price = price;
    }

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 0) {
        return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
      }
      updateData.quantity = quantity;
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== 'string') {
        return NextResponse.json({ error: 'Description must be a string or null' }, { status: 400 });
      }
      updateData.description = description === null ? null : description.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least one field must be provided for update' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        type: true,
        specs: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Product name must be unique' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.specValue.deleteMany({ where: { productID: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
