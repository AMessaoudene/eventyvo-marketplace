"use client";

import * as React from "react";
import Link from "next/link";
import { useOrders, getVendorId } from "@/lib/order-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VendorOrdersPage() {
  const { orders, refresh } = useOrders();
  const [vid, setVid] = React.useState<string | null>(null);

  React.useEffect(() => {
    setVid(getVendorId());
    refresh();
  }, [refresh]);

  const mine = orders.filter((o) => o.lines.some((l) => l.vendorId === vid));

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Seller orders</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/vendor/onboarding">Vendor setup</Link>
        </Button>
      </div>
      {!vid ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Set your vendor profile first via{" "}
          <Link className="font-medium underline" href="/vendor/onboarding">
            onboarding
          </Link>
          .
        </p>
      ) : (
        <p className="text-sm text-slate-500">Showing orders containing products for vendor <code>{vid}</code>.</p>
      )}
      {mine.length === 0 ? (
        <p className="text-slate-600">No orders for this vendor yet.</p>
      ) : (
        <ul className="space-y-4">
          {mine.map((o) => (
            <li key={o.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-mono">{o.id}</CardTitle>
                  <span className="text-xs capitalize text-slate-500">{o.status}</span>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  <p>{o.buyerEmail}</p>
                  <ul className="mt-2 list-inside list-disc">
                    {o.lines
                      .filter((l) => !vid || l.vendorId === vid)
                      .map((l) => (
                        <li key={l.productId}>
                          {l.title} × {l.qty}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
