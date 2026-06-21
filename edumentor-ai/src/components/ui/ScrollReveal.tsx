"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { slideUpFade } from "@/lib/animations"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        ...slideUpFade,
        transition: { ...slideUpFade.transition, delay }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
