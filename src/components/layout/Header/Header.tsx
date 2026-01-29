'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, User, ShoppingBag, LogOut, Shield, X, ChevronRight } from 'lucide-react'
import { useSession, authClient } from '@/lib/auth-client'
import { useCartStore } from '@/lib/store/cart'
import { hasOwnerAccess } from '@/lib/auth-utils'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { MenuLeft } from '@/components/layout/MenuLeft'

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const cart = useCartStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    setShowUserMenu(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const isOwner = hasOwnerAccess(session?.user ?? null)
  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <MenuLeft isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] animate-fade-in">
          <div
            className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />
          <div className="relative z-10 pt-20 px-4">
            <div className="max-w-2xl mx-auto animate-fade-in-down">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  autoFocus
                  className="w-full pl-14 pr-14 py-5 text-lg bg-white border-0 shadow-soft-2xl focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-primary-400 hover:text-primary-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-white/70">
                Press <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd> to search or <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Bar */}
      <div className="bg-primary-950 text-white py-2.5 text-center text-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8">✨ Free shipping on orders over 500 kr</span>
          <span className="mx-8">🎁 New arrivals every week</span>
          <span className="mx-8">⚡ Same-day delivery in Stockholm</span>
          <span className="mx-8">✨ Free shipping on orders over 500 kr</span>
          <span className="mx-8">🎁 New arrivals every week</span>
          <span className="mx-8">⚡ Same-day delivery in Stockholm</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-soft-md' : 'border-b border-primary-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 -ml-2 text-primary-700 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/products"
                  className="text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors link-underline"
                >
                  All Products
                </Link>
                <Link
                  href="/products?category=computers"
                  className="text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors link-underline"
                >
                  Computers
                </Link>
                <Link
                  href="/products?category=audio"
                  className="text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors link-underline"
                >
                  Audio
                </Link>
                <Link
                  href="/products?category=wearables"
                  className="text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors link-underline"
                >
                  Wearables
                </Link>
              </nav>
            </div>

            {/* Center - Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-display text-xl lg:text-2xl font-semibold text-primary-950 tracking-tight hover:opacity-80 transition-opacity"
            >
              SMRTMART
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 text-primary-700 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                {session ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || ''}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark text-primary-950 flex items-center justify-center text-sm font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />

                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-xl border border-primary-100 overflow-hidden z-50 animate-scale-in origin-top-right">
                          {/* User Info */}
                          <div className="px-5 py-4 bg-gradient-to-br from-primary-50 to-white">
                            <div className="flex items-center gap-3">
                              {session.user.image ? (
                                <img
                                  src={session.user.image}
                                  alt={session.user.name || ''}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark text-primary-950 flex items-center justify-center text-lg font-semibold">
                                  {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary-950 truncate">
                                  {session.user.name || 'User'}
                                </p>
                                <p className="text-xs text-primary-500 truncate">
                                  {session.user.email}
                                </p>
                              </div>
                            </div>
                            {isOwner && (
                              <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-primary-950">
                                <Shield className="w-3 h-3 mr-1" />
                                Store Owner
                              </div>
                            )}
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            {isOwner && (
                              <>
                                <Link
                                  href="/admin"
                                  className="flex items-center justify-between px-5 py-3 hover:bg-primary-50 transition-colors group"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-950 text-white flex items-center justify-center">
                                      <Shield className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-primary-950">Admin Dashboard</p>
                                      <p className="text-xs text-primary-500">Manage your store</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary-600 transition-colors" />
                                </Link>
                                <div className="mx-5 my-2 border-t border-primary-100" />
                              </>
                            )}

                            <Link
                              href="/profile"
                              className="flex items-center justify-between px-5 py-3 hover:bg-primary-50 transition-colors group"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary-700" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-primary-950">My Account</p>
                                  <p className="text-xs text-primary-500">Profile & orders</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary-600 transition-colors" />
                            </Link>
                          </div>

                          {/* Sign Out */}
                          <div className="border-t border-primary-100 p-2">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-error/5 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-950 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-primary-700 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-colors group"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-accent text-primary-950 text-xs font-semibold rounded-full animate-scale-in">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
