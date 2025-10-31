import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { hasOwnerAccess } from "@/lib/auth-utils"
import AdminLayout from "@/components/admin/AdminLayout"
import UsersTable from "./UsersTable"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || !hasOwnerAccess(session.user)) {
    redirect("/login?callbackUrl=/admin/users")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Users Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage customer accounts and permissions
            </p>
          </div>
        </div>

        {/* Users Table */}
        <UsersTable />
      </div>
    </AdminLayout>
  )
}
