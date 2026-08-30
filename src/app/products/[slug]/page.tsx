import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/catalog";
import { AddToCart } from "@/components/add-to-cart";
import { ProductReviews } from "@/components/product-reviews";
import { Button } from "@/components/ui/button";
import { StructuredData, buildProductSchema } from "@/components/StructuredData";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://marketplace.eventyvo.com");

  const productUrl = `${baseUrl}/products/${slug}`;

  return {
    title: `${product.title} | Eventyvo Marketplace`,
    description: product.description,
    openGraph: {
      type: "product",
      url: productUrl,
      title: product.title,
      description: product.description,
      siteName: "Eventyvo Marketplace",
      images: [
        {
          url: `${baseUrl}/products/${slug}/image`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [`${baseUrl}/products/${slug}/image`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://marketplace.eventyvo.com");

  const productSchema = buildProductSchema(product, baseUrl);

  return (
    <>
      <StructuredData type="Product" data={productSchema} />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Back to listings
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
          Product media
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{product.category}</span>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-800">{product.type}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.title}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>
          <p className="mt-4 text-2xl font-bold text-primary">
            {product.price.toLocaleString()} {product.currency}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {product.stock} in stock · Sold by {product.vendorName}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCart product={product} />
            <Button variant="outline" asChild>
              <Link href="/cart">View cart</Link>
            </Button>
          </div>
        </div>
      </div>
      <ProductReviews product={product} />
    </div>
    </>
  );
}
