'use client';

import { useCartStore } from '@/lib/store/cart';

function CartIcon() {
  const { getCartItemsCount } = useCartStore();
  const cartCount = getCartItemsCount();

  return (
    <a href="/cart" className="text-gray-600 hover:text-black relative">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </a>
  );
}

export function ClientHeader() {
  return (
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
            <a href="/cart" className="text-gray-600 hover:text-black transition-colors">Cart</a>
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
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}