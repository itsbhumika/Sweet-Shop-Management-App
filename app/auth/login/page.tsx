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
import { Candy, ArrowRight, UserCircle, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please check your email and confirm your account before logging in.")
        } else if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.")
        } else {
          throw error
        }
      }

      if (data.user) {
        const updateResponse = await fetch("/api/profile/role", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        })

        if (!updateResponse.ok) {
          throw new Error("Failed to update role")
        }

        if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
        router.refresh()
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background relative overflow-hidden">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30">
              <Candy className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Sweet Shop
              </h1>
              <p className="text-lg text-muted-foreground mt-2">Welcome back</p>
            </div>
          </div>

          <Alert className="rounded-2xl border-accent/20 bg-accent/5">
            <Mail className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm">
              After signing up, please check your email and confirm your account before logging in.
            </AlertDescription>
          </Alert>

          <Card className="border-0 shadow-2xl rounded-3xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-3xl">Sign In</CardTitle>
              <CardDescription className="text-base">Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label className="text-base">Login as</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === "user"
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <UserCircle
                          className={`w-8 h-8 ${role === "user" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <span className={`font-medium ${role === "user" ? "text-primary" : "text-muted-foreground"}`}>
                          Client
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("admin")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === "admin"
                            ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <ShieldCheck
                          className={`w-8 h-8 ${role === "admin" ? "text-accent" : "text-muted-foreground"}`}
                        />
                        <span className={`font-medium ${role === "admin" ? "text-accent" : "text-muted-foreground"}`}>
                          Admin
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password" className="text-base">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="rounded-2xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : `Sign In as ${role === "admin" ? "Admin" : "Client"}`}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <div className="mt-6 text-center text-base">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/auth/signup" className="text-primary font-medium hover:underline underline-offset-4">
                    Sign up
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
