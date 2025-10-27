"use client"

import { useEffect, useState } from "react"
import { TrendingUp, DollarSign, Package, Users, ShoppingCart, Eye } from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    views: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  async function fetchAnalytics() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics?range=${timeRange}`,
        {
          credentials: "include",
        }
      )

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data || data)
      } else {
        // Use mock data if endpoint doesn't exist
        setAnalytics({
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          topProducts: [],
          recentActivity: [],
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setAnalytics({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        topProducts: [],
        recentActivity: [],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "7d"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "30d"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === "90d"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +12% from last period
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.totalRevenue.toLocaleString("sv-SE")} kr
          </p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">
              +8% from last period
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">
              +15% from last period
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalCustomers}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.conversionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.averageOrderValue.toLocaleString("sv-SE")} kr
          </p>
          <p className="text-sm text-gray-600">Average Order Value</p>
        </div>
      </div>

      {/* Top Products */}
      {analytics.topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        {product.sales} sales
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {product.views} views
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {product.revenue.toLocaleString("sv-SE")} kr
                    </p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {analytics.totalOrders === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Analytics Data Yet
          </h3>
          <p className="text-gray-600">
            Analytics will appear here once you start receiving orders
          </p>
        </div>
      )}
    </div>
  )
}
