import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import { headers } from "next/headers"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import ProductsTable from "./ProductsTable"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || !hasOwnerAccess(session.user)) {
    redirect("/login?callbackUrl=/admin/products")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Products</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Product</span>
          </Link>
        </div>

        {/* Products Table */}
        <ProductsTable />
      </div>
    </AdminLayout>
  )
}
