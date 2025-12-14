"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Candy, Heart, ShoppingCart, User, LogOut, Settings, Menu, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"

interface NavBarProps {
  user?: {
    email?: string | null
  } | null
  profile?: Partial<Profile> | null
}

export function NavBar({ user, profile }: NavBarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="py-4 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between bg-white rounded-3xl shadow-md px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Candy className="w-5 h-5 text-foreground" />
              <span className="font-semibold text-lg text-foreground">Sweet Shop</span>
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                  <Link href="/client">
                    <Menu className="w-4 h-4 mr-1.5" />
                    Catalog
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-1.5" />
                    My Account
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                  <Link href="/client/favorites">
                    <Heart className="w-4 h-4 mr-1.5" />
                    Wishlist
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                  <Link href="/client/orders">
                    <Package className="w-4 h-4 mr-1.5" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm relative" asChild>
                  <Link href="/client/orders">
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    Cart
                  </Link>
                </Button>
                {profile?.role === "admin" && (
                  <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-1.5" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl h-9 w-9">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/client">
                      <Menu className="w-4 h-4 mr-2" />
                      Catalog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/client/favorites">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/client/orders">
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/client/orders">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-2xl h-9 text-sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-2xl h-9 bg-foreground text-background hover:bg-foreground/90 text-sm px-4"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
