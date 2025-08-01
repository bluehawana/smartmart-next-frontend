import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound } from "next/navigation"
import { use } from 'react'

// Mock products with correct Supabase image URLs
const MOCK_PRODUCTS: Record<string, any> = {
  "1": {
    id: 1,
    name: "Apple MacBook Pro 16-inch",
    price: 2499.99,
    description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg",
    stock: 15
  },
  "2": {
    id: 2,
    name: "Apple AirPods Pro 2nd Generation",
    price: 249.99,
    description: "Apple AirPods Pro with Active Noise Cancellation, Transparency mode, and spatial audio.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg",
    stock: 50
  },
  "3": {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    price: 399.99,
    description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg",
    stock: 25
  },
  "4": {
    id: 4,
    name: "Dell XPS 13 Laptop",
    price: 1299.99,
    description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg",
    stock: 20
  },
  "5": {
    id: 5,
    name: "Dell Alienware 34 Curved Monitor",
    price: 899.99,
    description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg",
    stock: 10
  },
  "6": {
    id: 6,
    name: "Apple Watch Ultra",
    price: 799.99,
    description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg",
    stock: 30
  },
  "7": {
    id: 7,
    name: "Dell XPS 13 Laptop",
    price: 1299.99,
    description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg",
    stock: 20
  },
  "8": {
    id: 8,
    name: "ASUS ROG Gaming Laptop",
    price: 1599.99,
    description: "High-performance gaming laptop with RTX graphics, RGB keyboard, and advanced cooling system.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/asus.jpg",
    stock: 12
  },
  "9": {
    id: 9,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg",
    stock: 18
  },
  "10": {
    id: 10,
    name: "Smart Translator Device",
    price: 299.99,
    description: "Portable smart translator with voice recognition, supporting 100+ languages for seamless communication.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg",
    stock: 35
  }
}

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  stock: number
}

// 模拟获取产品数据的函数
async function getProduct(id: string): Promise<Product> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const product = MOCK_PRODUCTS[id]
  if (!product) {
    notFound()
  }
  
  return product
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // 正确处理异步参数
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  )
}

// 加载状态组件
export function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
} 