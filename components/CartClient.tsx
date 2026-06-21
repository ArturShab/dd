"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
  } catch (e) {}
}

export default function CartClient({ ordered, createRequest }: { ordered?: boolean; createRequest?: any }) {
  const [cart, setCart] = useState<any[]>([]);
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [errDetail, setErrDetail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      setCart(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setCart([]);
    }

    function onUpdate() {
      try {
        const raw = localStorage.getItem('cart');
        setCart(raw ? JSON.parse(raw) : []);
      } catch (e) {
        setCart([]);
      }
    }
    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, []);

  useEffect(() => {
    if (ordered) {
      try {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (e) {}
      setCart([]);
      setMsg('Заявка успешно создана. Мы свяжемся с вами.');
    }
  }, [ordered]);

  function inc(id: number) {
    const c = readCart();
    const idx = c.findIndex((x: any) => x.id === id);
    if (idx >= 0) {
      c[idx].quantity = (c[idx].quantity || 0) + 1;
      writeCart(c);
      setCart(c);
    }
  }

  function dec(id: number) {
    const c = readCart();
    const idx = c.findIndex((x: any) => x.id === id);
    if (idx >= 0) {
      c[idx].quantity = Math.max(0, (c[idx].quantity || 0) - 1);
      if (c[idx].quantity === 0) c.splice(idx, 1);
      writeCart(c);
      setCart(c);
    }
  }

  function removeItem(id: number) {
    const c = readCart().filter((x: any) => x.id !== id);
    writeCart(c);
    setCart(c);
  }

  function clearCart() {
    writeCart([]);
    setCart([]);
  }

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);

  return (
    <main className="px-[6%] py-8">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      {msg && <div className="p-3 mb-4 bg-green-100 text-green-800 rounded">{msg}</div>}

      {cart.length === 0 ? (
        <div className="text-gray-600">Корзина пуста. <Link href="/">Перейти в каталог</Link></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border rounded p-4">
            <ul className="divide-y">
              {cart.map((it: any) => (
                <li key={it.id} className="py-3 flex items-center gap-4">
                  <img src="/uzi copy.png" alt={it.name} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <div className="font-medium text-blue-600 underline"><Link href={`/product/${it.id}`}>{it.name}</Link></div>
                    <div className="text-sm text-gray-600">{it.price} руб.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 border rounded" onClick={() => dec(it.id)}>-</button>
                    <div className="px-3">{it.quantity}</div>
                    <button className="px-2 py-1 border rounded" onClick={() => inc(it.id)}>+</button>
                  </div>
                  <div className="w-28 text-right font-semibold">{it.price * it.quantity} руб.</div>
                  <button className="ml-3 text-red-500" onClick={() => removeItem(it.id)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold">Итого: {total} руб.</div>
          </div>

          <aside className="bg-white border rounded p-4">
            <h2 className="text-lg font-semibold mb-3">Оформление заказа</h2>
            <p className="text-sm text-gray-600 mb-3">Заполните контактные данные.</p>

            {errDetail && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">Ошибка: {errDetail}</div>}

            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              fd.set('list', JSON.stringify(cart));
              fd.set('total', String(total));
              const res = await createRequest(fd);
              if (res && res.ok) {
                try { localStorage.removeItem('cart'); window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
                setCart([]);
                setMsg('Заявка оформлена. Номер: ' + (res.id || 'неизвестен'));
                setErrDetail(null);
                // navigate to cart with ordered flag
                window.location.href = '/Cart?ordered=1';
              } else {
                setMsg('Ошибка при создании заявки');
                setErrDetail(res?.error || 'неизвестная ошибка');
              }
            }} className="grid gap-3">
              <label className="text-sm">Телефон*</label>
              <input name="phone" placeholder="Телефон*" required value={phone} onChange={(e) => setPhone(e.target.value)} className="border px-3 py-2 w-full" />

              <label className="text-sm">Организация</label>
              <input name="organization" placeholder="Организация" value={organization} onChange={(e) => setOrganization(e.target.value)} className="border px-3 py-2 w-full" />

              <label className="text-sm">Адрес доставки</label>
              <input name="address" placeholder="Адрес доставки" value={address} onChange={(e) => setAddress(e.target.value)} className="border px-3 py-2 w-full" />

              <label className="text-sm">Комментарий</label>
              <textarea name="comment" placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)} className="border px-3 py-2 w-full h-24" />

              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded">Оформить заказ</button>
                <button type="button" onClick={clearCart} className="px-4 py-2 border rounded">Очистить</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </main>
  );
}
