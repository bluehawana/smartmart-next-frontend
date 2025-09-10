'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { getProductImageUrl } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'

// UUID to numeric ID mapping - same as in products page
const UUID_TO_NUMERIC: Record<string, string> = {
  "88d35c54-ce2d-40d5-92e9-4af5c7e5e330": "1", // MacBook Pro 16-inch
  "c0d069ee-031f-4340-8588-4706103e6b04": "2", // AirPods Pro 2nd Generation  
  "7a82d048-b478-4b4b-8b78-64eeb3a7ab86": "3", // Sony WH-1000XM5 Headphones
  "a4e33218-57c3-4133-ac51-ca9aa711eddb": "4", // Dell Alienware 34 Curved Monitor
  "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1": "5", // Apple Watch Ultra
  "a87117d8-e9dd-49ab-a131-245cff3cbf2d": "6", // AI Translate Earphones Pro
  "611bac4c-ef16-484e-899d-1e7992819a88": "7", // Dell XPS 13 Laptop
  "13e2b89d-4f65-4ad0-8c4a-5150657e5bde": "8", // ASUS ROG Rapture GT-BE98 Gaming Router
  "4dc6d3bf-ec23-4c1b-b47d-f156c82e92fa": "9", // iPhone 15 Pro Max
  "eed7ffb1-5dc5-45fe-8e77-63430419dce3": "10", // Smart Language Translator Buds
  "a3f5302f-f496-4211-9737-e55de3b526c2": "11"  // Dell XPS 15 Developer Edition
}

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
      // Convert UUID to numeric ID for cart system
      const numericId = UUID_TO_NUMERIC[id] || id
      await addToCart(Number(numericId), 1)
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