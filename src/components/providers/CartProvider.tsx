'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const fetchCart = useCartStore((state) => state.fetchCart)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return <>{children}</>
} 