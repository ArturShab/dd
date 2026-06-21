import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const limit = parseInt(url.searchParams.get('limit') || '7', 10);

    if (!q) return NextResponse.json({ results: [] });

    const products = await prisma.product.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      select: { id: true, name: true, price: true },
      take: isNaN(limit) ? 7 : limit,
    });

    return NextResponse.json({ results: products });
  } catch (err) {
    console.error('search api error', err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
