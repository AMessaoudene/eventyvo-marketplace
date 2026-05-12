import { NextResponse } from "next/server";
import { notifyB2bCatalogStub } from "@/lib/sync/registry";

/** Trigger catalog push (e.g. after vendor publishes listing). */
export async function POST() {
  await notifyB2bCatalogStub();
  return NextResponse.json({ ok: true, note: "Set EVENTYVO_B2B_CATALOG_SYNC_URL to deliver" });
}
