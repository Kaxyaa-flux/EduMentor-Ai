"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Flame, Trophy, ChevronDown, ChevronUp, CheckCircle, Loader2, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CURRICULUM_MAP } from "@/lib/curriculum"
import type { DailyStatus } from "@/types"

const LANGUAGES = Object.keys(CURRICULUM_MAP)

export default function ChallengePage() {
  const { data: session } = useSession()
  const [language, setLanguage] = useState("Python")
  const [status, setStatus] = useState<DailyStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [userCode, setUserCode] = useState("")

  useEffect(() => {
    if (session) loadChallenge(language)
  }, [language, session])

  async function loadChallenge(lang: string) {
    setIsLoading(true)
    setHintsRevealed(0)
    setShowSolution(false)
    setUserCode("")
    try {
      const res = await fetch(`/api/challenge?language=${encodeURIComponent(lang)}`)
      const data = await res.json()
      if (res.ok) setStatus(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleComplete() {
    if (!status?.challenge || status.isCompleted) return
    setIsCompleting(true)
    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: status.challenge.id }),
      })
      if (res.ok) {
        setStatus(prev => prev ? { ...prev, isCompleted: true, streak: prev.streak + 1 } : prev)
      }
    } finally {
      setIsCompleting(false)
    }
  }

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Generating today&apos;s challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Challenge</h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="text-lg font-bold text-orange-400">{status?.streak || 0}</span>
          <span className="text-xs text-muted-foreground">day streak</span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex gap-2 flex-wrap">
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              language === lang
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {status?.challenge && (
        <>
          {/* Completed Banner */}
          {status.isCompleted && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary/10 border border-primary/20">
              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-primary">Challenge Complete!</p>
                <p className="text-xs text-muted-foreground">You&apos;ve finished today&apos;s {language} challenge. Come back tomorrow for a new one.</p>
              </div>
            </div>
          )}

          {/* Challenge Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider mb-3">
                    <Trophy className="h-3 w-3" />
                    {status.challenge.difficulty} · {language}
                  </div>
                  <CardTitle className="text-lg text-foreground">{status.challenge.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm text-foreground/70 leading-relaxed mt-2">
                {status.challenge.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Starter Code */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Starter Code</p>
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-card">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">{language}</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
                    <code>{status.challenge.starterCode}</code>
                  </pre>
                </div>
              </div>

              {/* Your Solution */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Your Solution</p>
                <textarea
                  value={userCode}
                  onChange={e => setUserCode(e.target.value)}
                  disabled={status.isCompleted}
                  placeholder="Write your solution here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono resize-none disabled:opacity-50"
                />
              </div>

              {/* Hints */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Hints ({hintsRevealed}/{status.challenge.hints.length} revealed)
                </p>
                {status.challenge.hints.map((hint, i) => (
                  <div key={i}>
                    {i < hintsRevealed ? (
                      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-accent/50 border border-border text-sm text-foreground/80">
                        <span className="text-primary font-bold shrink-0">Hint {i + 1}:</span>
                        <span>{hint}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setHintsRevealed(i + 1)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all text-sm cursor-pointer"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Reveal Hint {i + 1}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Mark Complete Button */}
              {!status.isCompleted && (
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting || !userCode.trim()}
                  className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer"
                >
                  {isCompleting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Marking complete...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete</>
                  )}
                </Button>
              )}

              {/* Solution reveal (only after completing) */}
              {status.isCompleted && (
                <div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:border-primary/30 text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    <span className="font-semibold">View Official Solution</span>
                    {showSolution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showSolution && (
                    <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
                      <div className="px-4 py-2 border-b border-primary/20 bg-card">
                        <span className="text-[10px] font-semibold text-primary uppercase">Official Solution</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
                        <code>{status.challenge.solution}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
