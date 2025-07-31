'use client'

import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export function CheckoutButton() {
  const { items, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <button 
        disabled 
        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed"
      >
        Cart is Empty
      </button>
    )
  }

  return (
    <Link 
      href="/checkout"
      className="block w-full bg-black text-white text-center py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
    >
      Checkout - ${getTotalPrice().toFixed(2)}
    </Link>
  )
}