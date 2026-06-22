"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulsePhase: number
}

interface Pulse {
  nodeA: number
  nodeB: number
  progress: number
  speed: number
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "139, 92, 246"
}

export function NeuralNetworkBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const nodesRef = useRef<Node[]>([])
  const pulsesRef = useRef<Pulse[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initNodes()
    }

    const initNodes = () => {
      const count = Math.floor((canvas.width * canvas.height) / 18000)
      nodesRef.current = Array.from({ length: Math.min(count, 40) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
      }))
      pulsesRef.current = []
    }

    const MAX_DIST = 160
    let lastPulseTime = 0

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const nodes = nodesRef.current
      const pulses = pulsesRef.current

      // Determine color from theme
      const computedStyle = getComputedStyle(document.documentElement)
      const primaryHex = computedStyle.getPropertyValue("--primary") || "#8B5CF6"
      const rgbColor = hexToRgb(primaryHex)

      // Occasionally spawn a new pulse
      if (timestamp - lastPulseTime > 1800 && nodes.length >= 2) {
        lastPulseTime = timestamp
        const a = Math.floor(Math.random() * nodes.length)
        let b = Math.floor(Math.random() * nodes.length)
        while (b === a) b = Math.floor(Math.random() * nodes.length)
        pulses.push({ nodeA: a, nodeB: b, progress: 0, speed: 0.004 + Math.random() * 0.004 })
        if (pulses.length > 6) pulses.shift()
      }

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        n.pulsePhase += 0.02
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${rgbColor}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw pulse particles along lines
      const toRemove: number[] = []
      pulses.forEach((pulse, idx) => {
        pulse.progress += pulse.speed
        if (pulse.progress >= 1) {
          toRemove.push(idx)
          return
        }
        const a = nodes[pulse.nodeA]
        const b = nodes[pulse.nodeB]
        if (!a || !b) return
        const px = a.x + (b.x - a.x) * pulse.progress
        const py = a.y + (b.y - a.y) * pulse.progress
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8)
        grad.addColorStop(0, `rgba(${rgbColor}, 0.8)`)
        grad.addColorStop(1, `rgba(${rgbColor}, 0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fill()
      })
      // Remove finished pulses in reverse
      toRemove.reverse().forEach((i) => pulses.splice(i, 1))

      // Draw nodes
      nodes.forEach((n) => {
        const glow = Math.sin(n.pulsePhase) * 0.5 + 0.5
        const r = n.radius + glow * 1.5
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
        grad.addColorStop(0, `rgba(${rgbColor}, ${0.5 + glow * 0.3})`)
        grad.addColorStop(1, `rgba(${rgbColor}, 0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgbColor}, ${0.6 + glow * 0.3})`
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.35 }}
    />
  )
}
