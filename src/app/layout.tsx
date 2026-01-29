import type { Metadata } from 'next'
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/components/providers/CartProvider';
import { Header } from '@/components/layout/Header/Header';

export const metadata: Metadata = {
  title: 'SmrtMart - Premium Electronics & Tech',
  description: 'Discover premium electronics and technology products. Curated tech for the modern lifestyle.',
  keywords: ['electronics', 'tech', 'gadgets', 'premium', 'smart devices', 'audio', 'computers'],
  authors: [{ name: 'SmrtMart' }],
  openGraph: {
    title: 'SmrtMart - Premium Electronics & Tech',
    description: 'Discover premium electronics and technology products.',
    type: 'website',
  },
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full bg-white text-primary-950 antialiased font-body">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Premium Footer */}
            <footer className="border-t border-primary-100 bg-primary-50/50">
              {/* Newsletter Section */}
              <div className="border-b border-primary-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="max-w-2xl mx-auto text-center">
                    <h3 className="font-display text-2xl sm:text-3xl text-primary-950 mb-3">
                      Stay in the Loop
                    </h3>
                    <p className="text-primary-500 mb-6">
                      Get exclusive offers, new arrivals, and tech insights delivered to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 text-sm border border-primary-200 focus:border-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900/5 transition-all"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary-950 text-white text-sm font-medium hover:bg-primary-800 transition-colors whitespace-nowrap"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Main Footer */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                  {/* Brand Column */}
                  <div className="col-span-2 md:col-span-1">
                    <a href="/" className="inline-block font-display text-xl font-semibold text-primary-950 tracking-tight mb-4">
                      SMRTMART
                    </a>
                    <p className="text-sm text-primary-500 leading-relaxed">
                      Premium electronics curated for the modern lifestyle.
                    </p>
                  </div>

                  {/* Shop */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-950 uppercase tracking-wider mb-4">Shop</h4>
                    <ul className="space-y-3">
                      <li><a href="/products" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">All Products</a></li>
                      <li><a href="/products?category=computers" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Computers</a></li>
                      <li><a href="/products?category=audio" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Audio</a></li>
                      <li><a href="/products?category=wearables" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Wearables</a></li>
                      <li><a href="/products?category=accessories" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Accessories</a></li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-950 uppercase tracking-wider mb-4">Company</h4>
                    <ul className="space-y-3">
                      <li><a href="/about" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">About Us</a></li>
                      <li><a href="/careers" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Careers</a></li>
                      <li><a href="/press" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Press</a></li>
                      <li><a href="/blog" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Blog</a></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-950 uppercase tracking-wider mb-4">Support</h4>
                    <ul className="space-y-3">
                      <li><a href="/help" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Help Center</a></li>
                      <li><a href="/contact" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Contact Us</a></li>
                      <li><a href="/shipping" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Shipping Info</a></li>
                      <li><a href="/returns" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Returns</a></li>
                    </ul>
                  </div>

                  {/* Legal */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-950 uppercase tracking-wider mb-4">Legal</h4>
                    <ul className="space-y-3">
                      <li><a href="/privacy" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Privacy Policy</a></li>
                      <li><a href="/terms" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Terms of Service</a></li>
                      <li><a href="/cookies" className="text-sm text-primary-500 hover:text-primary-950 transition-colors">Cookie Policy</a></li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-primary-400">
                    © {new Date().getFullYear()} SmrtMart. All rights reserved.
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                    <a href="#" className="text-primary-400 hover:text-primary-950 transition-colors" aria-label="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-primary-400 hover:text-primary-950 transition-colors" aria-label="Instagram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-primary-400 hover:text-primary-950 transition-colors" aria-label="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-primary-400 hover:text-primary-950 transition-colors" aria-label="YouTube">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0A0A0A',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'Satoshi, DM Sans, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#D4A853',
                secondary: '#0A0A0A',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
