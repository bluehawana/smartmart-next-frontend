import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartMart - Premium Electronics & Tech",
  description: "Discover premium electronics and technology products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-gray-900 antialiased">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-black">SmartMart</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-600 hover:text-black transition-colors">Home</a>
                <a href="/products" className="text-gray-600 hover:text-black transition-colors">Products</a>
                <a href="/about" className="text-gray-600 hover:text-black transition-colors">About</a>
                <a href="/contact" className="text-gray-600 hover:text-black transition-colors">Contact</a>
              </nav>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-64 px-4 py-2 text-sm border border-gray-300 focus:border-black focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const searchTerm = (e.target as HTMLInputElement).value;
                          if (searchTerm.trim()) {
                            window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
                          }
                        }
                      }}
                    />
                    <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button className="md:hidden text-gray-600 hover:text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/about" className="text-gray-600 hover:text-black text-sm">About</a></li>
                  <li><a href="/careers" className="text-gray-600 hover:text-black text-sm">Careers</a></li>
                  <li><a href="/press" className="text-gray-600 hover:text-black text-sm">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/help" className="text-gray-600 hover:text-black text-sm">Help Center</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-black text-sm">Contact</a></li>
                  <li><a href="/returns" className="text-gray-600 hover:text-black text-sm">Returns</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/privacy" className="text-gray-600 hover:text-black text-sm">Privacy</a></li>
                  <li><a href="/terms" className="text-gray-600 hover:text-black text-sm">Terms</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Connect</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-black text-sm">Twitter</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-black text-sm">Instagram</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-black text-sm">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm text-center">© 2025 SmartMart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
