import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS, CATEGORIES } from "@/data/catalog";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
      {CATEGORIES.map((cat) => {
        const items = PRODUCTS.filter((p) => p.category === cat);
        return (
          <section key={cat}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{cat}</h2>
              <Link href={`/search?category=${encodeURIComponent(cat)}`} className="text-sm text-primary hover:underline">
                View all in search
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
