"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { Terminal, Key, Mail, User, AlertTriangle, Loader2 } from "lucide-react"

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

const registerSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = zod.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Something went wrong during registration")
        setIsLoading(false)
        return
      }

      // Auto sign in user after successful registration
      const signinResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signinResult?.error) {
        setError("Account created but auto-login failed. Please log in manually.")
        setIsLoading(false)
      } else {
        router.push("/onboarding")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border-[#1F2937] bg-[#111827]">
          <CardHeader>
            <CardTitle className="text-white text-lg">Join EduMentor AI</CardTitle>
            <CardDescription className="text-slate-400">
              Start learning Python with a customized AI tutor today.
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
                <Label htmlFor="name" className="text-slate-300">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 border-[#1F2937] bg-[#0A0F1E] text-white focus-visible:ring-[#10B981]"
                    {...register("name")}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-[#EF4444]">{errors.name.message}</p>
                )}
              </div>

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
                    Registering account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#10B981] hover:underline"
                >
                  Sign in instead
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
