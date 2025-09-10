'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

// Form data interfaces
interface CustomerInfo {
  firstName: string
  lastName: string
  phone: string
  email: string
}

interface Address {
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

interface CheckoutFormData {
  customerInfo: CustomerInfo
  shippingAddress: Address
  billingAddress?: Address
  useShippingAsBilling: boolean
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [useBackend, setUseBackend] = useState(true)
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    shippingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
      phone: ''
    },
    useShippingAsBilling: true
  })
  const { items, getTotalPrice } = useCartStore()

  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }))
  }

  const updateShippingAddress = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }))
  }

  const updateBillingAddress = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress!,
        [field]: value
      }
    }))
  }

  const validateForm = (): boolean => {
    const { customerInfo, shippingAddress } = formData
    
    // Validate customer info
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information fields')
      return false
    }
    
    // Validate shipping address
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      alert('Please fill in all required shipping address fields')
      return false
    }
    
    // Validate billing address if different from shipping
    if (!formData.useShippingAsBilling && formData.billingAddress) {
      const { billingAddress } = formData
      if (!billingAddress.firstName || !billingAddress.lastName || !billingAddress.addressLine1 || 
          !billingAddress.city || !billingAddress.state || !billingAddress.postalCode || !billingAddress.country) {
        alert('Please fill in all required billing address fields')
        return false
      }
    }
    
    return true
  }

  const handleBackendCheckout = async () => {
    if (!validateForm()) return
    
    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsLoading(true)

    try {
      // Prepare checkout data for backend
      const checkoutData = {
        items: items.map(item => ({
          product_id: item.productId.toString(),
          name: item.name,
          description: item.description || '',
          price: item.price,
          quantity: item.quantity,
          images: item.image ? [item.image] : []
        })),
        customer_email: formData.customerInfo.email,
        customer_info: {
          first_name: formData.customerInfo.firstName,
          last_name: formData.customerInfo.lastName,
          phone: formData.customerInfo.phone,
          email: formData.customerInfo.email
        },
        shipping_address: {
          first_name: formData.shippingAddress.firstName,
          last_name: formData.shippingAddress.lastName,
          company: formData.shippingAddress.company || '',
          address_line1: formData.shippingAddress.addressLine1,
          address_line2: formData.shippingAddress.addressLine2 || '',
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          postal_code: formData.shippingAddress.postalCode,
          country: formData.shippingAddress.country,
          phone: formData.shippingAddress.phone || ''
        },
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`
      }

      // Add billing address if different from shipping
      if (!formData.useShippingAsBilling && formData.billingAddress) {
        checkoutData.billing_address = {
          first_name: formData.billingAddress.firstName,
          last_name: formData.billingAddress.lastName,
          company: formData.billingAddress.company || '',
          address_line1: formData.billingAddress.addressLine1,
          address_line2: formData.billingAddress.addressLine2 || '',
          city: formData.billingAddress.city,
          state: formData.billingAddress.state,
          postal_code: formData.billingAddress.postalCode,
          country: formData.billingAddress.country,
          phone: formData.billingAddress.phone || ''
        }
      }

      console.log('Creating backend checkout session with data:', checkoutData)

      // Call backend checkout endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || errorData.message || 'Failed to create checkout session')
      }

      const result = await response.json()
      console.log('Backend response:', result)
      
      if (result.success && result.data?.SessionURL) {
        // Handle capitalized response format from Go backend
        window.location.href = result.data.SessionURL
      } else if (result.success && result.data?.session_url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.session_url
      } else {
        console.error('Invalid response structure:', result)
        throw new Error('Invalid response from checkout endpoint')
      }
    } catch (error) {
      console.error('Backend checkout error:', error)
      
      let errorMessage = 'Checkout failed. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectCheckout = async () => {
    if (!formData.customerInfo.email) {
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
      // Use the existing backend checkout but with minimal data for direct mode
      const checkoutData = {
        items: items.map(item => ({
          product_id: item.productId.toString(),
          name: item.name,
          description: item.description || '',
          price: item.price,
          quantity: item.quantity,
          images: item.image ? [item.image] : []
        })),
        customer_email: formData.customerInfo.email,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`
      }

      console.log('Creating direct checkout session (using backend):', checkoutData)

      // Call the original backend checkout endpoint (without full customer info)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || errorData.message || 'Failed to create checkout session')
      }

      const result = await response.json()
      console.log('Direct checkout response:', result)
      
      if (result.success && result.data?.SessionURL) {
        // Handle capitalized response format from Go backend
        window.location.href = result.data.SessionURL
      } else if (result.success && result.data?.session_url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.session_url
      } else {
        console.error('Invalid response structure:', result)
        throw new Error('Invalid response from checkout endpoint')
      }

    } catch (error) {
      console.error('Direct checkout error:', error)
      
      // Show detailed error information
      let errorMessage = 'Checkout failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Provide helpful error messages
      if (errorMessage.includes('Your account cannot currently make live charges')) {
        errorMessage = 'Payment system is in test mode. Please use test card number 4242 4242 4242 4242.';
      } else if (errorMessage.includes('No such payment_method')) {
        errorMessage = 'Invalid payment method. Please try again.';
      } else if (errorMessage.includes('Stripe')) {
        errorMessage = 'Payment service error. Please try again or contact support.';
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = () => {
    if (useBackend) {
      handleBackendCheckout()
    } else {
      handleDirectCheckout()
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
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            <p className="font-semibold">{(item.price * item.quantity).toLocaleString('sv-SE')} kr</p>
          </div>
        ))}
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-300">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-xl font-bold">{getTotalPrice().toLocaleString('sv-SE')} kr</span>
        </div>
      </div>

      {/* Checkout Method Toggle */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-blue-900">Checkout Method</h2>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={useBackend}
              onChange={() => setUseBackend(true)}
              className="mr-2"
            />
            <span className="text-sm">Backend Checkout (Full Info)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useBackend}
              onChange={() => setUseBackend(false)}
              className="mr-2"
            />
            <span className="text-sm">Direct Stripe (Email Only)</span>
          </label>
        </div>
      </div>

      {useBackend ? (
        <>
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.customerInfo.firstName}
                  onChange={(e) => updateCustomerInfo('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.customerInfo.lastName}
                  onChange={(e) => updateCustomerInfo('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.customerInfo.email}
                  onChange={(e) => updateCustomerInfo('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.customerInfo.phone}
                  onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.firstName}
                  onChange={(e) => updateShippingAddress('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.lastName}
                  onChange={(e) => updateShippingAddress('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.company}
                  onChange={(e) => updateShippingAddress('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) => updateShippingAddress('addressLine1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.addressLine2}
                  onChange={(e) => updateShippingAddress('addressLine2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Apt 4B"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) => updateShippingAddress('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) => updateShippingAddress('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) => updateShippingAddress('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.shippingAddress.country}
                  onChange={(e) => updateShippingAddress('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.shippingAddress.phone}
                  onChange={(e) => updateShippingAddress('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="useShippingAsBilling"
                checked={formData.useShippingAsBilling}
                onChange={(e) => {
                  const checked = e.target.checked
                  setFormData(prev => ({
                    ...prev,
                    useShippingAsBilling: checked,
                    billingAddress: checked ? undefined : {
                      firstName: '',
                      lastName: '',
                      company: '',
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: 'US',
                      phone: ''
                    }
                  }))
                }}
                className="mr-2"
              />
              <label htmlFor="useShippingAsBilling" className="text-sm font-medium text-gray-700">
                Billing address is the same as shipping address
              </label>
            </div>

            {!formData.useShippingAsBilling && (
              <>
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.firstName || ''}
                      onChange={(e) => updateBillingAddress('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.lastName || ''}
                      onChange={(e) => updateBillingAddress('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.company || ''}
                      onChange={(e) => updateBillingAddress('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.addressLine1 || ''}
                      onChange={(e) => updateBillingAddress('addressLine1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.addressLine2 || ''}
                      onChange={(e) => updateBillingAddress('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.city || ''}
                      onChange={(e) => updateBillingAddress('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.state || ''}
                      onChange={(e) => updateBillingAddress('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress?.postalCode || ''}
                      onChange={(e) => updateBillingAddress('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={formData.billingAddress?.country || 'US'}
                      onChange={(e) => updateBillingAddress('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="AT">Austria</option>
                      <option value="CH">Switzerland</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.customerInfo.email}
              onChange={(e) => updateCustomerInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading || (!useBackend && !formData.customerInfo.email)}
        className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-colors ${
          isLoading || (!useBackend && !formData.customerInfo.email)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {isLoading ? 'Processing...' : `Pay ${getTotalPrice().toLocaleString('sv-SE')} kr with ${useBackend ? 'Backend' : 'Direct'} Stripe`}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
          <>
            <p>🔒 Secure payment powered by Stripe</p>
            <p>Your payment information is encrypted and secure</p>
            <div className={`border rounded-md p-3 mt-2 ${
              useBackend 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-xs ${
                useBackend 
                  ? 'text-green-800' 
                  : 'text-blue-800'
              }`}>
                {useBackend 
                  ? '✅ Using complete backend checkout with full customer information collection'
                  : 'ℹ️ Using direct Stripe checkout - address will be collected by Stripe'
                }
              </p>
            </div>
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