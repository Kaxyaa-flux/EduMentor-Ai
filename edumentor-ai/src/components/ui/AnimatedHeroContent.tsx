"use client"

import { motion } from "framer-motion"
import { Code2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TypewriterText } from "@/components/ui/TypewriterText"
import { staggerContainer, slideUpFade, springHover } from "@/lib/animations"

interface AnimatedHeroContentProps {
  hasSession: boolean
}

export function AnimatedHeroContent({ hasSession }: AnimatedHeroContentProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="text-center max-w-3xl mx-auto"
    >
      <motion.div variants={slideUpFade} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1F2937] bg-[#111827]/80 text-sm text-[#10B981] mb-6">
        <Code2 className="h-4 w-4" />
        <span>AI-Powered Multi-Language Learning</span>
      </motion.div>
      
      <motion.h1 variants={slideUpFade} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight flex flex-col items-center justify-center gap-3">
        <span>Your Personal AI Tutor</span>
        <span className="h-[1.2em] flex items-center justify-center"><TypewriterText /></span>
      </motion.h1>
      
      <motion.p variants={slideUpFade} className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
        Learn programming at your own pace. Chat with a smart 24/7 AI tutor, take adaptive quizzes that adjust to your mastery score, and target your weak spots.
      </motion.p>
      
      <motion.div variants={slideUpFade} className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.div variants={springHover} whileHover="whileHover" whileTap="whileTap" className="w-full sm:w-auto">
          <Link
            href={hasSession ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/15 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Start Learning Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
        
        <motion.div variants={springHover} whileHover="whileHover" whileTap="whileTap" className="w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#1F2937] bg-[#111827]/50 hover:bg-[#111827] text-white font-semibold text-lg transition-all"
          >
            Resume Session
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
