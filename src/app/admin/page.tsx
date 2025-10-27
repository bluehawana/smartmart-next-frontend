import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import Link from "next/link"
import { Plus, Package, ShoppingBag } from "lucide-react"
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"

export default async function AdminDashboard() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect("/login?callbackUrl=/admin")
  }

  // Check if user is owner
  if (!hasOwnerAccess(session.user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Link href="/" className="text-black hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-black text-white rounded-lg">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-900 text-white rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-600">View and edit all products</p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-900 text-white rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">View Orders</p>
                <p className="text-sm text-gray-600">Check customer orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
