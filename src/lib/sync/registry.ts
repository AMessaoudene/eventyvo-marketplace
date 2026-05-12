export type SyncTarget = {
  id: string;
  label: string;
  service: string;
  status: "stub" | "planned";
};

export const SYNC_REGISTRY: SyncTarget[] = [
  {
    id: "orders-fennec",
    label: "Push orders to fennec-back",
    service: "fennec-back GraphQL / REST order mutations",
    status: "stub",
  },
  {
    id: "catalog-b2b",
    label: "Push product catalog to eventyvo-b2b marketplace module",
    service: "Internal webhook or queue consumed by eventyvo-b2b",
    status: "stub",
  },
];

/** Call after order placement — replace with real GraphQL mutation. */
export async function pushOrderToFennecStub(orderId: string): Promise<{ ok: boolean }> {
  const url = process.env.FENNEC_MARKETPLACE_ORDER_WEBHOOK_URL;
  if (!url) {
    return { ok: true };
  }
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, source: "eventyvo-marketplace" }),
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
