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
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                        {isOwner && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-white mt-1">
                            <Shield className="w-3 h-3 mr-1" />
                            Owner
                          </span>
                        )}
                      </div>

                      {isOwner && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4 inline mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        My Profile
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
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