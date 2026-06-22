import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"
import { GROQ_MODEL } from "@/lib/groq"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const userId = session.user.id

    const { code, language } = await req.json()
    if (!code || !language) return NextResponse.json({ error: "Missing code or language" }, { status: 400 })
    if (code.length > 5000) return NextResponse.json({ error: "Code too long. Max 5000 characters." }, { status: 400 })

    // Use user's personal Groq key if set
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { groqApiKey: true } })
    const groqClient = new Groq({ apiKey: user?.groqApiKey || process.env.GROQ_API_KEY! })

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

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("Analyze API Error:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}
