import Link from "next/link";
import type { Product } from "@/data/catalog";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const now = Date.now();
  const featured = product.featuredUntil && new Date(product.featuredUntil).getTime() > now;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
          <span className="text-sm font-medium">{product.type === "digital" ? "Digital" : "Photo"}</span>
        </div>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1">
            {featured || product.sponsored ? (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900">
                {product.sponsored ? "Sponsored" : "Featured"}
              </span>
            ) : null}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{product.category}</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-800">{product.type}</span>
          </div>
          <h2 className="mt-2 font-semibold text-slate-900">{product.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
          <p className="mt-2 text-lg font-bold text-primary">
            {product.price.toLocaleString()} {product.currency}
          </p>
          <p className="text-xs text-slate-500">{product.stock} in stock · {product.vendorName}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
