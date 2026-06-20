import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Terminal, ArrowRight } from "lucide-react"

export async function LandingHeader() {
  const session = await getServerSession(authOptions)

  return (
    <header className="border-b border-[#1F2937] bg-[#111827]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
            <Terminal className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            EduMentor<span className="text-[#10B981]">AI</span>
          </span>
        </Link>

        {/* Center Nav Links - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it works</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-medium transition-all duration-200 flex items-center gap-1 shadow-lg shadow-[#10B981]/10"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm text-slate-400 hover:text-white font-medium transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] text-sm font-medium transition-all duration-200 shadow-lg shadow-[#10B981]/10"
              >
                Start Learning Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
