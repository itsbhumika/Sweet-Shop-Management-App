"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Candy, UserCircle, ShieldCheck } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!fullName.trim()) {
      setError("Please enter your full name")
      setIsLoading(false)
      return
    }

    if (!email.trim()) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., john@gmail.com)")
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Starting signup process for:", email)

      // Prevent creating both client and admin accounts for same email
      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", email)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is 'No rows found' in some setups; ignore if no rows
          console.warn("[v0] Error checking existing profile:", fetchError)
        }

        if (existingProfile && existingProfile.role && existingProfile.role !== role) {
          setError(
            `An account with this email already exists as a ${existingProfile.role}. You cannot create both client and admin accounts for the same email.`,
          )
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.warn("[v0] Silent profile check error:", err)
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      console.log("[v0] Signup response:", { data, error: signUpError })

      if (signUpError) {
        const msg = (signUpError as any)?.message ?? String(signUpError)
        if (msg.includes("email") || msg.includes("invalid")) {
          throw new Error(
            "Please enter a valid email address with a proper domain (e.g., john@gmail.com, jane@company.com)",
          )
        }
        throw signUpError
      }

      if (data.user) {
        console.log("[v0] User created successfully:", data.user.id)
        router.push("/auth/signup-success")
      }
    } catch (err: unknown) {
      console.error("[v0] Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white">
              <Candy className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Sweet Shop</h1>
            <p className="text-sm text-muted-foreground">Create your account to start ordering</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>Create a new account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label className="text-base">Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === "user"
                            ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <UserCircle className={`w-8 h-8 ${role === "user" ? "text-pink-500" : "text-gray-400"}`} />
                        <span className={`font-medium text-sm ${role === "user" ? "text-pink-600" : "text-gray-500"}`}>
                          Client
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("admin")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === "admin"
                            ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <ShieldCheck className={`w-8 h-8 ${role === "admin" ? "text-purple-500" : "text-gray-400"}`} />
                        <span
                          className={`font-medium text-sm ${role === "admin" ? "text-purple-600" : "text-gray-500"}`}
                        >
                          Admin
                        </span>
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Choose Client for ordering sweets, or Admin for shop management
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use a valid email like john@gmail.com or jane@company.com
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeatPassword">Repeat Password</Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : `Sign Up as ${role === "admin" ? "Admin" : "Client"}`}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
