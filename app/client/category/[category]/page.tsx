import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { redirect } from "next/navigation"
import { SweetsGrid } from "@/components/sweets-grid"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: sweets } = await supabase
    .from("sweets")
    .select("*")
    .eq("is_available", true)
    .eq("category", decodedCategory)
    .order("name")

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
              {decodedCategory}
            </h1>
            <div className="wavy-separator mx-auto"></div>
            <p className="text-lg text-muted-foreground mt-4">
              Discover our {decodedCategory.toLowerCase()} collection
            </p>
          </div>
          {sweets && sweets.length > 0 ? (
            <SweetsGrid sweets={sweets} favoriteIds={favoriteIds} userId={user.id} />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No sweets available in this category yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
