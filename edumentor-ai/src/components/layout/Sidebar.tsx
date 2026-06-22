"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import {
  LayoutDashboard,
  GraduationCap,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
  User,
  Terminal,
  X,
  Code2,
  Flame,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Tutor Chat", href: "/learn", icon: GraduationCap },
  { name: "Code Analyzer", href: "/analyze", icon: Code2 },
  { name: "Daily Challenge", href: "/challenge", icon: Flame },
  { name: "Adaptive Quiz", href: "/quiz", icon: BrainCircuit },
  { name: "Progress & Mastery", href: "/progress", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useAppStore()

  // Fetch avatar from DB on mount
  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/settings/profile")
      .then(r => r.json())
      .then(data => {
        if (data?.avatarUrl) setAvatarUrl(data.avatarUrl)
      })
      .catch(() => {})
  }, [session?.user?.id])

  // Listen for custom event
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.avatarUrl !== undefined) setAvatarUrl(e.detail.avatarUrl)
    }
    window.addEventListener("avatar-updated", handler as EventListener)
    return () => window.removeEventListener("avatar-updated", handler as EventListener)
  }, [])

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname, setIsMobileMenuOpen])

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 border-r border-sidebar-border bg-sidebar flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sidebar-primary/10 rounded-md text-sidebar-primary">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
              EduMentor<span className="text-sidebar-primary">AI</span>
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
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
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary/10 flex items-center justify-center shrink-0 border border-sidebar-primary/20 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-sidebar-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {session?.user?.name || "Student"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-sidebar-border hover:border-destructive/30 text-sidebar-foreground/70 hover:text-destructive bg-transparent hover:bg-destructive/10 transition-all duration-200 text-sm font-semibold cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
