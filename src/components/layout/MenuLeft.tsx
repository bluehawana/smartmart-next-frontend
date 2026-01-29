'use client'

import { X, ChevronRight, Home, Package, Headphones, Watch, Smartphone, Monitor, Wifi, Settings, HelpCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Computers',
    icon: Monitor,
    href: '/products?category=computers',
    description: 'Laptops & Desktops'
  },
  {
    name: 'Audio',
    icon: Headphones,
    href: '/products?category=audio',
    description: 'Headphones & Speakers'
  },
  {
    name: 'Wearables',
    icon: Watch,
    href: '/products?category=wearables',
    description: 'Smartwatches & Trackers'
  },
  {
    name: 'Smartphones',
    icon: Smartphone,
    href: '/products?category=smartphones',
    description: 'Phones & Tablets'
  },
  {
    name: 'Networking',
    icon: Wifi,
    href: '/products?category=networking',
    description: 'Routers & Accessories'
  },
  {
    name: 'Accessories',
    icon: Settings,
    href: '/products?category=accessories',
    description: 'Cables, Cases & More'
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
      <div
        className={`fixed inset-0 bg-primary-950/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[380px] bg-white z-50 transform transition-transform duration-300 ease-out shadow-soft-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-primary-100">
            <Link
              href="/"
              onClick={onClose}
              className="font-display text-xl font-semibold text-primary-950 tracking-tight"
            >
              SMRTMART
            </Link>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-primary-500 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Quick Links */}
            <div className="p-4">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-primary-700 hover:text-primary-950 hover:bg-primary-50 rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/products"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-primary-700 hover:text-primary-950 hover:bg-primary-50 rounded-xl transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">All Products</span>
              </Link>
            </div>

            {/* Categories */}
            <div className="px-4 pb-4">
              <h3 className="px-4 py-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                Shop by Category
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 hover:bg-primary-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <Icon className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-900">{category.name}</p>
                          <p className="text-xs text-primary-500">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary-600 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Promo Banner */}
            <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
              <p className="text-xs font-semibold text-accent-dark uppercase tracking-wide mb-1">Limited Offer</p>
              <p className="text-sm text-primary-800 font-medium">Free shipping on orders over 500 kr</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-primary-100 p-4">
            <div className="space-y-1">
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
