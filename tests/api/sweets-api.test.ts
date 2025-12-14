import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }))

import * as route from "../../app/api/sweets/route"

describe("API /api/sweets (admin)", () => {
  it("returns 401 for unauthenticated POST", async () => {
    const createClient = (await import("@/lib/supabase/server")).createClient as any
    createClient.mockResolvedValue({ auth: { getUser: async () => ({ data: { user: null } }) } })

    const req = new Request("http://localhost", { method: "POST", body: JSON.stringify({}) })
    const res = await route.POST(req)
    const json = await res.json()
    expect(res.status).toBe(401)
    expect(json.error).toBeDefined()
  })

  it("returns 403 for non-admin user", async () => {
    const fakeUser = { id: "u1" }
    const createClient = (await import("@/lib/supabase/server")).createClient as any
    const singleMock = vi.fn().mockResolvedValue({ data: { role: "user" } })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
    const fromMock = vi.fn().mockReturnValue({ select: selectMock })
    createClient.mockResolvedValue({ auth: { getUser: async () => ({ data: { user: fakeUser } }) }, from: fromMock })

    const req = new Request("http://localhost", { method: "POST", body: JSON.stringify({}) })
    const res = await route.POST(req)
    const json = await res.json()
    expect(res.status).toBe(403)
    expect(json.error).toBeDefined()
  })

  it("creates sweet for admin and returns 201", async () => {
    const fakeUser = { id: "admin-id" }
    const createClient = (await import("@/lib/supabase/server")).createClient as any
    const singleMock = vi.fn().mockResolvedValue({ data: { role: "admin" } })
    const eqMock = vi.fn().mockReturnValue({ single: singleMock })
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

    const sweetsInsertSingle = vi.fn().mockResolvedValue({ data: { id: "s1" } })
    const sweetsSelect = vi.fn().mockReturnValue({ single: sweetsInsertSingle })
    const sweetsInsert = vi.fn().mockReturnValue({ select: sweetsSelect })

    const fromMock = vi.fn((table: string) => {
      if (table === "profiles") return { select: selectMock }
      if (table === "sweets") return { insert: sweetsInsert }
      return {}
    })

    createClient.mockResolvedValue({ auth: { getUser: async () => ({ data: { user: fakeUser } }) }, from: fromMock })

    const payload = { name: "Cake", description: "Tasty", price: 5, stock_quantity: 10, category: "dessert", image_url: "" }
    const req = new Request("http://localhost", { method: "POST", body: JSON.stringify(payload) })
    const res = await route.POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.sweet).toBeDefined()
  })
})
