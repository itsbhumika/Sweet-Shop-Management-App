"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart } from "lucide-react"
import type { Order, OrderItem, Sweet, Profile } from "@/lib/types"
import { useRouter } from "next/navigation"

interface OrderWithDetails extends Order {
  order_items: (OrderItem & { sweets: Sweet })[]
  profiles: Profile
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchOrders = async () => {
    setIsLoading(true)
    const response = await fetch("/api/orders")
    const data = await response.json()
    setOrders(data.orders || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      case "confirmed":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "preparing":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100"
      case "ready":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      case "delivered":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
      case "cancelled":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
        <CardContent className="py-12 text-center">
          <p className="text-purple-600/70">Loading orders...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900">Orders Management</CardTitle>
        <CardDescription className="text-purple-600/70">Manage customer orders and delivery status</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-purple-900">No orders yet</h3>
            <p className="text-purple-600/70">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border border-purple-100 shadow-md rounded-2xl bg-white/60 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-purple-900">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="text-purple-600/80">
                        {order.profiles.full_name} • {order.profiles.email}
                      </CardDescription>
                      <p className="text-sm text-purple-600/60 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(order.status)} rounded-full`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-purple-900">Items:</h4>
                      <ul className="space-y-1">
                        {order.order_items.map((item) => (
                          <li key={item.id} className="text-sm flex items-center justify-between text-purple-700">
                            <span>
                              {item.sweets.name} × {item.quantity}
                            </span>
                            <span>${(item.price_at_time * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-purple-900">Delivery Address:</span>
                      <p className="text-purple-600/80">{order.delivery_address}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-purple-900">Delivery Date:</span>
                      <p className="text-purple-600/80">{new Date(order.delivery_date).toLocaleDateString()}</p>
                    </div>
                    {order.notes && (
                      <div className="text-sm">
                        <span className="font-semibold text-purple-900">Notes:</span>
                        <p className="text-purple-600/80">{order.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-purple-900">Status:</span>
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-[180px] rounded-xl border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <span className="text-2xl font-bold text-purple-900">${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
