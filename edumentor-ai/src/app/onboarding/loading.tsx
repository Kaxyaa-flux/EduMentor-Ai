import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0A0F1E]">
      <LoadingSpinner text="Loading onboarding..." />
    </div>
  )
}
