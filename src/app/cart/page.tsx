'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'react-hot-toast';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getProductImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice 
  } = useCartStore();

  // Don't auto-fetch cart - rely on persisted storage
  // useEffect(() => {
  //   fetchCart();
  // }, [fetchCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, newQuantity);
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
          </svg>
          <h2 className="text-2xl font-light text-black mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link 
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light text-black mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="w-20 h-20 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={getProductImageUrl(item.image) || '/placeholder-product.svg'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-black">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.price.toLocaleString('sv-SE')} kr</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-black disabled:opacity-50 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-black disabled:opacity-50 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-medium text-black">
                    {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                    className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-50 flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-6">
          <h2 className="text-xl font-medium text-black mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-black">{getTotalPrice().toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-black">Free</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-black">Total</span>
                <span className="text-black">{getTotalPrice().toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/checkout"
            className="block w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors mb-4 text-center"
          >
            Proceed to Checkout
          </Link>
          
          <Link 
            href="/products"
            className="block text-center text-sm text-gray-600 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
