"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UserIdDisplay from "@/features/account/tabs/profile-tab/UserIdDisplay";
import SocialConnections from "@/features/account/tabs/profile-tab/SocialConnections";

// Define form schema for validation
const profileFormSchema = z.object({
  username: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
  displayPortfolio: z.boolean().default(true),
  email: z.string().email().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileTab() {
  // State for showing input fields
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showDisplayNameInput, setShowDisplayNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    username: "",
    displayName: "",
    bio: "",
    displayPortfolio: true,
    email: "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    // In a real app, you would send this data to your backend
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  onClick={() => setShowUsernameInput(false)}
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
            Note: All your wallets are set to private. At least one wallet must
            be public for others to see your profile.{" "}
            <a href="#" className="underline hover:text-amber-400">
              Manage wallet visibility here
            </a>
          </p>
        </div>

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
                  onClick={() => setShowDisplayNameInput(false)}
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
          <p className="text-gray-400 text-sm mt-1">
            This is the name displayed on your profile and activities
          </p>
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-[#2a2a3a] border-[#3a3a4a] resize-none min-h-[120px] mt-2 rounded"
                  placeholder="Write something about yourself..."
                />
              </FormControl>
              <FormMessage />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] rounded"
                  onClick={() => form.setValue("bio", "")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#e91e63] hover:bg-[#d81b60] rounded"
                >
                  Save
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayPortfolio"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-lg font-medium">
                Display total portfolio value
              </FormLabel>
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
                  onClick={() => setShowEmailInput(false)}
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
          <p className="text-gray-400 text-sm mt-1">
            Your email for marketplace notifications
          </p>
        </div>

        <SocialConnections />

        <UserIdDisplay id="f214a2a3-8...f07" />
      </form>
    </Form>
  );
}
