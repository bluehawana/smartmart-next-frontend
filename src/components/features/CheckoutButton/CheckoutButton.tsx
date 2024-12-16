'use client'

import { useCartStore } from '@/lib/store/cart'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { items } = useCartStore()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image
      }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items: cartItems }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (!url) {
        throw new Error('No checkout URL received')
      }

      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to proceed to checkout. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={items.length === 0 || isLoading}
      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 relative"
      aria-label={isLoading ? 'Processing checkout...' : 'Proceed to checkout'}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        'Checkout'
      )}
    </button>
  )
} 