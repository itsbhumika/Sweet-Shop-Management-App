import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { SweetsGrid } from "@/components/sweets-grid"
import { redirect } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart } from "lucide-react"

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: favorites } = await supabase
    .from("favorites")
    .select("sweet_id, sweets(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const sweets = favorites?.map((f) => f.sweets).filter(Boolean) || []
  const favoriteIds = favorites?.map((f) => f.sweet_id) || []

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Your Favorites</h1>
          <p className="text-lg text-muted-foreground">All the sweets you've saved for later</p>
        </div>
        {sweets.length === 0 ? (
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              You haven't added any favorites yet. Browse our collection and click the heart icon to save your favorite
              sweets!
            </AlertDescription>
          </Alert>
        ) : (
          <SweetsGrid sweets={sweets as any} favoriteIds={favoriteIds} userId={user.id} />
        )}
      </main>
    </div>
  )
}
