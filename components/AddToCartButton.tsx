"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function readCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeCart(c: any[]) {
  try {
    localStorage.setItem('cart', JSON.stringify(c));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    console.error('cart write error', e);
  }
}

export default function AddToCartButton({ product }: { product: any }) {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const c = readCart();
    const found = c.find((x: any) => x.id === product.id);
    setQty(found ? found.quantity || 0 : 0);

    function onUpdate() {
      const c2 = readCart();
      const f = c2.find((x: any) => x.id === product.id);
      setQty(f ? f.quantity || 0 : 0);
    }
    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, [product.id]);

  function add() {
    const c = readCart();
    const idx = c.findIndex((x: any) => x.id === product.id);
    let newQty = 1;
    if (idx >= 0) {
      c[idx].quantity = (c[idx].quantity || 0) + 1;
      newQty = c[idx].quantity;
    } else {
      c.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      newQty = 1;
    }
    writeCart(c);
    setQty(newQty);
  }

  function inc() {
    const c = readCart();
    const idx = c.findIndex((x: any) => x.id === product.id);
    if (idx >= 0) {
      c[idx].quantity = (c[idx].quantity || 0) + 1;
      writeCart(c);
      setQty(c[idx].quantity);
    }
  }

  function dec() {
    const c = readCart();
    const idx = c.findIndex((x: any) => x.id === product.id);
    if (idx >= 0) {
      c[idx].quantity = Math.max(0, (c[idx].quantity || 0) - 1);
      if (c[idx].quantity === 0) c.splice(idx, 1);
      writeCart(c);
      setQty(c[idx] ? c[idx].quantity : 0);
    }
  }

  if (qty === 0) {
    return (
      <button onClick={add} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Купить</button>
    );
  }

  return (
    <div className="mt-2 inline-flex items-center gap-2 border rounded px-2 py-1">
      <button onClick={dec} className="px-2 py-1">-</button>
      <div className="px-3">{qty}</div>
      <button onClick={inc} className="px-2 py-1">+</button>
      <Link href="/Cart" className="ml-2 text-sm text-blue-600 underline">Перейти</Link>
    </div>
  );
}
