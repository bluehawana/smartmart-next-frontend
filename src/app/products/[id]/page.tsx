'use client'

import Image from 'next/image'
import { useState, use } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'react-hot-toast'

const PRODUCTS = {
  1: {
    name: "Apple MacBook Pro 16-inch, M1 Max",
    price: 3499.99,
    description: "Supercharged by M1 Max chip for groundbreaking performance and amazing battery life.",
    image: "macbook.jpg"
  },
  2: {
    name: "Apple AirPods Pro with Active Noise Cancellation",
    price: 249.99,
    description: "Active Noise Cancellation for immersive sound. Transparency mode for hearing what's happening around you.",
    image: "airpods2.jpg"
  },
  3: {
    name: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
    price: 399.99,
    description: "Industry-leading noise cancellation with two processors and eight microphones.",
    image: "sony.jpg"
  },
  4: {
    name: "Dell XPS 13 9310 13.4-inch FHD+ Touchscreen Laptop",
    price: 1299.99,
    description: "13.4-inch FHD+ (1920 x 1200) InfinityEdge Touch Anti-Reflective Display.",
    image: "xps.jpg"
  },
  5: {
    name: "Dell Alienware 34-inch Curved Gaming Monitor",
    price: 999.99,
    description: "34-inch curved gaming monitor with WQHD resolution and 120Hz refresh rate.",
    image: "dell.jpg"
  },
  6: {
    name: "Apple Watch Ultra 2, GPS + Cellular, 49mm Titanium Case",
    price: 799.99,
    description: "The most rugged and capable Apple Watch with precision dual-frequency GPS.",
    image: "ultra.jpg"
  }
} as const

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const [quantity, setQuantity] = useState(1)
  const product = PRODUCTS[id as keyof typeof PRODUCTS]
  const addToCart = useCartStore((state) => state.addToCart)

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    )
    toast.success('Added to cart!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 左侧：产品图片 */}
        <div className="relative aspect-square bg-white rounded-lg">
          <Image
            src={`http://localhost:8080/api/uploads/${product.image}`}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
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
            className="w-full bg-black text-white py-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors active:bg-gray-800"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
} 