import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { id, category } = await params;
  const productId = Number(id || 0);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { type: true, specs: { include: { spec: true } } },
  });

  if (!product) {
    return (
      <main className="px-[6%] py-6">
        <div className="text-center py-20">Товар не найден</div>
        <div className="text-center">
          <Link href={`/Catalog/${category}`} className="text-green-600">Вернуться в каталог</Link>
        </div>
      </main>
    );
  }

  const specsGrouped: Record<string, string[]> = {};
  product.specs.forEach((sv: any) => {
    const name = sv.spec?.name || "";
    if (!specsGrouped[name]) specsGrouped[name] = [];
    specsGrouped[name].push(sv.value);
  });

  return (
    <main className="px-[6%] py-8">
      <div className="mb-4 text-sm text-gray-600">
        <Link href="/Catalog/Categories" className="text-green-600">Каталог</Link>
        <span className="mx-2">/</span>
        <Link href={`/Catalog/${product.type.categoryID}`} className="text-green-600">{product.type?.name || 'Тип'}</Link>
      </div>

      <div className="bg-white p-6 rounded shadow sm:flex sm:gap-8">
        <div className="sm:w-1/3 w-full h-72 relative bg-gray-50 rounded overflow-hidden">
          <Image src="/uzi%20copy.png" alt={product.name} fill style={{ objectFit: "contain" }} />
        </div>

        <div className="sm:flex-1 mt-4 sm:mt-0">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-sm text-gray-500 mt-1">Тип: {product.type?.name}</div>
          <div className="mt-4 text-3xl font-extrabold text-green-700">{product.price} руб.</div>
          <div className="mt-2 text-sm text-gray-700">{product.quantity} в наличии</div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Описание</h3>
            <p className="text-gray-700 mt-2">{product.description || 'Описание отсутствует.'}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Характеристики</h3>
            <dl className="grid grid-cols-1 gap-2 mt-2">
              {Object.entries(specsGrouped).map(([name, values]) => (
                <div key={name} className="flex justify-between border-b py-2">
                  <dt className="text-sm text-gray-600">{name}</dt>
                  <dd className="text-sm">{values.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="bg-green-600 text-white px-6 py-2 rounded">Купить</button>
            <Link href={`/Catalog/${category}`} className="px-6 py-2 border rounded">Назад</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
