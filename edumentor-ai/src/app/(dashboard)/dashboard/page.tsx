import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import DashboardContent from "@/components/dashboard/DashboardContent"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }
  const userId = session.user.id

  // 1. Fetch user preference (skill level and goals)
  const preferences = await prisma.userPreference.findUnique({
    where: { userId },
  })

  // 2. Fetch stats
  const totalSessions = await prisma.conversation.count({
    where: { userId },
  })

  const totalMessages = await prisma.message.count({
    where: {
      conversation: {
        userId,
      },
    },
  })

  const quizzesCompleted = await prisma.quizResult.count({
    where: { userId },
  })

  const avgScoreResult = await prisma.quizResult.aggregate({
    where: { userId },
    _avg: {
      percentage: true,
    },
  })
  const averageScore = avgScoreResult._avg.percentage || 0

  // 3. Fetch recent conversations/sessions
  const recentSessions = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 4,
  })

  // 4. Fetch topic progress (for Recharts)
  let topicProgress = await prisma.progress.findMany({
    where: { userId },
    orderBy: { masteryScore: "desc" },
  })

  // Seed default topics if user has zero progress records
  if (topicProgress.length === 0) {
    topicProgress = [
      { id: "1", userId, topic: "Variables & Types", masteryScore: 0, quizzesCompleted: 0, averageScore: 0, updatedAt: new Date() },
      { id: "2", userId, topic: "Control Flow (Loops & Ifs)", masteryScore: 0, quizzesCompleted: 0, averageScore: 0, updatedAt: new Date() },
      { id: "3", userId, topic: "Lists & Tuples", masteryScore: 0, quizzesCompleted: 0, averageScore: 0, updatedAt: new Date() },
      { id: "4", userId, topic: "Functions & Scope", masteryScore: 0, quizzesCompleted: 0, averageScore: 0, updatedAt: new Date() },
      { id: "5", userId, topic: "Dictionaries & Sets", masteryScore: 0, quizzesCompleted: 0, averageScore: 0, updatedAt: new Date() },
    ]
  }

  // 5. Identify weak topics (mastery < 60%)
  const weakTopics = topicProgress
    .filter((p) => p.masteryScore > 0 && p.masteryScore < 60)
    .map((p) => p.topic)

  return (
    <DashboardContent
      userName={session.user.name || "Student"}
      skillLevel={preferences?.skillLevel || "Beginner"}
      learningGoal={preferences?.learningGoal || "Software development"}
      stats={{
        totalSessions,
        totalMessages,
        quizzesCompleted,
        averageScore: Math.round(averageScore),
      }}
      recentSessions={recentSessions.map((c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt.toISOString(),
      }))}
      progressData={topicProgress.map((p) => ({
        topic: p.topic,
        mastery: Math.round(p.masteryScore),
        quizzes: p.quizzesCompleted,
      }))}
      weakTopics={weakTopics}
    />
  )
}
