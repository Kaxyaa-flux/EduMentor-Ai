import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { StaggerContainer } from "@/components/ui/StaggerContainer"
import { CheckCircle2 } from "lucide-react"

export function LearningPathSection() {
  const steps = [
    { title: "Assess", description: "Take a quick initial quiz to establish your baseline mastery score." },
    { title: "Learn", description: "Chat with the AI tutor for personalized explanations and examples." },
    { title: "Practice", description: "Complete adaptive quizzes that scale in difficulty as you improve." },
    { title: "Master", description: "Review your analytics and target weak spots until you achieve 100%." }
  ]

  return (
    <section className="py-24 bg-[#0A0F1E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="slideUp" className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your Path to Mastery
          </h2>
          <p className="mt-4 text-slate-400">
            A scientifically proven, iterative learning loop designed to maximize retention.
          </p>
        </ScrollReveal>

        <StaggerContainer className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#10B981] via-[#6366F1] to-transparent hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <ScrollReveal key={index} variant="slideUp" delay={index * 0.15}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative group">
                  <div className="z-10 bg-[#0A0F1E] p-2 rounded-full hidden md:block">
                    <div className="h-12 w-12 rounded-full bg-[#111827] border-2 border-[#1F2937] group-hover:border-[#10B981] flex items-center justify-center transition-colors duration-300">
                      <span className="text-[#10B981] font-bold">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-[#111827]/60 border border-[#1F2937] p-6 rounded-2xl group-hover:border-[#10B981]/30 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] md:hidden" />
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}
