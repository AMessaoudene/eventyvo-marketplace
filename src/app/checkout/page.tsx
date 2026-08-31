"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { appendOrder, type StoredOrder } from "@/lib/order-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">Nothing to checkout.</p>
        <Button asChild className="mt-4">
          <Link href="/">Browse products</Link>
        </Button>
      </div>
    );
  }

  const currency = lines[0]?.currency ?? "DZD";

  const pay = async () => {
    if (!email.includes("@")) {
      toast.error("Valid email required");
      return;
    }
    setBusy(true);
    const order: StoredOrder = {
      id: `ord_${crypto.randomUUID().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      buyerEmail: email.trim(),
      status: "paid",
      lines: lines.map((l) => ({
        productId: l.productId,
        title: l.title,
        qty: l.qty,
        price: l.price,
        vendorId: l.vendorId,
      })),
      total: subtotal,
    };
    appendOrder(order);
    try {
      await fetch("/api/sync/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {
      /* non-fatal */
    }
    clear();
    toast.success("Order placed (demo). Sync fired to fennec-back stub.");
    setBusy(false);
    window.location.assign(`/account/orders?highlight=${encodeURIComponent(order.id)}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      <p className="text-sm text-slate-500">Demo checkout — integrate Stripe / eventyvo-pay for production.</p>
      <div className="space-y-2">
        <Label htmlFor="em">Email for confirmations</Label>
        <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="rounded-lg border bg-slate-50 p-4 text-sm">
        <p className="font-medium text-slate-800">Total: {subtotal.toLocaleString()} {currency}</p>
        <p className="mt-1 text-slate-600">{lines.length} line item(s)</p>
      </div>
      <Button size="lg" className="w-full" disabled={busy} onClick={pay}>
        {busy ? "Processing…" : "Pay now (demo)"}
      </Button>
    </div>
  );
}
