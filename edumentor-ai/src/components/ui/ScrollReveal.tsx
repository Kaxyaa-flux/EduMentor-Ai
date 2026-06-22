"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ReactNode } from "react"
import { slideUpFade, fadeIn, cardReveal, imageReveal } from "@/lib/animations"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: "slideUp" | "fadeIn" | "card" | "image"
  once?: boolean
  margin?: string
}

export function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0, 
  variant = "slideUp",
  once = true,
  margin = "-50px"
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const getVariant = () => {
    if (shouldReduceMotion) return fadeIn
    
    switch (variant) {
      case "fadeIn": return fadeIn
      case "card": return cardReveal
      case "image": return imageReveal
      case "slideUp":
      default:
        return slideUpFade
    }
  }

  const selectedVariant = getVariant()

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once, margin }}
      variants={selectedVariant as any}
      transition={{ ...(selectedVariant as any).transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
