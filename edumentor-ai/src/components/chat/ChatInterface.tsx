"use client"

import { useEffect, useRef, useState } from "react"
import {
  Plus,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  MessageSquare,
  GraduationCap,
  ChevronRight,
  Code2,
  Sparkles,
  RefreshCw,
  Loader2,
  Bot,
  User,
} from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { slideUpFade } from "@/lib/animations"
import { HologramOrb } from "@/components/ui/HologramOrb"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function ChatInterface() {
  const {
    conversations,
    activeConversationId,
    activeMessages,
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    setActiveConversationId,
    sendMessage,
  } = useAppStore()

  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeMessages])

  // Close sidebar when active conversation changes on mobile
  useEffect(() => {
    setIsChatSidebarOpen(false)
  }, [activeConversationId])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSendingMessage) return
    sendMessage(input.trim())
    setInput("")
  }

  const handleQuickAction = (actionText: string) => {
    if (isSendingMessage) return
    sendMessage(actionText)
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim())
    }
    setEditingId(null)
  }

  const handleCreateNewSession = async () => {
    await createConversation("New Session")
    setIsChatSidebarOpen(false)
  }



  return (
    <div className="flex h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] rounded-2xl border border-border overflow-hidden bg-card/40 max-w-6xl mx-auto relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/20 pointer-events-none z-0" />
      {/* Mobile Sidebar Overlay */}
      {isChatSidebarOpen && (
        <div 
          className="md:hidden absolute inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={() => setIsChatSidebarOpen(false)}
        />
      )}

      {/* 1. Conversations List Sidebar */}
      <div className={`absolute md:relative z-30 w-64 md:w-64 border-r border-border bg-card/95 md:bg-card/80 flex flex-col h-full transition-transform duration-300 ${isChatSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <Button
            onClick={handleCreateNewSession}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center justify-center gap-2 border border-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Sessions Scroll List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoadingConversations ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No sessions yet.
            </p>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConversationId === conv.id
              const isEditing = editingId === conv.id

              return (
                <div
                  key={conv.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-sm ${
                    isActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1 w-full mr-2">
                      <Input
                        className="h-7 text-xs border-[#374151] bg-background text-foreground px-2 focus-visible:ring-primary"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(conv.id)
                          if (e.key === "Escape") setEditingId(null)
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(conv.id)}
                        className="p-1 hover:text-primary text-muted-foreground"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 hover:text-red-400 text-muted-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveConversationId(conv.id)}
                      className="flex-1 text-left truncate font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="truncate">{conv.title}</span>
                    </button>
                  )}

                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => startEditing(conv.id, conv.title)}
                        className="p-1 hover:text-slate-200 text-muted-foreground"
                        title="Rename"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="p-1 hover:text-red-400 text-muted-foreground"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 2. Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-card/40 h-full relative max-w-full w-full">
        {/* Mobile Header for Sessions Toggle */}
        <div className="md:hidden absolute top-3 left-3 z-20">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-background/80 backdrop-blur-sm border-border"
            onClick={() => setIsChatSidebarOpen(true)}
          >
            <MessageSquare className="h-4 w-4 text-foreground" />
          </Button>
        </div>


        {activeConversationId ? (
          <>
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <GraduationCap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-foreground font-bold text-lg mb-2">
                    Start Learning!
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Say hello to your tutor, ask how variables work, or request a quick code sample.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {activeMessages.map((msg) => {
                    const isUser = msg.role === "user"
                    return (
                      <motion.div
                        key={msg.id}
                        variants={slideUpFade}
                        initial="initial"
                        animate="animate"
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed text-sm ${
                            isUser
                              ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/10"
                              : "bg-accent text-foreground border border-[#374151] shadow-lg shadow-black/10"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "")
                                if (!inline && match) {
                                  return (
                                    <div className="my-3 rounded-xl overflow-hidden border border-border bg-background font-mono text-xs max-w-full">
                                      <div className="bg-card px-4 py-2 text-muted-foreground border-b border-border flex items-center justify-between text-[10px]">
                                        <span className="font-semibold text-muted-foreground uppercase">
                                          {match[1]}
                                        </span>
                                      </div>
                                      <pre className="p-4 overflow-x-auto text-primary whitespace-pre max-w-full">
                                        <code {...props}>{String(children).replace(/\n$/, "")}</code>
                                      </pre>
                                    </div>
                                  )
                                } else if (!inline) {
                                  return (
                                    <div className="my-3 rounded-xl overflow-hidden border border-border bg-background font-mono text-xs max-w-full">
                                      <div className="bg-card px-4 py-2 text-muted-foreground border-b border-border flex items-center justify-between text-[10px]">
                                        <span className="font-semibold text-muted-foreground uppercase">
                                          code
                                        </span>
                                      </div>
                                      <pre className="p-4 overflow-x-auto text-primary whitespace-pre max-w-full">
                                        <code {...props}>{String(children).replace(/\n$/, "")}</code>
                                      </pre>
                                    </div>
                                  )
                                }
                                return (
                                  <code className="px-1.5 py-0.5 rounded bg-accent text-secondary font-mono text-[11px] break-all" {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              p({ children }) {
                                return <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words">{children}</p>
                              },
                              strong({ children }) {
                                return <strong className="font-bold text-foreground/90">{children}</strong>
                              },
                              ul({ children }) {
                                return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
                              },
                              ol({ children }) {
                                return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
                              },
                              li({ children }) {
                                return <li>{children}</li>
                              },
                              h1({ children }) {
                                return <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>
                              },
                              h2({ children }) {
                                return <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>
                              },
                              h3({ children }) {
                                return <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isSendingMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex justify-start"
                  >
                    <div className="bg-accent border border-[#374151] shadow-lg shadow-black/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Bot className="h-5 w-5 text-primary" />
                      </motion.div>
                      <div className="flex gap-1.5">
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary/80"></motion.span>
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary/80"></motion.span>
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary/80"></motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Form */}
            <div className="p-4 border-t border-border bg-card/80 space-y-4">
              {/* Quick Actions Row */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction("Can you explain this simpler?")}
                  className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 bg-background/50 hover:bg-card text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  Explain Simpler
                </button>
                <button
                  onClick={() => handleQuickAction("Can you show me a code example of this?")}
                  className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 bg-background/50 hover:bg-card text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="h-3 w-3 text-primary" />
                  Show Code Example
                </button>
                <button
                  onClick={() => handleQuickAction("Can you give me a coding challenge to test my understanding?")}
                  className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 bg-background/50 hover:bg-card text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="h-3 w-3 text-primary" />
                  Practice Challenge
                </button>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  className="flex-grow border-border bg-background text-foreground focus-visible:ring-primary"
                  placeholder="Ask your tutor something... (e.g. What is a class?)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSendingMessage}
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-[#059669] text-primary-foreground font-bold px-5"
                  disabled={!input.trim() || isSendingMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto p-8"
            initial="initial"
            animate="animate"
          >
            {/* AI Mentor arrival animation */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Particle gather effect */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ top: "50%", left: "50%" }}
                  initial={{
                    x: Math.cos((i * Math.PI) / 4) * 60,
                    y: Math.sin((i * Math.PI) / 4) * 60,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.07, ease: "easeIn" }}
                />
              ))}
              <HologramOrb state="thinking" size={72} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-foreground font-bold text-lg mb-2">Your AI Mentor is Ready</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Select a session on the left or create a new one to begin your learning journey.
              </p>
              <Button
                onClick={handleCreateNewSession}
                className="bg-primary hover:bg-[#059669] text-primary-foreground font-bold"
              >
                Start New Session
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
