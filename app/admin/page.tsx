import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { SweetsManagement } from "@/components/admin/sweets-management"
import { OrdersManagement } from "@/components/admin/orders-management"
import { Candy, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/client")
  }

  const { count: totalSweets } = await supabase.from("sweets").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .order("created_at", { ascending: false })
    .limit(10)

  const totalRevenue = recentOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />

      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 tracking-tight text-purple-900">Admin Panel</h1>
          <p className="text-lg text-purple-600/80">Manage your sweet shop inventory and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Sweets</CardTitle>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Candy className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{totalSweets || 0}</div>
              <p className="text-xs text-purple-600/70 mt-1">Available products</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">Total Orders</CardTitle>
              <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-900">{totalOrders || 0}</div>
              <p className="text-xs text-pink-600/70 mt-1">All time orders</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalUsers || 0}</div>
              <p className="text-xs text-blue-600/70 mt-1">Registered customers</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Recent Revenue</CardTitle>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-emerald-600/70 mt-1">Last 10 orders</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sweets" className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm p-1 rounded-2xl shadow-md">
            <TabsTrigger
              value="sweets"
              className="rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Sweets Management
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Orders Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sweets">
            <SweetsManagement />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
