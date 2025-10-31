"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  createdAt: string
  image: string | null
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      )

      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success("User role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        { method: "DELETE" }
      )

      if (!response.ok) throw new Error("Failed to delete user")

      setUsers(users.filter(u => u.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true
    if (filter === "verified") return user.emailVerified
    if (filter === "unverified") return !user.emailVerified
    if (filter === "admin") return user.role === "owner"
    if (filter === "customer") return user.role === "customer"
    return true
  })

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-600">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "verified"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Verified ({users.filter(u => u.emailVerified).length})
          </button>
          <button
            onClick={() => setFilter("unverified")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "unverified"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unverified ({users.filter(u => !u.emailVerified).length})
          </button>
          <button
            onClick={() => setFilter("admin")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "admin"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admins ({users.filter(u => u.role === "owner").length})
          </button>
          <button
            onClick={() => setFilter("customer")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "customer"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Customers ({users.filter(u => u.role === "customer").length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-sm text-gray-500">No users found</div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-700">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="customer">Customer</option>
                      <option value="owner">Owner</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowModal(true)
                      }}
                      className="text-gray-600 hover:text-black mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">User Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name || "User"}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-gray-700">
                      {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-black">
                    {selectedUser.name || "No name"}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Role
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedUser.role}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Email Status
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedUser.emailVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
