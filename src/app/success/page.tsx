'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

function SuccessContent() {
  const [status, setStatus] = useState('processing')
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    if (sessionId) {
      // 清空购物车
      clearCart()

      // 处理订单确认
      fetch(`/api/checkout/success?session_id=${sessionId}`, {
        method: 'POST',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('complete')
          } else {
            setStatus('error')
            console.error('Error:', data.message)
          }
        })
        .catch(err => {
          console.error('Error:', err)
          setStatus('error')
        })
    }
  }, [sessionId, clearCart])

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {status === 'processing' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Processing your order...</p>
        </div>
      )}

      {status === 'complete' && (
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Thank you for your purchase!</h1>
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-4">Your order has been successfully processed.</p>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">
              Order ID: {sessionId}
            </p>
          )}
          <Link
            href="/"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
          <p>There was an error processing your order.</p>
          <p className="mt-2">Please contact customer support if you need assistance.</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
          >
            Return to Home
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
} 