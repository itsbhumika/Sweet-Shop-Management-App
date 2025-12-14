"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { Sweet } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SweetDetailModal } from "@/components/sweet-detail-modal"
import Image from "next/image"

interface SweetsGridProps {
  sweets: Sweet[]
  favoriteIds: string[]
  userId: string
}

export function SweetsGrid({ sweets, favoriteIds, userId }: SweetsGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoriteIds))
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const toggleFavorite = async (sweetId: string) => {
    const isFavorite = favorites.has(sweetId)

    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("sweet_id", sweetId)
      setFavorites((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sweetId)
        return newSet
      })
    } else {
      await supabase.from("favorites").insert({ user_id: userId, sweet_id: sweetId })
      setFavorites((prev) => new Set(prev).add(sweetId))
    }

    router.refresh()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sweets.map((sweet) => (
          <Card
            key={sweet.id}
            className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all rounded-3xl bg-card cursor-pointer"
            onClick={() => setSelectedSweet(sweet)}
          >
            <div className="p-5">
              <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden relative mb-4">
                {sweet.image_url ? (
                  <Image
                    src={sweet.image_url || "/placeholder.svg"}
                    alt={sweet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <Image
                    src={`/.jpg?height=400&width=400&query=${encodeURIComponent(sweet.name)}`}
                    alt={sweet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-9 h-9 shadow"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(sweet.id)
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      favorites.has(sweet.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{sweet.name}</h3>
                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-[#F4A460]" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">${sweet.price.toFixed(2)}</p>
                  <span className="text-xs text-muted-foreground">
                    {sweet.stock_quantity > 0 ? `${sweet.stock_quantity} left` : "Out of stock"}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-4 rounded-full h-11 bg-foreground text-background hover:bg-foreground/90"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSweet(sweet)
                }}
                disabled={sweet.stock_quantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {sweet.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedSweet && (
        <SweetDetailModal sweet={selectedSweet} userId={userId} onClose={() => setSelectedSweet(null)} />
      )}
    </>
  )
}
