'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
}

export function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  return (
    <Link 
      href={`/products/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-lg transition-shadow duration-300"
    >
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
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">€{price.toFixed(2)}</p>
      </div>
    </Link>
  )
} 