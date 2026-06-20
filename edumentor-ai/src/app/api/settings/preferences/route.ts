import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { skillLevel, learningGoal, dailyStudyMinutes } = body

  const validLevels = ["Beginner", "Intermediate", "Advanced"]
  if (skillLevel && !validLevels.includes(skillLevel)) {
    return NextResponse.json({ error: "Invalid skill level" }, { status: 400 })
  }

  const updated = await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: {
      ...(skillLevel && { skillLevel }),
      ...(learningGoal !== undefined && { learningGoal }),
      ...(dailyStudyMinutes !== undefined && { dailyStudyMinutes: Number(dailyStudyMinutes) }),
    },
    create: {
      userId: session.user.id,
      skillLevel: skillLevel || "Beginner",
      learningGoal,
      dailyStudyMinutes: dailyStudyMinutes ? Number(dailyStudyMinutes) : null,
    }
  })

  return NextResponse.json(updated)
}
