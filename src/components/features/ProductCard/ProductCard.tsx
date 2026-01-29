'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { getProductImageUrl } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
  description?: string
  category?: string
  comparePrice?: number
  featured?: boolean
  stock?: number
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
  category,
  comparePrice,
  featured,
  stock = 1
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAddingToCart(true)
    try {
      await addToCart(id, 1, {
        name,
        price,
        image: imageUrl,
        description: description || '',
      })
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="group">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square bg-primary-50 rounded-xl overflow-hidden mb-4">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {featured && (
              <span className="badge badge-accent">Featured</span>
            )}
            {discount > 0 && (
              <span className="badge badge-primary">-{discount}%</span>
            )}
          </div>

          {/* Image */}
          <Image
            src={getProductImageUrl(imageUrl)}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-primary-950/80 to-transparent pt-12">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || stock <= 0}
              className="w-full py-3 bg-white text-primary-950 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors disabled:bg-primary-200 disabled:text-primary-400 flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
              ) : stock <= 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/products/${id}`}>
        {category && (
          <p className="text-xs text-primary-400 uppercase tracking-wide mb-1">{category}</p>
        )}
        <h3 className="text-sm font-medium text-primary-950 group-hover:text-accent-dark transition-colors line-clamp-2 mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-semibold text-primary-950">
            {price.toLocaleString('sv-SE')} kr
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm text-primary-400 line-through">
              {comparePrice.toLocaleString('sv-SE')} kr
            </span>
          )}
        </div>
        <p className="text-xs text-primary-400 mt-1">inkl. 25% moms</p>
      </Link>
    </div>
  )
}
