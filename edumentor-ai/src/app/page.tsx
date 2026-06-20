import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Terminal, Brain, BarChart3, Code2, ArrowRight } from "lucide-react"
import { TypewriterText } from "@/components/ui/TypewriterText"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1F2937] bg-[#111827]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Terminal className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              EduMentor<span className="text-[#10B981]">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-medium transition-all duration-200 flex items-center gap-1"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-medium transition-all duration-200"
                >
                  Start Learning Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B981]/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1F2937] bg-[#111827]/80 text-sm text-[#10B981] mb-6 animate-fade-in">
                <Code2 className="h-4 w-4" />
                <span>AI-Powered Multi-Language Learning</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                Your Personal AI <TypewriterText /> Tutor
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Learn programming at your own pace. Chat with a smart 24/7 AI tutor, take adaptive quizzes that adjust to your mastery score, and target your weak spots.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={session ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/15"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#1F2937] bg-[#111827]/50 hover:bg-[#111827] text-white font-semibold text-lg transition-all"
                >
                  Resume Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#111827]/40 border-y border-[#1F2937]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Personalized Learning, Redefined
              </h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                No templates, no fixed speeds. EduMentor AI adapts its teaching strategy and quizzes to your current mastery score.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#10B981]/30 hover:bg-[#111827] transition-all duration-300 group">
                <div className="p-3 bg-[#10B981]/10 rounded-xl text-[#10B981] w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Tutor Chat</h3>
                <p className="text-slate-400 leading-relaxed">
                  Interactive chat with a smart tutor. Ask questions, get simplified explanations, explore examples, and learn step-by-step without stress.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#10B981]/30 hover:bg-[#111827] transition-all duration-300 group">
                <div className="p-3 bg-[#6366F1]/10 rounded-xl text-[#6366F1] w-fit mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Adaptive Quizzes</h3>
                <p className="text-slate-400 leading-relaxed">
                  Multiple-choice quizzes generated dynamically. The difficulty automatically scales from beginner to advanced depending on your progress score.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#10B981]/30 hover:bg-[#111827] transition-all duration-300 group">
                <div className="p-3 bg-[#10B981]/10 rounded-xl text-[#10B981] w-fit mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Progress Tracking</h3>
                <p className="text-slate-400 leading-relaxed">
                  Advanced mastery analytics. Identify weak spots, view your topic-by-topic progress charts, and watch your coding confidence grow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] bg-[#0A0F1E] py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} EduMentor AI. Built for the AI in EdTech Hackathon.</p>
      </footer>
    </div>
  )
}
