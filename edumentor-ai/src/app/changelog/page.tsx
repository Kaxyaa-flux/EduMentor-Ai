import { LandingHeader } from "@/components/layout/LandingHeader"
import { LandingFooter } from "@/components/layout/LandingFooter"
import { Sparkles, Zap, ShieldCheck } from "lucide-react"

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col">
      <LandingHeader />

      <main className="flex-1 pb-24 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Changelog</h1>
          <p className="text-slate-400 mb-16 text-lg">
            New updates and improvements to EduMentor AI.
          </p>
          
          <div className="space-y-16">
            
            {/* Version 1.1.0 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-[#1F2937] ml-[120px]" />
              <div className="md:grid md:grid-cols-[120px_1fr] md:gap-8 relative">
                <div className="mb-4 md:mb-0 text-slate-400 font-medium md:text-right md:pr-8 md:pt-1">
                  Today
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[37px] md:-left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#10B981] ring-4 ring-[#0A0F1E]" />
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    Multi-Language Support <Sparkles className="h-5 w-5 text-[#10B981]" />
                  </h2>
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><Zap className="h-3 w-3" /></div>
                        <span>Added support for Python, JavaScript, Java, C, C++, and HTML/CSS.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><Zap className="h-3 w-3" /></div>
                        <span>Interactive typewriter animation on the landing page hero section.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><ShieldCheck className="h-3 w-3" /></div>
                        <span>Improved API key handling and rate limiting logic.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Version 1.0.0 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-[#1F2937] ml-[120px]" />
              <div className="md:grid md:grid-cols-[120px_1fr] md:gap-8 relative">
                <div className="mb-4 md:mb-0 text-slate-400 font-medium md:text-right md:pr-8 md:pt-1">
                  Last Week
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[37px] md:-left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#1F2937] ring-4 ring-[#0A0F1E]" />
                  <h2 className="text-xl font-bold text-white mb-4">Initial Release 🚀</h2>
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><Zap className="h-3 w-3" /></div>
                        <span>Launched core AI chat tutoring interface.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><Zap className="h-3 w-3" /></div>
                        <span>Added dynamic adaptive quizzes based on mastery scores.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 bg-[#10B981]/10 text-[#10B981] rounded mt-0.5"><Zap className="h-3 w-3" /></div>
                        <span>Dashboard analytics and progress tracking built.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
