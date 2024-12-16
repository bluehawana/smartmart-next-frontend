'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore(state => state.clearCart)
  const [confirmationSent, setConfirmationSent] = useState(false)

  useEffect(() => {
    if (sessionId && !confirmationSent) {
      // 立即清空购物车
      clearCart()
      setConfirmationSent(true)

      // 发送确认邮件
      fetch('/api/order/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId,
          // 添加其他需要的信息
          timestamp: new Date().toISOString()
        })
      })
      .then(async response => {
        if (!response.ok) {
          const text = await response.text()
          throw new Error(`Failed to send confirmation: ${text}`)
        }
        console.log('Confirmation email sent successfully')
      })
      .catch(error => {
        console.error('Error sending confirmation:', error)
      })
    }
  }, [sessionId, clearCart, confirmationSent])

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-8">
          You will receive an email confirmation shortly.
          {sessionId && <span className="block mt-2 text-sm">Order ID: {sessionId}</span>}
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
} 