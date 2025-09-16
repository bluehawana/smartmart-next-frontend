import { EnhancedProductDetails } from "@/components/features/ProductDetails/EnhancedProductDetails"
import { notFound } from "next/navigation"

// Numeric ID to UUID mapping for backend API calls - FROM DATABASE
const NUMERIC_TO_UUID: Record<string, string> = {
  "1": "7a82d048-b478-4b4b-8b78-64eeb3a7ab86", // Sony WH-1000XM5 Headphones
  "2": "88d35c54-ce2d-40d5-92e9-4af5c7e5e330", // MacBook Pro 16-inch
  "3": "c0d069ee-031f-4340-8588-4706103e6b04", // AirPods Pro 2nd Generation
  "4": "a4e33218-57c3-4133-ac51-ca9aa711eddb", // Dell Alienware 34 Curved Monitor
  "5": "a87117d8-e9dd-49ab-a131-245cff3cbf2d", // AI Translate Earphones Pro
  "6": "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1", // Apple Watch Ultra
  "7": "611bac4c-ef16-484e-899d-1e7992819a88", // Dell XPS 13 Laptop
  "8": "eed7ffb1-5dc5-45fe-8e77-63430419dce3", // Smart Language Translator Buds
  "9": "a3f5302f-f496-4211-9737-e55de3b526c2", // Dell XPS 15 Developer Edition
  "10": "4dc6d3bf-ec23-4c1b-b47d-f156c82e92fa", // iPhone 15 Pro Max
  "11": "13e2b89d-4f65-4ad0-8c4a-5150657e5bde"  // ASUS ROG Rapture GT-BE98 Gaming Router
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1';

async function fetchProduct(productId: string) {
  try {
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
  // Use numeric ID (convert to UUID for backend call)
  const product = await fetchProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return <EnhancedProductDetails product={product} />
}
