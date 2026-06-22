"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  color: string
}

interface AchievementPortalProps {
  achievement: Achievement
  onComplete?: () => void
}

function Particle({ angle, color }: { angle: number; color: string }) {
  const rad = (angle * Math.PI) / 180
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ background: color, top: "50%", left: "50%" }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(rad) * 80,
        y: Math.sin(rad) * 80,
        opacity: 0,
        scale: 0.3,
      }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
    />
  )
}

export function AchievementPortal({ achievement, onComplete }: AchievementPortalProps) {
  const [phase, setPhase] = useState<"forming" | "open" | "badge" | "particles" | "closing" | "done">("forming")

  // Advance phases automatically
  const phases: Record<string, { next: string; delay: number }> = {
    forming: { next: "open", delay: 600 },
    open: { next: "badge", delay: 500 },
    badge: { next: "particles", delay: 600 },
    particles: { next: "closing", delay: 1200 },
    closing: { next: "done", delay: 800 },
  }

  const handleAnimationComplete = (currentPhase: string) => {
    const p = phases[currentPhase]
    if (!p) return
    setTimeout(() => {
      setPhase(p.next as any)
      if (p.next === "done") onComplete?.()
    }, p.delay)
  }

  if (phase === "done") return null

  const particleAngles = Array.from({ length: 12 }, (_, i) => i * 30)

  return (
    <div className="relative flex items-center justify-center w-48 h-48 select-none">
      {/* Portal ring */}
      <AnimatePresence>
        {(phase === "forming" || phase === "open" || phase === "badge" || phase === "particles") && (
          <motion.div
            key="ring"
            className="absolute rounded-full border-4"
            style={{
              borderColor: achievement.color,
              boxShadow: `0 0 30px ${achievement.color}60, inset 0 0 30px ${achievement.color}20`,
              width: phase === "forming" ? 40 : 140,
              height: phase === "forming" ? 40 : 140,
            }}
            initial={{ width: 40, height: 40, opacity: 0, rotate: 0 }}
            animate={{
              width: 140,
              height: 140,
              opacity: 1,
              rotate: 360,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => handleAnimationComplete("forming")}
          />
        )}
      </AnimatePresence>

      {/* Rotating energy ring */}
      <AnimatePresence>
        {(phase === "open" || phase === "badge" || phase === "particles") && (
          <motion.div
            key="energy"
            className="absolute rounded-full border-2 border-dashed"
            style={{ borderColor: `${achievement.color}80`, width: 150, height: 150 }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: -360 }}
            transition={{ opacity: { duration: 0.3 }, rotate: { duration: 4, repeat: Infinity, ease: "linear" } }}
          />
        )}
      </AnimatePresence>

      {/* Portal glow fill */}
      <AnimatePresence>
        {phase === "open" || phase === "badge" || phase === "particles" ? (
          <motion.div
            key="glow"
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${achievement.color}30 0%, transparent 70%)`,
              width: 130,
              height: 130,
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={() => handleAnimationComplete("open")}
          />
        ) : null}
      </AnimatePresence>

      {/* Badge emerges */}
      <AnimatePresence>
        {(phase === "badge" || phase === "particles") && (
          <motion.div
            key="badge"
            className="relative z-10 flex flex-col items-center gap-1 text-center"
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onAnimationComplete={() => handleAnimationComplete("badge")}
          >
            <span className="text-4xl">{achievement.emoji}</span>
            <div
              className="px-3 py-1 rounded-lg text-xs font-bold"
              style={{ background: `${achievement.color}20`, color: achievement.color, border: `1px solid ${achievement.color}40` }}
            >
              {achievement.title}
            </div>
            <p className="text-[10px] text-muted-foreground max-w-[100px]">{achievement.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward particles */}
      {phase === "particles" &&
        particleAngles.map((angle) => (
          <Particle key={angle} angle={angle} color={achievement.color} />
        ))}

      {/* Closing — ring contracts */}
      {phase === "closing" && (
        <motion.div
          key="closing-ring"
          className="absolute rounded-full border-2"
          style={{ borderColor: achievement.color, width: 140, height: 140 }}
          animate={{ width: 0, height: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          onAnimationComplete={() => handleAnimationComplete("closing")}
        />
      )}
    </div>
  )
}

// Demo trigger button for showing the portal
export function AchievementUnlock({ achievement }: { achievement: Achievement }) {
  const [showing, setShowing] = useState(false)

  return (
    <div>
      {!showing && (
        <button
          onClick={() => setShowing(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-foreground"
          style={{ background: `${achievement.color}20`, border: `1px solid ${achievement.color}40` }}
        >
          🏆 {achievement.title} — Unlock
        </button>
      )}
      <AnimatePresence>
        {showing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <AchievementPortal achievement={achievement} onComplete={() => setShowing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
