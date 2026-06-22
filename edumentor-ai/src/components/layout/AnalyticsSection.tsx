import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { BarChart3, TrendingUp, Target } from "lucide-react"

export function AnalyticsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2 space-y-8">
            <ScrollReveal variant="slideUp">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                See Your Growth in Real-Time
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Our comprehensive dashboard translates your interactions and quiz results into actionable insights. Watch your mastery bars fill up as you conquer new concepts.
              </p>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal variant="slideUp" delay={0.1}>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-1">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold mb-1">Target Weak Spots</h4>
                    <p className="text-sm text-muted-foreground">The system automatically flags topics where you score below 60%.</p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal variant="slideUp" delay={0.2}>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold mb-1">Track Progress Over Time</h4>
                    <p className="text-sm text-muted-foreground">Visualize your learning velocity and stay motivated.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <ScrollReveal variant="image">
              <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Decorative UI elements mimicking the dashboard */}
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Mastery Overview</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { topic: "Variables", score: 95 },
                    { topic: "Functions", score: 82 },
                    { topic: "Loops", score: 65 },
                    { topic: "Classes", score: 40 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground w-24">{item.topic}</span>
                      <div className="flex-1 mx-4 bg-accent h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{item.score}%</span>
                    </div>
                  ))}
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/10 blur-3xl rounded-full pointer-events-none" />
              </div>
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  )
}
