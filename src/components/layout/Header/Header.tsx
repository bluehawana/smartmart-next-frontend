'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, User, ShoppingCart, LogOut, Shield } from 'lucide-react'
import { useSession, authClient } from '@/lib/auth-client'
import { useCartStore } from '@/lib/store/cart'
import { hasOwnerAccess } from '@/lib/auth-utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  const cart = useCartStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    setShowUserMenu(false)
  }

  const isOwner = hasOwnerAccess(session?.user)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
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
            <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
              SMARTMART
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Search className="w-6 h-6" />
            </button>

            {/* User Menu */}
            <div className="relative">
              {session ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-gray-200 transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center text-sm font-semibold ring-2 ring-transparent hover:ring-gray-200 transition-all">
                        {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User Info */}
                        <div className="px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                          <div className="flex items-center space-x-3 mb-2">
                            {session.user.image ? (
                              <img
                                src={session.user.image}
                                alt={session.user.name || ''}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black text-white flex items-center justify-center text-lg font-semibold">
                                {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {session.user.name || 'User'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                          {isOwner && (
                            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black text-white">
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
                                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mr-3">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Admin Dashboard</p>
                                  <p className="text-xs text-gray-500">Manage your store</p>
                                </div>
                              </Link>
                              <div className="border-t border-gray-100 my-2" />
                            </>
                          )}

                          <Link
                            href="/profile"
                            className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">My Account</p>
                              <p className="text-xs text-gray-500">Profile & orders</p>
                            </div>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Sign Out</p>
                              <p className="text-xs text-red-500">See you soon!</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-md relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 