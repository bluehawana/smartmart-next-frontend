'use client'

import { X } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Electronics',
    subcategories: ['Laptops', 'Smartphones', 'Accessories']
  },
  {
    name: 'Audio',
    subcategories: ['Headphones', 'Speakers', 'Microphones']
  },
  {
    name: 'Wearables',
    subcategories: ['Smartwatches', 'Fitness Trackers']
  }
]

interface MenuLeftProps {
  isOpen: boolean
  onClose: () => void
}

export function MenuLeft({ isOpen, onClose }: MenuLeftProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div className={`
        fixed top-0 left-0 h-full bg-white w-[75vw] max-w-[350px] z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-auto h-[calc(100vh-64px)]">
          <nav className="p-4">
            <div className="space-y-1 mb-6">
              <Link
                href="/"
                className="block py-3 px-4 text-gray-900 hover:bg-gray-100 rounded-md font-medium"
                onClick={onClose}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block py-3 px-4 text-gray-900 hover:bg-gray-100 rounded-md font-medium"
                onClick={onClose}
              >
                All Products
              </Link>
            </div>

            <div className="border-t pt-4">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Shop by Category
              </h3>
              {categories.map((category) => (
                <div key={category.name} className="mb-4">
                  <Link
                    href={`/products?category=${category.name.toLowerCase()}`}
                    className="block py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                  <ul className="ml-4 mt-1 space-y-1">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/products?category=${category.name.toLowerCase()}`}
                          className="block py-1.5 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                          onClick={onClose}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <footer className="p-4 border-t mt-4">
            <div className="space-y-1">
              <Link
                href="/about"
                className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={onClose}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={onClose}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className="block py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={onClose}
              >
                Shopping Cart
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
} 