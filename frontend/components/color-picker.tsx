"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const presetColors = [
  "#7C3AED", // brand-purple
  "#EC4899", // brand-pink
  "#14B8A6", // brand-teal
  "#F97316", // brand-orange
  "#FBBF24", // brand-yellow
  "#3B82F6", // blue
  "#10B981", // green
  "#EF4444", // red
  "#6B7280", // gray
  "#000000", // black
]

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[60px] h-[36px] p-0 border-2" style={{ backgroundColor: color }}>
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "w-full h-8 rounded-md border-2 cursor-pointer",
                  color === presetColor && "ring-2 ring-primary ring-offset-2",
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor)
                  setOpen(false)
                }}
              />
            ))}
          </div>
          <Input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-full h-8" />
        </PopoverContent>
      </Popover>
      <Input value={color} onChange={(e) => onChange(e.target.value)} className="w-[100px] font-mono" />
    </div>
  )
}
