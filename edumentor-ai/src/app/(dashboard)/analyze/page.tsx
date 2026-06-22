"use client"

import { useState } from "react"
import { Code2, Sparkles, Loader2, ChevronDown, ChevronRight, Lightbulb, BookOpen, Zap, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CURRICULUM_MAP } from "@/lib/curriculum"
import type { CodeAnalysis } from "@/types"

const LINE_TYPE_COLORS: Record<string, string> = {
  logic: "text-blue-400",
  syntax: "text-purple-400",
  comment: "text-slate-500",
  declaration: "text-emerald-400",
  control: "text-yellow-400",
  function: "text-pink-400",
  import: "text-cyan-400",
}

const LINE_TYPE_BG: Record<string, string> = {
  logic: "bg-blue-500/5 border-blue-500/20",
  syntax: "bg-purple-500/5 border-purple-500/20",
  comment: "bg-slate-500/5 border-slate-500/20",
  declaration: "bg-emerald-500/5 border-emerald-500/20",
  control: "bg-yellow-500/5 border-yellow-500/20",
  function: "bg-pink-500/5 border-pink-500/20",
  import: "bg-cyan-500/5 border-cyan-500/20",
}

const LANGUAGES = Object.keys(CURRICULUM_MAP)

export default function AnalyzePage() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("Python")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set())

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)
    setExpandedLines(new Set())

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Analysis failed"); return }
      setAnalysis(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleLine = (idx: number) => {
    setExpandedLines(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Code2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Code Analyzer</h1>
          <p className="text-sm text-muted-foreground">Paste any code — get a line-by-line breakdown that teaches you why it works</p>
        </div>
      </div>

      {/* Input Panel */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <CardTitle className="text-base text-foreground">Paste Your Code</CardTitle>
            {/* Language Selector */}
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    language === lang
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here...\n\n# Example:\ndef greet(name):\n    return f"Hello, {name}!"`}
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono resize-none"
          />
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <Button
            onClick={handleAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm cursor-pointer"
          >
            {isAnalyzing ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing Your Code...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Analyze Code</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-5 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">What This Code Does</p>
                <p className="text-sm text-foreground font-medium">{analysis.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Line-by-Line */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Line-by-Line Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Click any line to expand the explanation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.lines.map((line, idx) => {
                const isExpanded = expandedLines.has(idx)
                const colorClass = LINE_TYPE_COLORS[line.type] || "text-foreground"
                const bgClass = LINE_TYPE_BG[line.type] || "bg-accent/30 border-border"

                return (
                  <button
                    key={idx}
                    onClick={() => toggleLine(idx)}
                    className={`w-full text-left rounded-xl border p-3 transition-all cursor-pointer ${bgClass} ${isExpanded ? "shadow-sm" : "hover:opacity-90"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-muted-foreground/50 w-6 shrink-0 mt-0.5 select-none">
                        {line.lineNumber}
                      </span>
                      <code className={`text-xs font-mono flex-1 text-left ${colorClass} break-all`}>
                        {line.code}
                      </code>
                      <span className={`text-xs font-bold uppercase tracking-wider shrink-0 ${colorClass}`}>
                        {line.type}
                      </span>
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      }
                    </div>
                    {isExpanded && (
                      <div className="mt-3 ml-9 pl-3 border-l-2 border-current/20">
                        <p className="text-xs text-foreground/80 leading-relaxed">{line.explanation}</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Concepts Used */}
          {analysis.concepts.length > 0 && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Concepts Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.concepts.map((concept, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-accent border border-border text-xs font-semibold text-muted-foreground">
                      {concept}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {analysis.improvements.length > 0 && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  How to Improve This Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.improvements.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="text-yellow-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Overall Feedback */}
          <Card className="border-border bg-card">
            <CardContent className="py-5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Tutor Feedback</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{analysis.overallFeedback}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
