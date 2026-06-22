import { CountUp } from "@/components/ui/CountUp"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { StaggerContainer } from "@/components/ui/StaggerContainer"
import { Users, Code, Trophy, Star } from "lucide-react"

export function StatisticsSection() {
  const stats = [
    { label: "Active Learners", value: 10000, suffix: "+", icon: Users },
    { label: "Lines of Code", value: 5000000, suffix: "+", icon: Code },
    { label: "Quizzes Completed", value: 250000, suffix: "+", icon: Trophy },
    { label: "Average Rating", value: 4.9, suffix: "/5", icon: Star },
  ]

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollReveal key={index} variant="slideUp" delay={index * 0.1}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/40 border border-border hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
