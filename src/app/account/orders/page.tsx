"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/lib/order-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BuyerOrdersInner() {
  const { orders, refresh } = useOrders();
  const sp = useSearchParams();
  const highlight = sp.get("highlight");

  React.useEffect(() => {
    refresh();
  }, [highlight, refresh]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Your orders</h1>
      <p className="text-sm text-slate-500">Buyer view — stored in this browser until accounts sync with fennec-back.</p>
      {orders.length === 0 ? (
        <p className="text-slate-600">
          No orders yet.{" "}
          <Link className="text-primary underline" href="/">
            Shop
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Card className={o.id === highlight ? "ring-2 ring-primary" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-mono">{o.id}</CardTitle>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">{o.status}</span>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>
                    {new Date(o.createdAt).toLocaleString()} · {o.buyerEmail}
                  </p>
                  <ul className="list-inside list-disc">
                    {o.lines.map((l) => (
                      <li key={l.productId}>
                        {l.title} × {l.qty} — {(l.price * l.qty).toLocaleString()} DZD
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold text-slate-900">Total {o.total.toLocaleString()} DZD</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BuyerOrdersPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-slate-500">Loading orders…</div>}>
      <BuyerOrdersInner />
    </React.Suspense>
  );
}
