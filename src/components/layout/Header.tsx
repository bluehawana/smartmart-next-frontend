'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export function Header() {
  const cartCount = useCartStore(state => state.items.length)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <button className="lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link href="/" className="text-xl font-bold">
          MEDUSA STORE
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
} 