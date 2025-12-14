import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }))

import * as route from "../../app/api/profile/route"

describe("Profile role change guard", () => {
  it("rejects attempts to change role via PATCH", async () => {
    const createClient = (await import("@/lib/supabase/server")).createClient as any
    createClient.mockResolvedValue({ auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) } })

    const req = new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ role: "admin" }) })
    const res = await route.PATCH(req)
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
