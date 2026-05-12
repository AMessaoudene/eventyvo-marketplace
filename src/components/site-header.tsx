"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Store, User, Search } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Store className="h-5 w-5 text-primary" />
          Marketplace
        </Link>
        <form
          className="hidden flex-1 items-center gap-2 sm:flex"
          action="/search"
          method="get"
          role="search"
        >
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input name="q" placeholder="Search products…" className="pl-9" defaultValue="" />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/categories">Categories</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendor/onboarding">Sell</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendor/orders">Seller</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sync">Sync</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="relative">
            <Link href="/cart" className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              Cart
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
