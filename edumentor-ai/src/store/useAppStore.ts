import { create } from "zustand"
import {
  Conversation,
  Message,
  UserPreference,
  QuizQuestion,
  QuizResultDetails,
  ProgressData,
  Progress,
} from "@/types"

interface AppState {
  // Conversations State
  conversations: Conversation[]
  activeConversationId: string | null
  activeMessages: Message[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isSendingMessage: boolean

  // Onboarding & Preferences
  preferences: UserPreference | null
  isLoadingPreferences: boolean

  // Quiz State
  activeQuiz: {
    quizId: string
    topic: string
    difficulty: string
    questions: QuizQuestion[]
  } | null
  quizResults: {
    score: number
    totalQuestions: number
    percentage: number
    results: QuizResultDetails[]
  } | null
  isLoadingQuiz: boolean
  isSubmittingQuiz: boolean

  // Progress State
  progressData: ProgressData | null
  isLoadingProgress: boolean

  // Methods
  fetchConversations: () => Promise<void>
  createConversation: (title?: string) => Promise<string | null>
  renameConversation: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  setActiveConversationId: (id: string | null) => void
  fetchConversationMessages: (id: string) => Promise<void>
  sendMessage: (message: string) => Promise<void>
  
  fetchPreferences: () => Promise<UserPreference | null>
  savePreferences: (data: {
    skillLevel: string
    learningGoal?: string
    dailyStudyMinutes?: number
  }) => Promise<boolean>

  generateQuiz: (topic: string) => Promise<void>
  submitQuiz: (answers: number[]) => Promise<void>
  resetQuizState: () => void
  fetchProgress: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial States
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSendingMessage: false,

  preferences: null,
  isLoadingPreferences: false,

  activeQuiz: null,
  quizResults: null,
  isLoadingQuiz: false,
  isSubmittingQuiz: false,

  progressData: null,
  isLoadingProgress: false,

  // Conversations Actions
  fetchConversations: async () => {
    set({ isLoadingConversations: true })
    try {
      const res = await fetch("/api/conversations")
      if (res.ok) {
        const data = await res.json()
        set({ conversations: data })
        // Set first conversation as active if none is set
        const activeId = get().activeConversationId
        if (!activeId && data.length > 0) {
          get().setActiveConversationId(data[0].id)
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err)
    } finally {
      set({ isLoadingConversations: false })
    }
  },

  createConversation: async (title) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (res.ok) {
        const newConv = await res.json()
        set((state) => ({
          conversations: [newConv, ...state.conversations],
        }))
        get().setActiveConversationId(newConv.id)
        return newConv.id
      }
    } catch (err) {
      console.error("Error creating conversation:", err)
    }
    return null
  },

  renameConversation: async (id, title) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      })
      if (res.ok) {
        const updated = await res.json()
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title: updated.title } : c
          ),
        }))
      }
    } catch (err) {
      console.error("Error renaming conversation:", err)
    }
  },

  deleteConversation: async (id) => {
    try {
      const res = await fetch(`/api/conversations?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id
              ? state.conversations.find((c) => c.id !== id)?.id || null
              : state.activeConversationId,
        }))
        // Load messages for the new active conversation if there is one
        const newActiveId = get().activeConversationId
        if (newActiveId) {
          get().fetchConversationMessages(newActiveId)
        } else {
          set({ activeMessages: [] })
        }
      }
    } catch (err) {
      console.error("Error deleting conversation:", err)
    }
  },

  setActiveConversationId: (id) => {
    set({ activeConversationId: id })
    if (id) {
      get().fetchConversationMessages(id)
    } else {
      set({ activeMessages: [] })
    }
  },

  fetchConversationMessages: async (id) => {
    set({ isLoadingMessages: true })
    try {
      const res = await fetch(`/api/conversations?id=${id}`)
      if (res.ok) {
        const data = await res.json()
        set({ activeMessages: data.messages || [] })
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
    } finally {
      set({ isLoadingMessages: false })
    }
  },

  sendMessage: async (message) => {
    const activeId = get().activeConversationId
    if (!activeId) return

    // Optimistically add user message to list
    const tempUserMessage: Message = {
      id: "temp-user-msg-" + Date.now(),
      conversationId: activeId,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      activeMessages: [...state.activeMessages, tempUserMessage],
      isSendingMessage: true,
    }))

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId: activeId }),
      })

      if (res.ok) {
        const data = await res.json()
        // Replace user message with db response if needed, and add assistant reply
        // To be safe, we reload messages from backend to ensure consistent state
        await get().fetchConversationMessages(activeId)
      } else {
        const errorData = await res.json()
        const errorMsg = errorData.error || "Failed to send message"
        
        // Add error message to chat
        const errorBubble: Message = {
          id: "error-msg-" + Date.now(),
          conversationId: activeId,
          role: "assistant",
          content: `⚠️ Error: ${errorMsg}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          activeMessages: [...state.activeMessages, errorBubble],
        }))
      }
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      set({ isSendingMessage: false })
    }
  },

  // Onboarding & Preferences Actions
  fetchPreferences: async () => {
    set({ isLoadingPreferences: true })
    try {
      const res = await fetch("/api/onboarding")
      if (res.ok) {
        const data = await res.json()
        set({ preferences: data })
        return data
      }
    } catch (err) {
      console.error("Error fetching preferences:", err)
    } finally {
      set({ isLoadingPreferences: false })
    }
    return null
  },

  savePreferences: async (data) => {
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const prefs = await res.json()
        set({ preferences: prefs })
        return true
      }
    } catch (err) {
      console.error("Error saving preferences:", err)
    }
    return false
  },

  // Quiz Actions
  generateQuiz: async (topic) => {
    set({ isLoadingQuiz: true, quizResults: null, activeQuiz: null })
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })
      if (res.ok) {
        const quiz = await res.json()
        set({ activeQuiz: quiz })
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to generate quiz.")
      }
    } catch (err) {
      console.error("Error generating quiz:", err)
    } finally {
      set({ isLoadingQuiz: false })
    }
  },

  submitQuiz: async (answers) => {
    const quiz = get().activeQuiz
    if (!quiz) return

    set({ isSubmittingQuiz: true })
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.quizId, answers }),
      })
      if (res.ok) {
        const results = await res.json()
        set({ quizResults: results })
      }
    } catch (err) {
      console.error("Error submitting quiz:", err)
    } finally {
      set({ isSubmittingQuiz: false })
    }
  },

  resetQuizState: () => {
    set({ activeQuiz: null, quizResults: null })
  },

  // Progress Actions
  fetchProgress: async () => {
    set({ isLoadingProgress: true })
    try {
      const res = await fetch("/api/progress")
      if (res.ok) {
        const data = await res.json()
        set({ progressData: data })
      }
    } catch (err) {
      console.error("Error fetching progress data:", err)
    } finally {
      set({ isLoadingProgress: false })
    }
  },
}))
