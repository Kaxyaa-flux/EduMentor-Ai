"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { staggerContainer } from "@/lib/animations"

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  once?: boolean
  margin?: string
}

export function StaggerContainer({ 
  children, 
  className = "", 
  once = true,
  margin = "-50px"
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once, margin }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}
