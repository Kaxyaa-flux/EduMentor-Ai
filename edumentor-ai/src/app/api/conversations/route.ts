import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    // If an ID is provided, return that specific conversation with its messages
    if (id) {
      const conversation = await prisma.conversation.findFirst({
        where: { id, userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      })
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
      return NextResponse.json(conversation)
    }

    // Otherwise, return all conversations for this user
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(conversations)
  } catch (error: any) {
    console.error("API Conversations GET Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const { title } = await req.json()

    // Create the conversation and update session count in analytics
    const [conversation] = await prisma.$transaction([
      prisma.conversation.create({
        data: {
          userId,
          title: title || "New Python Session",
        },
      }),
      prisma.learningAnalytics.upsert({
        where: { userId },
        update: {
          totalSessions: { increment: 1 },
        },
        create: {
          userId,
          totalSessions: 1,
        },
      }),
    ])

    return NextResponse.json(conversation)
  } catch (error: any) {
    console.error("API Conversations POST Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const { id, title } = await req.json()
    if (!id || !title) {
      return NextResponse.json({ error: "Missing id or title" }, { status: 400 })
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    })
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: { title },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("API Conversations PATCH Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing conversation id" }, { status: 400 })
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    })
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    await prisma.conversation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API Conversations DELETE Error:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
