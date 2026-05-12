import { NextResponse } from "next/server";
import { pushOrderToFennecStub } from "@/lib/sync/registry";

/** POST body: { orderId: string } — extend with full payload when fennec schema is fixed. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { orderId?: string };
    if (!body.orderId) {
      return NextResponse.json({ ok: false, error: "orderId required" }, { status: 400 });
    }
    await pushOrderToFennecStub(body.orderId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
