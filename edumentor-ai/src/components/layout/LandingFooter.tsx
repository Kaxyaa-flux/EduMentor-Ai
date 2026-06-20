import Link from "next/link"
import { Terminal, Globe, Mail, MessageSquare } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-[#1F2937] bg-[#0A0F1E] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                EduMentor<span className="text-[#10B981]">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Your intelligent companion for mastering any programming language. Built for the future of education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-[#10B981] transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#10B981] transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#10B981] transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/#how-it-works" className="hover:text-[#10B981] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[#10B981] transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-[#10B981] transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-[#10B981] transition-colors">Documentation</Link></li>
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-[#10B981] transition-colors">Community</Link></li>
              <li><Link href="mailto:support@edumentor.ai" className="hover:text-[#10B981] transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/privacy" className="hover:text-[#10B981] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#10B981] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#10B981] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1F2937] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EduMentor AI. Built for the AI in EdTech Hackathon.</p>
          <div className="flex gap-4">
            <span>Status: All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
