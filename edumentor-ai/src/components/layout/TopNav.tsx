"use client"

import { usePathname } from "next/navigation"
import { Calendar, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useAppStore } from "@/store/useAppStore"

export default function TopNav() {
  const pathname = usePathname()
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useAppStore()

  const getPageTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard Overview"
    if (pathname.startsWith("/learn")) return "AI Tutor"
    if (pathname.startsWith("/quiz")) return "Adaptive Practice Quiz"
    if (pathname.startsWith("/progress")) return "Mastery & Analytics"
    return "EduMentor AI"
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <header className="h-16 border-b border-border bg-background/40 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-lg border border-border">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{getFormattedDate()}</span>
        </div>
      </div>
    </header>
  )
}
