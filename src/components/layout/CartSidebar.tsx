'use client'

import { useCartStore } from '@/lib/store/cart'
import { ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import { getProductImageUrl } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { CheckoutButton } from '@/components/features/CheckoutButton/CheckoutButton'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal, isLoading } = useCartStore()

  if (!isOpen) return null

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(id, newQuantity)
    } catch (error) {
      toast.error('Failed to update quantity')
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
      console.error('Failed to remove item:', error)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart ({items.length})</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => item && (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative w-20 h-20">
                      {item.image && (
                        <Image
                          src={getProductImageUrl(item.image)}
                          alt={item.name || 'Product image'}
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{Number(item.price).toLocaleString('sv-SE')} kr</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-bold">{getCartTotal().toLocaleString('sv-SE')} kr</span>
            </div>
            <CheckoutButton />
          </div>
        </div>
      </div>
    </>
  )
} 