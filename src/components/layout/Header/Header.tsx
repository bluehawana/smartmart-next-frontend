'use client'

import Link from 'next/link'
import { Menu, Search, User, ShoppingCart } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center */}
          <div className="flex-1 text-center">
            <Link href="/" className="text-xl font-bold">
              SMARTMART
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <User className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 