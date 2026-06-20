"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  GraduationCap,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
  User,
  Terminal,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Tutor Chat", href: "/learn", icon: GraduationCap },
  { name: "Adaptive Quiz", href: "/quiz", icon: BrainCircuit },
  { name: "Progress & Mastery", href: "/progress", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Fetch avatar from DB on mount — avoids relying on JWT cookie
  // which can't hold large base64 image strings
  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/settings/profile")
      .then(r => r.json())
      .then(data => {
        if (data?.avatarUrl) setAvatarUrl(data.avatarUrl)
      })
      .catch(() => {}) // silently fail — avatar is cosmetic
  }, [session?.user?.id])

  // Also listen for a custom event fired by Settings page after a successful save
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.avatarUrl !== undefined) setAvatarUrl(e.detail.avatarUrl)
    }
    window.addEventListener("avatar-updated", handler as EventListener)
    return () => window.removeEventListener("avatar-updated", handler as EventListener)
  }, [])

  return (
    <aside className="w-64 border-r border-[#1F2937] bg-[#111827] flex flex-col h-screen fixed left-0 top-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-[#1F2937]">
        <div className="p-1.5 bg-[#10B981]/10 rounded-md text-[#10B981]">
          <Terminal className="h-5 w-5" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          EduMentor<span className="text-[#10B981]">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#1F2937] bg-[#0A0F1E]/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-9 w-9 rounded-full bg-[#6366F1]/10 flex items-center justify-center shrink-0 border border-[#6366F1]/20 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-[#6366F1]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {session?.user?.name || "Student"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#1F2937] hover:border-red-500/30 text-slate-400 hover:text-red-400 bg-transparent hover:bg-red-500/5 transition-all duration-200 text-sm font-semibold cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
