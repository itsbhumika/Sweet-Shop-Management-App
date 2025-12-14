import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingCart } from "lucide-react"
import type { OrderWithItems } from "@/lib/types"

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

  const statusColors = {
    pending: "secondary",
    confirmed: "default",
    preparing: "default",
    ready: "default",
    delivered: "default",
    cancelled: "destructive",
  } as const

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Your Orders</h1>
          <p className="text-lg text-muted-foreground">Track your sweet deliveries</p>
        </div>
        {!orders || orders.length === 0 ? (
          <Alert>
            <ShoppingCart className="h-4 w-4" />
            <AlertDescription>
              You haven't placed any orders yet. Browse our collection to place your first order!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {orders.map((order: OrderWithItems) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>
                            {item.sweets.name} x {item.quantity}
                          </span>
                          <span className="font-medium">${(item.price_at_time * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Delivery Address:</span> {order.delivery_address}
                    </div>
                    <div>
                      <span className="font-semibold">Delivery Date:</span>{" "}
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </div>
                    {order.notes && (
                      <div>
                        <span className="font-semibold">Notes:</span> {order.notes}
                      </div>
                    )}
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
