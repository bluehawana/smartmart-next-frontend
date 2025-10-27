import type { Metadata } from 'next'
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/components/providers/CartProvider';
import { ClientHeader } from '@/components/layout/ClientHeader';

export const metadata: Metadata = {
  title: 'SmrtMart - Premium Electronics & Tech',
  description: 'Discover premium electronics and technology products',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-gray-900 antialiased">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <ClientHeader />
            <main className="flex-1">
              {children}
            </main>
            
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
                  <p className="text-gray-500 text-sm text-center">© 2025 SmrtMart. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
