import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { NavBar } from "../../components/nav-bar"

describe("NavBar", () => {
  it("renders My Account link for logged-in user", () => {
    render(<NavBar user={{ email: "test@example.com" }} profile={{ id: "1", email: "test@example.com", role: "user" }} />)

    expect(screen.getByText(/My Account/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Catalog/i)[0]).toBeInTheDocument()
  })

  it("shows Admin Panel when profile role is admin", () => {
    render(<NavBar user={{ email: "a@b.com" }} profile={{ id: "1", email: "a@b.com", role: "admin" }} />)

    expect(screen.getByText(/Admin Panel|Admin/i)).toBeInTheDocument()
  })
})
