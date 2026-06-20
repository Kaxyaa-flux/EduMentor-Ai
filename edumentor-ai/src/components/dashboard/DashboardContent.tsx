"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MessageSquare,
  GraduationCap,
  Award,
  Sparkles,
  Play,
  Plus,
  BookOpen,
  ArrowRight,
  Brain,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardContentProps {
  userName: string
  skillLevel: string
  learningGoal: string
  stats: {
    totalSessions: number
    totalMessages: number
    quizzesCompleted: number
    averageScore: number
  }
  recentSessions: Array<{
    id: string
    title: string
    updatedAt: string
  }>
  progressData: Array<{
    topic: string
    mastery: number
    quizzes: number
  }>
  weakTopics: string[]
}

export default function DashboardContent({
  userName,
  skillLevel,
  learningGoal,
  stats,
  recentSessions,
  progressData,
  weakTopics,
}: DashboardContentProps) {
  const router = useRouter()
  const createConversation = useAppStore((state) => state.createConversation)
  const setActiveConversationId = useAppStore((state) => state.setActiveConversationId)
  
  const [mounted, setMounted] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStartNewSession = async () => {
    setIsCreatingSession(true)
    const newSessionId = await createConversation("Python Basics")
    if (newSessionId) {
      router.push("/learn")
    } else {
      setIsCreatingSession(false)
    }
  }

  const handleResumeSession = (id: string) => {
    setActiveConversationId(id)
    router.push("/learn")
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1F2937] bg-gradient-to-r from-[#111827] via-[#111827]/80 to-[#10B981]/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-[#10B981]/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 text-xs font-semibold text-[#10B981] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Level: {skillLevel}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {userName}!
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Goal: &ldquo;{learningGoal}&rdquo;. Ask your tutor a question or take an adaptive quiz to raise your mastery scores.
            </p>
          </div>
          <Button
            onClick={handleStartNewSession}
            disabled={isCreatingSession}
            className="bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold self-start md:self-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Learning Session
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sessions */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Sessions
            </CardDescription>
            <MessageSquare className="h-4 w-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
            <p className="text-xs text-slate-500 mt-1">Persistent rooms</p>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Tutor Interactions
            </CardDescription>
            <GraduationCap className="h-4 w-4 text-[#6366F1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
            <p className="text-xs text-slate-500 mt-1">AI messages sent</p>
          </CardContent>
        </Card>

        {/* Quizzes */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Quizzes Taken
            </CardDescription>
            <Brain className="h-4 w-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.quizzesCompleted}</div>
            <p className="text-xs text-slate-500 mt-1">Adaptive assessments</p>
          </CardContent>
        </Card>

        {/* Avg Quiz Score */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Average Score
            </CardDescription>
            <Award className="h-4 w-4 text-[#6366F1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.averageScore}%
            </div>
            <div className="w-full bg-[#1F2937] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all"
                style={{ width: `${stats.averageScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Chart & Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3: Mastery Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="border-[#1F2937] bg-[#111827] h-full">
            <CardHeader>
              <CardTitle className="text-white text-base">Topic Mastery Overview</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Your Python mastery score is calculated based on quiz correctness and completion rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 pb-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis
                      dataKey="topic"
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#1F2937",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#10B981" }}
                    />
                    <Bar
                      dataKey="mastery"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name="Mastery Score (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  Loading analytics...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1/3: Recent Sessions */}
        <div>
          <Card className="border-[#1F2937] bg-[#111827] h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-white text-base">Recent Sessions</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Resume your previous learning chats.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {recentSessions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm space-y-3">
                  <p>No active sessions yet.</p>
                  <Button
                    onClick={handleStartNewSession}
                    disabled={isCreatingSession}
                    variant="outline"
                    className="border-[#1F2937] text-[#10B981]"
                  >
                    Start First Chat
                  </Button>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl border border-[#1F2937] bg-[#0A0F1E]/50 hover:border-[#10B981]/20 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Active {new Date(session.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleResumeSession(session.id)}
                      size="sm"
                      className="bg-[#1F2937] hover:bg-[#10B981] hover:text-[#0A0F1E] text-slate-300 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weak Topics & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400 text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Focus Suggested
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Your mastery score is below 60% in these topics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Card */}
        <Card className={`border-[#1F2937] bg-[#111827] ${weakTopics.length === 0 ? "md:col-span-2" : ""}`}>
          <CardHeader>
            <CardTitle className="text-white text-base">Quick Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link
              href="/learn"
              className="p-4 rounded-xl border border-[#1F2937] bg-[#0A0F1E]/50 hover:border-[#10B981]/20 hover:bg-[#111827] transition-all text-center flex flex-col items-center gap-2 group"
            >
              <MessageSquare className="h-6 w-6 text-[#10B981] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-white">Tutor Chat</span>
            </Link>
            <Link
              href="/quiz"
              className="p-4 rounded-xl border border-[#1F2937] bg-[#0A0F1E]/50 hover:border-[#6366F1]/20 hover:bg-[#111827] transition-all text-center flex flex-col items-center gap-2 group"
            >
              <Brain className="h-6 w-6 text-[#6366F1] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-white">Take Quiz</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
