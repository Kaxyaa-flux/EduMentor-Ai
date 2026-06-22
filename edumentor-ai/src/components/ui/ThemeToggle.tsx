"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9 rounded-full bg-card border-border opacity-50">
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full bg-card border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300 overflow-hidden group"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: isDark ? 0 : 1, 
          rotate: isDark ? 90 : 0,
          opacity: isDark ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-amber-500"
      >
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          scale: isDark ? 1 : 0, 
          rotate: isDark ? 0 : -90,
          opacity: isDark ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-primary"
      >
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/10 rounded-full transition-opacity duration-300 pointer-events-none" />
    </Button>
  )
}
