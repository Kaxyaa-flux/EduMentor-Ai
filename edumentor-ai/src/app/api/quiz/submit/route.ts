import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    // Parse request body
    const { quizId, answers } = await req.json()
    if (!quizId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing quizId or answers array" },
        { status: 400 }
      )
    }

    // 2. Fetch the quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })
    if (!quiz || quiz.userId !== userId) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const quizData = JSON.parse(quiz.quizData as string)
    const questions = quizData.questions || []
    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid quiz format" },
        { status: 400 }
      )
    }

    // 3. Evaluate results
    let correctCount = 0
    const results = questions.map((q: any, idx: number) => {
      const selectedAnswer = answers[idx] !== undefined ? answers[idx] : -1
      const isCorrect = q.correct === selectedAnswer
      if (isCorrect) correctCount++

      return {
        id: q.id,
        question: q.question,
        options: q.options,
        correct: q.correct,
        selected: selectedAnswer,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const totalQuestions = questions.length
    const percentage = (correctCount / totalQuestions) * 100

    // 4. Calculate new topic progress stats
    const progress = await prisma.progress.findUnique({
      where: {
        userId_topic: {
          userId,
          topic: quiz.topic,
        },
      },
    })

    const prevQuizzesCompleted = progress?.quizzesCompleted ?? 0
    const prevAverageScore = progress?.averageScore ?? 0

    const newQuizzesCompleted = prevQuizzesCompleted + 1
    const newAverageScore =
      ((prevAverageScore * prevQuizzesCompleted) + percentage) /
      newQuizzesCompleted

    // Completion Rate formula: Completing 10 quizzes gives 100% completion consistency
    const completionRate = Math.min(newQuizzesCompleted * 10, 100)
    const newMasteryScore = (newAverageScore * 0.7) + (completionRate * 0.3)

    // Calculate new overall quiz average from DB results
    const quizResultsCount = await prisma.quizResult.count({
      where: { userId },
    })
    const allResults = await prisma.quizResult.findMany({
      where: { userId },
      select: { percentage: true },
    })
    const totalPercentage =
      allResults.reduce((acc, curr) => acc + curr.percentage, 0) + percentage
    const newAnalyticsAvgScore = totalPercentage / (quizResultsCount + 1)

    // 5. Save in transaction
    await prisma.$transaction([
      prisma.quizResult.create({
        data: {
          quizId,
          userId,
          score: correctCount,
          totalQuestions,
          percentage,
        },
      }),
      prisma.progress.upsert({
        where: {
          userId_topic: {
            userId,
            topic: quiz.topic,
          },
        },
        update: {
          quizzesCompleted: newQuizzesCompleted,
          averageScore: newAverageScore,
          masteryScore: newMasteryScore,
        },
        create: {
          userId,
          topic: quiz.topic,
          quizzesCompleted: 1,
          averageScore: percentage,
          masteryScore: (percentage * 0.7) + (10 * 0.3),
        },
      }),
      prisma.learningAnalytics.upsert({
        where: { userId },
        update: {
          averageQuizScore: newAnalyticsAvgScore,
        },
        create: {
          userId,
          averageQuizScore: percentage,
        },
      }),
    ])

    return NextResponse.json({
      score: correctCount,
      totalQuestions,
      percentage,
      results,
    })
  } catch (error: any) {
    console.error("API Quiz Submit Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
