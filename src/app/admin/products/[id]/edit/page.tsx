import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProductForm from "../../ProductForm"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function EditProductPage({ params }: PageProps) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect(`/login?callbackUrl=/admin/products/${params.id}/edit`)
  }

  // Check if user is owner
  if (!hasOwnerAccess(session.user)) {
    redirect("/")
  }

  const product = await getProduct(params.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  )
}
