import { LandingHeader } from "@/components/layout/LandingHeader"
import { LandingFooter } from "@/components/layout/LandingFooter"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />

      <main className="flex-1 pb-24 pt-16">
        <ScrollReveal variant="slideUp" className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: 22 Jun 2026</p>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using EduMentor AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p>
                EduMentor AI provides an AI-powered personalized programming tutoring platform. The service includes chat interfaces, dynamic quizzes, and progress tracking tools. We reserve the right to modify or discontinue the service at any time without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. User Conduct</h2>
              <p>
                You agree not to use the service to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Violate any local, state, national, or international law.</li>
                <li>Attempt to bypass any security measures of the platform.</li>
                <li>Share or distribute AI-generated content that is harmful or violates our community guidelines.</li>
                <li>Exceed acceptable rate limits for AI generations.</li>
              </ul>
            </section>
          </div>
        </ScrollReveal>
      </main>

      <LandingFooter />
    </div>
  )
}
