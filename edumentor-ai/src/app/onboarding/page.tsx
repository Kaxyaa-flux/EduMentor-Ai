"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Terminal, Award, BookOpen, Clock, ArrowRight, Check } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function OnboardingPage() {
  const router = useRouter()
  const savePreferences = useAppStore((state) => state.savePreferences)
  
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner")
  const [learningGoal, setLearningGoal] = useState("")
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState("30")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await savePreferences({
      skillLevel,
      learningGoal: learningGoal || "Learn Python fundamentals",
      dailyStudyMinutes: parseInt(dailyStudyMinutes) || 30,
    })

    if (success) {
      router.push("/dashboard")
    } else {
      alert("Failed to save preferences. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
            <Terminal className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            EduMentor<span className="text-[#10B981]">AI</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Welcome to EduMentor AI!
        </h2>
        <p className="mt-2 text-center text-slate-400">
          Let&apos;s personalize your Python learning experience.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-[#1F2937] bg-[#111827]">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#10B981]" />
                Personalize Your Path
              </CardTitle>
              <CardDescription className="text-slate-400">
                These settings will shape how your AI tutor explains concepts and decides quiz difficulties.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Skill Level Selection */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#10B981]" />
                  What is your current Python level?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Beginner",
                      desc: "New to programming, or never touched Python.",
                    },
                    {
                      name: "Intermediate",
                      desc: "Know basic loops, variables, and list syntax.",
                    },
                    {
                      name: "Advanced",
                      desc: "Comfortable with OOP, classes, and APIs.",
                    },
                  ].map((level) => {
                    const isSelected = skillLevel === level.name
                    return (
                      <button
                        key={level.name}
                        type="button"
                        onClick={() => setSkillLevel(level.name as any)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "border-[#10B981] bg-[#10B981]/5 text-white"
                            : "border-[#1F2937] bg-[#0A0F1E]/50 text-slate-400 hover:border-[#374151]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${isSelected ? "text-[#10B981]" : "text-slate-200"}`}>
                            {level.name}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-[#10B981]" />}
                        </div>
                        <span className="text-xs leading-relaxed block">{level.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Learning Goals */}
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-slate-300 text-sm font-semibold">
                  What is your main learning goal?
                </Label>
                <Input
                  id="goal"
                  type="text"
                  placeholder="e.g. Build web scrapers, pass my college exam, build machine learning models"
                  className="border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Study Time */}
              <div className="space-y-3">
                <Label htmlFor="studyTime" className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#10B981]" />
                  How much time do you want to dedicate daily?
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="studyTime"
                    type="number"
                    min="5"
                    max="180"
                    className="w-24 border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                    value={dailyStudyMinutes}
                    onChange={(e) => setDailyStudyMinutes(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <span className="text-slate-400 text-sm">minutes per day</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-bold py-6 text-base"
              >
                {isSubmitting ? (
                  "Saving Preferences..."
                ) : (
                  <span className="flex items-center gap-2">
                    Enter Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
