"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"
import type { Sweet } from "@/lib/types"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SweetDetailModalProps {
  sweet: Sweet | null
  userId: string
  onClose: () => void
}

export function SweetDetailModal({ sweet, userId, onClose }: SweetDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [expandedSection, setExpandedSection] = useState<string | null>("description")
  const [isOrdering, setIsOrdering] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  if (!sweet) return null

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleAddToCart = async () => {
    setIsOrdering(true)
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total_amount: sweet.price * quantity,
          status: "pending",
          delivery_address: "To be provided",
        })
        .select()
        .single()

      if (orderError) throw orderError

      const { error: itemError } = await supabase.from("order_items").insert({
        order_id: order.id,
        sweet_id: sweet.id,
        quantity: quantity,
        price_at_time: sweet.price,
      })

      if (itemError) throw itemError

      router.refresh()
      onClose()
    } catch (error) {
      console.error("[v0] Order error:", error)
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <Dialog open={!!sweet} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-[#FFF5F5] border-0 rounded-[2rem] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Product Image and Details */}
          <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-[#FFE4E1] to-[#FFF0F0] relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-foreground uppercase tracking-wide">
              {sweet.name}
            </h1>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{sweet.description}</p>

            <div className="flex items-center gap-6 mb-8">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-foreground bg-transparent"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-foreground bg-transparent"
                onClick={() => setQuantity(Math.min(sweet.stock_quantity, quantity + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <Button
                className="rounded-full h-12 px-8 bg-foreground text-background hover:bg-foreground/90 font-medium"
                onClick={handleAddToCart}
                disabled={isOrdering}
              >
                {isOrdering ? "Adding..." : "Add to cart"}
              </Button>
              <span className="text-3xl font-bold text-foreground">${sweet.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Right side - Image and Expandable Info */}
          <div className="bg-white p-8 flex flex-col">
            <div className="aspect-square relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-[#FFE4E1] to-[#FFF0F0] flex items-center justify-center">
              {sweet.image_url ? (
                <Image
                  src={sweet.image_url || "/placeholder.svg"}
                  alt={sweet.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src={`/.jpg?height=600&width=600&query=${encodeURIComponent(sweet.name)}`}
                  alt={sweet.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3">
              <div className="border-b border-border pb-3">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleSection("description")}
                >
                  <span className="font-medium text-foreground">Description</span>
                  {expandedSection === "description" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === "description" && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{sweet.description}</p>
                )}
              </div>

              <div className="border-b border-border pb-3">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleSection("nutrition")}
                >
                  <span className="font-medium text-foreground">Nutrition</span>
                  {expandedSection === "nutrition" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === "nutrition" && (
                  <div className="mt-3 text-sm text-muted-foreground space-y-1">
                    <p>Calories: Varies by portion</p>
                    <p>Sugar: Natural sweeteners</p>
                    <p>Weight: {((sweet.price / 100) * 2.5).toFixed(2)} KG</p>
                  </div>
                )}
              </div>

              <div className="border-b border-border pb-3">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleSection("ingredients")}
                >
                  <span className="font-medium text-foreground">Ingredients</span>
                  {expandedSection === "ingredients" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === "ingredients" && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Premium ingredients including organic sugar, natural flavors, fresh dairy, and artisan techniques.
                    Category: {sweet.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
