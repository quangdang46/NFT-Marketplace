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
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { PublicMint } from "./types";

interface PublicMintDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  onSubmit: (values: PublicMint) => void;
}

export function PublicMintDialog({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
}: PublicMintDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogTitle>Edit Public Mint</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "MM/dd/yyyy HH:mm")
                            : "Select date and time"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-gray-700">
                          <Input
                            type="time"
                            className="bg-gray-800 border-gray-700"
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = new Date(field.value);
                              newDate.setHours(
                                Number.parseInt(hours),
                                Number.parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "MM/dd/yyyy HH:mm")
                            : "Select date and time"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-gray-700">
                          <Input
                            type="time"
                            className="bg-gray-800 border-gray-700"
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = new Date(field.value);
                              newDate.setHours(
                                Number.parseInt(hours),
                                Number.parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
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
                Save Public Mint
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
