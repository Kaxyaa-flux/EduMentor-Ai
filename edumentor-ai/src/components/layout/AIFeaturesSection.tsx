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
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal variant="slideUp">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powered by Advanced AI
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="slideUp" delay={0.1}>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We leverage cutting-edge language models to provide an educational experience that feels magical.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollReveal key={index} variant="card">
                <div className="p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:bg-card transition-all duration-300 h-full group shadow-lg hover:shadow-primary/5">
                  <div className="p-3 bg-accent rounded-xl text-foreground w-fit mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
