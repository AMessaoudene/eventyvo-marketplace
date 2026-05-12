export type Review = { id: string; author: string; rating: number; text: string; at: string };

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: "physical" | "digital";
  category: string;
  price: number;
  currency: string;
  stock: number;
  vendorId: string;
  vendorName: string;
  /** ISO date when featured placement ends; null = not featured */
  featuredUntil: string | null;
  sponsored: boolean;
  reviews: Review[];
};

export const CATEGORIES = ["Electronics", "Tickets", "Merch", "Digital", "Services"] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "wireless-buds-pro",
    title: "Wireless Buds Pro",
    description: "Noise-cancelling earbuds with charging case. Physical shipment.",
    type: "physical",
    category: "Electronics",
    price: 12900,
    currency: "DZD",
    stock: 42,
    vendorId: "v-north",
    vendorName: "Northwind Audio",
    featuredUntil: new Date(Date.now() + 86400000 * 14).toISOString(),
    sponsored: true,
    reviews: [
      { id: "r1", author: "Lina", rating: 5, text: "Great sound for the price.", at: "2026-04-01" },
      { id: "r2", author: "Omar", rating: 4, text: "Comfortable, battery ok.", at: "2026-04-12" },
    ],
  },
  {
    id: "p2",
    slug: "vip-festival-pass-digital",
    title: "VIP Festival Pass (Digital)",
    description: "Instant QR delivery to your email.",
    type: "digital",
    category: "Tickets",
    price: 18500,
    currency: "DZD",
    stock: 500,
    vendorId: "v-events",
    vendorName: "Atlas Events",
    featuredUntil: null,
    sponsored: false,
    reviews: [{ id: "r3", author: "Sam", rating: 5, text: "Worked perfectly at the gate.", at: "2026-05-02" }],
  },
  {
    id: "p3",
    slug: "eventyvo-hoodie",
    title: "Eventyvo Hoodie",
    description: "Heavyweight cotton, ships in 48h.",
    type: "physical",
    category: "Merch",
    price: 7500,
    currency: "DZD",
    stock: 3,
    vendorId: "v-north",
    vendorName: "Northwind Audio",
    featuredUntil: null,
    sponsored: false,
    reviews: [],
  },
  {
    id: "p4",
    slug: "sound-pack-dl",
    title: "Producer Sound Pack",
    description: "100 royalty-free one-shots (ZIP download).",
    type: "digital",
    category: "Digital",
    price: 2900,
    currency: "DZD",
    stock: 9999,
    vendorId: "v-sound",
    vendorName: "Studio 54 B2B",
    featuredUntil: new Date(Date.now() + 86400000 * 2).toISOString(),
    sponsored: false,
    reviews: [{ id: "r4", author: "DJ Mira", rating: 5, text: "Solid kicks.", at: "2026-05-08" }],
  },
  {
    id: "p5",
    slug: "on-site-av-package",
    title: "On-site AV package (4h)",
    description: "Technician + PA for small venues.",
    type: "physical",
    category: "Services",
    price: 45000,
    currency: "DZD",
    stock: 8,
    vendorId: "v-events",
    vendorName: "Atlas Events",
    featuredUntil: null,
    sponsored: true,
    reviews: [],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function searchProducts(q: string, category?: string): Product[] {
  const t = q.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const catOk = !category || category === "all" || p.category === category;
    if (!t) return catOk;
    const text = `${p.title} ${p.description} ${p.category}`.toLowerCase();
    return catOk && text.includes(t);
  });
}

export function featuredProducts(): Product[] {
  const now = Date.now();
  return PRODUCTS.filter((p) => {
    if (!p.featuredUntil) return p.sponsored;
    return new Date(p.featuredUntil).getTime() > now || p.sponsored;
  });
}
