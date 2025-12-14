"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Candy } from "lucide-react"
import type { Sweet } from "@/lib/types"
import { SweetDialog } from "@/components/admin/sweet-dialog"
import { useRouter } from "next/navigation"

export function SweetsManagement() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchSweets = async () => {
    setIsLoading(true)
    const response = await fetch("/api/sweets")
    const data = await response.json()
    setSweets(data.sweets || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSweets()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return

    try {
      const response = await fetch(`/api/sweets/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSweets()
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error deleting sweet:", error)
    }
  }

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedSweet(null)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedSweet(null)
    fetchSweets()
    router.refresh()
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
        <CardContent className="py-12 text-center">
          <p className="text-purple-600/70">Loading sweets...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-900">Sweets Inventory</CardTitle>
              <CardDescription className="text-purple-600/70">Manage your sweet products</CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sweet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sweets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Candy className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-900">No sweets yet</h3>
              <p className="text-purple-600/70 mb-4">Start adding sweets to your inventory</p>
              <Button onClick={handleCreate} className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                Add First Sweet
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-purple-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50/50 hover:bg-purple-50/50">
                    <TableHead className="text-purple-900 font-semibold">Name</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Category</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Price</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Stock</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Status</TableHead>
                    <TableHead className="text-right text-purple-900 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sweets.map((sweet) => (
                    <TableRow key={sweet.id} className="hover:bg-purple-50/30">
                      <TableCell className="font-medium text-purple-900">{sweet.name}</TableCell>
                      <TableCell className="text-purple-700">{sweet.category}</TableCell>
                      <TableCell className="text-purple-700">${sweet.price.toFixed(2)}</TableCell>
                      <TableCell className="text-purple-700">{sweet.stock_quantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={sweet.is_available ? "default" : "secondary"}
                          className={
                            sweet.is_available
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-100 rounded-full"
                          }
                        >
                          {sweet.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(sweet)}
                            className="hover:bg-blue-100 hover:text-blue-600 rounded-xl"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(sweet.id)}
                            className="hover:bg-red-100 hover:text-red-600 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isDialogOpen && <SweetDialog sweet={selectedSweet} onClose={handleDialogClose} />}
    </>
  )
}
