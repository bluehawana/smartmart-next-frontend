import { EnhancedProductDetails } from "@/components/features/ProductDetails/EnhancedProductDetails"
import { notFound } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.smrtmart.com/api/v1';

async function fetchProduct(productId: string) {
  try {
    // Backend now supports both numeric IDs and UUIDs
    // Always fetch fresh product details to avoid stale content
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Product not found')
    }
    
    const result = await response.json()
    if (result.success && result.data) {
      return result.data
    }
    
    throw new Error('Invalid API response')
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  // Backend handles both numeric IDs (1, 2, 3) and UUIDs automatically
  const product = await fetchProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return <EnhancedProductDetails product={product} />
}
