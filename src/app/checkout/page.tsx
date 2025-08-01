'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const { items, getTotalPrice } = useCartStore()

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email address')
      return
    }

    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert('Stripe is not configured. Please contact support.')
      return
    }

    setIsLoading(true)

    try {
      // Prepare checkout items
      const checkoutItems = items.map(item => ({
        product_id: item.productId, // Use productId instead of id
        name: item.name,
        description: item.description || `Quantity: ${item.quantity}`,
        price: Math.round(item.price * 100), // Convert to cents for Stripe
        quantity: item.quantity,
        images: item.image ? [item.image] : []
      }))

      // Create checkout session
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';
      const response = await fetch(`${apiUrl}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer_email: email,
          success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout/cancel`
        })
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (!stripePromise) {
        throw new Error('Stripe is not configured')
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.data.session_id
      })

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      console.error('Checkout error:', error)
      
      // Show detailed error information
      let errorMessage = 'Checkout failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // If it's a network error, provide more context
      if (errorMessage.includes('fetch')) {
        errorMessage = 'Unable to connect to payment service. Please check your internet connection and try again.';
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart to proceed with checkout.</p>
        <a 
          href="/" 
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading || !email}
        className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-colors ${
          isLoading || !email
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {isLoading ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)} with Stripe`}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
          <>
            <p>🔒 Secure payment powered by Stripe</p>
            <p>Your payment information is encrypted and secure</p>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
            <p className="text-yellow-800 font-medium">⚠️ Stripe Configuration Required</p>
            <p className="text-yellow-700 text-xs mt-1">
              Add your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local to enable payments
            </p>
          </div>
        )}
      </div>
    </div>
  )
}