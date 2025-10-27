import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import ProductsTable from "./ProductsTable"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect("/login?callbackUrl=/admin/products")
  }

  // Check if user is owner
  if (!hasOwnerAccess(session.user)) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow">
          <ProductsTable />
        </div>
      </div>
    </div>
  )
}
