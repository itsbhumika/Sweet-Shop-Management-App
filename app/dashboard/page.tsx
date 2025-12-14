import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { SweetsGrid } from "@/components/sweets-grid"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: sweets } = await supabase.from("sweets").select("*").eq("is_available", true).order("name")

  const { data: favorites } = await supabase.from("favorites").select("sweet_id").eq("user_id", user.id)

  const favoriteIds = favorites?.map((f) => f.sweet_id) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Sweets</h1>
          <p className="text-muted-foreground">Discover and order your favorite treats</p>
        </div>
        <SweetsGrid sweets={sweets || []} favoriteIds={favoriteIds} userId={user.id} />
      </main>
    </div>
  )
}
