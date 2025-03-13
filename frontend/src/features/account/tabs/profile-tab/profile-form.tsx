"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormItem, FormLabel, FormControl, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const profileFormSchema = z.object({
  username: z.string().min(3).max(50),
  displayName: z.string().min(2).max(50),
  bio: z.string().max(500),
  email: z.string().email().optional(),
  displayPortfolio: z.boolean().default(true),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  // State for showing input fields
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [showDisplayNameInput, setShowDisplayNameInput] = useState(false)
  const [showBioInput, setShowBioInput] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      email: "",
      displayPortfolio: true,
    },
  })

  function onSubmit(data: ProfileFormValues) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username Field */}
        <div>
          <h2 className="text-lg font-medium mb-2">Username</h2>
          {showUsernameInput ? (
            <div className="space-y-2">
              <Input
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                placeholder="Enter username"
                {...form.register("username")}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] rounded"
                  onClick={() => setShowUsernameInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#e91e63] hover:bg-[#d81b60] rounded"
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setShowUsernameInput(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
              onClick={() => setShowUsernameInput(true)}
            >
              Add Username
            </Button>
          )}
        </div>

        <div className="text-amber-500 text-sm">
          <p>
            Note: All your wallets are set to private. At least one wallet must be public for others to see your
            profile.{" "}
            <a href="#" className="underline hover:text-amber-400">
              Manage wallet visibility here
            </a>
          </p>
        </div>

        {/* Display Name Field */}
        <div>
          <h2 className="text-lg font-medium mb-2">Display Name</h2>
          {showDisplayNameInput ? (
            <div className="space-y-2">
              <Input
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                placeholder="Enter display name"
                {...form.register("displayName")}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] rounded"
                  onClick={() => setShowDisplayNameInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#e91e63] hover:bg-[#d81b60] rounded"
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setShowDisplayNameInput(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
              onClick={() => setShowDisplayNameInput(true)}
            >
              Add Display Name
            </Button>
          )}
          <p className="text-gray-400 text-sm mt-1">This is the name displayed on your profile and activities</p>
        </div>

        {/* Bio Field */}
        <div>
          <h2 className="text-lg font-medium mb-2">Bio</h2>
          {showBioInput ? (
            <div className="space-y-2">
              <Textarea
                className="bg-[#2a2a3a] border-[#3a3a4a] resize-none min-h-[120px]"
                placeholder="Write something about yourself..."
                {...form.register("bio")}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] rounded"
                  onClick={() => setShowBioInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#e91e63] hover:bg-[#d81b60] rounded"
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setShowBioInput(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
              onClick={() => setShowBioInput(true)}
            >
              Add Bio
            </Button>
          )}
        </div>

        {/* Portfolio Toggle */}
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

        {/* Email Field */}
        <div>
          <h2 className="text-lg font-medium mb-2">Email</h2>
          {showEmailInput ? (
            <div className="space-y-2">
              <Input
                className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                placeholder="Enter email"
                type="email"
                {...form.register("email")}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] rounded"
                  onClick={() => setShowEmailInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#e91e63] hover:bg-[#d81b60] rounded"
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setShowEmailInput(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
              onClick={() => setShowEmailInput(true)}
            >
              Add Email
            </Button>
          )}
          <p className="text-gray-400 text-sm mt-1">Your email for marketplace notifications</p>
        </div>
      </form>
    </Form>
  )
}

