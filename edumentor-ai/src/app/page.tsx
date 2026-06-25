import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Terminal, Brain, BarChart3, Code2, ArrowRight } from "lucide-react"
import { TypewriterText } from "@/components/ui/TypewriterText"
import { LandingHeader } from "@/components/layout/LandingHeader"
import { LandingFooter } from "@/components/layout/LandingFooter"
import { NeuralBackground } from "@/components/ui/NeuralBackground"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { AnimatedHeroContent } from "@/components/ui/AnimatedHeroContent"
import { StatisticsSection } from "@/components/layout/StatisticsSection"
import { AIFeaturesSection } from "@/components/layout/AIFeaturesSection"
import { LearningPathSection } from "@/components/layout/LearningPathSection"
import { AnalyticsSection } from "@/components/layout/AnalyticsSection"
import { TestimonialsSection } from "@/components/layout/TestimonialsSection"
import { StaggerContainer } from "@/components/ui/StaggerContainer"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <NeuralBackground />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedHeroContent hasSession={!!session} />
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-20 bg-card/40 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="slideUp" className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Personalized Learning, Redefined
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                No templates, no fixed speeds. EduMentor AI adapts its teaching strategy and quizzes to your current mastery score.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <ScrollReveal variant="card" delay={0.1}>
                <div className="p-8 rounded-2xl border border-border bg-card/60 hover:border-primary/30 hover:bg-card transition-all duration-300 group shadow-lg hover:shadow-primary/5 h-full">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">AI Tutor Chat</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Interactive chat with a smart tutor. Ask questions, get simplified explanations, explore examples, and learn step-by-step without stress.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 2 */}
              <ScrollReveal variant="card" delay={0.2}>
                <div className="p-8 rounded-2xl border border-border bg-card/60 hover:border-primary/30 hover:bg-card transition-all duration-300 group shadow-lg hover:shadow-secondary/5 h-full">
                  <div className="p-3 bg-secondary/10 rounded-xl text-secondary w-fit mb-6 group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Adaptive Quizzes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Multiple-choice quizzes generated dynamically. The difficulty automatically scales from beginner to advanced depending on your progress score.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 3 */}
              <ScrollReveal variant="card" delay={0.3}>
                <div className="p-8 rounded-2xl border border-border bg-card/60 hover:border-primary/30 hover:bg-card transition-all duration-300 group shadow-lg hover:shadow-primary/5 h-full">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Progress Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Advanced mastery analytics. Identify weak spots, view your topic-by-topic progress charts, and watch your coding confidence grow.
                  </p>
                </div>
              </ScrollReveal>
            </StaggerContainer>
          </div>
        </section>

        <StatisticsSection />
        <LearningPathSection />
        <AIFeaturesSection />
        <AnalyticsSection />
        <TestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  )
}
