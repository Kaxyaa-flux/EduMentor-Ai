"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  BarChart3,
  Award,
  Calendar,
  Flame,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Loader2,
  CheckCircle,
} from "lucide-react"

import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProgressPage() {
  const router = useRouter()
  const { progressData, isLoadingProgress, fetchProgress, createConversation } =
    useAppStore()
  
  const [mounted, setMounted] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProgress()
  }, [fetchProgress])

  // Calculate learning streak from quiz results dates
  const calculateStreak = (results: any[]) => {
    if (!results || results.length === 0) return 0
    
    const dates = results.map((r) =>
      new Date(r.submittedAt).toDateString()
    )
    const uniqueDates = Array.from(new Set(dates)).map((d) => new Date(d))
    
    // Sort descending (newest first)
    uniqueDates.sort((a, b) => b.getTime() - a.getTime())

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const latest = uniqueDates[0]
    if (!latest) return 0
    latest.setHours(0, 0, 0, 0)

    // If the last activity wasn't today or yesterday, streak is 0
    if (latest.getTime() !== today.getTime() && latest.getTime() !== yesterday.getTime()) {
      return 0
    }

    let streak = 1
    let currentCheck = latest

    for (let i = 1; i < uniqueDates.length; i++) {
      const nextExpected = new Date(currentCheck)
      nextExpected.setDate(nextExpected.getDate() - 1)
      
      const prevDate = uniqueDates[i]
      prevDate.setHours(0, 0, 0, 0)

      if (prevDate.getTime() === nextExpected.getTime()) {
        streak++
        currentCheck = prevDate
      } else {
        break
      }
    }

    return streak
  }

  const handleAskAboutTopic = async (topic: string) => {
    setIsCreatingSession(true)
    const sessionId = await createConversation(`Study: ${topic}`)
    if (sessionId) {
      router.push("/learn")
    } else {
      setIsCreatingSession(false)
    }
  }

  const streak = progressData?.quizResults
    ? calculateStreak(progressData.quizResults)
    : 0

  const chartData = progressData?.progress.map((p) => ({
    topic: p.topic,
    mastery: Math.round(p.masteryScore),
  })) || []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Learning Streak
            </CardDescription>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
              {streak} <span className="text-sm font-medium text-slate-500">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {streak > 0 ? "Keep the flame burning!" : "Take a quiz to start a streak!"}
            </p>
          </CardContent>
        </Card>

        {/* Total Quizzes */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Quizzes Evaluated
            </CardDescription>
            <CheckCircle className="h-5 w-5 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {progressData?.analytics.totalQuizzes || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Adaptive tests completed</p>
          </CardContent>
        </Card>

        {/* Global Average */}
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Average Accuracy
            </CardDescription>
            <Award className="h-5 w-5 text-[#6366F1]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">
              {Math.round(progressData?.analytics.averageQuizScore || 0)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all topic quiz history</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Chart & Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="border-[#1F2937] bg-[#111827] h-full">
            <CardHeader>
              <CardTitle className="text-white text-base">Topic Mastery Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pb-4">
              {isLoadingProgress ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-[#10B981] animate-spin" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  Complete a quiz to generate mastery charts.
                </div>
              ) : mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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
                      name="Mastery (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Weak Spots & Action Box */}
        <div>
          <Card className="border-[#1F2937] bg-[#111827] h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-white text-base">Weak Areas</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Topics below 60% mastery requiring study focus.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {isLoadingProgress ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-5 w-5 text-slate-500 animate-spin" />
                </div>
              ) : !progressData?.weakTopics || progressData.weakTopics.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                  <CheckCircle className="h-8 w-8 text-[#10B981] mx-auto mb-2" />
                  <p>Excellent! All evaluated topics have &gt; 60% mastery score.</p>
                </div>
              ) : (
                progressData.weakTopics.map((item) => (
                  <div
                    key={item.topic}
                    className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:border-red-500/20 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.topic}
                        </p>
                        <p className="text-xs text-red-400 mt-0.5">
                          Mastery Score: {Math.round(item.masteryScore)}%
                        </p>
                      </div>
                      <span className="p-1 rounded bg-red-500/10 text-red-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <Button
                      onClick={() => handleAskAboutTopic(item.topic)}
                      disabled={isCreatingSession}
                      size="sm"
                      className="w-full bg-[#111827] border border-[#1F2937] hover:border-[#10B981]/30 hover:bg-[#10B981]/5 text-slate-300 hover:text-[#10B981] transition-all text-xs"
                    >
                      Ask Tutor About This
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz History Table */}
      <Card className="border-[#1F2937] bg-[#111827]">
        <CardHeader>
          <CardTitle className="text-white text-base">Quiz Performance History</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Review your accuracy details for completed adaptive quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-6">
          {isLoadingProgress ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 text-[#10B981] animate-spin" />
            </div>
          ) : !progressData?.quizResults || progressData.quizResults.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No quiz history records found.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#1F2937] text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] text-slate-300">
                {progressData.quizResults.map((result) => (
                  <tr key={result.id} className="hover:bg-[#1F2937]/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      {result.quiz?.topic}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1F2937] border border-[#374151]">
                        {result.quiz?.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {result.totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#10B981]">
                      {result.score} / {result.totalQuestions} ({result.percentage}%)
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(result.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
