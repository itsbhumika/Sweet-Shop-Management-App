import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Sweet } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const { data: bestSellers } = await supabase
    .from("sweets")
    .select("*")
    .eq("is_available", true)
    .order("price", { ascending: false })
    .limit(4)

  const { data: categoriesData } = await supabase
    .from("sweets")
    .select("category")
    .eq("is_available", true)
    .order("category")

  const categories = [...new Set(categoriesData?.map((item) => item.category) || [])]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NavBar user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <section className="relative mb-16 bg-gradient-to-br from-[#FFE4E1] to-[#FFF0F0] rounded-[3rem] overflow-hidden shadow-xl min-h-[600px] flex items-center justify-center">
          <Image src="/shop.jpg" alt="Sweet Shop" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="relative z-10 text-center max-w-2xl text-white">
            <h1
              className="text-6xl md:text-7xl font-serif italic mb-4 drop-shadow-lg"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Best of Sweet
              <br />
              Gluten-Free Treats
            </h1>
            <div className="wavy-separator-white mx-auto"></div>
          </div>
        </section>

        <section className="mb-16">
          <h2
            className="text-4xl md:text-5xl font-serif text-center mb-3 text-foreground italic"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Best Sellers
          </h2>
          <div className="wavy-separator mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers &&
              bestSellers.map((sweet: Sweet) => (
                <Link key={sweet.id} href={user ? "/client" : "/auth/login"}>
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-3xl bg-card cursor-pointer">
                    <div className="p-4">
                      <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden relative mb-4">
                        {sweet.image_url ? (
                          <Image
                            src={sweet.image_url || "/placeholder.svg"}
                            alt={sweet.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <Image
                            src={`/.jpg?height=300&width=300&query=${encodeURIComponent(sweet.name)}`}
                            alt={sweet.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {sweet.name}
                        </h3>
                        <div className="star-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current text-[#F4A460]" />
                          ))}
                        </div>
                        <p className="text-2xl font-bold text-foreground">${sweet.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </section>

        <section className="mb-16">
          <h2
            className="text-4xl md:text-5xl font-serif text-center mb-3 text-foreground italic"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Categories
          </h2>
          <div className="wavy-separator mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link key={category} href={user ? `/client/category/${encodeURIComponent(category)}` : "/auth/login"}>
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-3xl bg-card cursor-pointer">
                  <div className="aspect-[4/3] bg-secondary/30 rounded-2xl m-4 relative">
                    <Image
                      src={`/.jpg?height=400&width=600&query=${encodeURIComponent(category + " sweets desserts")}`}
                      alt={category}
                      fill
                      className="object-cover rounded-2xl"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-semibold text-foreground">{category}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {!user && (
          <section className="text-center py-16">
            <h2
              className="text-3xl font-serif mb-6 text-foreground italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Start Your Sweet Journey
            </h2>
            <Button
              size="lg"
              className="rounded-full h-12 px-8 bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
          </section>
        )}
      </main>

      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Sweet Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
