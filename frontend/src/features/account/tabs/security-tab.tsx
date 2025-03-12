"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Shield, Key, Smartphone } from "lucide-react"

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SecurityFormValues = z.infer<typeof securityFormSchema>

export default function SecurityTab() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: SecurityFormValues) {
    console.log(data)
    // Handle password change
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-[#e91e63]" />
          Two-Factor Authentication (2FA)
        </h2>

        {is2FAEnabled ? (
          <div className="bg-[#2a2a3a] p-4 rounded-md">
            <p className="text-green-400 mb-2">2FA is currently enabled</p>
            <p className="text-gray-400 text-sm mb-4">
              Two-factor authentication adds an additional layer of security to your account by requiring more than just
              a password to sign in.
            </p>
            <Button
              variant="outline"
              className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]"
              onClick={() => setIs2FAEnabled(false)}
            >
              Disable 2FA
            </Button>
          </div>
        ) : (
          <div className="bg-[#2a2a3a] p-4 rounded-md">
            <p className="text-amber-500 mb-2">2FA is currently disabled</p>
            <p className="text-gray-400 text-sm mb-4">
              Two-factor authentication adds an additional layer of security to your account by requiring more than just
              a password to sign in.
            </p>
            <Button className="bg-[#e91e63] hover:bg-[#d81b60]" onClick={() => setIs2FAEnabled(true)}>
              Enable 2FA
            </Button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Key className="mr-2 h-5 w-5 text-[#e91e63]" />
          Change Password
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="bg-[#2a2a3a] border-[#3a3a4a] text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="bg-[#2a2a3a] border-[#3a3a4a] text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="bg-[#2a2a3a] border-[#3a3a4a] text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="bg-[#e91e63] hover:bg-[#d81b60]">
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Smartphone className="mr-2 w-5 h-5 text-[#e91e63]" />
          Connected Devices
        </h2>

        <div className="bg-[#2a2a3a] p-4 rounded-md">
          <p className="text-gray-400 text-sm mb-4">
            Manage devices that are currently connected to your account. You can revoke access for any device that you
            don't recognize.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-[#3a3a4a] rounded-md">
              <div>
                <p className="font-medium">Chrome on Windows</p>
                <p className="text-gray-400 text-sm">Last active: Today at 10:45 AM</p>
              </div>
              <Button variant="outline" size="sm" className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]">
                Revoke
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border border-[#3a3a4a] rounded-md">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-gray-400 text-sm">Last active: Yesterday at 8:30 PM</p>
              </div>
              <Button variant="outline" size="sm" className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]">
                Revoke
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

