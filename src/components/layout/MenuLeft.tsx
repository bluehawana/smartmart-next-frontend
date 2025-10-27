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
            {categories.map((category) => (
              <div key={category.name} className="mb-6">
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <ul className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link 
                        href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                        className="text-gray-600 hover:text-gray-900"
                        onClick={onClose}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <footer className="p-4 border-t">
            <div className="space-y-4">
              <Link 
                href="/about"
                className="block text-gray-600 hover:text-gray-900"
                onClick={onClose}
              >
                About Us
              </Link>
              <Link 
                href="/contact"
                className="block text-gray-600 hover:text-gray-900"
                onClick={onClose}
              >
                Contact
              </Link>
              <Link 
                href="/support"
                className="block text-gray-600 hover:text-gray-900"
                onClick={onClose}
              >
                Support
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
} 