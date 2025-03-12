"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"

interface BioFieldProps {
  form: UseFormReturn<any>
}

export function BioField({ form }: BioFieldProps) {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">Bio</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className="bg-[#2a2a3a] border-[#3a3a4a] resize-none min-h-[120px]"
              placeholder="Write something about yourself..."
            />
          </FormControl>
          <FormMessage />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a]"
              onClick={() => form.resetField("bio")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#e91e63] hover:bg-[#d81b60]">
              Save
            </Button>
          </div>
        </FormItem>
      )}
    />
  )
}

