"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { formsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Save, Eye, Plus, Settings, Palette, Share2, Copy, MessageCircleCode } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"
import { FormBuilder } from "@/components/form-builder"
import Link from "next/link"

interface FormData {
  id?: string
  title: string
  detail?: string
  logo?: string
  cover_image?: string
  max_response?: number
  is_active: boolean
  as_template?: boolean
  active_until?: string
  company_website?: string
  draft: boolean
  primary_color: string
  secondary_color: string
  collect_email: boolean
  multi_response: boolean
  public_id: string
  sections: any[]
}

export default function FormEditorPage() {
  const { id } = useParams()
  const isNewForm = id === "new"
  const router = useRouter()
  const { token } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    detail: "",
    is_active: true,
    draft: true,
    primary_color: "#7C3AED",
    secondary_color: "#EC4899",
    collect_email: true,
    multi_response: true,
    public_id: "",
    as_template: false,
    sections: [],
  })
  const [isLoading, setIsLoading] = useState(!isNewForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("builder")

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (isNewForm || !token) return

      try {
        setIsLoading(true)
        const response = await formsApi.getDetails(id as string, token)
        setFormData(response)
      } catch (err: any) {
        console.error("Error fetching form details:", err)
        setError(err.message || "Failed to fetch form details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormDetails()
  }, [id, isNewForm, token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleColorChange = (name: string, color: string) => {
    setFormData((prev) => ({ ...prev, [name]: color }))
  }

  const handleSave = async () => {
    if (!token) return

    try {
      setIsSaving(true)
      setError("")

      if (isNewForm) {
        const response = await formsApi.create(formData, token)
        router.push(`/forms/${response.form_id}`)
      } else {
        await formsApi.update(id as string, formData, token)
      }
    } catch (err: any) {
      console.error("Error saving form:", err)
      setError(err.message || "Failed to save form")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    window.open(`/forms/${isNewForm ? "preview" : formData.public_id}/preview`, "_blank")
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid gap-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isNewForm ? "Create Form" : "Edit Form"}</h1>
            <p className="text-muted-foreground">
              {isNewForm ? "Create a new form to collect responses" : "Edit your form settings and fields"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <Link href={`/forms/${isNewForm ? "preview" : formData.id}/responses`}>
          <Button variant="outline">
          <MessageCircleCode className="mr-2 h-4 w-4" />
          Responses
          </Button>
          </Link>


          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="builder">
            <Plus className="h-4 w-4 mr-2" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="share">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
              <CardDescription>Basic information about your form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter form title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail">Description (optional)</Label>
                <Textarea
                  id="detail"
                  name="detail"
                  value={formData.detail || ""}
                  onChange={handleInputChange}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <FormBuilder
            sections={formData.sections}
            onChange={(sections) => setFormData((prev) => ({ ...prev, sections }))}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure how your form works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-sm text-muted-foreground">When active, your form can receive responses</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collect_email">As Template</Label>
                  <p className="text-sm text-muted-foreground">Make this form available as a template</p>
                </div>
                <Switch
                  id="as_template"
                  checked={formData.as_template}
                  onCheckedChange={(checked) => handleSwitchChange("as_template", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collect_email">Collect Email</Label>
                  <p className="text-sm text-muted-foreground">Ask respondents for their email address</p>
                </div>
                <Switch
                  id="collect_email"
                  checked={formData.collect_email}
                  onCheckedChange={(checked) => handleSwitchChange("collect_email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multi_response">Allow Multiple Responses</Label>
                  <p className="text-sm text-muted-foreground">Let users submit the form multiple times</p>
                </div>
                <Switch
                  id="multi_response"
                  checked={formData.multi_response}
                  onCheckedChange={(checked) => handleSwitchChange("multi_response", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_response">Maximum Responses (optional)</Label>
                <Input
                  id="max_response"
                  name="max_response"
                  type="number"
                  value={formData.max_response || ""}
                  onChange={handleInputChange}
                  placeholder="Leave blank for unlimited"
                />
                <p className="text-sm text-muted-foreground">Limit the number of responses your form can receive</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active_until">Active Until (optional)</Label>
                <Input
                  id="active_until"
                  name="active_until"
                  type="datetime-local"
                  value={formData.active_until || ""}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">
                  Set a date when your form will automatically become inactive
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website">Company Website (optional)</Label>
                <Input
                  id="company_website"
                  name="company_website"
                  value={formData.company_website || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Appearance</CardTitle>
              <CardDescription>Customize how your form looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Color</Label>
                <ColorPicker
                  color={formData.primary_color}
                  onChange={(color) => handleColorChange("primary_color", color)}
                />
              </div>

              <div className="space-y-4">
                <Label>Secondary Color</Label>
                <ColorPicker
                  color={formData.secondary_color}
                  onChange={(color) => handleColorChange("secondary_color", color)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (optional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL (optional)</Label>
                <Input
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Form</CardTitle>
              <CardDescription>Get your form in front of your audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Form Link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={`${window.location.origin}/f/${isNewForm ? "preview" : formData.public_id}`} />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/f/${isNewForm ? "preview" : id}`)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Share this link with your audience to collect responses</p>
              </div>

              {/* <div className="space-y-2">
                <Label>Embed Code</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`<iframe src="${window.location.origin}/f/${isNewForm ? "preview" : id}/embed" width="100%" height="600" frameborder="0"></iframe>`}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `<iframe src="${window.location.origin}/f/${isNewForm ? "preview" : id}/embed" width="100%" height="600" frameborder="0"></iframe>`,
                      )
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Embed this form on your website</p>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
