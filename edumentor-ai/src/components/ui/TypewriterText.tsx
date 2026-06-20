"use client"

import { useState, useEffect } from "react"

const LANGUAGES = ["Python", "JavaScript", "Java", "C", "C++", "HTML/CSS"]

export function TypewriterText() {
  const [text, setText] = useState("")

  useEffect(() => {
    let currentText = ""
    let isDeleting = false
    let loopNum = 0
    let typingSpeed = 150
    let timer: NodeJS.Timeout

    const tick = () => {
      const i = loopNum % LANGUAGES.length
      const fullText = LANGUAGES[i]

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1)
        typingSpeed = 50 // Deletion speed
      } else {
        currentText = fullText.substring(0, currentText.length + 1)
        typingSpeed = 150 - Math.random() * 50 // Human-like typing speed variation
      }

      setText(currentText)

      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000 // Pause when word is complete
        isDeleting = true
      } else if (isDeleting && currentText === "") {
        isDeleting = false
        loopNum++
        typingSpeed = 500 // Pause before starting new word
      }

      timer = setTimeout(tick, typingSpeed)
    }

    timer = setTimeout(tick, 500) // Initial delay

    return () => clearTimeout(timer)
  }, []) // Empty dependency array ensures smooth timing decoupled from renders

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#6366F1]">
      {text}
      <span className="animate-pulse text-[#10B981] ml-1 opacity-70">|</span>
    </span>
  )
}
