import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ProfileForm } from "../../components/profile-form"

describe("ProfileForm", () => {
  const profile = {
    id: "uid",
    email: "jane@doe.com",
    full_name: "Jane Doe",
    phone: "+1 555",
    delivery_address: "123 Main St",
    role: "user",
  }

  beforeEach(() => {
    // mock fetch
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))
  })

  it("submits updated profile", async () => {
    render(<ProfileForm profile={profile as any} />)

    const nameInput = screen.getByLabelText(/Full Name/i)
    fireEvent.change(nameInput, { target: { value: "Jane X" } })

    const button = screen.getByRole("button", { name: /Save Changes/i })
    fireEvent.click(button)

    await waitFor(() => expect((global.fetch as any)).toHaveBeenCalled())

    const call = (global.fetch as any).mock.calls[0]
    expect(call[0]).toBe("/api/profile")
    expect(call[1].method).toBe("PATCH")
    const body = JSON.parse(call[1].body)
    expect(body.full_name).toBe("Jane X")
  })
})
