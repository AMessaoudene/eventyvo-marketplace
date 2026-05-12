"use client";

import * as React from "react";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  qty: number;
  type: "physical" | "digital";
  vendorId: string;
};

type CartContextValue = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotal: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);
const KEY = "eventyvo-marketplace-cart";

function load(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as CartLine[];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);

  React.useEffect(() => {
    setLines(load());
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const add = React.useCallback((line: Omit<CartLine, "qty"> & { qty?: number }) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === line.productId);
      const addQty = line.qty ?? 1;
      if (existing) {
        return prev.map((l) =>
          l.productId === line.productId ? { ...l, qty: l.qty + addQty } : l,
        );
      }
      return [...prev, { ...line, qty: addQty }];
    });
  }, []);

  const setQty = React.useCallback((productId: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l)));
  }, []);

  const remove = React.useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const subtotal = React.useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);

  const value = React.useMemo(
    () => ({ lines, add, setQty, remove, clear, subtotal }),
    [lines, add, setQty, remove, clear, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
