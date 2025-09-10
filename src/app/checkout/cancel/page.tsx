export default function CheckoutCancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>
      </div>

      <div className="space-y-4">
        <a 
          href="/checkout" 
          className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Try Again
        </a>
        <div>
          <a 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}