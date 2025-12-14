import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-[#FFE4E1] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A3347] mb-2" style={{ fontFamily: "Crimson Text, serif" }}>
            My Account
          </h1>
          <p className="text-[#6B5B65]">Manage your profile and account settings</p>
        </div>

        <div className="bg-[#FFF5F3] rounded-3xl shadow-lg p-8">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
