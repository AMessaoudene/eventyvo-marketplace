import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { searchProducts, CATEGORIES } from "@/data/catalog";
import { Button } from "@/components/ui/button";

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "all";
  const results = searchProducts(q, category === "all" ? undefined : category);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Search & filter</h1>
          <p className="text-sm text-slate-500">
            Query: “{q || "(empty)"}” · Category: {category}
          </p>
        </div>
        <form className="flex flex-wrap gap-2" action="/search" method="get">
          <input type="hidden" name="q" value={q} />
          <select
            name="category"
            defaultValue={category}
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm">
            Apply
          </Button>
        </form>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {results.length === 0 ? (
        <p className="text-center text-slate-500">
          No matches.{" "}
          <Link href="/" className="text-primary underline">
            Back home
          </Link>
        </p>
      ) : null}
    </div>
  );
}
