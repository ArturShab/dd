"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=7`, { cache: "no-store" });
        const json = await res.json();
        setResults(json.results || []);
        setOpen(true);
      } catch (e) {
        setResults([]);
        setOpen(false);
      }
    }, 220);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => q && setOpen(true)}
        placeholder="Поиск товаров..."
        className="border w-full px-4 py-2 rounded"
      />

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg z-50 max-h-80 overflow-auto">
          <ul className="divide-y">
            {results.map((p) => (
              <li key={p.id} className="p-3 hover:bg-gray-50">
                <Link href={`/product/${p.id}`} className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <img src="/uzi copy.png" alt={p.name} className="max-w-[36px] max-h-[36px] object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-blue-600 underline">{p.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{p.price} руб.</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
