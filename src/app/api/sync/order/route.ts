import { NextResponse } from "next/server";
import { persistMarketplaceOrder, type StoredMarketplaceOrder } from "@/lib/partner-orders-store";
import { pushOrderToFennecStub } from "@/lib/sync/registry";

/** POST body: full order payload from checkout. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<StoredMarketplaceOrder> & { orderId?: string };
    const id = body.id ?? body.orderId;
    if (!id) {
      return NextResponse.json({ ok: false, error: "order id required" }, { status: 400 });
    }

    const order: StoredMarketplaceOrder = {
      id,
      createdAt: body.createdAt ?? new Date().toISOString(),
      buyerEmail: body.buyerEmail ?? "",
      status: body.status ?? "paid",
      total: body.total ?? 0,
      vendorId: body.vendorId ?? body.lines?.[0]?.vendorId,
      partnerSlug: body.partnerSlug ?? body.vendorId ?? body.lines?.[0]?.vendorId,
      lines: body.lines,
    };

    await persistMarketplaceOrder(order);
    await pushOrderToFennecStub(id);

    const b2bUrl = process.env.EVENTYVO_B2B_MARKETPLACE_WEBHOOK_URL?.trim();
    const b2bSecret = process.env.B2B_MARKETPLACE_WEBHOOK_SECRET?.trim();
    if (b2bUrl) {
      await fetch(b2bUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(b2bSecret ? { "x-marketplace-webhook-secret": b2bSecret } : {}),
        },
        body: JSON.stringify({ type: "marketplace.order.created", payload: order }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
