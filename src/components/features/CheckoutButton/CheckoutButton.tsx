'use client'

import { useCartStore } from '@/lib/store/cart'
import { useState } from 'react'

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const items = useCartStore(state => state.items)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        description: item.description
      }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items: cartItems })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Checkout error:', errorData)
        throw new Error(errorData.message || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (!url) {
        throw new Error('No checkout URL received')
      }

      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      className={`w-full py-3 rounded-lg transition-colors ${
        isLoading || items.length === 0
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-black hover:bg-gray-900'
      } text-white`}
    >
      {isLoading ? 'Processing...' : 'Checkout'}
    </button>
  )
} 