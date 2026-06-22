export interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
}

export interface UserPreference {
  id: string
  userId: string
  learningTopic: string
  skillLevel: "Beginner" | "Intermediate" | "Advanced"
  learningGoal: string | null
  dailyStudyMinutes: number | null
  createdAt: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface QuizData {
  questions: QuizQuestion[]
}

export interface Quiz {
  id: string
  userId: string
  topic: string
  difficulty: string
  quizData: QuizData
  createdAt: string
}

export interface QuizResultDetails {
  id: number
  question: string
  options: string[]
  correct: number
  selected: number
  isCorrect: boolean
  explanation: string
}

export interface QuizResult {
  id: string
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  percentage: number
  submittedAt: string
  quiz?: {
    topic: string
    difficulty: string
  }
}

export interface Progress {
  id: string
  userId: string
  topic: string
  masteryScore: number
  quizzesCompleted: number
  averageScore: number
  updatedAt: string
}

export interface LearningAnalytics {
  totalSessions: number
  totalMessages: number
  totalQuizzes: number
  averageQuizScore: number
  totalLearningMinutes: number
}

export interface ProgressData {
  progress: Progress[]
  quizResults: QuizResult[]
  analytics: LearningAnalytics
  weakTopics: Array<{
    topic: string
    masteryScore: number
    quizzesCompleted: number
  }>
}

// ─── Code Analyzer ───
export interface CodeAnalysis {
  language: string
  summary: string
  lines: Array<{
    lineNumber: number
    code: string
    explanation: string
    type: "logic" | "syntax" | "comment" | "declaration" | "control" | "function" | "import"
  }>
  improvements: string[]
  concepts: string[]
  overallFeedback: string
}

// ─── Mistake Patterns ───
export interface MistakePattern {
  id: string
  language: string
  concept: string
  description: string
  occurrences: number
  lastSeen: string
}

// ─── Daily Challenge ───
export interface DailyChallenge {
  id: string
  language: string
  date: string
  title: string
  description: string
  starterCode: string
  difficulty: string
  hints: string[]
  solution: string
}

export interface DailyStatus {
  challenge: DailyChallenge | null
  isCompleted: boolean
  streak: number
}

