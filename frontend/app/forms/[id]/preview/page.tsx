"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FormPreviewPage() {
  const { id } = useParams()
  const router = useRouter()

  // Redirect to the public form view in a new window/tab
  useEffect(() => {
    const formUrl = `/f/${id}`
    window.open(formUrl, "_blank")

    // Navigate back after 1 second
    const timer = setTimeout(() => {
      router.back()
    }, 1000)

    return () => clearTimeout(timer)
  }, [id, router])

  return (
    <div className="container max-w-lg py-12 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Opening Preview...</h1>
      <p className="text-muted-foreground mb-8">Your form preview is opening in a new tab.</p>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Editor
      </Button>
    </div>
  )
}
