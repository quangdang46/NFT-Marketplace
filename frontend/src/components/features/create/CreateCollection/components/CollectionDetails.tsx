import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CollectionDetailsProps {
  form: any;
  isLoading: boolean;
}

export function CollectionDetails({ form, isLoading }: CollectionDetailsProps) {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Chain Selection */}
          <div>
            <Label htmlFor="chain">Chain</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <FormField
                control={form.control}
                name="chain"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                              Base
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="base">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                            Base
                          </div>
                        </SelectItem>
                        <SelectItem value="ethereum">
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-500 rounded-full w-4 h-4"></div>
                            Ethereum
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Name and Symbol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full mt-1" />
                  ) : (
                    <FormControl>
                      <Input
                        placeholder="The Pond"
                        className="bg-gray-800 border-gray-700"
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full mt-1" />
                  ) : (
                    <FormControl>
                      <Input
                        placeholder="POND"
                        className="bg-gray-800 border-gray-700"
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Collection Image */}
          <div>
            <Label>Collection Image</Label>
            <p className="text-sm text-gray-400 mb-2">
              Image that will be shown as the main image for the collection.
              Recommended: 800x800px jpg
            </p>
            {isLoading ? (
              <Skeleton className="h-40 w-full mt-1" />
            ) : (
              <div className="border border-dashed border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-gray-800/50">
                <Upload className="h-6 w-6 mb-2 text-gray-400" />
                <p className="text-sm text-center text-gray-400">
                  Drop your artwork here
                  <br />
                  to upload
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Choose Image...
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                {isLoading ? (
                  <Skeleton className="h-24 w-full mt-1" />
                ) : (
                  <FormControl>
                    <Textarea
                      placeholder="e.g. The Pond is the greatest collection ever made"
                      className="bg-gray-800 border-gray-700 min-h-24"
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
