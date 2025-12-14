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

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    let query = supabase.from("orders").select(`
        *,
        order_items (
          *,
          sweets (*)
        ),
        profiles (
          full_name,
          email
        )
      `)

    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
    const { items, delivery_address, delivery_date, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
    }

    let total_amount = 0
    for (const item of items) {
      const { data: sweet } = await supabase.from("sweets").select("price").eq("id", item.sweet_id).single()

      if (sweet) {
        total_amount += sweet.price * item.quantity
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount,
        delivery_address,
        delivery_date,
        notes,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item: { sweet_id: string; quantity: number; price_at_time: number }) => ({
      order_id: order.id,
      sweet_id: item.sweet_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
