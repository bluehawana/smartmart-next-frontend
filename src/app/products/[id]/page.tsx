import { ProductDetails } from "@/components/features/ProductDetails/ProductDetails"
import { notFound } from "next/navigation"

// Numeric ID to UUID mapping for backend API calls
const NUMERIC_TO_UUID: Record<string, string> = {
  "1": "88d35c54-ce2d-40d5-92e9-4af5c7e5e330", // MacBook Pro 16-inch
  "2": "c0d069ee-031f-4340-8588-4706103e6b04", // AirPods Pro 2nd Generation  
  "3": "7a82d048-b478-4b4b-8b78-64eeb3a7ab86", // Sony WH-1000XM5 Headphones
  "4": "a4e33218-57c3-4133-ac51-ca9aa711eddb", // Dell Alienware 34 Curved Monitor
  "5": "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1", // Apple Watch Ultra
  "6": "a87117d8-e9dd-49ab-a131-245cff3cbf2d", // AI Translate Earphones Pro
  "7": "611bac4c-ef16-484e-899d-1e7992819a88", // Dell XPS 13 Laptop
  "8": "13e2b89d-4f65-4ad0-8c4a-5150657e5bde", // ASUS ROG Rapture GT-BE98 Gaming Router
  "9": "4dc6d3bf-ec23-4c1b-b47d-f156c82e92fa", // iPhone 15 Pro Max
  "10": "eed7ffb1-5dc5-45fe-8e77-63430419dce3", // Smart Language Translator Buds
  "11": "a3f5302f-f496-4211-9737-e55de3b526c2"  // Dell XPS 15 Developer Edition
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';

async function fetchProduct(numericId: string) {
  // Convert numeric ID to UUID for API call
  const uuid = NUMERIC_TO_UUID[numericId]
  if (!uuid) {
    return null
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${uuid}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      throw new Error('Product not found')
    }
    
    const result = await response.json()
    // Convert the product ID back to numeric for frontend
    const product = result.data
    product.id = numericId
    return product
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

  return <ProductDetails product={product} />
}