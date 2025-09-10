import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';

async function fetchProduct(productId: string) {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      next: { revalidate: 3600 }
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
  const product = await fetchProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
