'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  stock: number
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      // Convert product.id to number for the cart store
      const numericProductId = Number(product.id)
      await addToCart(numericProductId, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 左侧：产品图片 */}
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image || '/placeholder-product.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />
        </div>

        {/* 右侧：产品信息 */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light text-black">{product.name}</h1>
            <p className="mt-4 text-2xl font-medium text-black">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* 数量选择器 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border border-gray-300 hover:border-black transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-medium w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border border-gray-300 hover:border-black transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 添加到购物车按钮 */}
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 text-sm font-medium"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
} 