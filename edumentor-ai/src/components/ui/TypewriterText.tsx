"use client"

import { useState, useEffect } from "react"

const LANGUAGES = ["Python", "JavaScript", "Java", "C", "C++", "HTML/CSS"]

export function TypewriterText() {
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    let timer: NodeJS.Timeout
    const currentLanguage = LANGUAGES[index % LANGUAGES.length]
    
    if (!isDeleting) {
      if (text === currentLanguage) {
        timer = setTimeout(() => setIsDeleting(true), 2000)
      } else {
        timer = setTimeout(() => {
          setText(currentLanguage.substring(0, text.length + 1))
          setTypingSpeed(150)
        }, typingSpeed)
      }
    } else {
      if (text === "") {
        setIsDeleting(false)
        setIndex((prev) => prev + 1)
      } else {
        timer = setTimeout(() => {
          setText(currentLanguage.substring(0, text.length - 1))
          setTypingSpeed(50)
        }, typingSpeed)
      }
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, index, typingSpeed])

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#6366F1]">
      {text}
      <span className="animate-pulse text-[#10B981] ml-1 opacity-70">|</span>
    </span>
  )
}
