import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Type, Mail, FileText, Hash, Calendar, Clock, List, CheckSquare, BarChart3, Eye, Palette } from "lucide-react"
import { templatesApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface FormPreviewProps {
  formData: {
    id?: string
    title: string
    detail?: string
    logo?: string
    cover_image?: string
    primary_color?: string
    secondary_color?: string
    collect_email?: boolean
    sections: Array<{
      title: string
      description?: string
      fields: Array<{
        field_name: string
        field_type: string
        required: boolean
        field_order: number
        constraints?: Record<string, any>
      }>
    }>
  }
}

export function FormPreview({ formData }: FormPreviewProps) {
  const { token } = useAuth()
  const [error, setError] = useState<string>("")
  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case "text":
        return <Type className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "textarea":
        return <FileText className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      case "date":
        return <Calendar className="h-4 w-4" />
      case "datetime":
        return <Clock className="h-4 w-4" />
      case "select":
        return <List className="h-4 w-4" />
      case "multiselect":
      case "checkbox":
        return <CheckSquare className="h-4 w-4" />
      case "scale":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  const getFieldTypeLabel = (fieldType: string) => {
    switch (fieldType) {
      case "text":
        return "Text Input"
      case "email":
        return "Email Input"
      case "textarea":
        return "Text Area"
      case "number":
        return "Number Input"
      case "date":
        return "Date Picker"
      case "datetime":
        return "Date & Time"
      case "select":
        return "Dropdown"
      case "multiselect":
        return "Multi-Select"
      case "checkbox":
        return "Checkboxes"
      case "scale":
        return "Rating Scale"
      default:
        return "Unknown"
    }
  }

  const getConstraintInfo = (field: any) => {
    const constraints = field.constraints || {}
    const info = []

    if (constraints.min_length) info.push(`Min: ${constraints.min_length} chars`)
    if (constraints.max_length) info.push(`Max: ${constraints.max_length} chars`)
    if (constraints.min !== undefined) info.push(`Min: ${constraints.min}`)
    if (constraints.max !== undefined) info.push(`Max: ${constraints.max}`)
    if (constraints.min_date) info.push(`From: ${constraints.min_date}`)
    if (constraints.max_date) info.push(`To: ${constraints.max_date}`)
    if (constraints.items) info.push(`${constraints.items.length} options`)
    if (constraints.min_items) info.push(`Min select: ${constraints.min_items}`)
    if (constraints.max_items) info.push(`Max select: ${constraints.max_items}`)
    if (constraints.pattern) info.push("Pattern validation")

    return info
  }

  const totalFields = formData.sections.reduce((total, section) => total + section.fields.length, 0)
  const requiredFields = formData.sections.reduce(
    (total, section) => total + section.fields.filter((field) => field.required).length,
    0,
  )

   const useTemplate = async (templateId: string) => {
      if (!token) return
  
      try {
        const response = await templatesApi.useTemplate(templateId, token)
      
          window.location.href = `/forms/${response.form_id}`
        
          setError(response.message || "Failed to use template")
        
      } catch (err: any) {
        console.error("Error using template:", err)
        setError(err.message || "Failed to use template")
      }
    }
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Eye className="h-5 w-5" />
          <span className="text-sm font-medium">Form Preview</span>
        </div>

        {/* Cover Image Preview */}
        {formData.cover_image && (
          <div className="w-full h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <img
              src={formData.cover_image}
              alt="Cover"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        {/* Logo and Title */}
        <div className="space-y-3">
          {formData.logo && (
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formData.title}</h1>
            {formData.detail && <p className="text-lg text-gray-600 mt-2">{formData.detail}</p>}
          </div>
        </div>

        {/* Form Stats */}
        <div className="flex justify-center gap-6 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formData.sections.length}</div>
            <div className="text-sm text-gray-500">Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalFields}</div>
            <div className="text-sm text-gray-500">Fields</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{requiredFields}</div>
            <div className="text-sm text-gray-500">Required</div>
          </div>
        </div>

        {/* Color Theme Preview */}
        {(formData.primary_color || formData.secondary_color) && (
          <div className="flex justify-center gap-3 pt-2">
            {formData.primary_color && (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: formData.primary_color }}
                ></div>
                <span className="text-xs text-gray-500">Primary</span>
              </div>
            )}
            {formData.secondary_color && (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: formData.secondary_color }}
                ></div>
                <span className="text-xs text-gray-500">Secondary</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Email Collection Notice */}
      {formData.collect_email && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Email Collection Enabled</span>
              <Badge variant="secondary" className="ml-auto">
                Required
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections Preview */}
      <div className="space-y-6">
        {formData.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  {section.description && <CardDescription className="mt-1">{section.description}</CardDescription>}
                </div>
                <Badge variant="outline" className="ml-4">
                  {section.fields.length} {section.fields.length === 1 ? "field" : "fields"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {section.fields
                .sort((a, b) => a.field_order - b.field_order)
                .map((field, fieldIndex) => {
                  const constraintInfo = getConstraintInfo(field)

                  return (
                    <div key={fieldIndex} className="border rounded-lg p-4 bg-gray-50/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getFieldIcon(field.field_type)}
                            <span className="font-medium text-gray-900">{field.field_name}</span>
                          </div>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getFieldTypeLabel(field.field_type)}
                        </Badge>
                      </div>

                      {/* Field Preview */}
                      <div className="mb-3">
                        {field.field_type === "textarea" ? (
                          <div className="w-full h-20 bg-white border border-gray-200 rounded-md p-3 text-gray-400 text-sm">
                            Text area placeholder...
                          </div>
                        ) : field.field_type === "select" ? (
                          <div className="w-full h-10 bg-white border border-gray-200 rounded-md px-3 flex items-center text-gray-400 text-sm">
                            Select an option...
                          </div>
                        ) : field.field_type === "multiselect" || field.field_type === "checkbox" ? (
                          <div className="space-y-2">
                            {(field.constraints?.items || ["Option 1", "Option 2", "Option 3"])
                              .slice(0, 3)
                              .map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                                  <span className="text-sm text-gray-600">{item}</span>
                                </div>
                              ))}
                            {(field.constraints?.items?.length || 0) > 3 && (
                              <div className="text-xs text-gray-400">
                                +{(field.constraints?.items?.length || 0) - 3} more options
                              </div>
                            )}
                          </div>
                        ) : field.field_type === "scale" ? (
                          <div className="flex gap-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-sm text-gray-400"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-10 bg-white border border-gray-200 rounded-md px-3 flex items-center text-gray-400 text-sm">
                            {field.field_type === "email"
                              ? "email@example.com"
                              : field.field_type === "number"
                                ? "123"
                                : field.field_type === "date"
                                  ? "mm/dd/yyyy"
                                  : field.field_type === "datetime"
                                    ? "mm/dd/yyyy hh:mm"
                                    : "Enter text..."}
                          </div>
                        )}
                      </div>

                      {/* Constraints Info */}
                      {constraintInfo.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {constraintInfo.map((info, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {info}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button Preview */}
      <div className="flex justify-center pt-6 cursor-pointer w-full" onClick={() => useTemplate(formData.id || "")}>
        <div
          className="px-8 py-3 rounded-md text-white font-medium shadow-sm"
          style={{ backgroundColor: formData.primary_color || "#7C3AED" }}
        >
          Use Template
        </div>
      </div>
    </div>
  )
}
