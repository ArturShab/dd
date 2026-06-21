"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { useEffect, useState } from "react";

function readCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export default function ProductCard({ product }: { product: any }) {
  const href = `/product/${product.id}`;
  const [badgeQty, setBadgeQty] = useState(0);

  useEffect(() => {
    try {
      const c = readCart();
      const f = c.find((x: any) => x.id === product.id);
      setBadgeQty(f ? f.quantity || 0 : 0);
    } catch (e) {
      setBadgeQty(0);
    }

    function onUpdate() {
      try {
        const c = readCart();
        const f = c.find((x: any) => x.id === product.id);
        setBadgeQty(f ? f.quantity || 0 : 0);
      } catch (e) {
        setBadgeQty(0);
      }
    }

    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, [product.id]);

  return (
    <div className="block">
      <article className="flex items-start gap-4 p-4 border rounded hover:shadow-md relative">
        <div className="w-28 h-28 relative bg-gray-50 flex-shrink-0 rounded overflow-hidden">
          <Link href={String(href)} className="block w-full h-full">
            <Image src="/uzi%20copy.png" alt={product.name} fill style={{ objectFit: "cover" }} />
          </Link>

          {badgeQty > 0 && (
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{badgeQty}</div>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold"><Link href={String(href)} className="hover:underline">{product.name}</Link></h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{product.description || "Описание товара отсутствует"}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm text-green-700 font-medium">{product.quantity} в наличии</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold">{product.price} руб.</div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
