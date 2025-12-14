import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the server supabase client module used by the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import * as route from "../../app/api/profile/route"

describe("API /api/profile", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("returns 401 when unauthenticated on GET", async () => {
    const createClient = (await import("@/lib/supabase/server")).createClient as any
    createClient.mockResolvedValue({ auth: { getUser: async () => ({ data: { user: null } }) } })

    const res = await route.GET()
    const json = await res.json()
    expect(res.status).toBe(401)
    expect(json.error).toBeDefined()
  })

  it("updates profile on PATCH", async () => {
    const fakeUser = { id: "uid", email: "x@x.com" }
    const profileData = { id: "uid", email: "x@x.com", full_name: "X" }

    const singleMock = vi.fn().mockResolvedValue({ data: profileData, error: null })
    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const eqMock = vi.fn().mockReturnValue({ select: selectMock })
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
    const fromMock = vi.fn().mockReturnValue({ update: updateMock })

    const createClient = (await import("@/lib/supabase/server")).createClient as any
    createClient.mockResolvedValue({
      auth: { getUser: async () => ({ data: { user: fakeUser } }) },
      from: fromMock,
    })

    const request = new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ full_name: "New" }) })
    const res = await route.PATCH(request)
    const json = await res.json()
    expect(json.profile).toBeDefined()
    expect(fromMock).toHaveBeenCalledWith("profiles")
    expect(updateMock).toHaveBeenCalled()
    expect(eqMock).toHaveBeenCalledWith("id", fakeUser.id)
  })
})
