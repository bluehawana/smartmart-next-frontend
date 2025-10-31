import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { hasOwnerAccess } from "@/lib/auth-utils"
import { headers } from "next/headers"
import AdminLayout from "@/components/admin/AdminLayout"
import OrdersTable from "./OrdersTable"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || !hasOwnerAccess(session.user)) {
    redirect("/login?callbackUrl=/admin/orders")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-black">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer orders and track fulfillment
          </p>
        </div>

        {/* Orders Table */}
        <OrdersTable />
      </div>
    </AdminLayout>
  )
}
