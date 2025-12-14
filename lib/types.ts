export interface Profile {
  id: string
  email: string
  full_name: string
  role: "user" | "admin"
  phone?: string | null
  delivery_address?: string | null
  created_at: string
  updated_at: string
}

export interface Sweet {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  category: string
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  total_amount: number
  delivery_address: string
  delivery_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  sweet_id: string
  quantity: number
  price_at_time: number
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  sweet_id: string
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { sweets: Sweet })[]
}
