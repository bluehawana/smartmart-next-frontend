'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    if (canceled) {
      toast.error('Payment was canceled')
    }
  }, [canceled])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Canceled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was canceled. You can try again when you're ready.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
} 