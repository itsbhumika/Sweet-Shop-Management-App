import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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
    const { role } = body

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    console.log("[v0] Updating user role to:", role, "for user:", user.id)

    const { data, error } = await supabase.from("profiles").update({ role }).eq("id", user.id).select().single()

    if (error) {
      console.error("[v0] Error updating role:", error)
      throw error
    }

    console.log("[v0] Role updated successfully:", data)

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("[v0] Error updating role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}
