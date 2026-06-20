import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      preferences: true,
    }
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, avatarUrl } = body

  // Validate
  if (name && (name.trim().length < 2 || name.trim().length > 50)) {
    return NextResponse.json({ error: "Name must be 2-50 characters" }, { status: 400 })
  }

  // Validate base64 image size (roughly ~500KB = 680000 base64 chars)
  if (avatarUrl && avatarUrl.length > 700000) {
    return NextResponse.json({ error: "Image too large. Max 500KB." }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: { id: true, name: true, email: true, avatarUrl: true }
  })

  return NextResponse.json(updated)
}
