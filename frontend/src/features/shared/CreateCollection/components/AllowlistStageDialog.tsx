import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AllowlistStage } from "./types";

interface AllowlistStageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  onSubmit: (values: AllowlistStage) => void;
}

export function AllowlistStageDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
}: AllowlistStageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
        <div className="flex justify-between items-center">
          <DialogTitle>Allowlist Stage</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="mintPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mint Price</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="0.00"
                        className="bg-gray-800 border-gray-700 rounded-r-none"
                        {...field}
                      />
                      <div className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-3 flex items-center">
                        ETH
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Stage Duration</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="1"
                            className="bg-gray-800 border-gray-700 rounded-r-none"
                            {...field}
                          />
                          <div className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-3 flex items-center">
                            Days
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationHours"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="0"
                            className="bg-gray-800 border-gray-700 rounded-r-none"
                            {...field}
                          />
                          <div className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-3 flex items-center">
                            Hours
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="wallets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowlist</FormLabel>
                  <p className="text-sm text-gray-400">
                    Enter allowlisted wallets separated by new lines or commas
                  </p>
                  <FormControl>
                    <Textarea
                      placeholder="0xAbCdEf123456789abcdef123456789ABCDEF12
0xBcDeF0987654321bcdef0987654321BCDEF098"
                      className="bg-gray-800 border-gray-700 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Done
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
