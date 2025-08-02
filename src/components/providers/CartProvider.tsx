'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force hydration of cart store
    useCartStore.persist.rehydrate()
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 