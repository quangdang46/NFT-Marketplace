import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface NFTArtSectionProps {
  isLoading: boolean;
}

export function NFTArtSection({ isLoading }: NFTArtSectionProps) {
  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label>NFT Art Type</Label>
          {isLoading ? (
            <Skeleton className="h-32 w-full mt-1" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex">
                <RadioGroup defaultValue="same" className="w-full">
                  <div className="border border-gray-700 rounded-md p-4 flex items-start gap-3 bg-gray-800/50 relative">
                    <RadioGroupItem value="same" id="same" className="mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt="Same artwork icon"
                          className="h-10 w-10"
                        />
                        <Label htmlFor="same" className="font-medium">
                          Same Artwork
                        </Label>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        An ERC-1155 collection where everyone mints the same
                        artwork.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex">
                <RadioGroup defaultValue="same" className="w-full">
                  <div className="border border-gray-700 rounded-md p-4 flex items-start gap-3 bg-gray-800/50">
                    <RadioGroupItem
                      value="unique"
                      id="unique"
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-0.5">
                          <img
                            src="/placeholder.svg?height=20&width=20"
                            alt="Unique artwork icon 1"
                            className="h-5 w-5"
                          />
                          <img
                            src="/placeholder.svg?height=20&width=20"
                            alt="Unique artwork icon 2"
                            className="h-5 w-5"
                          />
                          <img
                            src="/placeholder.svg?height=20&width=20"
                            alt="Unique artwork icon 3"
                            className="h-5 w-5"
                          />
                          <img
                            src="/placeholder.svg?height=20&width=20"
                            alt="Unique artwork icon 4"
                            className="h-5 w-5"
                          />
                        </div>
                        <Label htmlFor="unique" className="font-medium">
                          Unique Artwork
                        </Label>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        An ERC-721 collection where everyone mints a unique
                        artwork.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* NFT Art Upload */}
          {isLoading ? (
            <Skeleton className="h-40 w-full mt-1" />
          ) : (
            <div className="border border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-gray-800/50">
              <Upload className="h-6 w-6 mb-2 text-gray-400" />
              <p className="text-sm text-center text-gray-400">
                Drop your artwork here to upload
                <br />
                <span className="text-xs">
                  File types allowed: jpg, png. Max file size: 10MB
                </span>
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Choose Image...
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
