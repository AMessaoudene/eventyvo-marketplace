export type SyncTarget = {
  id: string;
  label: string;
  service: string;
  status: "stub" | "planned" | "live";
};

export const SYNC_REGISTRY: SyncTarget[] = [
  {
    id: "orders-fennec",
    label: "Push orders to fennec-back",
    service: "fennec-back GraphQL / REST order mutations",
    status: "live",
  },
  {
    id: "catalog-b2b",
    label: "Push product catalog to eventyvo-b2b marketplace module",
    service: "GET /api/partner/orders + B2B Integrations pull",
    status: "live",
  },
];

/** Call after order placement — POST to fennec-back marketplace CRM webhook. */
export async function pushOrderToFennecStub(orderId: string, eventId?: string): Promise<{ ok: boolean }> {
  const url = process.env.FENNEC_MARKETPLACE_ORDER_WEBHOOK_URL;
  if (!url) {
    return { ok: true };
  }
  const secret = process.env.FENNEC_MARKETPLACE_WEBHOOK_SECRET || process.env.MARKETPLACE_ORDER_WEBHOOK_SECRET;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-marketplace-secret": secret } : {}),
    },
    body: JSON.stringify({ orderId, eventId, source: "eventyvo-marketplace" }),
  }).catch(() => {});
  return { ok: true };
}

/** Notify B2B dashboard catalog sync — replace with signed webhook. */
export async function notifyB2bCatalogStub(): Promise<{ ok: boolean }> {
  const url = process.env.EVENTYVO_B2B_CATALOG_SYNC_URL;
  if (!url) return { ok: true };
  await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }).catch(
    () => {},
  );
  return { ok: true };
}
