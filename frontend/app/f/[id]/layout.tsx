import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Form | Formably",
  description: "Fill out this form",
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>
}
