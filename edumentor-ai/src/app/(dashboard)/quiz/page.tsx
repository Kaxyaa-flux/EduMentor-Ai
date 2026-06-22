"use client"

import { useEffect, useState } from "react"
import {
  Brain,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  HelpCircle,
  GraduationCap,
  Loader2,
  Calendar,
} from "lucide-react"

import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const AVAILABLE_TOPICS = [
  "Variables & Types",
  "Control Flow (Loops & Ifs)",
  "Lists & Tuples",
  "Functions & Scope",
  "Dictionaries & Sets",
]

export default function QuizPage() {
  const {
    activeQuiz,
    quizResults,
    isLoadingQuiz,
    isSubmittingQuiz,
    progressData,
    generateQuiz,
    submitQuiz,
    resetQuizState,
    fetchProgress,
  } = useAppStore()

  const [selectedTopic, setSelectedTopic] = useState("")
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Fetch progress on load to get mastery scores
  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  // Get topic-specific mastery score
  const getTopicProgress = (topicName: string) => {
    if (!progressData?.progress) return null
    return progressData.progress.find((p) => p.topic === topicName)
  }

  // Get difficulty level depending on mastery score
  const getExpectedDifficulty = (score: number) => {
    if (score <= 40) return "Beginner"
    if (score <= 70) return "Intermediate"
    return "Advanced"
  }

  const handleStartQuiz = () => {
    if (!selectedTopic) return
    generateQuiz(selectedTopic)
    setCurrentQuestionIdx(0)
    setAnswers([])
    setSelectedOption(null)
  }

  const handleSelectOption = (index: number) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    if (selectedOption === null) return
    
    // Save selected answer
    const newAnswers = [...answers]
    newAnswers[currentQuestionIdx] = selectedOption
    setAnswers(newAnswers)

    if (currentQuestionIdx < (activeQuiz?.questions.length || 5) - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setSelectedOption(answers[currentQuestionIdx + 1] !== undefined ? answers[currentQuestionIdx + 1] : null)
    }
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    // Save final answer
    const newAnswers = [...answers]
    newAnswers[currentQuestionIdx] = selectedOption
    setAnswers(newAnswers)

    submitQuiz(newAnswers)
  }

  const handleCloseResults = () => {
    resetQuizState()
    fetchProgress() // Reload progress stats
    setSelectedTopic("")
  }

  // 1. SELECT TOPIC VIEW
  if (!activeQuiz && !quizResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Brain className="h-10 w-10 text-primary mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Personalized Practice Quizzes
          </h2>
          <p className="text-muted-foreground text-sm">
            Our adaptive algorithm scales the difficulty dynamically. As your mastery score increases, the quiz questions will adapt to challenge you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic Select List */}
          <Card className="border-border bg-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Select Python Topic</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Select a topic to start your personalized assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AVAILABLE_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic
                const prog = getTopicProgress(topic)
                const mastery = prog ? Math.round(prog.masteryScore) : 0
                const difficulty = getExpectedDifficulty(mastery)

                return (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background/50 hover:border-[#374151]"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-slate-200"}`}>
                        {topic}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Adaptive Mode: <span className="text-muted-foreground font-medium">{difficulty}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-6 self-start sm:self-center">
                      <div className="text-right space-y-1">
                        <span className="text-xs text-muted-foreground">Mastery Score</span>
                        <p className="text-sm font-bold text-foreground">{mastery}%</p>
                      </div>
                      <div className="w-24 bg-accent h-2 rounded-full overflow-hidden shrink-0">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStartQuiz}
                disabled={!selectedTopic || isLoadingQuiz}
                className="w-full bg-primary hover:bg-[#059669] text-primary-foreground font-bold py-6"
              >
                {isLoadingQuiz ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Adaptive Quiz...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Quiz
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // 2. ACTIVE QUIZ RUNNING VIEW
  if (activeQuiz && !quizResults) {
    const questions = activeQuiz.questions || []
    const currentQuestion = questions[currentQuestionIdx]
    const totalQ = questions.length
    const progressVal = ((currentQuestionIdx + 1) / totalQ) * 100

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Topic: <span className="text-primary font-semibold">{activeQuiz.topic}</span></span>
            <span>Question {currentQuestionIdx + 1} of {totalQ}</span>
          </div>
          <Progress value={progressVal} className="h-1.5 bg-accent [&>div]:bg-primary" />
        </div>

        {/* Question Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary w-fit mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Difficulty: {activeQuiz.difficulty}</span>
            </div>
            <CardTitle className="text-foreground text-base leading-relaxed">
              {currentQuestion?.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion?.options.map((option, idx) => {
              const isSelected = selectedOption === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background/50 text-muted-foreground hover:border-[#374151]"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-primary text-primary font-bold"
                        : "border-[#374151] text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </button>
              )
            })}
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Select an option to proceed
            </span>
            {currentQuestionIdx < totalQ - 1 ? (
              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className="bg-primary hover:bg-[#059669] text-primary-foreground font-semibold"
              >
                Next Question
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null || isSubmittingQuiz}
                className="bg-primary hover:bg-[#059669] text-primary-foreground font-bold px-6"
              >
                {isSubmittingQuiz ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Answers"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 3. QUIZ RESULTS / FEEDBACK VIEW
  if (quizResults) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Results Banner */}
        <Card className="border-border bg-card overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          <CardContent className="py-8 text-center space-y-4">
            <Award className="h-12 w-12 text-primary mx-auto" />
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                Assessment Completed
              </span>
              <h3 className="text-3xl font-extrabold text-foreground">
                Score: <span className="text-primary">{quizResults.score} / {quizResults.totalQuestions}</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                You achieved a score of <span className="text-foreground font-semibold">{quizResults.percentage}%</span> on this topic.
              </p>
            </div>
            <Button
              onClick={handleCloseResults}
              className="bg-primary hover:bg-[#059669] text-primary-foreground font-semibold"
            >
              Back to Topic List
            </Button>
          </CardContent>
        </Card>

        {/* Detailed Review */}
        <div className="space-y-4">
          <h4 className="text-foreground font-bold text-base">Question Review</h4>
          {quizResults.results.map((result, idx) => (
            <Card key={result.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs text-muted-foreground font-semibold uppercase">
                    Question {idx + 1}
                  </span>
                  {result.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-destructive text-xs font-semibold bg-destructive/10 px-2 py-0.5 rounded-full">
                      <XCircle className="h-3.5 w-3.5" />
                      Incorrect
                    </span>
                  )}
                </div>
                <CardTitle className="text-foreground text-sm font-semibold leading-relaxed mt-2">
                  {result.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Options Review */}
                <div className="space-y-2">
                  {result.options.map((option, oIdx) => {
                    const isCorrectOption = oIdx === result.correct
                    const isSelectedOption = oIdx === result.selected
                    let optionStyle = "border-border bg-background/30 text-muted-foreground"
                    
                    if (isCorrectOption) {
                      optionStyle = "border-primary/50 bg-primary/5 text-foreground"
                    } else if (isSelectedOption && !result.isCorrect) {
                      optionStyle = "border-red-500/50 bg-red-500/5 text-foreground"
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center gap-3 ${optionStyle}`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            isCorrectOption
                              ? "border-primary text-primary"
                              : isSelectedOption
                              ? "border-red-500 text-red-500"
                              : "border-[#374151] text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span>{option}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-4 p-4 rounded-xl bg-background/50 border border-border space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Tutor Explanation
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return null
}
