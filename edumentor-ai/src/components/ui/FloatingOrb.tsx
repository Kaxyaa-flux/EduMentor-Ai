"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Loader2, X, Plus, Sparkles, Code2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/store/useAppStore"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HologramOrb } from "@/components/ui/HologramOrb"

export function FloatingOrb() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const {
    activeConversationId,
    activeMessages,
    isLoadingMessages,
    isSendingMessage,
    fetchConversations,
    createConversation,
    sendMessage,
  } = useAppStore()

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages, isOpen, isSendingMessage])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSendingMessage) return
    sendMessage(input.trim())
    setInput("")
  }

  const handleCreateNewSession = async () => {
    await createConversation("Quick Chat Session")
  }

  const handleQuickAction = (actionText: string) => {
    if (isSendingMessage) return
    sendMessage(actionText)
  }

  // Simplified renderer for the widget
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/)
        const code = match ? match[2] : part.slice(3, -3)
        return (
          <div key={index} className="my-2 rounded-lg overflow-hidden border border-border bg-background font-mono text-[10px]">
            <pre className="p-3 overflow-x-auto text-primary whitespace-pre">
              <code>{code.trim()}</code>
            </pre>
          </div>
        )
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>
    })
  }

  if (pathname === "/learn") {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HologramOrb size={24} state={isSendingMessage ? "responding" : activeConversationId ? "idle" : "thinking"} />
                <span className="font-semibold text-foreground text-sm">AI Tutor</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleCreateNewSession} title="New Session">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
              {!activeConversationId ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot className="h-8 w-8 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Start a quick session to ask a question.</p>
                  <Button onClick={handleCreateNewSession} size="sm" className="bg-primary hover:bg-[#059669] text-primary-foreground font-semibold">
                    Start Chat
                  </Button>
                </div>
              ) : isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <p className="text-xs text-muted-foreground">Ask me anything about your studies.</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isUser = msg.role === "user"
                  const isError = msg.content.includes("⚠️ Error")
                  return (
                    <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[90%] break-words rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                        isUser 
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-sm" 
                          : isError
                            ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-sm"
                            : "bg-muted/50 text-foreground border border-border/50 rounded-tl-sm"
                      }`}>
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>
                  )
                })
              )}

              {/* Typing Indicator */}
              {isSendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 shadow-sm">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeConversationId && (
              <div className="p-3 border-t border-border bg-card/95">
                {/* Quick actions */}
                <div className="flex overflow-x-auto gap-2 mb-3 pb-1 text-xs" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  <button onClick={() => handleQuickAction("Explain simpler")} className="shrink-0 px-3 py-1.5 rounded-full border border-border/40 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Explain simpler
                  </button>
                  <button onClick={() => handleQuickAction("Give me a code example")} className="shrink-0 px-3 py-1.5 rounded-full border border-border/40 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all">
                    <Code2 className="h-3.5 w-3.5 text-primary" /> Example
                  </button>
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    className="flex-grow bg-muted/40 border-border/40 text-sm h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isSendingMessage}
                  />
                  <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 shrink-0 rounded-xl shadow-sm transition-transform active:scale-95" disabled={!input.trim() || isSendingMessage}>
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb Button */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isOpen ? 0 : [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: isOpen ? 0 : Infinity,
          ease: "easeInOut"
        }}
        className="relative group cursor-pointer"
      >
        {!isOpen && (
          <motion.div 
            animate={{
              scale: isHovered ? 1.2 : [1, 1.1, 1],
              opacity: isHovered ? 0.8 : [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full blur-xl"
          />
        )}
        
        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/50 border border-white/10 transition-transform duration-200 hover:scale-105 active:scale-95">
          {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Bot className="h-6 w-6 text-foreground" />}
        </div>

        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card text-foreground px-3 py-1.5 rounded-lg text-sm border border-border shadow-xl pointer-events-none"
          >
            Chat with AI Tutor
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
