import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const { data, error } = await supabase.from("sweets").select("*").eq("id", id).single()

    if (error) throw error

    return NextResponse.json({ sweet: data })
  } catch (error) {
    console.error("[v0] Error fetching sweet:", error)
    return NextResponse.json({ error: "Failed to fetch sweet" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("sweets").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ sweet: data })
  } catch (error) {
    console.error("[v0] Error updating sweet:", error)
    return NextResponse.json({ error: "Failed to update sweet" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { error } = await supabase.from("sweets").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Sweet deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting sweet:", error)
    return NextResponse.json({ error: "Failed to delete sweet" }, { status: 500 })
  }
}
