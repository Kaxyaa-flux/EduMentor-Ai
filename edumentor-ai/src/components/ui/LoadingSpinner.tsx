"use client"

import { motion } from "framer-motion"

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="relative flex items-center justify-center w-20 h-20">
        <motion.div 
          className="absolute inset-0 bg-[#10B981]/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#10B981] border-r-[#10B981]/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-transparent border-b-[#6366F1] border-l-[#6366F1]/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Dot */}
        <motion.div
          className="w-3 h-3 bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {text && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-slate-400 font-medium tracking-widest uppercase text-xs"
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        </motion.p>
      )}
    </div>
  )
}
