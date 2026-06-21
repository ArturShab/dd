"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

type SpecOption = { name: string; values: string[] };

export default function CatalogClient({
  initialProducts,
  specOptions,
}: {
  initialProducts: any[];
  specOptions: SpecOption[];
}) {
  const [products] = useState(initialProducts || []);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [query, setQuery] = useState("");

  const toggle = (specName: string, value: string) => {
    setSelected((prev) => {
      const copy: Record<string, Set<string>> = {};
      for (const k of Object.keys(prev)) copy[k] = new Set(prev[k]);
      if (!copy[specName]) copy[specName] = new Set();
      if (copy[specName].has(value)) copy[specName].delete(value);
      else copy[specName].add(value);
      return copy;
    });
  };

  const reset = () => setSelected({});

  const filtered = useMemo(() => {
    const activeSpecs = Object.entries(selected).filter(([, set]) => set.size > 0);
    return products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      for (const [specName, set] of activeSpecs) {
        const values = p.specs.map((s: any) => (s.spec?.name === specName ? s.value : null)).filter(Boolean);
        const matched = Array.from(set).some((v) => values.includes(v));
        if (!matched) return false;
      }
      return true;
    });
  }, [products, selected, query]);

  return (
    <div className="flex gap-6">
      <section className="flex-1">
        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-4">
          {filtered.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && <div className="text-center py-8">Товары не найдены</div>}
        </div>
      </section>

      <aside className="w-80 bg-white border p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Фильтры</h3>
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          {specOptions.map((s) => (
            <div key={s.name} className="border-t pt-3">
              <div className="text-sm font-medium mb-2">{s.name}</div>
              <div className="grid grid-cols-1 gap-1">
                {s.values.map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!selected[s.name]?.has(v)}
                      onChange={() => toggle(s.name, v)}
                    />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => {}} className="flex-1 bg-green-600 text-white py-2 rounded">Применить</button>
          <button onClick={reset} className="flex-1 border py-2 rounded">Сбросить</button>
        </div>
      </aside>
    </div>
  );
}
