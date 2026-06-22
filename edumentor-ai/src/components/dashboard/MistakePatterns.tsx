"use client"

import { useState, useEffect } from "react"
import { Brain, AlertTriangle, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { MistakePattern } from "@/types"

export default function MistakePatterns({ language }: { language: string }) {
  const [patterns, setPatterns] = useState<MistakePattern[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/mistakes")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPatterns(data.filter(p => p.language === language))
        }
      })
      .finally(() => setIsLoading(false))
  }, [language])

  if (isLoading) return (
    <Card className="border-border bg-card">
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      </CardContent>
    </Card>
  )

  if (patterns.length === 0) return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base text-foreground flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Mistake Memory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4 space-y-2">
          <TrendingUp className="h-8 w-8 text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">No recurring mistakes detected yet.</p>
          <p className="text-xs text-muted-foreground/60">Keep learning — your AI tutor will track patterns as you go.</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="text-base text-foreground flex items-center gap-2">
          <Brain className="h-4 w-4 text-orange-400" />
          Your Recurring Mistake Patterns
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Detected by your AI tutor across all sessions — focus here to level up fast
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.slice(0, 5).map((p) => (
          <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground truncate">{p.concept}</p>
                <span className="text-xs text-orange-400 font-bold shrink-0">×{p.occurrences}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
