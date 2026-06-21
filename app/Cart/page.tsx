import prisma from "@/lib/prisma";
// server action returns result; client will handle navigation and clearing
import Link from "next/link";
import CartClient from '@/components/CartClient';

export async function createRequest(formData: FormData) {
  'use server'
  try {
    const phone = formData.get('phone')?.toString() || '';
    const organization = formData.get('organization')?.toString() || null;
    const address = formData.get('address')?.toString() || null;
    const list = formData.get('list')?.toString() || '';
    const comment = formData.get('comment')?.toString() || '';
    const total = parseInt(formData.get('total')?.toString() || '0', 10) || 0;

    const listWithComment = comment ? `${list}\n\nКомментарий: ${comment}` : list;
    // diagnostic: ensure prisma and model accessor exist
    if (!prisma) {
      console.error('createRequest: prisma is undefined');
      return { ok: false, error: 'prisma is undefined' };
    }
    if (!('request' in prisma) || !prisma.request) {
      try {
        console.error('createRequest: prisma keys', Object.keys(prisma));
      } catch (e) {}
      return { ok: false, error: "prisma.request is missing", debug: Object.keys(prisma || {}) };
    }

    const created = await prisma.request.create({ data: { phone, organization, address, list: listWithComment, total } });
    return { ok: true, id: created.id };
  } catch (err) {
    console.error('createRequest error', err);
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

export default function CartPage({ searchParams }: { searchParams?: { ordered?: string } }) {
  const ordered = searchParams?.ordered === '1' || searchParams?.ordered === 'true';
  return <CartClient ordered={ordered} createRequest={createRequest} />;
}
