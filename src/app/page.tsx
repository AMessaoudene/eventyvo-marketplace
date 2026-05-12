import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { featuredProducts, PRODUCTS, CATEGORIES } from "@/data/catalog";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-12 text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Eventyvo Marketplace</h1>
        <p className="mt-3 max-w-xl text-slate-200">
          Physical and digital products, tickets, and services — cart, checkout, reviews, and vendor tools in one app.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/categories">Browse categories</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Link href="/search?q=ticket">Search tickets</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Featured & sponsored</h2>
            <p className="text-sm text-slate-500">Placements expire via hourly cron (`featured-listing-expiry`).</p>
          </div>
          <Link href="/search" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">All listings</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Category browser</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button key={c} variant="outline" asChild>
              <Link href={`/search?category=${encodeURIComponent(c)}`}>{c}</Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
