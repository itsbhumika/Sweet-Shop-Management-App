import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Candy, Heart } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import type { Sweet, Favorite } from "@/lib/types"

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
    .select(
      `
      *,
      sweets (*)
    `,
    )
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <NavBar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">Your saved sweet treats</p>
        </div>

        {!favorites || favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-4">Start adding sweets to your favorites</p>
              <Button asChild>
                <Link href="/dashboard">Browse Sweets</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite: Favorite & { sweets: Sweet }) => {
              const sweet = favorite.sweets
              return (
                <Card key={favorite.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 rounded-md mb-4 flex items-center justify-center">
                      <Candy className="w-16 h-16 text-pink-500" />
                    </div>
                    <CardTitle>{sweet.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{sweet.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${sweet.price.toFixed(2)}</span>
                      <Badge variant="secondary">{sweet.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/dashboard">Order Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
