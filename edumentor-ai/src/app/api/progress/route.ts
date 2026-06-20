import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    // 1. Fetch topic progress (mastery score by topic)
    const progressList = await prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    // 2. Fetch quiz history (recent quiz results)
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            topic: true,
            difficulty: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 20,
    })

    // 3. Fetch general learning analytics
    const analytics = await prisma.learningAnalytics.findUnique({
      where: { userId },
    })

    // 4. Identify weak topics (mastery score below 60%)
    const weakTopics = progressList
      .filter((p) => p.masteryScore < 60)
      .map((p) => ({
        topic: p.topic,
        masteryScore: p.masteryScore,
        quizzesCompleted: p.quizzesCompleted,
      }))

    return NextResponse.json({
      progress: progressList,
      quizResults,
      analytics: analytics || {
        totalSessions: 0,
        totalMessages: 0,
        totalQuizzes: 0,
        averageQuizScore: 0,
        totalLearningMinutes: 0,
      },
      weakTopics,
    })
  } catch (error: any) {
    console.error("API Progress GET Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
