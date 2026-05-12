import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Eventyvo Marketplace",
  description: "Buy and sell physical and digital goods across the Eventyvo ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
