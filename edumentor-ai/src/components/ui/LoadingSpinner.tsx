import { Loader2 } from "lucide-react"

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="h-10 w-10 text-[#10B981] animate-spin relative z-10" />
      </div>
      {text && (
        <p className="mt-4 text-slate-400 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}
