import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationLayout } from "@/components/layout/NavigationLayout";
import { Toaster } from 'react-hot-toast'
import { CartProvider } from "@/components/providers/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartMart - Premium Lifestyle Products",
  description: "Your destination for premium lifestyle products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <NavigationLayout>
            {children}
          </NavigationLayout>
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
