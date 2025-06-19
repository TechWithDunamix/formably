"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Type,
  Mail,
  Calendar,
  Clock,
  Hash,
  List,
  CheckSquare,
  AlignLeft,
  Sliders,
  Cog,
  CircleDot,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface FormBuilderProps {
  sections: any[]
  onChange: (sections: any[]) => void
}

const fieldTypes = [
  { value: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { value: "date", label: "Date", icon: <Calendar className="h-4 w-4" /> },
  { value: "datetime", label: "Date & Time", icon: <Clock className="h-4 w-4" /> },
  { value: "number", label: "Number", icon: <Hash className="h-4 w-4" /> },
  { value: "select", label: "Dropdown", icon: <List className="h-4 w-4" /> },
  { value: "multiselect", label: "Multi-select", icon: <CheckSquare className="h-4 w-4" /> },
  { value: "textarea", label: "Long Text", icon: <AlignLeft className="h-4 w-4" /> },
  { value: "scale", label: "Rating Scale", icon: <Sliders className="h-4 w-4" /> },
  { value: "radio", label: "Radio Buttons", icon: <CircleDot className="h-4 w-4" /> },
]

export function FormBuilder({ sections, onChange }: FormBuilderProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(1)
  const [expandedField, setExpandedField] = useState<{ section: number; field: number } | null>(null)

  const addSection = () => {
    const newSection = {
      title: `Section ${sections.length + 1}`,
      description: "",
      order: sections.length,
      fields: [],
    }

    onChange([...sections, newSection])
    setExpandedSection(sections.length)
  }

  const updateSection = (index: number, data: any) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], ...data }
    onChange(newSections)
  }

  const deleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    onChange(newSections)
  }

  const addField = (sectionIndex: number) => {
    const newSections = [...sections]
    const newField = {
      field_name: `field_${newSections[sectionIndex].fields.length + 1}`,
      field_type: "text",
      field_order: newSections[sectionIndex].fields.length,
      required: false,
      section: newSections[sectionIndex].title,
      constraints: {},
    }

    newSections[sectionIndex].fields.push(newField)
    onChange(newSections)
    setExpandedField({ section: sectionIndex, field: newSections[sectionIndex].fields.length - 1 })
  }

  const updateField = (sectionIndex: number, fieldIndex: number, data: any) => {
    const newSections = [...sections]
    newSections[sectionIndex].fields[fieldIndex] = {
      ...newSections[sectionIndex].fields[fieldIndex],
      ...data,
    }
    onChange(newSections)
  }

  const deleteField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].fields = newSections[sectionIndex].fields.filter(
      (_: any, i: number) => i !== fieldIndex,
    )
    onChange(newSections)
  }

  const moveField = (sectionIndex: number, fieldIndex: number, direction: "up" | "down") => {
    if (
      (direction === "up" && fieldIndex === 0) ||
      (direction === "down" && fieldIndex === sections[sectionIndex].fields.length - 1)
    ) {
      return
    }

    const newSections = [...sections]
    const fields = [...newSections[sectionIndex].fields]
    const newIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1

    // Swap fields
    ;[fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]]

    // Update field_order
    fields[fieldIndex].field_order = fieldIndex
    fields[newIndex].field_order = newIndex

    newSections[sectionIndex].fields = fields
    onChange(newSections)

    // Update expanded field
    setExpandedField({ section: sectionIndex, field: newIndex })
  }

  const getFieldIcon = (fieldType: string) => {
    const field = fieldTypes.find((f) => f.value === fieldType)
    return field ? field.icon : <Type className="h-4 w-4" />
  }

  const renderFieldConstraints = (sectionIndex: number, fieldIndex: number, fieldType: string) => {
    const field = sections[sectionIndex].fields[fieldIndex]
    const constraints = field.constraints || {}

    switch (fieldType) {
      case "text":
      case "textarea":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`min_length_${sectionIndex}_${fieldIndex}`}>Min Length</Label>
                <Input
                  id={`min_length_${sectionIndex}_${fieldIndex}`}
                  type="number"
                  value={constraints.min_length || ""}
                  onChange={(e) => {
                    const newConstraints = { ...constraints, min_length: Number.parseInt(e.target.value) || null }
                    updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                  }}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`max_length_${sectionIndex}_${fieldIndex}`}>Max Length</Label>
                <Input
                  id={`max_length_${sectionIndex}_${fieldIndex}`}
                  type="number"
                  value={constraints.max_length || ""}
                  onChange={(e) => {
                    const newConstraints = { ...constraints, max_length: Number.parseInt(e.target.value) || null }
                    updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                  }}
                  placeholder="Optional"
                />
              </div>
            </div>
            {fieldType === "text" && (
              <div className="space-y-2">
                <Label htmlFor={`pattern_${sectionIndex}_${fieldIndex}`}>Pattern (Regex)</Label>
                <Input
                  id={`pattern_${sectionIndex}_${fieldIndex}`}
                  value={constraints.pattern || ""}
                  onChange={(e) => {
                    const newConstraints = { ...constraints, pattern: e.target.value }
                    updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                  }}
                  placeholder="Optional"
                />
              </div>
            )}
          </div>
        )

      case "number":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min_${sectionIndex}_${fieldIndex}`}>Min Value</Label>
              <Input
                id={`min_${sectionIndex}_${fieldIndex}`}
                type="number"
                value={constraints.min || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, min: Number.parseInt(e.target.value) || null }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max_${sectionIndex}_${fieldIndex}`}>Max Value</Label>
              <Input
                id={`max_${sectionIndex}_${fieldIndex}`}
                type="number"
                value={constraints.max || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, max: Number.parseInt(e.target.value) || null }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
                placeholder="Optional"
              />
            </div>
          </div>
        )

      case "date":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min_date_${sectionIndex}_${fieldIndex}`}>Min Date</Label>
              <Input
                id={`min_date_${sectionIndex}_${fieldIndex}`}
                type="date"
                value={constraints.min_date || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, min_date: e.target.value }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max_date_${sectionIndex}_${fieldIndex}`}>Max Date</Label>
              <Input
                id={`max_date_${sectionIndex}_${fieldIndex}`}
                type="date"
                value={constraints.max_date || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, max_date: e.target.value }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
          </div>
        )

      case "datetime":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min_datetime_${sectionIndex}_${fieldIndex}`}>Min Date & Time</Label>
              <Input
                id={`min_datetime_${sectionIndex}_${fieldIndex}`}
                type="datetime-local"
                value={constraints.min_datetime || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, min_datetime: e.target.value }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max_datetime_${sectionIndex}_${fieldIndex}`}>Max Date & Time</Label>
              <Input
                id={`max_datetime_${sectionIndex}_${fieldIndex}`}
                type="datetime-local"
                value={constraints.max_datetime || ""}
                onChange={(e) => {
                  const newConstraints = { ...constraints, max_datetime: e.target.value }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
          </div>
        )

      case "select":
      case "multiselect":
      case "radio":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {(constraints.items || []).map((item: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(constraints.items || [])]
                        newItems[i] = e.target.value
                        const newConstraints = { ...constraints, items: newItems }
                        updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = (constraints.items || []).filter((_: string, index: number) => index !== i)
                        const newConstraints = { ...constraints, items: newItems }
                        updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(constraints.items || []), `Option ${(constraints.items || []).length + 1}`]
                    const newConstraints = { ...constraints, items: newItems }
                    updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>

            {fieldType === "multiselect" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`min_items_${sectionIndex}_${fieldIndex}`}>Min Selections</Label>
                  <Input
                    id={`min_items_${sectionIndex}_${fieldIndex}`}
                    type="number"
                    value={constraints.min_items || ""}
                    onChange={(e) => {
                      const newConstraints = { ...constraints, min_items: Number.parseInt(e.target.value) || "" }
                      updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                    }}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`max_items_${sectionIndex}_${fieldIndex}`}>Max Selections</Label>
                  <Input
                    id={`max_items_${sectionIndex}_${fieldIndex}`}
                    type="number"
                    value={constraints.max_items || ""}
                    onChange={(e) => {
                      const newConstraints = { ...constraints, max_items: Number.parseInt(e.target.value) || "" }
                      updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                    }}
                    placeholder="Optional"
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "scale":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min_${sectionIndex}_${fieldIndex}`}>Min Value</Label>
              <Input
                id={`min_${sectionIndex}_${fieldIndex}`}
                type="number"
                value={constraints.min || 1}
                onChange={(e) => {
                  const newConstraints = { ...constraints, min: Number.parseInt(e.target.value) || 1 }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max_${sectionIndex}_${fieldIndex}`}>Max Value</Label>
              <Input
                id={`max_${sectionIndex}_${fieldIndex}`}
                type="number"
                value={constraints.max || 5}
                onChange={(e) => {
                  const newConstraints = { ...constraints, max: Number.parseInt(e.target.value) || 5 }
                  updateField(sectionIndex, fieldIndex, { constraints: newConstraints })
                }}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8 ">
      {sections?.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="border-2 border-primary/40 transition-all duration-300 rounded-lg mb-8 p-6">
          <CardHeader className="pb-6 my-2 bg-background/80 border-b border-primary/20 rounded-t-lg px-4">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3 flex-1 mr-4">
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                  className="font-semibold text-lg border-b-2 border-primary/30 focus:border-primary/80 transition-colors bg-transparent py-3 px-2 focus:outline-none focus:ring-0"
                  placeholder="Section Title"
                />
                <Textarea
                  value={section.description || ""}
                  onChange={(e) => updateSection(sectionIndex, { description: e.target.value })}
                  placeholder="Section Description (optional)"
                  className="resize-none border-b border-primary/10 bg-transparent py-2 px-2 focus:outline-none focus:ring-0"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
                  className="transition-transform duration-300"
                >
                  {expandedSection === sectionIndex ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteSection(sectionIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Collapsible open={expandedSection === sectionIndex}>
            <CollapsibleContent className="transition-all duration-500 ease-in-out">
              <CardContent className="pb-6 px-4">
                <div className="space-y-6">
                  {section.fields.map((field: any, fieldIndex: number) => (
                    <Card key={fieldIndex} className="border border-primary/30 rounded-md transition-all duration-300 mb-6 p-4">
                      <CardHeader className="py-4 bg-background/70 border-b border-primary/10 rounded-t-md px-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-md border border-primary/20 bg-background">
                              {getFieldIcon(field.field_type)}
                            </div>
                            <Input
                              value={field.field_name}
                              onChange={(e) => updateField(sectionIndex, fieldIndex, { field_name: e.target.value })}
                              className="max-w-[240px] border-b border-primary/20 bg-transparent py-2 px-2 focus:outline-none focus:ring-0"
                              placeholder="Field Name"
                            />
                            <div className="flex items-center ml-4">
                              <Switch
                                id={`required_${sectionIndex}_${fieldIndex}`}
                                checked={field.required}
                                onCheckedChange={(checked) =>
                                  updateField(sectionIndex, fieldIndex, { required: checked })
                                }
                              />
                              <Label htmlFor={`required_${sectionIndex}_${fieldIndex}`} className="ml-2">
                                Required
                              </Label>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveField(sectionIndex, fieldIndex, "up")}
                              disabled={fieldIndex === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveField(sectionIndex, fieldIndex, "down")}
                              disabled={fieldIndex === section.fields.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setExpandedField(
                                  expandedField?.section === sectionIndex && expandedField?.field === fieldIndex
                                    ? null
                                    : { section: sectionIndex, field: fieldIndex },
                                )
                              }
                              className="transition-transform duration-300"
                            >
                              {expandedField?.section === sectionIndex && expandedField?.field === fieldIndex ? (
                                <Cog className="h-4 w-4" />
                              ) : (
                                <Cog className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteField(sectionIndex, fieldIndex)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <Collapsible
                        open={expandedField?.section === sectionIndex && expandedField?.field === fieldIndex}
                      >
                        <CollapsibleContent className="transition-all duration-500 ease-in-out">
                          <CardContent className="py-2 px-2 space-y-6">
                            <div className="space-y-3">
                              <Label htmlFor={`field_type_${sectionIndex}_${fieldIndex}`}>Field Type</Label>
                              <Select
                                value={field.field_type}
                                onValueChange={(value) =>
                                  updateField(sectionIndex, fieldIndex, { field_type: value, constraints: {} })
                                }
                              >
                                <SelectTrigger id={`field_type_${sectionIndex}_${fieldIndex}`} className="border-primary/20">
                                  <SelectValue placeholder="Select field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center">
                                        {type.icon}
                                        <span className="ml-2">{type.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="constraints">
                                <AccordionTrigger>Field Constraints</AccordionTrigger>
                                <AccordionContent>
                                  {renderFieldConstraints(sectionIndex, fieldIndex, field.field_type)}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-6 px-4">
                <Button variant="outline" onClick={() => addField(sectionIndex)} className="w-full border-primary/30 py-3">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </CardFooter>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      <Button variant="outline" onClick={addSection} className="w-full border-primary/40 py-4 text-lg">
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>
    </div>
  )
}
