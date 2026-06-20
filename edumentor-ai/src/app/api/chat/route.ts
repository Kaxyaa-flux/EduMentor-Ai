import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"

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
    const today = new Date().toISOString().split('T')[0]

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
    const { message, conversationId } = await req.json()
    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Missing message or conversationId" },
        { status: 400 }
      )
    }

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

    // 5. Build system prompt
    const systemPrompt = `You are EduMentor AI, a friendly and encouraging ${language} tutor.
Student skill level: ${skillLevel}
Learning goal: ${learningGoal}

Rules:
- Explain concepts clearly and simply
- Always use ${language} examples
- If the student is confused, try a different explanation approach
- Never give full homework answers — guide with hints
- Keep responses concise but complete
- End with a follow-up question to check understanding`

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

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("API Chat Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
