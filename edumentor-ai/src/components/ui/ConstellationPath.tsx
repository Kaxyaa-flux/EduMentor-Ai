"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

interface Star {
  id: string
  label: string
  completed: boolean
  x: number
  y: number
  description?: string
}

interface ConstellationPathProps {
  stars?: Star[]
  className?: string
}


function TwinklingStar({ star, index, totalStars }: { star: Star; index: number; totalStars: number }) {
  const [hovered, setHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Connection line to next star */}
      {index < totalStars - 1 && (
        <motion.line
          x1={star.x}
          y1={star.y}
          x2={star.x} // placeholder, overridden by next star
          y2={star.y}
          stroke={star.completed ? "var(--primary)" : "var(--muted-foreground)"}
          strokeWidth={1}
          strokeDasharray="4 4"
          animate={!prefersReduced ? { strokeDashoffset: [-20, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Outer glow ring */}
      {star.completed && (
        <motion.circle
          cx={star.x}
          cy={star.y}
          r={18}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={0.8}
          animate={{ r: [14, 22, 14], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
        />
      )}

      {/* Star circle */}
      <motion.circle
        cx={star.x}
        cy={star.y}
        r={hovered ? 13 : 10}
        fill={star.completed ? "var(--primary)" : "var(--card)"}
        stroke={star.completed ? "var(--success)" : hovered ? "var(--muted-foreground)" : "var(--border)"}
        strokeWidth={star.completed ? 2 : 1.5}
        style={{
          cursor: "pointer",
          filter: star.completed ? "drop-shadow(0 0 8px var(--primary))" : "none",
        }}
        animate={!prefersReduced && star.completed
          ? { fill: ["var(--primary)", "var(--success)", "var(--primary)"] }
          : {}}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Star checkmark for completed */}
      {star.completed && (
        <text x={star.x} y={star.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="var(--primary-foreground)" style={{ pointerEvents: "none" }}>
          ✓
        </text>
      )}

      {/* Star number for incomplete */}
      {!star.completed && (
        <text x={star.x} y={star.y} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--muted-foreground)" style={{ pointerEvents: "none" }}>
          {index + 1}
        </text>
      )}

      {/* Label below */}
      <text
        x={star.x}
        y={star.y + 20}
        textAnchor="middle"
        fontSize={9}
        fill={star.completed ? "var(--primary)" : "var(--muted-foreground)"}
        fontWeight={star.completed ? "600" : "400"}
        style={{ pointerEvents: "none" }}
      >
        {star.label}
      </text>

      {/* Hover tooltip */}
      {hovered && star.description && (
        <g>
          <rect x={star.x - 50} y={star.y - 48} width={100} height={30} rx={6} fill="var(--card)" stroke="var(--border)" />
          <text x={star.x} y={star.y - 30} textAnchor="middle" fontSize={9} fill="var(--foreground)">
            {star.description}
          </text>
        </g>
      )}
    </motion.g>
  )
}

const DEFAULT_STARS: Star[] = [
  { id: "1", label: "Variables", completed: true, x: 60, y: 100, description: "Beginner lesson" },
  { id: "2", label: "Loops", completed: true, x: 160, y: 60, description: "Control flow" },
  { id: "3", label: "Functions", completed: true, x: 260, y: 90, description: "Reusable code" },
  { id: "4", label: "Lists", completed: false, x: 360, y: 55, description: "Data structures" },
  { id: "5", label: "Dicts", completed: false, x: 460, y: 85, description: "Key-value pairs" },
  { id: "6", label: "OOP", completed: false, x: 560, y: 50, description: "Object-oriented" },
  { id: "7", label: "APIs", completed: false, x: 640, y: 90, description: "External services" },
]

export function ConstellationPath({ stars = DEFAULT_STARS, className = "" }: ConstellationPathProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgWidth, setSvgWidth] = useState(700)

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setSvgWidth(e.contentRect.width)
    })
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement)
    return () => ro.disconnect()
  }, [])

  // Scale stars to fit svg width
  const maxX = Math.max(...stars.map((s) => s.x))
  const scale = (svgWidth - 60) / maxX

  const scaledStars = stars.map((s) => ({ ...s, x: s.x * scale + 20, y: s.y }))

  return (
    <div className={`w-full rounded-2xl border border-border bg-card overflow-hidden p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary text-sm font-semibold">✨ Learning Constellation</span>
        <span className="text-xs text-muted-foreground">Your path through the curriculum</span>
      </div>

      <svg ref={svgRef} width="100%" height={140} viewBox={`0 0 ${svgWidth} 140`}>
        {/* Dashed connection lines first (below stars) */}
        {scaledStars.map((star, i) => {
          const next = scaledStars[i + 1]
          if (!next) return null
          return (
            <motion.line
              key={`line-${star.id}`}
              x1={star.x}
              y1={star.y}
              x2={next.x}
              y2={next.y}
              stroke={star.completed && next.completed ? "var(--primary)" : "var(--border)"}
              strokeWidth={1}
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            />
          )
        })}

        {/* Stars */}
        {scaledStars.map((star, i) => (
          <TwinklingStar key={star.id} star={star} index={i} totalStars={scaledStars.length} />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-primary" />
          Completed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-card border border-border" />
          Upcoming
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {stars.filter((s) => s.completed).length}/{stars.length} complete
        </div>
      </div>
    </div>
  )
}
