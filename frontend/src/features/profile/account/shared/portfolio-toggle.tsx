"use client"

import { Switch } from "@/components/ui/switch"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"

interface PortfolioToggleProps {
  form: UseFormReturn<any>
}

export function PortfolioToggle({ form }: PortfolioToggleProps) {
  return (
    <FormField
      control={form.control}
      name="displayPortfolio"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <FormLabel className="text-lg font-medium">Display total portfolio value</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-[#e91e63]"
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

