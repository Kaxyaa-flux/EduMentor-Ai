import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { groq, GROQ_MODEL } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    // Parse request body
    const { topic } = await req.json()
    if (!topic) {
      return NextResponse.json(
        { error: "Missing topic parameter" },
        { status: 400 }
      )
    }

    // 2. Check api_usage — limit to 50 quizGenerations per day
    const today = new Date().toISOString().split('T')[0]

    const apiUsage = await prisma.apiUsage.findUnique({
      where: {
        userId_usageDate: {
          userId,
          usageDate: today,
        },
      },
    })

    if (apiUsage && apiUsage.quizGenerations >= 50) {
      return NextResponse.json(
        { error: "Daily quiz generation limit reached (50 quizzes/day)" },
        { status: 429 }
      )
    }

    // 3. Get user preferences & mastery score to adapt difficulty
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    })
    const skillLevel = preferences?.skillLevel || "Beginner"

    const progress = await prisma.progress.findUnique({
      where: {
        userId_topic: {
          userId,
          topic,
        },
      },
    })
    const masteryScore = progress?.masteryScore ?? 0

    // Adaptive Difficulty logic
    let difficulty = "beginner"
    if (masteryScore > 40 && masteryScore <= 70) {
      difficulty = "intermediate"
    } else if (masteryScore > 70) {
      difficulty = "advanced"
    }

    // 4. Call Groq to generate 5 MCQ questions
    const quizPrompt = `Generate a Python quiz with exactly 5 multiple choice questions.
Topic: ${topic}
Difficulty: ${difficulty}
Student level: ${skillLevel}

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

Ensure "correct" is a 0-indexed integer corresponding to the index in "options".
Return ONLY the raw JSON object. Do not include markdown codeblocks or other formatting.`

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a specialized quiz generator that outputs only raw JSON.",
        },
        { role: "user", content: quizPrompt },
      ],
      temperature: 0.7,
    })

    const rawText = response.choices[0]?.message?.content || ""

    // Clean potential markdown tags from LLM response
    let cleaned = rawText.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
    }

    let quizData
    try {
      quizData = JSON.parse(cleaned)
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", rawText)
      return NextResponse.json(
        { error: "Failed to generate valid quiz structure. Please try again." },
        { status: 500 }
      )
    }

    // 5. Store quiz in quizzes table & increment usage count in a transaction
    const [quiz] = await prisma.$transaction([
      prisma.quiz.create({
        data: {
          userId,
          topic,
          difficulty,
          quizData: JSON.stringify(quizData),
        },
      }),
      prisma.apiUsage.upsert({
        where: {
          userId_usageDate: {
            userId,
            usageDate: today,
          },
        },
        update: {
          quizGenerations: { increment: 1 },
        },
        create: {
          userId,
          usageDate: today,
          quizGenerations: 1,
        },
      }),
      prisma.learningAnalytics.upsert({
        where: { userId },
        update: {
          totalQuizzes: { increment: 1 },
        },
        create: {
          userId,
          totalQuizzes: 1,
        },
      }),
    ])

    return NextResponse.json({
      quizId: quiz.id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questions: quizData.questions,
    })
  } catch (error: any) {
    console.error("API Quiz Generate Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
