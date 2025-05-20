"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormRendererProps {
  sections: any[]
  values: Record<string, any>
  onChange: (fieldName: string, value: any) => void
  validationErrors: Record<string, string>
}

export function FormRenderer({ sections, values, onChange, validationErrors }: FormRendererProps) {
  const renderField = (field: any) => {
    const value = values[field.field_name] !== undefined ? values[field.field_name] : ""
    const error = validationErrors[field.field_name]
    const constraints = field.constraints || {}

    switch (field.field_type) {
      case "text":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <input
              type="text"
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
              minLength={constraints.min_length}
              maxLength={constraints.max_length}
              pattern={constraints.pattern}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "email":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <input
              type="email"
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <textarea
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
              minLength={constraints.min_length}
              maxLength={constraints.max_length}
              rows={5}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "number":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <input
              type="number"
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value ? Number(e.target.value) : "")}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
              min={constraints.min}
              max={constraints.max}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "date":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <input
              type="date"
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
              min={constraints.min_date}
              max={constraints.max_date}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "datetime":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <input
              type="datetime-local"
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
              min={constraints.min_datetime}
              max={constraints.max_datetime}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-2" data-error={!!error}>
            <Label htmlFor={field.field_name} className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <select
              id={field.field_name}
              name={field.field_name}
              value={value}
              onChange={(e) => onChange(field.field_name, e.target.value)}
              className={cn(
                "w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary",
                error && "border-destructive",
              )}
              required={field.required}
            >
              <option value="">Select an option</option>
              {(constraints.items || []).map((item: string, index: number) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      case "multiselect":
      case "checkbox":
        const selectedValues = Array.isArray(value) ? value : []

        return (
          <div className="space-y-2" data-error={!!error}>
            <Label className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="space-y-2">
              {(constraints.items || []).map((item: string, index: number) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.field_name}_${index}`}
                    name={`${field.field_name}_${index}`}
                    value={item}
                    checked={selectedValues.includes(item)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, item]
                        : selectedValues.filter((val) => val !== item)
                      onChange(field.field_name, newValues)
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`${field.field_name}_${index}`} className="ml-2 text-sm font-normal">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {constraints.min_items && (
              <p className="text-xs text-muted-foreground">
                Select at least {constraints.min_items} {constraints.min_items === 1 ? "option" : "options"}
              </p>
            )}
            {constraints.max_items && (
              <p className="text-xs text-muted-foreground">
                Select at most {constraints.max_items} {constraints.max_items === 1 ? "option" : "options"}
              </p>
            )}
          </div>
        )

      case "scale":
        const min = constraints.min || 1
        const max = constraints.max || 5
        const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

        return (
          <div className="space-y-2" data-error={!!error}>
            <Label className="font-medium text-sm">
              {field.field_name}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="flex  items-center">
              {options.map((option) => (
                <div key={option} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onChange(field.field_name, option)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 border-input m-1",
                      value === option && `bg-secondary text-primary-foreground border-primary`,
                    )}
                  >
                    {option}
                  </button>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )

      default:
        return <div>Unsupported field type: {field.field_type}</div>
    }
  }

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="mb-6 shadow-none">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {section.fields
              .sort((a: any, b: any) => a.field_order - b.field_order)
              .map((field: any, fieldIndex: number) => (
                <div key={fieldIndex}>{renderField(field)}</div>
              ))}
          </CardContent>
        </Card>
      ))}
    </>
  )
}
