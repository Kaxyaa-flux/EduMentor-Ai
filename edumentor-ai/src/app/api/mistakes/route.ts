import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"
import { z } from "zod"

const mistakeSchema = z.object({
  userMessage: z.string().min(1).max(5000),
  aiResponse: z.string().min(1).max(5000),
  language: z.string().min(1).max(50),
})

export const dynamic = 'force-dynamic'

// GET — fetch user's mistake patterns
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const patterns = await prisma.mistakePattern.findMany({
      where: { userId: session.user.id },
      orderBy: [{ occurrences: "desc" }, { lastSeen: "desc" }],
      take: 10,
    })

    return NextResponse.json(patterns)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

// POST — detect and log mistakes from a conversation message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ ok: true })
    const userId = session.user.id

    let reqBody
    try {
      reqBody = await req.json()
    } catch {
      return NextResponse.json({ ok: true })
    }

    const parseResult = mistakeSchema.safeParse(reqBody)
    if (!parseResult.success) {
      return NextResponse.json({ ok: true })
    }
    const { userMessage, aiResponse, language } = parseResult.data

    // Use user's personal Groq key if set
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { groqApiKey: true } })
    const groqClient = new Groq({ apiKey: user?.groqApiKey || process.env.GROQ_API_KEY! })

    // Ask AI to detect if there's a mistake pattern in this exchange
    const detectionPrompt = `Analyze this student-tutor exchange and detect if the student made a conceptual mistake.

Student message: "${userMessage}"
Tutor response: "${aiResponse}"
Language: ${language}

If the student made a conceptual mistake or showed confusion about a concept, return JSON:
{
  "hasMistake": true,
  "concept": "short concept name (e.g. 'Array indexing', 'Variable scope', 'Pointer arithmetic')",
  "description": "one sentence describing the specific mistake pattern"
}

If no clear mistake, return:
{ "hasMistake": false }

Return ONLY raw JSON. No markdown.`

    const response = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: detectionPrompt }],
      temperature: 0.2,
    })

    let rawText = response.choices[0]?.message?.content || ""
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim()

    let result
    try { result = JSON.parse(rawText) } catch { return NextResponse.json({ ok: true }) }

    if (!result.hasMistake) return NextResponse.json({ ok: true })

    // Upsert mistake pattern — increment occurrences if it already exists
    await prisma.mistakePattern.upsert({
      where: {
        userId_language_concept: {
          userId,
          language,
          concept: result.concept,
        }
      },
      update: {
        occurrences: { increment: 1 },
        lastSeen: new Date(),
        description: result.description,
      },
      create: {
        userId,
        language,
        concept: result.concept,
        description: result.description,
        occurrences: 1,
      }
    })

    return NextResponse.json({ ok: true, detected: result.concept })
  } catch {
    return NextResponse.json({ ok: true }) // Never fail silently for this background task
  }
}
