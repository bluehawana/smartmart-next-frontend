'use client'

import { useEffect, useState } from 'react'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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