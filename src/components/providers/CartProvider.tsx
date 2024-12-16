'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const fetchCart = useCartStore(state => state.fetchCart)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchCart()
    }
  }, [mounted, fetchCart])

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 