'use client'

import Image from 'next/image'
import Link from 'next/link'

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
      <div className="aspect-square relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">€{price.toFixed(2)}</p>
      </div>
    </Link>
  )
} 