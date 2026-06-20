"use client"

import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"

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
    <header className="h-16 border-b border-[#1F2937] bg-[#111827]/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 w-full">
      <h1 className="text-xl font-bold text-white tracking-tight">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#1F2937]/50 px-3 py-1.5 rounded-lg border border-[#1F2937]">
          <Calendar className="h-3.5 w-3.5 text-[#10B981]" />
          <span>{getFormattedDate()}</span>
        </div>
      </div>
    </header>
  )
}
