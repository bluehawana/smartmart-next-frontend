'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't auto-fetch cart on mount, let individual pages handle it
  // The Zustand persist middleware will automatically restore from localStorage

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 