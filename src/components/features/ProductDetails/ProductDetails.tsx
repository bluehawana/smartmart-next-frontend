'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface ColorOption {
  name: string
  value: string
}

const colorOptions: ColorOption[] = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
]

export function ProductDetails({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [quantity, setQuantity] = useState(1)
  const [expandedSection, setExpandedSection] = useState<string | null>('info')

  const imageUrl = `http://localhost:8080/api/uploads/${product.imageUrl}`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column - Product Image */}
      <div className="lg:col-span-7">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Column - Product Info */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">€{product.price.toFixed(2)}</p>
        </div>

        {/* Color Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Color: {selectedColor.name}</h3>
          <div className="flex gap-4">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor.name === color.name
                    ? 'border-black'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Quantity</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-medium w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button className="w-full bg-black text-white py-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>

        {/* Product Information */}
        <div className="space-y-4 pt-8 border-t">
          {['info', 'shipping', 'returns'].map((section) => (
            <div key={section}>
              <button
                onClick={() => setExpandedSection(
                  expandedSection === section ? null : section
                )}
                className="flex justify-between items-center w-full py-2"
              >
                <span className="font-medium text-gray-900">
                  {section === 'info' ? 'Product Information' : 
                   section === 'shipping' ? 'Shipping Information' : 
                   'Returns & Exchanges'}
                </span>
                {expandedSection === section ? 
                  <Minus className="w-5 h-5" /> : 
                  <Plus className="w-5 h-5" />
                }
              </button>
              {expandedSection === section && (
                <div className="pt-2 pb-4 text-gray-600">
                  {section === 'info' && product.description}
                  {section === 'shipping' && 
                    'Free worldwide shipping on all orders over €300. Delivery within 3-5 business days.'}
                  {section === 'returns' && 
                    'Easy 30-day returns. See our return policy for more details.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 