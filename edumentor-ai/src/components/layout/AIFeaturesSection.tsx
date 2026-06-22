import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { StaggerContainer } from "@/components/ui/StaggerContainer"
import { Sparkles, MessageSquareCode, ShieldAlert, Cpu } from "lucide-react"

export function AIFeaturesSection() {
  const features = [
    {
      title: "Context-Aware Responses",
      description: "The AI remembers your past mistakes and adjusts its explanations accordingly.",
      icon: MessageSquareCode
    },
    {
      title: "Real-Time Code Analysis",
      description: "Submit your code snippets, and the tutor will pinpoint errors and suggest optimizations.",
      icon: Cpu
    },
    {
      title: "Dynamic Difficulty Adjustment",
      description: "Quiz questions are generated on the fly, matching your exact mastery level to keep you in the flow state.",
      icon: Sparkles
    },
    {
      title: "Gentle Error Correction",
      description: "Instead of just giving the answer, the AI guides you to find the solution yourself.",
      icon: ShieldAlert
    }
  ]

  return (
    <section className="py-24 bg-[#111827]/30 border-y border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal variant="slideUp">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Powered by Advanced AI
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="slideUp" delay={0.1}>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              We leverage cutting-edge language models to provide an educational experience that feels magical.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollReveal key={index} variant="card">
                <div className="p-6 rounded-2xl bg-[#0A0F1E] border border-[#1F2937] hover:border-[#10B981]/30 hover:bg-[#111827] transition-all duration-300 h-full group shadow-lg hover:shadow-[#10B981]/5">
                  <div className="p-3 bg-[#1F2937] rounded-xl text-white w-fit mb-6 group-hover:bg-[#10B981]/10 group-hover:text-[#10B981] transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#10B981] transition-colors">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
