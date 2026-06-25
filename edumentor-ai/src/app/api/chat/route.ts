import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"
import { z } from "zod"

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message is too long. Maximum 2000 characters allowed."),
  conversationId: z.string().min(1, "Conversation ID is required")
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    // Fetch user's personal Groq key (if any)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { groqApiKey: true }
    })

    // Use user's personal key if they have one, otherwise fallback to server key
    const groqClient = new Groq({
      apiKey: user?.groqApiKey || process.env.GROQ_API_KEY!
    })

    // 2. Check api_usage — limit to 100 chatRequests per day
    const todayStr = new Date().toISOString().split('T')[0]
    const today = new Date(`${todayStr}T00:00:00.000Z`)

    const apiUsage = await prisma.apiUsage.findUnique({
      where: {
        userId_usageDate: {
          userId,
          usageDate: today,
        },
      },
    })

    if (apiUsage && apiUsage.chatRequests >= 100) {
      return NextResponse.json(
        { error: "Daily chat request limit reached (100 requests/day)" },
        { status: 429 }
      )
    }

    // Parse request body
    let reqBody
    try {
      reqBody = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parseResult = chatSchema.safeParse(reqBody)
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors[0].message }, { status: 400 })
    }
    const { message, conversationId } = parseResult.data

    // Verify conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    })
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      )
    }

    // 3. Get user preferences
    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    })
    const skillLevel = preferences?.skillLevel || "Beginner"
    const learningGoal = preferences?.learningGoal || "General programming"
    const language = preferences?.learningTopic || "Python"

    // 4. Get conversation history (last 15 messages only)
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 15,
    })

    // Fetch top recurring mistakes for context
    const topMistakes = await prisma.mistakePattern.findMany({
      where: { userId, language },
      orderBy: { occurrences: "desc" },
      take: 3,
    })

    const mistakesContext = topMistakes.length > 0
      ? `\n\nThis student's known recurring mistakes in ${language}:\n${topMistakes.map(m => `- ${m.concept}: ${m.description} (seen ${m.occurrences} times)`).join("\n")}\nIf relevant to the current topic, proactively address these patterns.`
      : ""

    // 5. Build system prompt
    const systemPrompt = `You are EduMentor AI, an expert and dedicated tutor strictly focused on teaching ${language}.
IMPORTANT: You are a ${language} tutor. Do not claim to be a tutor for any other language (e.g., do not say you are a Python tutor unless ${language} is Python).

Student skill level: ${skillLevel}
Student learning goal: ${learningGoal}

Rules:
- You must exclusively teach and provide examples in ${language}.
- Explain concepts clearly and simply.
- If the student is confused, try a different explanation approach.
- Never give full homework answers — guide with hints.
- Keep responses concise but complete.
- End with a follow-up question to check understanding.${mistakesContext}`

    const groqMessages: any[] = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ]

    // 6. Call Groq API using the appropriate client
    const response = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.7,
    })

    const reply = response.choices[0]?.message?.content || ""

    // 7. Save to database in a transaction
    await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          role: "user",
          content: message,
        },
      }),
      prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: reply,
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
          chatRequests: { increment: 1 },
        },
        create: {
          userId,
          usageDate: today,
          chatRequests: 1,
        },
      }),
      prisma.learningAnalytics.upsert({
        where: { userId },
        update: {
          totalMessages: { increment: 1 },
        },
        create: {
          userId,
          totalMessages: 1,
        },
      }),
    ])

    // Fire-and-forget mistake detection (don't await — keeps chat fast)
    fetch(`${process.env.NEXTAUTH_URL}/api/mistakes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: (req as any).headers?.get?.("cookie") || "" },
      body: JSON.stringify({ userMessage: message, aiResponse: reply, language }),
    }).catch(() => {})

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("API Chat Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
