import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound, redirect } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1';

async function fetchProduct(productId: string) {
  try {
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
  const product = await fetchProduct(params.id)
  
  if (!product) {
    notFound()
  }

  const numericId = product.numeric_id ?? product.numericId ?? product.numericID
  if (numericId && `${numericId}` !== params.id) {
    redirect(`/products/${numericId}`)
  }

  return <ProductDetails product={product} />
}
