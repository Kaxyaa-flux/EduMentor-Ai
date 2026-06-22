import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Sidebar from "@/components/layout/Sidebar"
import TopNav from "@/components/layout/TopNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }

  const preferences = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  })

  if (!preferences) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 min-h-screen">
        <TopNav />
        <main className="flex-grow p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
