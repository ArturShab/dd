import prisma from "@/lib/prisma";
import CatalogClient from "@/components/CatalogClient";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryId = Number(category || 0);

  // fetch products with their specs and types
  const products = await prisma.product.findMany({
    where: { type: { categoryID: categoryId } },
    include: { specs: { include: { spec: true } }, type: true },
    orderBy: { id: "desc" },
  });

  // derive filter options (spec name -> values)
  const specsMap: Record<string, Set<string>> = {};
  products.forEach((p) => {
    p.specs.forEach((sv) => {
      const name = sv.spec?.name || "";
      if (!specsMap[name]) specsMap[name] = new Set();
      specsMap[name].add(sv.value);
    });
  });

  const specOptions = Object.entries(specsMap).map(([name, set]) => ({ name, values: Array.from(set) }));

  return (
    <main className="px-[6%] py-6">
      <CatalogClient initialProducts={products} specOptions={specOptions} />
    </main>
  );
}
