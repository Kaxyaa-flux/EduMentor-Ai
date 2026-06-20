import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const { skillLevel, learningTopic, learningGoal, dailyStudyMinutes } = await req.json()

    if (!skillLevel) {
      return NextResponse.json({ error: "Skill level is required" }, { status: 400 })
    }

    // Upsert user preferences
    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        skillLevel,
        ...(learningTopic && { learningTopic }),
        learningGoal: learningGoal || null,
        dailyStudyMinutes: dailyStudyMinutes ? parseInt(dailyStudyMinutes) : null,
      },
      create: {
        userId,
        skillLevel,
        learningTopic: learningTopic || "Python",
        learningGoal: learningGoal || null,
        dailyStudyMinutes: dailyStudyMinutes ? parseInt(dailyStudyMinutes) : null,
      },
    })

    return NextResponse.json(preferences)
  } catch (error: any) {
    console.error("Onboarding API Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
    })

    return NextResponse.json(preferences)
  } catch (error: any) {
    console.error("GET Onboarding API Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
