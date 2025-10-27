import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProductForm from "../ProductForm"

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect("/login?callbackUrl=/admin/products/new")
  }

  // Check if user is owner
  if (!hasOwnerAccess(session.user)) {
    redirect("/")
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <ProductForm />
        </div>
      </div>
    </div>
  )
}
