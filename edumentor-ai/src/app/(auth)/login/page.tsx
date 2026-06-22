"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { Terminal, Key, Mail, AlertTriangle, Loader2 } from "lucide-react"

import { ScrollReveal } from "@/components/ui/ScrollReveal"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = zod.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to home
      </Link>

      <ScrollReveal variant="slideUp" className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
            <Terminal className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            EduMentor<span className="text-[#10B981]">AI</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </ScrollReveal>

      <ScrollReveal variant="slideUp" delay={0.1} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader>
            <CardTitle className="text-white text-lg">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to resume your Python tutoring sessions.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-[#EF4444] rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-[#EF4444]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-[#EF4444]">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0A0F1E] font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#10B981] hover:underline"
                >
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </ScrollReveal>
    </div>
  )
}
