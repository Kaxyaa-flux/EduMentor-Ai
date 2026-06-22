import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { StaggerContainer } from "@/components/ui/StaggerContainer"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "EduMentor AI completely changed how I learn Python. The adaptive quizzes know exactly where my weak spots are.",
      author: "Sarah J.",
      role: "Software Engineering Student"
    },
    {
      quote: "The 24/7 AI tutor feels like having a senior developer pair programming with me. Incredibly helpful and patient.",
      author: "Michael T.",
      role: "Self-Taught Developer"
    },
    {
      quote: "I love the clean interface and the seamless progression. The mastery scores keep me motivated to learn more every day.",
      author: "Elena R.",
      role: "Data Science Bootcamp Grad"
    }
  ]

  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="slideUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by Learners
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are learning faster and smarter with EduMentor AI.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} variant="card">
              <div className="h-full p-8 rounded-2xl border border-border bg-card/60 hover:border-secondary/30 transition-all duration-300 relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-[#1F2937] opacity-50" />
                <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-foreground font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold text-sm">{testimonial.author}</h4>
                    <span className="text-muted-foreground text-xs">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
