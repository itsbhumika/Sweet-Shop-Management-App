import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("[v0] Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    // Prevent client from changing role or email via this endpoint
    if (body.role !== undefined || body.email !== undefined) {
      return NextResponse.json({ error: "Cannot change role or email via this endpoint" }, { status: 400 })
    }

    const { full_name, phone, delivery_address } = body

    const updateData: { full_name?: string; phone?: string; delivery_address?: string } = {}
    if (full_name !== undefined) updateData.full_name = full_name
    if (phone !== undefined) updateData.phone = phone
    if (delivery_address !== undefined) updateData.delivery_address = delivery_address

    const { data, error } = await supabase.from("profiles").update(updateData).eq("id", user.id).select().single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
