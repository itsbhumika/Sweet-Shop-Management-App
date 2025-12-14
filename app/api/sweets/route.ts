import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("sweets")
      .select("*")
      .eq("is_available", true)
      .order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json({ sweets: data })
  } catch (error) {
    console.error("[v0] Error fetching sweets:", error)
    return NextResponse.json({ error: "Failed to fetch sweets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

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
    const { name, description, price, stock_quantity, category, image_url } = body

    const { data, error } = await supabase
      .from("sweets")
      .insert({
        name,
        description,
        price,
        stock_quantity,
        category,
        image_url,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ sweet: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating sweet:", error)
    return NextResponse.json({ error: "Failed to create sweet" }, { status: 500 })
  }
}
