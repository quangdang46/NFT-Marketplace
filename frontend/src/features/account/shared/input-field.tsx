"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"

interface InputFieldProps {
  name: string
  label: string
  description?: string
  placeholder: string
  form: UseFormReturn<any>
}

export function InputField({ name, label, description, placeholder, form }: InputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} placeholder={placeholder} className="bg-[#2a2a3a] border-[#3a3a4a] h-14" />
              <div className="absolute right-2 top-2 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a]"
                  onClick={() => form.resetField(name)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#e91e63] hover:bg-[#d81b60]">
                  Save
                </Button>
              </div>
            </div>
          </FormControl>
          {description && <FormDescription className="text-gray-400 text-sm">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

