import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { SweetsGrid } from "@/components/sweets-grid"
import { redirect } from "next/navigation"

export default async function ClientPage() {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="relative z-10">
        <NavBar user={user} profile={profile} />
        <main className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1
              className="text-5xl md:text-6xl font-serif italic mb-3 text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Sweet Collection
            </h1>
            <div className="wavy-separator mx-auto"></div>
            <p className="text-lg text-muted-foreground mt-4">Handcrafted with love and the finest ingredients</p>
          </div>
          <SweetsGrid sweets={sweets || []} favoriteIds={favoriteIds} userId={user.id} />
        </main>
      </div>
    </div>
  )
}
