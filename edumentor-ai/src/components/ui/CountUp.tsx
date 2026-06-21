"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

export function CountUp({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [hasMounted, setHasMounted] = useState(false)
  
  // Spring configuration for smooth counting
  const springValue = useSpring(0, {
    bounce: 0,
    duration: duration * 1000,
  })

  useEffect(() => {
    setHasMounted(true)
    springValue.set(end)
  }, [end, springValue])

  const display = useTransform(springValue, (current) => Math.round(current) + suffix)

  if (!hasMounted) return <span>{end}{suffix}</span>

  return <motion.span>{display}</motion.span>
}
