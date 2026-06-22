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
import { motion } from "framer-motion"
import { staggerContainer, slideUpFade, cardHover } from "@/lib/animations"
import { CountUp } from "@/components/ui/CountUp"
import { NeuralNetworkBackground } from "@/components/ui/NeuralNetworkBackground"
import { StreakFire } from "@/components/ui/StreakFire"
import { LearningGalaxy } from "@/components/ui/LearningGalaxy"
import { ConstellationPath } from "@/components/ui/ConstellationPath"

interface DashboardContentProps {
  userName: string
  skillLevel: string
  learningTopic: string
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
  learningTopic,
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
    const newSessionId = await createConversation("Learning Basics")
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
    <div className="relative">
      {/* Neural Network Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }}>
        <NeuralNetworkBackground />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 space-y-8 max-w-6xl mx-auto"
    >
      {/* Welcome Banner */}
      <motion.div variants={slideUpFade} className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card/80 to-primary/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Level: {skillLevel}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName}!
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Goal: &ldquo;{learningGoal}&rdquo;. Ask your tutor a question or take an adaptive quiz to raise your mastery scores.
            </p>
          </div>
          <Button
            onClick={handleStartNewSession}
            disabled={isCreatingSession}
            className="bg-primary hover:bg-[#059669] text-primary-foreground font-bold self-start md:self-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Learning Session
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sessions */}
        <motion.div variants={slideUpFade} {...cardHover} className="h-full">
          <Card className="border-border bg-card h-full shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Sessions
              </CardDescription>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                <CountUp end={stats.totalSessions} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Persistent rooms</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages */}
        <motion.div variants={slideUpFade} {...cardHover} className="h-full">
          <Card className="border-border bg-card h-full shadow-lg hover:shadow-secondary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Tutor Interactions
              </CardDescription>
              <GraduationCap className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                <CountUp end={stats.totalMessages} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">AI messages sent</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quizzes */}
        <motion.div variants={slideUpFade} {...cardHover} className="h-full">
          <Card className="border-border bg-card h-full shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Quizzes Taken
              </CardDescription>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                <CountUp end={stats.quizzesCompleted} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Adaptive assessments</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avg Quiz Score */}
        <motion.div variants={slideUpFade} {...cardHover} className="h-full">
          <Card className="border-border bg-card h-full shadow-lg hover:shadow-secondary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Average Score
              </CardDescription>
              <Award className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                <CountUp end={stats.averageScore} suffix="%" />
              </div>
              <div className="w-full bg-accent h-1.5 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.averageScore}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Grid: Chart & Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3: Mastery Bar Chart */}
        <motion.div variants={slideUpFade} className="lg:col-span-2">
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Topic Mastery Overview</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Your mastery score is calculated based on quiz correctness and completion rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 pb-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
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
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "var(--primary)" }}
                    />
                    <Bar
                      dataKey="mastery"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                      name="Mastery Score (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Loading analytics...
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right 1/3: Recent Sessions */}
        <motion.div variants={slideUpFade}>
          <Card className="border-border bg-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Recent Sessions</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Resume your previous learning chats.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {recentSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm space-y-3">
                  <p>No active sessions yet.</p>
                  <Button
                    onClick={handleStartNewSession}
                    disabled={isCreatingSession}
                    variant="outline"
                    className="border-border text-primary"
                  >
                    Start First Chat
                  </Button>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl border border-border bg-background/50 hover:border-primary/20 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Active {new Date(session.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleResumeSession(session.id)}
                      size="sm"
                      className="bg-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Galaxy */}
      <motion.div variants={slideUpFade}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-foreground font-bold text-base">🌌 Learning Galaxy</span>
          <span className="text-muted-foreground text-sm">Your subject universe — click planets to explore</span>
        </div>
        <LearningGalaxy 
          activeTopic={learningTopic} 
          globalMastery={stats.averageScore} 
          className="h-80" 
        />
      </motion.div>

      {/* Constellation Learning Path */}
      <motion.div variants={slideUpFade}>
        <ConstellationPath 
          activeTopic={learningTopic}
          progressData={progressData}
        />
      </motion.div>

      {/* Weak Topics & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <motion.div variants={slideUpFade}>
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Focus Suggested
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
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
          </motion.div>
        )}

        {/* Quick Actions Card */}
        <motion.div variants={slideUpFade} className={weakTopics.length === 0 ? "md:col-span-2" : ""}>
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Quick Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link
                href="/learn"
                className="p-4 rounded-xl border border-border bg-background/50 hover:border-primary/20 hover:bg-card transition-all text-center flex flex-col items-center gap-2 group"
              >
                <MessageSquare className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">Tutor Chat</span>
              </Link>
              <Link
                href="/quiz"
                className="p-4 rounded-xl border border-border bg-background/50 hover:border-secondary/20 hover:bg-card transition-all text-center flex flex-col items-center gap-2 group"
              >
                <Brain className="h-6 w-6 text-secondary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">Take Quiz</span>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </motion.div>
    </div>
  )
}
