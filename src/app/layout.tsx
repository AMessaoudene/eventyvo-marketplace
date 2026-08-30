import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";
import { StructuredData, buildOrganizationSchema, buildWebSiteSchema } from "@/components/StructuredData";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://marketplace.eventyvo.com");

export const metadata: Metadata = {
  title: "Eventyvo Marketplace",
  description: "Discover and purchase tickets, merchandise, digital products, and services across the Eventyvo ecosystem. Connect with trusted vendors, find exclusive event deals, and shop securely with our integrated marketplace.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Eventyvo Marketplace",
    title: "Eventyvo Marketplace",
    description: "Buy and sell physical and digital goods across the Eventyvo ecosystem.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Eventyvo Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventyvo Marketplace",
    description: "Buy and sell physical and digital goods across the Eventyvo ecosystem.",
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="WebSite" data={buildWebSiteSchema(baseUrl) as any} />
        <StructuredData type="Organization" data={buildOrganizationSchema(baseUrl) as any} />
      </head>
      <body className="min-h-screen">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
