'use client'

import { useCartStore } from '@/lib/store/cart'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items } = useCartStore()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.image}`
          }))
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Checkout error response:', data)
        throw new Error(data.error || data.message || 'Failed to create checkout session')
      }

      if (!data.success || !data.url) {
        throw new Error('Invalid response from checkout API')
      }

      window.location.href = data.url

    } catch (error) {
      console.error('Checkout error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
} 