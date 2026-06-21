import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const id = parseInt(form.get('id')?.toString() || '0', 10);
    if (!id) return NextResponse.json({ ok: false, error: 'invalid id' }, { status: 400 });

    await prisma.request.delete({ where: { id } });
    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (err) {
    console.error('admin delete error', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
