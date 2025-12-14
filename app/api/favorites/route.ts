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

    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        *,
        sweets (*)
      `,
      )
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ favorites: data })
  } catch (error) {
    console.error("[v0] Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
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

    const body = await request.json()
    const { sweet_id } = body

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        sweet_id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ favorite: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding favorite:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sweet_id = searchParams.get("sweet_id")

    if (!sweet_id) {
      return NextResponse.json({ error: "sweet_id is required" }, { status: 400 })
    }

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("sweet_id", sweet_id)

    if (error) throw error

    return NextResponse.json({ message: "Favorite removed successfully" })
  } catch (error) {
    console.error("[v0] Error removing favorite:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}
