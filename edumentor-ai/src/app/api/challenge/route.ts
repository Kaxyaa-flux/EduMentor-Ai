import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"

export const dynamic = 'force-dynamic'

// GET — fetch today's challenge + completion status + streak
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const userId = session.user.id

    const url = new URL(req.url)
    const language = url.searchParams.get("language") || "Python"
    const today = new Date().toISOString().split("T")[0]

    // Check if today's challenge exists for this language
    let challenge = await prisma.dailyChallenge.findUnique({
      where: { language_date: { language, date: today } }
    })

    // If not, generate it
    if (!challenge) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { groqApiKey: true } })
      const groqClient = new Groq({ apiKey: user?.groqApiKey || process.env.GROQ_API_KEY || 'build-placeholder' })

      const preferences = await prisma.userPreference.findUnique({ where: { userId } })
      const skillLevel = preferences?.skillLevel || "Beginner"

      const prompt = `Generate a daily coding challenge for ${language} programmers.
Difficulty: ${skillLevel}
Date: ${today}

Return ONLY raw JSON in this exact format:
{
  "title": "Challenge title (e.g. 'Reverse a String')",
  "description": "Clear problem statement, 2-4 sentences. Explain what the function should do, include example input/output.",
  "starterCode": "starter code with function signature and a comment showing example usage",
  "difficulty": "${skillLevel}",
  "hints": [
    "First subtle hint",
    "More specific hint",
    "Almost the answer"
  ],
  "solution": "complete working solution with comments"
}

Make the challenge practical, educational, and solvable in 10-20 minutes.`

      const response = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a coding challenge generator. Return only raw JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
      })

      let rawText = response.choices[0]?.message?.content || ""
      rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim()

      let challengeData
      try { challengeData = JSON.parse(rawText) } catch {
        return NextResponse.json({ error: "Failed to generate challenge. Please try again." }, { status: 500 })
      }

      challenge = await prisma.dailyChallenge.create({
        data: {
          language,
          date: today,
          title: challengeData.title,
          description: challengeData.description,
          starterCode: challengeData.starterCode,
          difficulty: challengeData.difficulty,
          hints: JSON.stringify(challengeData.hints),
          solution: challengeData.solution,
        }
      })
    }

    // Check if user completed today's challenge
    const completion = await prisma.dailyCompletion.findUnique({
      where: {
        userId_dailyChallengeId: {
          userId,
          dailyChallengeId: challenge.id,
        }
      }
    })

    // Calculate streak — count consecutive days the user completed a challenge
    const completions = await prisma.dailyCompletion.findMany({
      where: { userId },
      include: { dailyChallenge: { select: { date: true } } },
      orderBy: { completedAt: "desc" },
    })

    const uniqueDates = [...new Set(completions.map(c => c.dailyChallenge.date))].sort().reverse()
    let streak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)

    for (const dateStr of uniqueDates) {
      const d = new Date(dateStr)
      d.setHours(0, 0, 0, 0)
      const diff = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 0 || diff === 1) {
        streak++
        checkDate = d
      } else break
    }

    return NextResponse.json({
      challenge: {
        ...challenge,
        hints: JSON.parse(challenge.hints),
      },
      isCompleted: !!completion,
      streak,
    })
  } catch (error: any) {
    console.error("Challenge GET Error:", error)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

// POST — mark today's challenge as complete
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const userId = session.user.id

    const { challengeId } = await req.json()
    if (!challengeId) return NextResponse.json({ error: "Missing challengeId" }, { status: 400 })

    await prisma.dailyCompletion.upsert({
      where: { userId_dailyChallengeId: { userId, dailyChallengeId: challengeId } },
      update: {},
      create: { userId, dailyChallengeId: challengeId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}
