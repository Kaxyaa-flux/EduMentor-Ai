"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface HologramOrbProps {
  state?: "idle" | "thinking" | "responding"
  size?: number
  className?: string
  onClick?: () => void
}

export function HologramOrb({ state = "idle", size = 56, className = "", onClick }: HologramOrbProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const orbSize = size
  const ringSize = orbSize * 1.6
  const outerSize = orbSize * 2.1

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ width: outerSize, height: outerSize }}
      onClick={onClick}
      title="AI Tutor"
    >
      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full border border-primary/20"
        style={{ width: outerSize, height: outerSize }}
        animate={
          state === "responding"
            ? { scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }
            : state === "thinking"
            ? { scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }
            : { scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }
        }
        transition={{ duration: state === "thinking" ? 1 : 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating ring */}
      <motion.div
        className="absolute rounded-full border border-dashed border-primary/30"
        style={{ width: ringSize, height: ringSize }}
        animate={{ rotate: state === "thinking" ? 360 : state === "responding" ? -720 : 360 }}
        transition={{
          duration: state === "thinking" ? 1.5 : state === "responding" ? 2 : 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: orbSize,
          height: orbSize,
          background:
            state === "responding"
              ? "radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed, #4c1d95)"
              : state === "thinking"
              ? "radial-gradient(circle at 35% 35%, #c4b5fd, #8b5cf6, #5b21b6)"
              : "radial-gradient(circle at 35% 35%, #c4b5fd, #8b5cf6, #4c1d95)",
          boxShadow:
            state === "responding"
              ? "0 0 30px #8b5cf680, 0 0 60px #8b5cf640"
              : state === "thinking"
              ? "0 0 20px #8b5cf660, 0 0 40px #8b5cf630"
              : "0 0 15px #8b5cf640, 0 0 30px #8b5cf620",
        }}
        animate={
          state === "responding"
            ? { scale: [1, 1.15, 1], y: [0, -4, 0] }
            : state === "thinking"
            ? { scale: [1, 1.06, 0.96, 1], rotate: [0, 5, -5, 0] }
            : { y: [0, -6, 0], scale: [1, 1.03, 1] }
        }
        transition={{
          duration: state === "thinking" ? 1.2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute rounded-full bg-white/20"
            style={{ width: "45%", height: "45%", top: "12%", left: "15%", filter: "blur(2px)" }}
          />
        </div>

        {/* Particle emission when responding */}
        {state === "responding" &&
          Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{ top: "50%", left: "50%" }}
              animate={{
                x: Math.cos((i * Math.PI) / 2) * 40,
                y: Math.sin((i * Math.PI) / 2) * 40,
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeOut",
              }}
            />
          ))}
      </motion.div>

      {/* State label */}
      {state === "thinking" && (
        <motion.div
          className="absolute -bottom-6 text-[9px] font-semibold text-primary/70 whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Thinking...
        </motion.div>
      )}
    </div>
  )
}

// Floating version for bottom-right corner placement
export function FloatingAIOrb({
  state = "idle",
  onClick,
}: {
  state?: "idle" | "thinking" | "responding"
  onClick?: () => void
}) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
    >
      <HologramOrb state={state} size={52} onClick={onClick} />
    </motion.div>
  )
}
