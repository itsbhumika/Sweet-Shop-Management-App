"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Sweet } from "@/lib/types"

interface SweetDialogProps {
  sweet: Sweet | null
  onClose: () => void
}

export function SweetDialog({ sweet, onClose }: SweetDialogProps) {
  const [name, setName] = useState(sweet?.name || "")
  const [description, setDescription] = useState(sweet?.description || "")
  const [price, setPrice] = useState(sweet?.price.toString() || "")
  const [stockQuantity, setStockQuantity] = useState(sweet?.stock_quantity.toString() || "")
  const [category, setCategory] = useState(sweet?.category || "")
  const [imageUrl, setImageUrl] = useState(sweet?.image_url || "")
  const [isAvailable, setIsAvailable] = useState(sweet?.is_available ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const body = {
        name,
        description,
        price: Number.parseFloat(price),
        stock_quantity: Number.parseInt(stockQuantity),
        category,
        image_url: imageUrl || null,
        is_available: isAvailable,
      }

      const url = sweet ? `/api/sweets/${sweet.id}` : "/api/sweets"
      const method = sweet ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save sweet")
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-0 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-900">{sweet ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
            <DialogDescription className="text-purple-600/70">
              {sweet ? "Update sweet details" : "Add a new sweet to your inventory"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-purple-900 font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-purple-900 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-purple-900 font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-purple-900 font-medium">
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                  className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-purple-900 font-medium">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl" className="text-purple-900 font-medium">
                Image URL (Optional)
              </Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={isAvailable}
                onCheckedChange={(checked) => setIsAvailable(!!checked)}
                className="rounded-md border-purple-300"
              />
              <Label htmlFor="available" className="text-sm font-normal cursor-pointer text-purple-700">
                Available for purchase
              </Label>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-2xl border-purple-200 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl"
            >
              {isLoading ? "Saving..." : sweet ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
