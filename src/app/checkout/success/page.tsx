'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
      </div>

      {sessionId && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Order Details</h2>
          <p className="text-sm text-gray-600">Session ID: {sessionId}</p>
          <p className="text-sm text-gray-600 mt-2">
            You will receive an email confirmation shortly with your order details and tracking information.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <a 
          href="/" 
          className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </a>
        <div>
          <a 
            href="/orders" 
            className="text-blue-600 hover:underline"
          >
            View Your Orders
          </a>
        </div>
      </div>
    </div>
  )
}