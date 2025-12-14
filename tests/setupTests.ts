import "@testing-library/jest-dom"

// Minimal mocks for Next.js modules used in components
import React from "react"

// Mock next/link to render children directly in tests
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nextLink = require("next/link")
  if (nextLink && nextLink.default) {
    nextLink.default = ({ children }: any) => children
  }
} catch (e) {
  // ignore if module not resolved in test environment
}

// Mock next/navigation's useRouter to avoid errors in client components
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // Use Vitest's mocking to stub next/navigation
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { vi } = require("vitest")
  vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
  }))
  // Mock supabase client used by client components to avoid needing env keys
  vi.mock("@/lib/supabase/client", () => ({
    createClient: () => ({ auth: { signOut: vi.fn(), getUser: vi.fn() } }),
  }))
} catch (e) {
  // ignore if not available
}
