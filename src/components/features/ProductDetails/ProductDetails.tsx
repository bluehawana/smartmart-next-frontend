'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'
import { getProductImageUrl } from '@/lib/utils'

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
      await addToCart(product.id, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
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
        <div className="relative aspect-square bg-white rounded-lg">
          <Image
            src={getProductImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* 右侧：产品信息 */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold">€{product.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* 数量选择器 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border rounded-md hover:bg-gray-50 active:bg-gray-100"
              disabled={quantity <= 1}
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-medium w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border rounded-md hover:bg-gray-50 active:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* 添加到购物车按钮 */}
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-black text-white py-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors active:bg-gray-800 disabled:bg-gray-400"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
} 