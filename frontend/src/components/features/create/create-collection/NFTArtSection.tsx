

"use client";

import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Check, Link, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface NFTArtSectionProps {
  isLoading: boolean;
}

export function NFTArtSection({ isLoading }: NFTArtSectionProps) {
  const [selectedType, setSelectedType] = useState<"same" | "unique">("unique");
  const [showMetadataUrl, setShowMetadataUrl] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const removeSelectedImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    const input = document.getElementById("nft-artwork") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="dark">
      <div className="space-y-4 bg-[#0e0a1a] dark:bg-[#0e0a1a] p-6 rounded-lg">
        <Label className="text-white dark:text-white">NFT Art Type</Label>
        {isLoading ? (
          <Skeleton className="h-80 w-full mt-1" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-4">
              {/* Same Artwork Option */}
              <div
                className={`relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedType === "same"
                    ? "border-[#3a3450] bg-[#1a1525] dark:border-[#3a3450] dark:bg-[#1a1525]"
                    : "border-[#1e1a2a] bg-transparent dark:border-[#1e1a2a] hover:border-[#3a3450] dark:hover:border-[#3a3450]"
                }`}
                onClick={() => {
                  setSelectedType("same");
                  setShowMetadataUrl(false);
                }}
              >
                <div className="flex-shrink-0">
                  <Image
                    src="https://placehold.co/60x60"
                    alt="Same artwork character"
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white dark:text-white">
                    Same Artwork
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    An ERC-1155 collection where everyone mints the same artwork
                  </p>
                </div>
                {selectedType === "same" && (
                  <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                )}
              </div>

              {/* Unique Artwork Option */}
              <div
                className={`relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedType === "unique"
                    ? "border-[#3a3450] bg-[#1a1525] dark:border-[#3a3450] dark:bg-[#1a1525]"
                    : "border-[#1e1a2a] bg-transparent dark:border-[#1e1a2a] hover:border-[#3a3450] dark:hover:border-[#3a3450]"
                }`}
                onClick={() => {
                  setSelectedType("unique");
                  setShowMetadataUrl(true);
                }}
              >
                <div className="flex-shrink-0 grid grid-cols-2 gap-1">
                  <Image
                    src="https://placehold.co/28x28"
                    alt="Unique artwork character 1"
                    width={28}
                    height={28}
                    className="rounded-sm"
                  />
                  <Image
                    src="https://placehold.co/28x28"
                    alt="Unique artwork character 2"
                    width={28}
                    height={28}
                    className="rounded-sm"
                  />
                  <Image
                    src="https://placehold.co/28x28"
                    alt="Unique artwork character 3"
                    width={28}
                    height={28}
                    className="rounded-sm"
                  />
                  <Image
                    src="https://placehold.co/28x28"
                    alt="Unique artwork character 4"
                    width={28}
                    height={28}
                    className="rounded-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white dark:text-white">
                    Unique Artwork
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    An ERC-721 collection where everyone mints a unique artwork
                  </p>
                </div>
                {selectedType === "unique" && (
                  <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Upload or Metadata URL */}
            <div className="flex flex-col">
              {showMetadataUrl ? (
                <div className="border border-dashed border-[#3a3450] dark:border-[#3a3450] rounded-lg p-6 flex flex-col items-center justify-center h-full bg-transparent">
                  <Link className="h-10 w-10 mb-4 text-gray-400" />
                  <h3 className="font-medium text-white dark:text-white mb-1">
                    Metadata URL
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 text-center mb-4">
                    Check our{" "}
                    <span className="text-blue-400 underline cursor-pointer">
                      step-by-step guide
                    </span>{" "}
                    on how to generate and upload your collection assets and
                    metadata.
                  </p>
                  <Input
                    placeholder="https://ipfs.io/ipfs/<CID>"
                    value={metadataUrl}
                    onChange={(e) => setMetadataUrl(e.target.value)}
                    className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              ) : (
                <div className="border border-dashed border-[#3a3450] dark:border-[#3a3450] rounded-lg p-6 flex flex-col items-center justify-center h-full bg-transparent">
                  <input
                    type="file"
                    id="nft-artwork"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-2">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Artwork preview"
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                          onClick={removeSelectedImage}
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
                      <Upload className="h-10 w-10 mb-4 text-gray-400" />
                      <h3 className="font-medium text-white dark:text-white mb-1">
                        Drop your artwork here to upload
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-400 text-center mb-4">
                        File types allowed: jpg, png. Max file size: 10MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white hover:bg-[#2a2535] dark:hover:bg-[#2a2535]"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById("nft-artwork")?.click();
                        }}
                      >
                        Choose Image...
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

