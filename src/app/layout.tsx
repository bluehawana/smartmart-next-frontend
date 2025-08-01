import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">SmartMart</h1>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
