import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AllowlistStage, PublicMint } from "./types";

interface MintDetailsProps {
  isLoading: boolean;
  allowlistStages: AllowlistStage[];
  setAllowlistStages: (stages: AllowlistStage[]) => void;
  publicMint: PublicMint;
  setPublicMint: (mint: PublicMint) => void;
  handleAddStage: () => void;
  handleEditStage: (stage: AllowlistStage) => void;
  handleEditPublicMint: () => void;
}

export function MintDetails({
  isLoading,
  allowlistStages,
  setAllowlistStages,
  publicMint,
  setPublicMint,
  handleAddStage,
  handleEditStage,
  handleEditPublicMint,
}: MintDetailsProps) {
  const [date, setDate] = useState<Date>();

  const handleDeleteStage = (stageId: string) => {
    setAllowlistStages(allowlistStages.filter((stage) => stage.id !== stageId));
  };

  return (
    <Card className="bg-gray-900/60 border-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mintPrice">Mint Price</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <div className="flex">
                  <Input
                    id="mintPrice"
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-700 rounded-r-none"
                  />
                  <div className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-3 flex items-center">
                    ETH
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="royaltyFee">Royalty Fee</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <div className="flex">
                  <Input
                    id="royaltyFee"
                    placeholder="0"
                    className="bg-gray-800 border-gray-700 rounded-r-none"
                  />
                  <div className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-3 flex items-center">
                    %
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxSupply">Max Supply</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <Input
                  id="maxSupply"
                  placeholder="10000"
                  className="bg-gray-800 border-gray-700"
                />
              )}
            </div>
            <div>
              <Label htmlFor="mintLimit">Mint Limit per Wallet</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <Input
                  id="mintLimit"
                  placeholder="5"
                  className="bg-gray-800 border-gray-700"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="mintDate">Mint Start Date & Time</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "MM/dd/yyyy h:mm a")
                      : "MM/DD/YYYY 00:00 AM"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <Card className="bg-gray-900/60 border-gray-800">
            <CardContent className="pt-6">
              <Label>Mint Stages</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <div className="space-y-3">
                  <div className="border border-gray-700 rounded-md p-3 bg-gray-800/50 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400"
                      onClick={handleAddStage}
                    >
                      <span className="mr-1">+</span> Add Allowlist Stage
                    </Button>
                  </div>

                  {allowlistStages.map((stage) => (
                    <div
                      key={stage.id}
                      className="border border-gray-700 rounded-md p-4 bg-gray-800/50 relative"
                      onClick={() => handleEditStage(stage)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Allowlist Stage</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStage(stage);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStage(stage.id);
                              }}
                              className="text-red-500"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Price: {stage.mintPrice} ETH</span>
                          <span>
                            Duration: {stage.durationDays}d{" "}
                            {stage.durationHours}h
                          </span>
                        </div>
                        <div className="mt-1">
                          <span>
                            Wallets:{" "}
                            {
                              stage.wallets.split(/[\n,]/).filter(Boolean)
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div
                    className="border border-gray-700 rounded-md p-4 bg-gray-800/50 relative"
                    onClick={handleEditPublicMint}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Public Mint</h3>
                        <span className="bg-green-900 text-green-400 text-xs px-2 py-0.5 rounded">
                          FREE
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPublicMint();
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                      <span>
                        {format(publicMint.startDate, "MMM dd yyyy, HH:mm")}
                      </span>
                      <span>
                        Ends: {format(publicMint.endDate, "MMM dd yyyy, HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
