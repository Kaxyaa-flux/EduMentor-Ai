import type { Metadata } from "next"
import "./globals.css"
import NextAuthProvider from "@/components/providers/NextAuthProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

export const metadata: Metadata = {
  title: "EduMentor AI - Personalized AI Tutor",
  description:
    "An adaptive, conversational AI tutor that customizes quizzes and teaching material to your mastery level.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
