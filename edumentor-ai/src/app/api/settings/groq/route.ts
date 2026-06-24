import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Groq from "groq-sdk"

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { groqApiKey: true }
  })

  // Return masked key - never expose the full key
  const masked = user?.groqApiKey
    ? `gsk_${"*".repeat(20)}${user.groqApiKey.slice(-4)}`
    : null

  return NextResponse.json({ hasKey: !!user?.groqApiKey, maskedKey: masked })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { groqApiKey } = await req.json()

  if (!groqApiKey || !groqApiKey.startsWith("gsk_")) {
    return NextResponse.json({ error: "Invalid Groq API key format. Must start with gsk_" }, { status: 400 })
  }

  // Verify the key actually works before saving
  try {
    const testClient = new Groq({ apiKey: groqApiKey })
    await testClient.models.list()
  } catch {
    return NextResponse.json({ error: "Invalid key — Groq rejected it. Check and try again." }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { groqApiKey }
  })

  return NextResponse.json({ success: true, message: "Groq API key saved and verified." })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { groqApiKey: null }
  })

  return NextResponse.json({ success: true, message: "Groq API key removed." })
}
