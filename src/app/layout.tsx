import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavigationLayout } from "@/components/layout/NavigationLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartMart - Premium Lifestyle Products",
  description: "Your destination for premium lifestyle products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationLayout>{children}</NavigationLayout>
      </body>
    </html>
  );
}
