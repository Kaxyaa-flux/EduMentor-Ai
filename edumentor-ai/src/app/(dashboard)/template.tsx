"use client"

import { PageTransition } from "@/components/ui/PageTransition"
import { FloatingOrb } from "@/components/ui/FloatingOrb"

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageTransition>{children}</PageTransition>
      <FloatingOrb />
    </>
  )
}
