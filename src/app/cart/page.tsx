'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CheckoutButton } from '@/components/features/CheckoutButton'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">€{item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <CheckoutButton />
          </div>
        </div>
      </div>
    </div>
  )
} 