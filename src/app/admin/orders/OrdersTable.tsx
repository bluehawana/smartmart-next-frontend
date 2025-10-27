"use client"

import { useEffect, useState } from "react"
import { Package, Clock, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

interface Order {
  id: string
  orderNumber: string
  userId: string
  userEmail?: string
  userName?: string
  status: "pending" | "processing" | "completed" | "cancelled"
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
  shippingAddress?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  paymentMethod?: string
  stripeSessionId?: string
}

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending"
  },
  processing: {
    color: "bg-blue-100 text-blue-800",
    icon: Package,
    label: "Processing"
  },
  completed: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Completed"
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Cancelled"
  }
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        credentials: "include",
      })

      if (!response.ok) {
        // If orders endpoint doesn't exist or returns error, show empty state
        if (response.status === 404) {
          setOrders([])
          return
        }
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.data || data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Don't show error toast on first load if endpoint doesn't exist yet
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!response.ok) throw new Error("Failed to update order status")

      toast.success("Order status updated successfully")
      await fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium mb-2">No orders yet</p>
        <p className="text-gray-500 text-sm">
          Orders will appear here once customers make purchases
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.userName || "Guest"}</div>
                    <div className="text-sm text-gray-500">{order.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.totalAmount.toLocaleString("sv-SE")} kr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusConfig[order.status].color
                      }`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as Order["status"])
                      }
                      disabled={updatingStatus === order.id}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {selectedOrder.userName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedOrder.userEmail || "N/A"}
                </p>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress.street}
                    <br />
                    {selectedOrder.shippingAddress.postalCode}{" "}
                    {selectedOrder.shippingAddress.city}
                    <br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {item.price.toLocaleString("sv-SE")} kr
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {(item.quantity * item.price).toLocaleString("sv-SE")} kr
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {selectedOrder.totalAmount.toLocaleString("sv-SE")} kr
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("sv-SE")}
                </p>
                {selectedOrder.paymentMethod && (
                  <p>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
