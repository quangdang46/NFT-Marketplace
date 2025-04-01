"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle } from "lucide-react";
import { AllowlistStageDialog } from "./AllowlistStageDialog";
import { PublicStageDialog } from "./PublicStageDialog";
import type {
  AllowlistStage,
  PublicMint,
} from "@/types/create-collection.type";

interface MintDetailsProps {
  isLoading: boolean;
  allowlistStages: AllowlistStage[];
  setAllowlistStages: (stages: AllowlistStage[]) => void;
  publicMint: PublicMint;
  setPublicMint: (mint: PublicMint) => void;
  onMintPriceChange?: (price: string) => void;
  onRoyaltyFeeChange?: (fee: string) => void;
  onMaxSupplyChange?: (supply: string) => void;
  onMintLimitChange?: (limit: string) => void;
  onMintStartDateChange?: (date: Date) => void;
}

export function MintDetails({
  isLoading,
  allowlistStages,
  setAllowlistStages,
  publicMint,
  setPublicMint,
  onMintPriceChange,
  onRoyaltyFeeChange,
  onMaxSupplyChange,
  onMintLimitChange,
  onMintStartDateChange,
}: MintDetailsProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isAllowlistDialogOpen, setIsAllowlistDialogOpen] = useState(false);
  const [isPublicMintDialogOpen, setIsPublicMintDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<AllowlistStage | null>(null);

  // Form field states
  const [collectionMintPrice, setCollectionMintPrice] = useState("0.00");
  const [royaltyFee, setRoyaltyFee] = useState("0");
  const [maxSupply, setMaxSupply] = useState("");
  const [mintLimit, setMintLimit] = useState("");

  // Notify parent component when values change
  useEffect(() => {
    if (onMintStartDateChange) onMintStartDateChange(date);
  }, [date, onMintStartDateChange]);

  useEffect(() => {
    if (onMintPriceChange) onMintPriceChange(collectionMintPrice);
  }, [collectionMintPrice, onMintPriceChange]);

  useEffect(() => {
    if (onRoyaltyFeeChange) onRoyaltyFeeChange(royaltyFee);
  }, [royaltyFee, onRoyaltyFeeChange]);

  useEffect(() => {
    if (onMaxSupplyChange) onMaxSupplyChange(maxSupply);
  }, [maxSupply, onMaxSupplyChange]);

  useEffect(() => {
    if (onMintLimitChange) onMintLimitChange(mintLimit);
  }, [mintLimit, onMintLimitChange]);

  const handleDeleteStage = (stageId: string) => {
    setAllowlistStages(allowlistStages.filter((stage) => stage.id !== stageId));
  };

  const openEditStageDialog = (stage: AllowlistStage) => {
    setCurrentStage(stage);
    setIsAllowlistDialogOpen(true);
  };

  const handleAddStage = () => {
    const newStage: AllowlistStage = {
      id: crypto.randomUUID(),
      mintPrice: "0.00",
      durationDays: "1",
      durationHours: "0",
      wallets: "",
      startDate: date.toISOString(),
    };
    setAllowlistStages([...allowlistStages, newStage]);
    setIsAllowlistDialogOpen(true); // Mở dialog để chỉnh sửa ngay
    setCurrentStage(newStage);
  };

  const handleSaveStage = (stage: AllowlistStage) => {
    if (currentStage) {
      setAllowlistStages(
        allowlistStages.map((s) => (s.id === currentStage.id ? stage : s))
      );
    } else {
      setAllowlistStages([...allowlistStages, stage]);
    }
    setIsAllowlistDialogOpen(false);
    setCurrentStage(null);
  };

  const handleSavePublicMint = (updatedPublicMint: PublicMint) => {
    setPublicMint(updatedPublicMint);
    setIsPublicMintDialogOpen(false);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      if (onMintStartDateChange) onMintStartDateChange(newDate);
    }
  };

  const calculateEndDate = (start: string, days: string, hours: string) => {
    const startDate = new Date(start);
    const durationMs = parseInt(days) * 86400000 + parseInt(hours) * 3600000;
    return new Date(startDate.getTime() + durationMs);
  };

  return (
    <div className="dark">
      <div className="space-y-6 bg-[#0e0a1a] dark:bg-[#0e0a1a] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="mintPrice" className="text-white dark:text-white">
                Mint Price
              </Label>
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <div className="flex mt-2">
                <Input
                  id="mintPrice"
                  value={collectionMintPrice}
                  onChange={(e) => setCollectionMintPrice(e.target.value)}
                  className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="bg-[#2a2535] dark:bg-[#2a2535] border border-[#3a3450] dark:border-[#3a3450] rounded-r-md px-4 flex items-center text-white dark:text-white">
                  ETH
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor="royaltyFee"
                className="text-white dark:text-white"
              >
                Royalty Fee
              </Label>
              <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <div className="flex mt-2">
                <Input
                  id="royaltyFee"
                  value={royaltyFee}
                  onChange={(e) => setRoyaltyFee(e.target.value)}
                  className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="bg-[#2a2535] dark:bg-[#2a2535] border border-[#3a3450] dark:border-[#3a3450] rounded-r-md px-4 flex items-center text-white dark:text-white">
                  %
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="maxSupply" className="text-white dark:text-white">
                Max Supply
              </Label>
              <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <Input
                id="maxSupply"
                value={maxSupply}
                onChange={(e) => setMaxSupply(e.target.value)}
                className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="mintLimit" className="text-white dark:text-white">
                Mint Limit per Wallet
              </Label>
              <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-1" />
            ) : (
              <Input
                id="mintLimit"
                value={mintLimit}
                onChange={(e) => setMintLimit(e.target.value)}
                className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="mintDate" className="text-white dark:text-white">
            Mint Start Date & Time
          </Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "MM/dd/yyyy h:mm a") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1a1525] border-[#3a3450]">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="bg-[#1a1525] text-white"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div>
          <Label className="text-white dark:text-white">Mint Stages</Label>
          {isLoading ? (
            <Skeleton className="h-40 w-full mt-1" />
          ) : (
            <div className="space-y-3 mt-2">
              {allowlistStages.map((stage) => (
                <div
                  key={stage.id}
                  className="border border-[#3a3450] dark:border-[#3a3450] rounded-md p-4 bg-[#1a1525] dark:bg-[#1a1525] relative cursor-pointer"
                  onClick={() => openEditStageDialog(stage)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white dark:text-white">
                        Allowlist Mint - {stage.id}
                      </h3>
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded">
                        {stage.mintPrice} ETH
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1525] border-[#3a3450]"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditStageDialog(stage);
                          }}
                          className="text-white hover:bg-[#2a2535] cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStage(stage.id);
                          }}
                          className="text-red-500 hover:bg-[#2a2535] cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>
                      {format(new Date(stage.startDate), "MMM dd yyyy, h:mm a")}
                    </span>
                    <span>
                      Ends:{" "}
                      {format(
                        calculateEndDate(
                          stage.startDate,
                          stage.durationDays,
                          stage.durationHours
                        ),
                        "MMM dd yyyy, h:mm a"
                      )}
                    </span>
                  </div>
                </div>
              ))}

              <div
                className="border border-[#3a3450] dark:border-[#3a3450] rounded-md p-4 bg-[#1a1525] dark:bg-[#1a1525] relative cursor-pointer"
                onClick={() => setIsPublicMintDialogOpen(true)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white dark:text-white">
                      Public Mint
                    </h3>
                    <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded">
                      {publicMint.mintPrice} ETH
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#1a1525] border-[#3a3450]"
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPublicMintDialogOpen(true);
                        }}
                        className="text-white hover:bg-[#2a2535] cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>
                    {publicMint.startDate
                      ? format(
                          new Date(publicMint.startDate),
                          "MMM dd yyyy, h:mm a"
                        )
                      : "Not set"}
                  </span>
                  <span>
                    Ends:{" "}
                    {publicMint.startDate
                      ? format(
                          calculateEndDate(
                            publicMint.startDate,
                            publicMint.durationDays,
                            publicMint.durationHours
                          ),
                          "MMM dd yyyy, h:mm a"
                        )
                      : "Not set"}
                  </span>
                </div>
              </div>

              <div className="border border-[#1a1525] dark:border-[#1a1525] rounded-md p-3 bg-[#0e0a1a] flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer w-full text-gray-400 flex items-center justify-center gap-2 hover:bg-transparent hover:text-gray-400"
                  onClick={handleAddStage}
                  style={{ backgroundColor: "transparent" }}
                >
                  <Plus className="h-4 w-4" /> Add Allowlist Stage
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <AllowlistStageDialog
          isOpen={isAllowlistDialogOpen}
          onOpenChange={setIsAllowlistDialogOpen}
          stage={currentStage}
          onSave={handleSaveStage}
        />

        <PublicStageDialog
          isOpen={isPublicMintDialogOpen}
          onOpenChange={setIsPublicMintDialogOpen}
          publicMint={publicMint}
          onSave={handleSavePublicMint}
        />
      </div>
    </div>
  );
}
