"use client"

import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export default function TopNav() {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard Overview"
    if (pathname.startsWith("/learn")) return "AI Python Tutor"
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
    <header className="h-16 border-b border-border bg-background/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 w-full">
      <h1 className="text-xl font-bold text-foreground tracking-tight">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-lg border border-border">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{getFormattedDate()}</span>
        </div>
      </div>
    </header>
  )
}
