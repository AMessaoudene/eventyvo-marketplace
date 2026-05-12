"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <Button asChild className="mt-6">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Cart</h1>
      <ul className="divide-y rounded-lg border bg-white">
        {lines.map((l) => (
          <li key={l.productId} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <Link href={`/products/${l.slug}`} className="font-medium text-slate-900 hover:underline">
                {l.title}
              </Link>
              <p className="text-sm text-slate-500">
                {l.price.toLocaleString()} {l.currency} · {l.type}
              </p>
            </div>
            <Input
              type="number"
              min={1}
              className="w-20"
              value={l.qty}
              onChange={(e) => setQty(l.productId, Number(e.target.value))}
            />
            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => remove(l.productId)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
        <span className="font-semibold">Subtotal</span>
        <span className="text-xl font-bold">
          {lines[0] ? subtotal.toLocaleString() : 0} {lines[0]?.currency ?? "DZD"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/checkout">Checkout</Link>
        </Button>
        <Button variant="outline" onClick={clear}>
          Clear cart
        </Button>
      </div>
    </div>
  );
}
