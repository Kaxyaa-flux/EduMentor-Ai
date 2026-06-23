import type { Metadata } from "next"
import "./globals.css"
import NextAuthProvider from "@/components/providers/NextAuthProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { NeuralNetworkBackground } from "@/components/ui/NeuralNetworkBackground"

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
          <NextAuthProvider>
            <div className="fixed inset-0 z-[-1] pointer-events-none">
              <NeuralNetworkBackground />
            </div>
            {children}
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
