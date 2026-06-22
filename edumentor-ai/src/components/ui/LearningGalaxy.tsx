"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { NeuralNetworkBackground } from "@/components/ui/NeuralNetworkBackground"

interface Planet {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  moons: Moon[]
  progress: number // 0–100
}

interface Moon {
  id: string
  label: string
  completed: boolean
}

const DEMO_PLANETS: Planet[] = [
  {
    id: "python",
    name: "Python",
    emoji: "🐍",
    color: "#10B981",
    description: "Variables, loops, functions, OOP",
    progress: 70,
    moons: [
      { id: "m1", label: "Variables", completed: true },
      { id: "m2", label: "Loops", completed: true },
      { id: "m3", label: "Functions", completed: true },
      { id: "m4", label: "OOP", completed: false },
      { id: "m5", label: "APIs", completed: false },
    ],
  },
  {
    id: "js",
    name: "JavaScript",
    emoji: "⚡",
    color: "#F59E0B",
    description: "DOM, events, async, frameworks",
    progress: 30,
    moons: [
      { id: "m6", label: "Syntax", completed: true },
      { id: "m7", label: "DOM", completed: false },
      { id: "m8", label: "Async", completed: false },
    ],
  },
  {
    id: "data",
    name: "Data Science",
    emoji: "📊",
    color: "#6366F1",
    description: "NumPy, Pandas, Matplotlib",
    progress: 10,
    moons: [
      { id: "m9", label: "NumPy", completed: false },
      { id: "m10", label: "Pandas", completed: false },
    ],
  },
  {
    id: "web",
    name: "Web Dev",
    emoji: "🌐",
    color: "#EC4899",
    description: "HTML, CSS, React, Next.js",
    progress: 50,
    moons: [
      { id: "m11", label: "HTML", completed: true },
      { id: "m12", label: "CSS", completed: true },
      { id: "m13", label: "React", completed: false },
    ],
  },
]

function MoonOrbit({ moon, index, total, orbitRadius }: { moon: Moon; index: number; total: number; orbitRadius: number }) {
  const angle = (index / total) * 2 * Math.PI
  const x = Math.cos(angle) * orbitRadius
  const y = Math.sin(angle) * orbitRadius
  return (
    <motion.g>
      <motion.circle
        cx={x}
        cy={y}
        r={moon.completed ? 7 : 5}
        fill={moon.completed ? "#10B981" : "#1F2937"}
        stroke={moon.completed ? "#34D399" : "#374151"}
        strokeWidth={1.5}
        animate={{ opacity: moon.completed ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4] }}
        transition={{ duration: 2 + index * 0.5, repeat: Infinity }}
      />
      {moon.completed && (
        <motion.circle
          cx={x}
          cy={y}
          r={12}
          fill="none"
          stroke="#10B981"
          strokeWidth={0.8}
          animate={{ r: [10, 16, 10], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
      )}
    </motion.g>
  )
}

function PlanetCard({ planet, isSelected, onClick, cx, cy }: {
  planet: Planet
  isSelected: boolean
  onClick: () => void
  cx: number
  cy: number
}) {
  const orbitRadius = 40 + planet.progress * 0.3
  const planetSize = 28 + planet.progress * 0.15

  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {/* Orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitRadius}
        fill="none"
        stroke={`${planet.color}20`}
        strokeWidth={1}
        strokeDasharray="4 6"
      />

      {/* Moons */}
      {planet.moons.slice(0, 5).map((moon, i) => (
        <g key={moon.id} transform={`translate(${cx}, ${cy})`}>
          <MoonOrbit moon={moon} index={i} total={Math.min(planet.moons.length, 5)} orbitRadius={orbitRadius} />
        </g>
      ))}

      {/* Planet body */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={planetSize / 2}
        fill={planet.color}
        animate={{
          r: isSelected ? [planetSize / 2, planetSize / 2 + 4, planetSize / 2] : [planetSize / 2, planetSize / 2 + 1, planetSize / 2],
          filter: isSelected ? ["blur(0px)", "blur(1px)", "blur(0px)"] : [],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 ${isSelected ? 20 : 10}px ${planet.color}80)` }}
      />

      {/* Planet emoji text */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={planetSize * 0.55}
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {planet.emoji}
      </text>

      {/* Planet name */}
      <text
        x={cx}
        y={cy + planetSize / 2 + 14}
        textAnchor="middle"
        fontSize={10}
        fill={planet.color}
        fontWeight="600"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {planet.name}
      </text>
    </g>
  )
}

export function LearningGalaxy({ className = "" }: { className?: string }) {
  const [selected, setSelected] = useState<Planet | null>(null)
  const [svgSize, setSvgSize] = useState({ w: 700, h: 400 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setSvgSize({ w: e.contentRect.width, h: e.contentRect.height })
      }
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Positions for 4 planets in a rough galaxy spread
  const positions = [
    { cx: svgSize.w * 0.22, cy: svgSize.h * 0.35 },
    { cx: svgSize.w * 0.55, cy: svgSize.h * 0.22 },
    { cx: svgSize.w * 0.75, cy: svgSize.h * 0.62 },
    { cx: svgSize.w * 0.38, cy: svgSize.h * 0.72 },
  ]

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-[#1F2937] bg-[#080D1A] ${className}`}
      style={{ minHeight: 340 }}
    >
      <NeuralNetworkBackground />

      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{ opacity: [null, Math.random() * 0.8 + 0.1, null] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Galaxy SVG */}
      <svg width={svgSize.w} height={svgSize.h} className="relative z-10">
        {DEMO_PLANETS.map((planet, i) => (
          <PlanetCard
            key={planet.id}
            planet={planet}
            isSelected={selected?.id === planet.id}
            onClick={() => setSelected(selected?.id === planet.id ? null : planet)}
            cx={positions[i]?.cx ?? 100}
            cy={positions[i]?.cy ?? 100}
          />
        ))}
      </svg>

      {/* Info card for selected planet */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 right-4 w-56 rounded-xl p-4 z-20"
            style={{
              background: `linear-gradient(135deg, ${selected.color}15, #111827ee)`,
              border: `1px solid ${selected.color}40`,
              boxShadow: `0 0 24px ${selected.color}30`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{selected.emoji}</span>
              <span className="font-bold text-white text-sm">{selected.name}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{selected.description}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span style={{ color: selected.color }}>{selected.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: selected.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selected.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {selected.moons.map((m) => (
                <span
                  key={m.id}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: m.completed ? `${selected.color}20` : "#1F2937",
                    color: m.completed ? selected.color : "#6B7280",
                    border: `1px solid ${m.completed ? `${selected.color}40` : "#374151"}`,
                  }}
                >
                  {m.completed ? "✓ " : ""}{m.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-3 left-4 text-xs text-slate-500 font-medium z-10">
        🌌 Learning Galaxy — click a planet to explore
      </div>
    </div>
  )
}
