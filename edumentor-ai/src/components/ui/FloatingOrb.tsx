"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function FloatingOrb() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/dashboard/learn">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative group cursor-pointer"
        >
          {/* Outer glow */}
          <motion.div 
            animate={{
              scale: isHovered ? 1.2 : [1, 1.1, 1],
              opacity: isHovered ? 0.8 : [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full blur-xl"
          />
          
          {/* Inner sphere */}
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/50 border border-white/10">
            <Bot className="h-6 w-6 text-foreground" />
          </div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card text-foreground px-3 py-1.5 rounded-lg text-sm border border-border shadow-xl pointer-events-none"
          >
            Chat with AI Tutor
          </motion.div>
        </motion.div>
      </Link>
    </div>
  )
}
