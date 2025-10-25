'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { getProductImageUrl } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
}

export function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAddingToCart(true)
    try {
      // Use the product ID directly (already numeric from API)
      await addToCart(id, 1, {
        name,
        price,
        image: imageUrl,
        description: '',
      })
      toast.success('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${id}`} className="block">
        <div className="relative w-full pt-[100%]">
          <Image
            src={getProductImageUrl(imageUrl)}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:opacity-75 transition-opacity duration-300"
            priority
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700">{name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">€{price.toFixed(2)}</p>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="mt-3 w-full bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
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
  )
} 
