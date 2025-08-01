import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound } from "next/navigation"
import { use } from 'react'

// Mock products with correct Supabase image URLs - matching the products page order
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
    name: "AirPods Pro 2nd Generation",
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
    name: "Dell Alienware 34 Curved Monitor",
    price: 899.99,
    description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg",
    stock: 10
  },
  "5": {
    id: 5,
    name: "Apple Watch Ultra",
    price: 799.99,
    description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg",
    stock: 30
  },
  "6": {
    id: 6,
    name: "AI Translate Earphones Pro",
    price: 199.99,
    description: "Revolutionary intelligent translate earphones with real-time translation in 40+ languages.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg",
    stock: 25
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
    name: "ASUS ROG Rapture GT-BE98 Gaming Router",
    price: 8990.99,
    description: "ASUS ROG Rapture GT-BE98 Quad-band Gaming Router with WiFi 7, advanced QoS, and ultra-low latency for competitive gaming.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/asus.jpg",
    stock: 8
  },
  "9": {
    id: 9,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system.",
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg",
    stock: 18
  },

}

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  stock: number
}

// UUID to numeric ID mapping - 9 products total
const UUID_TO_NUMERIC: Record<string, string> = {
  "88d35c54-ce2d-40d5-92e9-4af5c7e5e330": "1",
  "c0d069ee-031f-4340-8588-4706103e6b04": "2", 
  "7a82d048-b478-4b4b-8b78-64eeb3a7ab86": "3",
  "a4e33218-57c3-4133-ac51-ca9aa711eddb": "4",
  "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1": "5",
  "a87117d8-e9dd-49ab-a131-245cff3cbf2d": "6",
  "611bac4c-ef16-484e-899d-1e7992819a88": "7",
  "asus-rog-laptop-001": "8",
  "iphone-15-pro-max-001": "9"
}

// 模拟获取产品数据的函数
async function getProduct(id: string): Promise<Product> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Convert UUID to numeric ID if needed
  const numericId = UUID_TO_NUMERIC[id] || id
  const product = MOCK_PRODUCTS[numericId]
  
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