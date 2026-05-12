import { verifyCronRequest } from "@/lib/cron/verify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  return NextResponse.json({
    ok: true,
    job: "low-stock-alert",
    note: "Notify vendors where stock < threshold (e.g. 5 units)",
  });
}
