"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/lib/types"
import { Mail, User, Phone, MapPin, Shield } from "lucide-react"

interface ProfileFormProps {
  profile: Profile | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.delivery_address || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          delivery_address: deliveryAddress,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#4A3347]">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your account type and email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-gray-50 rounded-xl" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account Type
            </Label>
            <div>
              <Badge variant={profile?.role === "admin" ? "default" : "secondary"} className="rounded-xl px-3 py-1">
                {profile?.role === "admin" ? "Admin" : "Client"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">Account type cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-[#4A3347]">Personal Details</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </Label>
            <Textarea
              id="deliveryAddress"
              placeholder="123 Main Street, Apt 4B&#10;New York, NY 10001"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={3}
              className="rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground">This address will be used for order deliveries</p>
          </div>
        </CardContent>
      </Card>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl">{error}</div>}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl">
          Profile updated successfully!
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#4A3347] hover:bg-[#3A2337] text-white rounded-2xl h-11"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
