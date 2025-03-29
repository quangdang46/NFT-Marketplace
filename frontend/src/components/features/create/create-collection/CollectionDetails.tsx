/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface CollectionDetailsProps {
  form: any;
  isLoading: boolean;
  onChainChange?: (chain: string) => void;
}

export function CollectionDetails({
  form,
  isLoading,
  onChainChange,
}: CollectionDetailsProps) {
  const [selectedChain, setSelectedChain] = useState("base");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Chain icons and colors mapping
  const chainIcons: Record<string, { color: string; label: string }> = {
    ethereum: { color: "bg-purple-500", label: "Ethereum" },
    base: { color: "bg-blue-500", label: "Base" },
    apechain: { color: "bg-blue-400", label: "ApeChain" },
    abstract: { color: "bg-green-500", label: "Abstract" },
    berachain: { color: "bg-orange-500", label: "Berachain" },
    monad: { color: "bg-indigo-500", label: "Monad" },
    arbitrum: { color: "bg-blue-600", label: "Arbitrum" },
    sei: { color: "bg-red-500", label: "Sei" },
    bnb: { color: "bg-yellow-500", label: "BNB Chain" },
    polygon: { color: "bg-purple-600", label: "Polygon" },
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
                          {field.value && chainIcons[field.value] ? (
                            <div className="flex items-center gap-2">
                              <div
                                className={`${
                                  chainIcons[field.value].color
                                } rounded-full w-4 h-4`}
                              ></div>
                              {chainIcons[field.value].label}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                              Base
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a1525] border-[#3a3450] text-white">
                      <SelectItem
                        value="ethereum"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-500 rounded-full w-4 h-4"></div>
                          Ethereum
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="base"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                          Base
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="apechain"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-400 rounded-full w-4 h-4"></div>
                          ApeChain
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="abstract"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-green-500 rounded-full w-4 h-4"></div>
                          Abstract
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="berachain"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-500 rounded-full w-4 h-4"></div>
                          Berachain
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="monad"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-500 rounded-full w-4 h-4"></div>
                          Monad
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="arbitrum"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 rounded-full w-4 h-4"></div>
                          Arbitrum
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="sei"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-red-500 rounded-full w-4 h-4"></div>
                          Sei
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="bnb"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-yellow-500 rounded-full w-4 h-4"></div>
                          BNB Chain
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="polygon"
                        className="text-white focus:bg-[#2a2535] focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-600 rounded-full w-4 h-4"></div>
                          Polygon
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Name and Symbol */}
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
          <div>
            <Label className="text-white dark:text-white">Symbol</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="POND"
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
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file);

                    // Create a preview URL for the image
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
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
