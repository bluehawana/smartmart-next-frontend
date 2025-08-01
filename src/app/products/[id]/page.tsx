import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound } from "next/navigation"
import { use } from 'react'

// 临时的模拟数据，包含所有产品
const MOCK_PRODUCTS: Record<string, any> = {
  "1": {
    id: 1,
    name: "Apple MacBook Pro 16-inch",
    price: 3499.99,
    description: "Supercharged by M1 Max chip for groundbreaking performance and amazing battery life.",
    image: "macbook.jpg",
    stock: 10
  },
  "2": {
    id: 2,
    name: "Apple AirPods Pro",
    price: 249.99,
    description: "Active Noise Cancellation for immersive sound.",
    image: "airpods2.jpg",
    stock: 20
  },
  "3": {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 399.99,
    description: "Industry-leading noise cancellation with two processors and eight microphones.",
    image: "sony.jpg",
    stock: 15
  },
  "4": {
    id: 4,
    name: "Dell XPS 13",
    price: 1299.99,
    description: "13.4-inch FHD+ InfinityEdge Touch Anti-Reflective Display.",
    image: "xps.jpg",
    stock: 8
  },
  "5": {
    id: 5,
    name: "Dell Alienware 34",
    price: 999.99,
    description: "34-inch curved gaming monitor with WQHD resolution and 120Hz refresh rate.",
    image: "dell.jpg",
    stock: 12
  },
  "6": {
    id: 6,
    name: "Apple Watch Ultra",
    price: 799.99,
    description: "The most rugged and capable Apple Watch with precision dual-frequency GPS.",
    image: "ultra.jpg",
    stock: 25
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