import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import type { Order, OrderItem, Sweet } from "@/lib/types"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        sweets (*)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-purple-100 text-purple-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your sweet deliveries</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-4">Start ordering your favorite sweets</p>
              <Button asChild>
                <Link href="/dashboard">Browse Sweets</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order & { order_items: (OrderItem & { sweets: Sweet })[] }) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>Ordered on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.order_items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between text-sm">
                            <span>
                              {item.sweets.name} × {item.quantity}
                            </span>
                            <span className="font-medium">${(item.price_at_time * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Delivery Address:</span>
                        <p className="mt-1">{order.delivery_address}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Delivery Date:</span>
                        <p className="mt-1">{new Date(order.delivery_date).toLocaleDateString()}</p>
                      </div>
                      {order.notes && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="mt-1">{order.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-4 flex items-center justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold">${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
