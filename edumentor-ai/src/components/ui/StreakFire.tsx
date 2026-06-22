"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface StreakFireProps {
  streak: number
  onMilestone?: () => void
  className?: string
}

function getFlameCount(streak: number) {
  if (streak >= 30) return 5
  if (streak >= 15) return 4
  if (streak >= 8) return 3
  if (streak >= 4) return 2
  if (streak >= 1) return 1
  return 0
}

function getGlowColor(streak: number) {
  if (streak >= 30) return "#FF4500"
  if (streak >= 15) return "#FF6B35"
  if (streak >= 8) return "#FF8C00"
  if (streak >= 4) return "#FFA500"
  return "#FFD700"
}

function getMilestoneLabel(streak: number) {
  if (streak === 30) return "🏆 30-Day Legend!"
  if (streak === 15) return "🔥 Two-Week Blaze!"
  if (streak === 8) return "⚡ One Week+"
  if (streak === 4) return "🚀 4-Day Streak!"
  return null
}

function XPParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      animate={{
        opacity: 0,
        y: -(30 + Math.random() * 40),
        x: (Math.random() - 0.5) * 30,
        scale: 0.3,
      }}
      transition={{ duration: 1.5 + Math.random(), delay, ease: "easeOut" }}
      className="absolute text-[10px] font-bold pointer-events-none select-none"
      style={{ color: "#FFD700", bottom: "100%", left: "50%", transform: "translateX(-50%)" }}
    >
      +XP
    </motion.div>
  )
}

export function StreakFire({ streak, onMilestone, className = "" }: StreakFireProps) {
  const [prevStreak, setPrevStreak] = useState(streak)
  const [showMilestone, setShowMilestone] = useState(false)
  const [particleKey, setParticleKey] = useState(0)
  const flameCount = getFlameCount(streak)
  const glowColor = getGlowColor(streak)
  const milestoneLabel = getMilestoneLabel(streak)

  useEffect(() => {
    if (streak > prevStreak) {
      setParticleKey((k) => k + 1)
      const isMilestone = [4, 8, 15, 30].includes(streak)
      if (isMilestone) {
        setShowMilestone(true)
        onMilestone?.()
        setTimeout(() => setShowMilestone(false), 3000)
      }
    }
    setPrevStreak(streak)
  }, [streak, prevStreak, onMilestone])

  if (streak === 0) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <span className="text-3xl opacity-30">🔥</span>
        <span className="text-xs text-slate-500">No streak yet</span>
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col items-center gap-2 ${className}`}>
      {/* XP Particles */}
      <div className="relative">
        {Array.from({ length: particleKey > 0 ? 5 : 0 }).map((_, i) => (
          <XPParticle key={`${particleKey}-${i}`} delay={i * 0.15} />
        ))}

        {/* Flames */}
        <motion.div
          className="flex gap-0.5"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {Array.from({ length: flameCount }).map((_, i) => (
            <motion.span
              key={i}
              className="select-none"
              style={{
                fontSize: i === 0 ? "2rem" : `${1.6 - i * 0.05}rem`,
                filter: `drop-shadow(0 0 ${6 + i * 2}px ${glowColor})`,
              }}
              animate={{
                y: [0, -3, 1, -2, 0],
                rotate: [-3, 3, -2, 2, -3],
                scale: [1, 1.08, 0.97, 1.04, 1],
              }}
              transition={{
                duration: 1.8 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              🔥
            </motion.span>
          ))}
        </motion.div>

        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: `0 0 ${streak * 2}px ${glowColor}40` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Streak number */}
      <motion.div
        key={streak}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <span className="text-2xl font-extrabold text-white">{streak}</span>
        <span className="text-xs text-slate-400 font-medium">day streak</span>
      </motion.div>

      {/* Milestone popup */}
      <AnimatePresence>
        {showMilestone && milestoneLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold text-white z-50"
            style={{
              background: `linear-gradient(135deg, ${glowColor}20, #111827)`,
              border: `1px solid ${glowColor}60`,
              boxShadow: `0 0 20px ${glowColor}40`,
            }}
          >
            {milestoneLabel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
