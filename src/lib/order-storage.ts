"use client";

import * as React from "react";

const ORDERS_KEY = "eventyvo-marketplace-orders";
const VENDOR_KEY = "eventyvo-marketplace-vendor-id";

export type StoredOrder = {
  id: string;
  createdAt: string;
  buyerEmail: string;
  status: "pending" | "paid" | "shipped" | "completed";
  lines: { productId: string; title: string; qty: number; price: number; vendorId: string }[];
  total: number;
};

function readOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as StoredOrder[];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function appendOrder(order: StoredOrder) {
  const prev = readOrders();
  writeOrders([order, ...prev]);
}

export function getVendorId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VENDOR_KEY);
}

export function setVendorId(id: string) {
  localStorage.setItem(VENDOR_KEY, id);
}

export function useOrders() {
  const [orders, setOrders] = React.useState<StoredOrder[]>([]);

  React.useEffect(() => {
    setOrders(readOrders());
  }, []);

  const refresh = React.useCallback(() => {
    setOrders(readOrders());
  }, []);

  return { orders, refresh };
}
