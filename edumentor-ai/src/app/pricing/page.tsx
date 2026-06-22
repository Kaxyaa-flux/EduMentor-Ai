import Link from "next/link"
import { Check } from "lucide-react"
import { LandingHeader } from "@/components/layout/LandingHeader"
import { LandingFooter } from "@/components/layout/LandingFooter"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />

      <main className="flex-1 pb-24">
        <div className="pt-20 pb-16 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade anytime to accelerate your progress with our advanced AI features.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Free Plan */}
          <div className="p-8 rounded-3xl border border-border bg-card/50 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Hobby</h3>
              <p className="text-muted-foreground">Perfect for trying out EduMentor AI and learning the basics.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Access to 1 programming language",
                "50 AI chat messages per day",
                "Basic adaptive quizzes",
                "Community support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="w-full py-4 rounded-xl border border-border bg-transparent hover:bg-accent text-foreground font-semibold text-center transition-all"
            >
              Get Started for Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
            <div className="absolute top-6 right-8">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground">For serious learners who want to master coding faster.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">$15</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Access to ALL programming languages",
                "Unlimited AI chat messages",
                "Advanced adaptive quizzes with explanations",
                "Priority email support",
                "Custom learning roadmaps",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="w-full py-4 rounded-xl bg-primary hover:bg-[#059669] text-primary-foreground font-bold text-center transition-all shadow-lg shadow-primary/15"
            >
              Upgrade to Pro
            </Link>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
