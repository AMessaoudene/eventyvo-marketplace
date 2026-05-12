import { verifyCronRequest } from "@/lib/cron/verify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  return NextResponse.json({
    ok: true,
    job: "order-auto-complete",
    note: "Mark orders paid/shipped but buyer unconfirmed >7d as completed",
  });
}
