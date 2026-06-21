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
} from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { slideUpFade } from "@/lib/animations"
import { Bot } from "lucide-react"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeMessages])

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
    await createConversation("New Python Session")
  }

  // Custom text formatter to handle code blocks and inline code
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/)
        const language = match ? match[1] : ""
        const code = match ? match[2] : part.slice(3, -3)
        return (
          <div
            key={index}
            className="my-3 rounded-xl overflow-hidden border border-[#1F2937] bg-[#0A0F1E] font-mono text-xs"
          >
            <div className="bg-[#111827] px-4 py-2 text-slate-400 border-b border-[#1F2937] flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-500 uppercase">
                {language || "code"}
              </span>
            </div>
            <pre className="p-4 overflow-x-auto text-[#10B981] whitespace-pre">
              <code>{code.trim()}</code>
            </pre>
          </div>
        )
      }

      // Inline code formatter
      const inlineParts = part.split(/(`[^`]+`)/g)
      return (
        <span key={index} className="whitespace-pre-wrap">
          {inlineParts.map((subPart, subIdx) => {
            if (subPart.startsWith("`") && subPart.endsWith("`")) {
              return (
                <code
                  key={subIdx}
                  className="px-1.5 py-0.5 rounded bg-[#1F2937] text-[#6366F1] font-mono text-xs"
                >
                  {subPart.slice(1, -1)}
                </code>
              )
            }
            return subPart
          })}
        </span>
      )
    })
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-[#1F2937] overflow-hidden bg-[#111827]/40 max-w-6xl mx-auto">
      {/* 1. Conversations List Sidebar */}
      <div className="w-64 border-r border-[#1F2937] bg-[#111827]/80 flex flex-col h-full">
        <div className="p-4 border-b border-[#1F2937]">
          <Button
            onClick={handleCreateNewSession}
            className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] font-semibold flex items-center justify-center gap-2 border border-[#10B981]/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Sessions Scroll List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoadingConversations ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-5 w-5 text-slate-500 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
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
                      ? "bg-[#10B981]/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1 w-full mr-2">
                      <Input
                        className="h-7 text-xs border-[#374151] bg-[#0A0F1E] text-white px-2 focus-visible:ring-[#10B981]"
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
                        className="p-1 hover:text-[#10B981] text-slate-400"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 hover:text-red-400 text-slate-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveConversationId(conv.id)}
                      className="flex-1 text-left truncate font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className={`h-4 w-4 ${isActive ? "text-[#10B981]" : "text-slate-500"}`} />
                      <span className="truncate">{conv.title}</span>
                    </button>
                  )}

                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={() => startEditing(conv.id, conv.title)}
                        className="p-1 hover:text-slate-200 text-slate-500"
                        title="Rename"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        className="p-1 hover:text-red-400 text-slate-500"
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
      <div className="flex-1 flex flex-col bg-[#111827]/40 h-full">
        {activeConversationId ? (
          <>
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#10B981] animate-spin" />
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <GraduationCap className="h-10 w-10 text-[#10B981] mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">
                    Start Learning!
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
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
                              ? "bg-[#10B981] text-[#0A0F1E] font-semibold shadow-lg shadow-[#10B981]/10"
                              : "bg-[#1F2937] text-slate-100 border border-[#374151] shadow-lg shadow-black/10"
                          }`}
                        >
                          {renderMessageContent(msg.content)}
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
                    <div className="bg-[#1F2937] border border-[#374151] shadow-lg shadow-black/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Bot className="h-5 w-5 text-[#10B981]" />
                      </motion.div>
                      <div className="flex gap-1.5">
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80"></motion.span>
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80"></motion.span>
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80"></motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Form */}
            <div className="p-4 border-t border-[#1F2937] bg-[#111827]/80 space-y-4">
              {/* Quick Actions Row */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction("Can you explain this simpler?")}
                  className="px-3 py-1.5 rounded-lg border border-[#1F2937] hover:border-[#10B981]/30 bg-[#0A0F1E]/50 hover:bg-[#111827] text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-[#10B981]" />
                  Explain Simpler
                </button>
                <button
                  onClick={() => handleQuickAction("Can you show me a Python example of this?")}
                  className="px-3 py-1.5 rounded-lg border border-[#1F2937] hover:border-[#10B981]/30 bg-[#0A0F1E]/50 hover:bg-[#111827] text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="h-3 w-3 text-[#10B981]" />
                  Show Code Example
                </button>
                <button
                  onClick={() => handleQuickAction("Can you give me a coding challenge to test my understanding?")}
                  className="px-3 py-1.5 rounded-lg border border-[#1F2937] hover:border-[#10B981]/30 bg-[#0A0F1E]/50 hover:bg-[#111827] text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="h-3 w-3 text-[#10B981]" />
                  Practice Challenge
                </button>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  className="flex-grow border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                  placeholder="Ask your tutor something... (e.g. What is a class in Python?)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSendingMessage}
                />
                <Button
                  type="submit"
                  className="bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold px-5"
                  disabled={!input.trim() || isSendingMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto p-8">
            <MessageSquare className="h-10 w-10 text-slate-500 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">
              No Active Session
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Create a new room or select a conversation from the sidebar to start tutoring.
            </p>
            <Button
              onClick={handleCreateNewSession}
              className="bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold"
            >
              Start New Room
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
