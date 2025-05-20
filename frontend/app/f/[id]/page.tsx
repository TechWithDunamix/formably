"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { publicApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { FormRenderer } from "@/components/form-renderer"

interface FormData {
  id: string
  title: string
  detail?: string
  logo?: string
  cover_image?: string
  max_response?: number
  is_active: boolean
  as_template?: boolean
  active_until?: string
  company_website?: string
  primary_color: string
  secondary_color: string
  collect_email: boolean
  multi_response: boolean
  sections: any[]
}

export default function PublicFormPage() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [response, setResponse] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [primaryColor, setPrimaryColor] = useState("#7C3AED")
  const [secondaryColor, setSecondaryColor] = useState("#EC4899")

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setIsLoading(true)
        const response = await publicApi.getFormDetails(id as string)
        setFormData(response)
        if (response) {
          setPrimaryColor(response.primary_color || "#7C3AED")
          setSecondaryColor(response.secondary_color || "#EC4899")
        }
      } catch (err: any) {
        console.error("Error fetching form details:", err)
        setError(err.message || "Failed to fetch form details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormDetails()
  }, [id])

  const handleInputChange = (fieldName: string, value: any) => {
    setResponse((prev) => ({ ...prev, [fieldName]: value }))

    // Clear validation error for this field if it exists
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Handle email validation if collect_email is true
    if (formData?.collect_email && (!response.email || !response.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
      errors.email = "Please enter a valid email address"
    }

    // Validate required fields in each section
    formData?.sections.forEach((section) => {
      section.fields.forEach((field: any) => {
        const fieldName = field.field_name
        const value = response[fieldName]

        if (field.required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) {
          errors[fieldName] = "This field is required"
        }

        // Validate based on field type and constraints
        if (value !== undefined && value !== "") {
          const constraints = field.constraints || {}

          switch (field.field_type) {
            case "text":
            case "textarea":
              if (constraints.min_length && String(value).length < constraints.min_length) {
                errors[fieldName] = `Minimum length is ${constraints.min_length} characters`
              }
              if (constraints.max_length && String(value).length > constraints.max_length) {
                errors[fieldName] = `Maximum length is ${constraints.max_length} characters`
              }
              if (constraints.pattern && !String(value).match(new RegExp(constraints.pattern))) {
                errors[fieldName] = "Value doesn't match the required pattern"
              }
              break

            case "number":
              if (constraints.min !== undefined && Number(value) < constraints.min) {
                errors[fieldName] = `Minimum value is ${constraints.min}`
              }
              if (constraints.max !== undefined && Number(value) > constraints.max) {
                errors[fieldName] = `Maximum value is ${constraints.max}`
              }
              break

            case "date":
              if (constraints.min_date && new Date(value) < new Date(constraints.min_date)) {
                errors[fieldName] = `Date must be on or after ${constraints.min_date}`
              }
              if (constraints.max_date && new Date(value) > new Date(constraints.max_date)) {
                errors[fieldName] = `Date must be on or before ${constraints.max_date}`
              }
              break

            case "multiselect":
            case "checkbox":
              if (constraints.min_items && Array.isArray(value) && value.length < constraints.min_items) {
                errors[fieldName] = `Please select at least ${constraints.min_items} options`
              }
              if (constraints.max_items && Array.isArray(value) && value.length > constraints.max_items) {
                errors[fieldName] = `Please select at most ${constraints.max_items} options`
              }
              break
          }
        }
      })
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector("[data-error='true']")
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Add form metadata
      const submissionData = {
        ...response,
        _metadata: {
          submitted_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
        },
      }

      await publicApi.submitResponse(id as string, submissionData)
      setSuccess(true)
      // Reset form data
      setResponse({})

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      console.error("Error submitting form:", err)
      setError(err.message || "Failed to submit form")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (formData) {
      const rootElement = document.documentElement
      rootElement.style.setProperty("--color-primary", primaryColor || "#7C3AED")
      rootElement.style.setProperty("--color-secondary", secondaryColor || "#EC4899")
      return () => {
        // Restore default colors when component unmounts
        rootElement.style.removeProperty("--primary")
        rootElement.style.removeProperty("--secondary")
      }
    }
  }, [formData, primaryColor, secondaryColor])

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-12 px-4">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-12" />

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="container max-w-3xl py-12 px-4">
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium mb-2">Form Not Found</h3>
            <p className="text-muted-foreground mb-4">The form you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formData.is_active) {
    return (
      <div className="container max-w-3xl py-12 px-4">
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="rounded-full bg-amber-500/10 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Form Not Active</h3>
            <p className="text-muted-foreground mb-4">This form is currently not accepting responses.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container max-w-3xl py-12 px-4">
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="rounded-full bg-green-500/10 p-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-6">Your response has been submitted successfully.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false)
                setResponse({})
              }}
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(to bottom, ${primaryColor}10, transparent)`,
      }}
    >
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          {formData.logo && (
            <div className="mb-6 flex justify-center">
              <img
                src={formData.logo || "/placeholder.svg"}
                alt={`${formData.title} logo`}
                className="h-16 object-contain"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-3">{formData.title}</h1>
          {formData.detail && <p className="text-muted-foreground">{formData.detail}</p>}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            {formData.collect_email && (
              <CardContent className="pt-6">
                <div className="space-y-2" data-error={!!validationErrors.email}>
                  <label htmlFor="email" className="font-medium text-sm">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={response.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full p-2 rounded-md border ${
                      validationErrors.email ? "border-destructive" : "border-input"
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    required
                  />
                  {validationErrors.email && <p className="text-sm text-destructive">{validationErrors.email}</p>}
                </div>
              </CardContent>
            )}
          </Card>

          <FormRenderer
            sections={formData.sections}
            values={response}
            onChange={handleInputChange}
            validationErrors={validationErrors}
          />

          <div className="mt-8 flex justify-center">
            <Button type="submit" size="lg" className={`w-full max-w-xs  text-white`} style={{ backgroundColor: primaryColor }}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit" 
              )}
            </Button>
          </div>
        </form>

        {formData.company_website && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href={formData.company_website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: secondaryColor }}
              >
                {new URL(formData.company_website).hostname.replace(/^www\./, "")}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
