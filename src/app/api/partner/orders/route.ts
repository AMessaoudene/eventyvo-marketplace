import { NextRequest, NextResponse } from "next/server";
import { listMarketplaceOrders } from "@/lib/partner-orders-store";

export const runtime = "nodejs";

/** Partner pull endpoint consumed by eventyvo-b2b sync client. */
export async function GET(req: NextRequest) {
  const secret = process.env.B2B_MARKETPLACE_SYNC_SECRET;
  if (!secret || req.headers.get("x-b2b-partner-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerSlug = req.nextUrl.searchParams.get("partnerSlug") ?? undefined;
  const vendorId = req.nextUrl.searchParams.get("vendorId") ?? undefined;
  const orders = await listMarketplaceOrders({ partnerSlug, vendorId, limit: 100 });

  return NextResponse.json({ ok: true, orders });
}
