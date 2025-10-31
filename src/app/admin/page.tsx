import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import { headers } from "next/headers"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || !hasOwnerAccess(session.user)) {
    redirect("/login?callbackUrl=/admin")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-semibold text-black">
            Welcome back, {session.user.name || session.user.email}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your store today
          </p>
        </div>

        {/* Analytics */}
        <AnalyticsDashboard />

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-black text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black">Add Product</p>
                <p className="text-xs text-gray-600">Create new listing</p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-900 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black">Products</p>
                <p className="text-xs text-gray-600">Manage inventory</p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-900 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black">Orders</p>
                <p className="text-xs text-gray-600">View customer orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
