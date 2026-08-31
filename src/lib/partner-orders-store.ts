import { promises as fs } from "fs";
import path from "path";

export type StoredMarketplaceOrder = {
  id: string;
  createdAt: string;
  buyerEmail: string;
  status: string;
  total: number;
  vendorId?: string;
  partnerSlug?: string;
  lines?: { productId: string; title: string; qty: number; price: number; vendorId: string }[];
};

const STORE_PATH =
  process.env.MARKETPLACE_ORDERS_STORE_PATH ||
  path.join(process.cwd(), ".data", "marketplace-orders.json");

async function readStore(): Promise<StoredMarketplaceOrder[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoredMarketplaceOrder[];
  } catch {
    return [];
  }
}

async function writeStore(items: StoredMarketplaceOrder[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function persistMarketplaceOrder(order: StoredMarketplaceOrder): Promise<StoredMarketplaceOrder> {
  const items = await readStore();
  const existing = items.findIndex((o) => o.id === order.id);
  if (existing >= 0) {
    items[existing] = order;
  } else {
    items.unshift(order);
  }
  await writeStore(items.slice(0, 1000));
  return order;
}

export async function listMarketplaceOrders(filter?: {
  partnerSlug?: string;
  vendorId?: string;
  limit?: number;
}): Promise<StoredMarketplaceOrder[]> {
  let items = await readStore();
  if (filter?.partnerSlug) {
    items = items.filter(
      (o) => o.partnerSlug === filter.partnerSlug || o.vendorId === filter.partnerSlug,
    );
  }
  if (filter?.vendorId) {
    items = items.filter((o) => o.vendorId === filter.vendorId);
  }
  return items.slice(0, filter?.limit ?? 100);
}
