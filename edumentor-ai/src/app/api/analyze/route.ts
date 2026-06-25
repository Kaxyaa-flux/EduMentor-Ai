import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"
import { z } from "zod"

const analyzeSchema = z.object({
  code: z.string().min(1, "Code is required").max(5000, "Code is too long. Maximum 5000 characters allowed."),
  language: z.string().min(1, "Language is required").max(50, "Language string too long."),
})

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const userId = session.user.id

    let reqBody
    try {
      reqBody = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parseResult = analyzeSchema.safeParse(reqBody)
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors[0].message }, { status: 400 })
    }
    const { code, language } = parseResult.data

    const todayStr = new Date().toISOString().split('T')[0]
    const today = new Date(`${todayStr}T00:00:00.000Z`)

    const apiUsage = await prisma.apiUsage.findUnique({
      where: {
        userId_usageDate: { userId, usageDate: today },
      },
    })

    if (apiUsage && apiUsage.analyzeRequests >= 50) {
      return NextResponse.json(
        { error: "Daily code analysis limit reached (50 requests/day)" },
        { status: 429 }
      )
    }

    // Use user's personal Groq key if set
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { groqApiKey: true } })
    const apiKey = user?.groqApiKey || process.env.GROQ_API_KEY || 'build-placeholder'
    const groqClient = new Groq({ apiKey })

    const prompt = `You are an expert ${language} code analyzer and teacher.
Analyze this ${language} code and explain it in a way that helps students learn.

CODE:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "language": "${language}",
  "summary": "One sentence describing what this code does overall",
  "lines": [
    {
      "lineNumber": 1,
      "code": "exact line of code",
      "explanation": "clear explanation of what this line does and why",
      "type": "one of: logic | syntax | comment | declaration | control | function | import"
    }
  ],
  "improvements": [
    "specific improvement suggestion 1",
    "specific improvement suggestion 2"
  ],
  "concepts": ["concept1", "concept2"],
  "overallFeedback": "Encouraging 2-3 sentence feedback on the code quality and learning points"
}

Only include non-empty lines in the lines array. Skip blank lines.`

    const response = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a code analysis tool. Return only raw JSON, no markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    })

    let rawText = response.choices[0]?.message?.content || ""
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim()

    let analysis
    try {
      analysis = JSON.parse(rawText)
    } catch {
      return NextResponse.json({ error: "Failed to parse analysis. Please try again." }, { status: 500 })
    }

    await prisma.apiUsage.upsert({
      where: {
        userId_usageDate: { userId, usageDate: today },
      },
      update: { analyzeRequests: { increment: 1 } },
      create: { userId, usageDate: today, analyzeRequests: 1 },
    })

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("Analyze API Error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}
