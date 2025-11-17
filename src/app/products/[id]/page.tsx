import { EnhancedProductDetails } from "@/components/features/ProductDetails/EnhancedProductDetails"
import { notFound } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.smrtmart.com/api/v1';

async function fetchProduct(productId: string) {
  try {
    // Backend now supports both numeric IDs and UUIDs
    // Cache for 5 minutes to prevent rate limiting
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      next: { revalidate: 300 }
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
  params: Promise<{ id: string }>
}) {
  // Next.js 15: await params
  const { id } = await params

  // Backend handles both numeric IDs (1, 2, 3) and UUIDs automatically
  const product = await fetchProduct(id)

  if (!product) {
    notFound()
  }

  return <EnhancedProductDetails product={product} />
}
