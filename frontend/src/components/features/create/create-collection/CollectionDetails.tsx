
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Upload, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { mockChains } from "@/lib/constant/chains";
import EthereumIcon from "@/components/icons/Ethereum";
import { toast } from "sonner";

interface CollectionDetailsProps {
  form: any;
  isLoading: boolean;
  onChainChange?: (chain: string) => void;
  onImageChange?: (file: File | null) => void;
}

export function CollectionDetails({
  form,
  isLoading,
  onChainChange,
  onImageChange,
}: CollectionDetailsProps) {
  const [selectedChain, setSelectedChain] = useState("Sepolia");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPG and PNG are allowed.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }

      setSelectedImage(file);
      if (onImageChange) onImageChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dark space-y-6 bg-[#0e0a1a] dark:bg-[#0e0a1a] p-6 rounded-lg">
      <div className="space-y-6">
        {/* Chain Selection */}
        <div>
          <Label className="text-white dark:text-white">Chain</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <FormField
              control={form.control}
              name="chain"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedChain(value);
                      form.setValue("chain", value);
                      if (onChainChange) onChainChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue>
                          {field.value &&
                          mockChains.find(
                            (chain) => chain.id === field.value
                          ) ? (
                            <div className="flex items-center gap-2">
                              {
                                mockChains.find(
                                  (chain) => chain.id === field.value
                                )?.icon
                              }
                              {
                                mockChains.find(
                                  (chain) => chain.id === field.value
                                )?.name
                              }
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <EthereumIcon />
                              {selectedChain}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a1525] border-[#3a3450] text-white">
                      {mockChains.map((chain) => (
                        <SelectItem
                          key={chain.id}
                          value={chain.name}
                          className="text-white focus:bg-[#2a2535] focus:text-white"
                        >
                          <div className="flex items-center gap-2">
                            {chain.icon}
                            {chain.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white dark:text-white">Name</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="The Pond"
                        className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Collection Image */}
        <div>
          <Label className="text-white dark:text-white">Collection Image</Label>
          <p className="text-sm text-gray-400 mt-1">
            Image that will be shown as the main image for the collection.
            Recommended: 800x800px jpg
          </p>
          {isLoading ? (
            <Skeleton className="h-40 w-full mt-1" />
          ) : (
            <div className="border border-dashed border-[#3a3450] dark:border-[#3a3450] rounded-md p-6 flex flex-col items-center justify-center bg-transparent mt-2">
              <input
                type="file"
                id="collection-image"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-2">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Collection preview"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (onImageChange) onImageChange(null);
                        const input = document.getElementById(
                          "collection-image"
                        ) as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedImage?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedImage &&
                      (selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2 text-gray-400" />
                  <p className="text-sm text-center text-gray-400">
                    Drop your artwork here
                    <br />
                    to upload
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white hover:bg-[#2a2535] dark:hover:bg-[#2a2535]"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("collection-image")?.click();
                    }}
                  >
                    Choose Image...
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <Label className="text-white dark:text-white">Description</Label>
          {isLoading ? (
            <Skeleton className="h-24 w-full mt-1" />
          ) : (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. The Pond is the greatest collection ever made"
                      className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white min-h-24 mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}