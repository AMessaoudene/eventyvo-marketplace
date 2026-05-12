"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/data/catalog";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <Button
      className="w-full sm:w-auto"
      disabled={product.stock <= 0}
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          currency: product.currency,
          type: product.type,
          vendorId: product.vendorId,
        });
        toast.success("Added to cart");
      }}
    >
      Add to cart
    </Button>
  );
}
