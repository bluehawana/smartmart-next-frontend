'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const fetchCart = useCartStore(state => state.fetchCart)

  useEffect(() => {
    // 清空购物车
    fetchCart()

    // 5秒后重定向到首页
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router, fetchCart])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Order ID: {sessionId}
        </p>
        <p className="text-gray-500 text-sm">
          You will be redirected to the homepage in 5 seconds...
        </p>
      </div>
    </div>
  )
} 