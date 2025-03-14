/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Calendar,
  Check,
  HelpCircle,
  MoreVertical,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define a schema for Allowlist Stage
const allowlistStageSchema = z.object({
  id: z.string(),
  mintPrice: z.string().min(1, "Mint price is required"),
  durationDays: z.string().min(1, "Days are required"),
  durationHours: z.string().min(1, "Hours are required"),
  wallets: z.string().min(1, "Wallet addresses are required"),
});

type AllowlistStage = z.infer<typeof allowlistStageSchema>;

// Add a new schema for Public Mint
const publicMintSchema = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

type PublicMint = z.infer<typeof publicMintSchema>;

export default function CreateCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [publicMint, setPublicMint] = useState<PublicMint>({
    id: "public-mint",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to 1 day later
  });
  const [isPublicMintDialogOpen, setIsPublicMintDialogOpen] = useState(false);

  const [date, setDate] = useState<Date>();

  // Initialize the form
  const formSchema = z.object({
    chain: z.string(),
    name: z.string().min(2, {
      message: "Collection name must be at least 2 characters.",
    }),
    symbol: z.string().min(2, {
      message: "Symbol must be at least 2 characters.",
    }),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chain: "base",
      name: "",
      symbol: "",
      description: "",
    },
  });

  // Initialize the allowlist stage form
  const allowlistStageForm = useForm<z.infer<typeof allowlistStageSchema>>({
    resolver: zodResolver(allowlistStageSchema),
    defaultValues: {
      id: "",
      mintPrice: "",
      durationDays: "",
      durationHours: "",
      wallets: "",
    },
  });

  // Initialize the public mint form
  const publicMintForm = useForm<z.infer<typeof publicMintSchema>>({
    resolver: zodResolver(publicMintSchema),
    defaultValues: publicMint,
  });

  // Simulate loading for demonstration
  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toggleLoading();
    toast("Form submitted", {
      description: "Your NFT collection has been created",
    });
  };

  // Handle adding a new stage
  const handleAddStage = () => {
    setIsEditMode(false);
    allowlistStageForm.reset({
      id: crypto.randomUUID(),
      mintPrice: "",
      durationDays: "",
      durationHours: "",
      wallets: "",
    });
    setIsStageDialogOpen(true);
  };

  // Handle editing an existing stage
  const handleEditStage = (stage: AllowlistStage) => {
    setIsEditMode(true);
    allowlistStageForm.reset(stage);
    setIsStageDialogOpen(true);
  };

  // Handle deleting a stage
  const handleDeleteStage = (stageId: string) => {
    setAllowlistStages(allowlistStages.filter((stage) => stage.id !== stageId));
    toast("Stage deleted", {
      description: "The allowlist stage has been removed",
    });
  };

  // Handle saving a stage
  const handleSaveStage = (values: z.infer<typeof allowlistStageSchema>) => {
    if (isEditMode) {
      setAllowlistStages(
        allowlistStages.map((stage) =>
          stage.id === values.id ? values : stage
        )
      );
      toast("Stage updated", {
        description: "The allowlist stage has been updated",
      });
    } else {
      setAllowlistStages([...allowlistStages, values]);
      toast("Stage added", {
        description: "A new allowlist stage has been added",
      });
    }
    setIsStageDialogOpen(false);
  };

  // Handle editing public mint
  const handleEditPublicMint = () => {
    publicMintForm.reset(publicMint);
    setIsPublicMintDialogOpen(true);
  };

  // Handle saving public mint
  const handleSavePublicMint = (values: z.infer<typeof publicMintSchema>) => {
    setPublicMint(values);
    setIsPublicMintDialogOpen(false);
    toast("Public Mint updated", {
      description: "The public mint details have been updated",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Chain Selection */}
          <Card className="bg-gray-900/60 border-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
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
                  <div>
                    <Label htmlFor="name">Name</Label>
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
                                className="bg-gray-800 border-gray-700"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
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
                                className="bg-gray-800 border-gray-700"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Collection Image */}
                <div>
                  <Label>Collection Image</Label>
                  <p className="text-sm text-gray-400 mb-2">
                    Image that will be shown as the main image for the
                    collection. Recommended: 800x800px jpg
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
                <div>
                  <Label htmlFor="description">Description</Label>
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
                              className="bg-gray-800 border-gray-700 min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NFT Art Type */}
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
                          <RadioGroupItem
                            value="same"
                            id="same"
                            className="mt-1"
                          />
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
                              An ERC-1155 collection where everyone mints the
                              same artwork.
                            </p>
                          </div>
                          <div className="absolute top-2 right-2 text-green-500">
                            <Check className="h-5 w-5" />
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
                              An ERC-721 collection where everyone mints a
                              unique artwork.
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

          {/* Mint Details */}
          <Card className="bg-gray-900/60 border-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Mint Price & Royalty Fee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="mintPrice">Mint Price</Label>
                    </div>
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
                    <div className="flex items-center gap-1">
                      <Label htmlFor="royaltyFee">Royalty Fee</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">
                            Percentage of secondary sales that goes to the
                            creator.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
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

                {/* Max Supply & Mint Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="maxSupply">Max Supply</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">
                            Maximum number of NFTs that can be minted.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
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
                    <div className="flex items-center gap-1">
                      <Label htmlFor="mintLimit">Mint Limit per Wallet</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <p className="text-sm">
                            Maximum number of NFTs that can be minted per
                            wallet.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
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

                {/* Mint Start Date & Time */}
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

                {/* Mint Stages */}
                <Card className="bg-gray-900/60 border-gray-800 dark:bg-gray-800/60 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Label>Mint Stages</Label>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full mt-1" />
                      ) : (
                        <div className="space-y-3">
                          <div className="border border-gray-700 rounded-md p-3 bg-gray-800/50 dark:bg-gray-700/50 flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400"
                              onClick={handleAddStage}
                            >
                              <span className="mr-1">+</span> Add Allowlist
                              Stage
                            </Button>
                          </div>

                          {/* List of added stages */}
                          {allowlistStages.map((stage) => (
                            <div
                              key={stage.id}
                              className="border border-gray-700 rounded-md p-4 bg-gray-800/50 dark:bg-gray-700/50 relative"
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
                                      className="text-red-500 dark:text-red-400"
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
                                      stage.wallets
                                        .split(/[\n,]/)
                                        .filter(Boolean).length
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Public Mint */}
                          <div
                            className="border border-gray-700 rounded-md p-4 bg-gray-800/50 dark:bg-gray-700/50 relative"
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
                                {format(
                                  publicMint.startDate,
                                  "MMM dd yyyy, HH:mm"
                                )}
                              </span>
                              <span>
                                Ends:{" "}
                                {format(
                                  publicMint.endDate,
                                  "MMM dd yyyy, HH:mm"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Switch Wallet to Base"}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-2">
            By clicking &quot;publish on base&quot;, you agree to the Magic Eden Terms of
            Service.
          </p>
        </form>
      </Form>

      {/* Allowlist Stage Dialog */}
      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 sm:max-w-[425px]">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">Allowlist Stage</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => setIsStageDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Form {...allowlistStageForm}>
            <form
              onSubmit={allowlistStageForm.handleSubmit(handleSaveStage)}
              className="space-y-4 py-4"
            >
              <FormField
                control={allowlistStageForm.control}
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
                <Label>Stage Duration</Label>
                <div className="flex gap-2">
                  <FormField
                    control={allowlistStageForm.control}
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
                    control={allowlistStageForm.control}
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
                control={allowlistStageForm.control}
                name="wallets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowlist</FormLabel>
                    <p className="text-sm text-gray-400">
                      Enter allowlisted wallets separated by new lines or commas
                    </p>
                    <FormControl>
                      <Textarea
                        placeholder="0xAbCdEf123456789abcdef123456789ABCDEF12&#10;0xBcDeF0987654321bcdef0987654321BCDEF098"
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

      {/* Public Mint Dialog */}
      <Dialog
        open={isPublicMintDialogOpen}
        onOpenChange={setIsPublicMintDialogOpen}
      >
        <DialogContent className="bg-gray-900 border-gray-800 text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
          <DialogTitle className="text-white">Edit Public Mint</DialogTitle>

          <Form {...publicMintForm}>
            <form
              onSubmit={publicMintForm.handleSubmit(handleSavePublicMint)}
              className="space-y-4"
            >
              {/* Start Date */}
              <FormField
                control={publicMintForm.control}
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

              {/* End Date */}
              <FormField
                control={publicMintForm.control}
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
    </div>
  );
}
