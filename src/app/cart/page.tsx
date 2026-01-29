'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Shield, Truck, Package } from 'lucide-react';
import { getProductImageUrl } from '@/lib/utils';
import { getCartVATBreakdown } from '@/lib/vat';

export default function CartPage() {
  const {
    items,
    isLoading,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    refreshItemDetails
  } = useCartStore();

  // Consolidate duplicate items
  const consolidatedItems = items.reduce((acc, item) => {
    const existing = acc.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as typeof items);

  useEffect(() => {
    if (!items.length) return;
    const needsRefresh = items.some((item) => !item.name || item.name.startsWith('Product ') || item.price === 0);
    if (!needsRefresh) return;
    refreshItemDetails().catch(() => {});
  }, [items, refreshItemDetails]);

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

  const totalPrice = getTotalPrice();
  const vatBreakdown = getCartVATBreakdown(
    consolidatedItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-primary-100 rounded w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-primary-100 rounded-xl" />
                ))}
              </div>
              <div className="h-80 bg-primary-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (consolidatedItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary-300" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-primary-950 mb-3">
              Your cart is empty
            </h1>
            <p className="text-primary-500 mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to find something you'll love.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary-950 text-white px-8 py-4 text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-display-xs sm:text-display-sm text-primary-950">
            Shopping Cart
          </h1>
          <p className="text-primary-500 mt-1">
            {consolidatedItems.length} {consolidatedItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {consolidatedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-primary-100 rounded-xl hover:border-primary-200 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-primary-50 rounded-lg overflow-hidden">
                      <img
                        src={getProductImageUrl(item.image) || '/placeholder-product.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.svg';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-medium text-primary-950 hover:text-accent-dark transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-primary-500 mt-1">
                      {item.price.toLocaleString('sv-SE')} kr each
                    </p>

                    {/* Quantity Controls - Mobile */}
                    <div className="flex items-center justify-between mt-4 sm:hidden">
                      <div className="flex items-center border border-primary-200 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-9 h-9 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-primary-950">
                        {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                      </p>
                    </div>
                  </div>

                  {/* Desktop: Quantity & Price */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="flex items-center border border-primary-200 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right w-28">
                      <p className="font-semibold text-primary-950">
                        {(item.price * item.quantity).toLocaleString('sv-SE')} kr
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isLoading}
                        className="text-xs text-primary-400 hover:text-error flex items-center gap-1 mt-1 ml-auto disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Mobile Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                    className="sm:hidden self-start p-2 text-primary-400 hover:text-error disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-950 mt-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary-50 rounded-2xl p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-lg text-primary-950 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Subtotal (inkl. moms)</span>
                  <span className="text-primary-950 font-medium">{totalPrice.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 pl-3">— varav moms (25%)</span>
                  <span className="text-primary-500">{vatBreakdown.vatAmount.toLocaleString('sv-SE')} kr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="pt-3 mt-3 border-t border-primary-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary-950">Total</span>
                    <span className="font-display text-xl text-primary-950">{totalPrice.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <p className="text-xs text-primary-500 text-right mt-1">inkl. 25% moms</p>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-primary-950 text-white py-4 text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-primary-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-primary-600">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-600">
                  <Truck className="w-4 h-4 text-accent-dark" />
                  <span>Free shipping on orders over 500 kr</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-600">
                  <Package className="w-4 h-4 text-primary-400" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
