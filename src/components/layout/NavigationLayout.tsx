'use client'

import { useState } from 'react'
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { MenuLeft } from './MenuLeft'
import { SearchBar } from './SearchBar'
import { CartSidebar } from './CartSidebar'
import { useCartStore } from '@/lib/store/cart'

export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const cartItemsCount = useCartStore(state => state.getCartItemsCount())

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Section */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu size={24} />
          </button>

          {/* Center Section */}
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            SMARTMART
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Search size={24} />
            </button>
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <User size={24} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Slide-out Menu */}
      <MenuLeft isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Search Overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
} 