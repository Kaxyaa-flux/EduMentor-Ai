import type { Metadata } from "next"
import "./globals.css"
import NextAuthProvider from "@/components/providers/NextAuthProvider"

export const metadata: Metadata = {
  title: "EduMentor AI - Personalized AI Python Tutor",
  description:
    "An adaptive, conversational AI Python tutor that customizes quizzes and teaching material to your mastery level.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0A0F1E] text-slate-100">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
