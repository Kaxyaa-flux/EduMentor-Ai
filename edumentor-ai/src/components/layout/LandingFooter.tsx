import Link from "next/link"
import { Terminal, Globe, Mail, MessageSquare } from "lucide-react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { StaggerContainer } from "@/components/ui/StaggerContainer"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <ScrollReveal variant="slideUp" className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                EduMentor<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Your intelligent companion for mastering any programming language. Built for the future of education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </ScrollReveal>

          {/* Links Columns */}
          <ScrollReveal variant="slideUp" delay={0.1}>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </ScrollReveal>

          <ScrollReveal variant="slideUp" delay={0.2}>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </ScrollReveal>

          <ScrollReveal variant="slideUp" delay={0.3}>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </ScrollReveal>
        </StaggerContainer>

        <ScrollReveal variant="slideUp" delay={0.4}>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EduMentor AI. Built for the AI in EdTech Hackathon.</p>
            <div className="flex gap-4">
              <span>Status: All systems operational</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
