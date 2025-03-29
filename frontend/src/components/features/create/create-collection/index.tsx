"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { CollectionDetails } from "./CollectionDetails";
import { NFTArtSection } from "./NFTArtSection";
import { MintDetails } from "./MintDetails";
import {
  formSchema,
  type AllowlistStage,
  type PublicMint,
} from "@/types/create.type";
import type { z } from "zod";
import { RotateCcw } from "lucide-react";


// Define chain data structure
export type ChainInfo = {
  id: string
  label: string
  color: string
}


export default function CreateCollection() {

    const availableChains: ChainInfo[] = [
      { id: "ethereum", label: "Ethereum", color: "bg-purple-500" },
      { id: "base", label: "Base", color: "bg-blue-500" },
      { id: "sepolia", label: "Sepolia", color: "bg-blue-300" },
      { id: "apechain", label: "ApeChain", color: "bg-blue-400" },
      { id: "abstract", label: "Abstract", color: "bg-green-500" },
      { id: "berachain", label: "Berachain", color: "bg-orange-500" },
      { id: "monad", label: "Monad", color: "bg-indigo-500" },
      { id: "arbitrum", label: "Arbitrum", color: "bg-blue-600" },
      { id: "sei", label: "Sei", color: "bg-red-500" },
      { id: "bnb", label: "BNB Chain", color: "bg-yellow-500" },
      { id: "polygon", label: "Polygon", color: "bg-purple-600" },
    ];

    // Create a map for easy lookup
    const chainDisplayNames = availableChains.reduce((acc, chain) => {
      acc[chain.id] = chain.label;
      return acc;
    }, {} as Record<string, string>);




  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [selectedChain, setSelectedChain] = useState("sepolia");
  const [publicMint, setPublicMint] = useState<PublicMint>({
    mintPrice: "0.00",
    durationDays: "1",
    durationHours: "0",
  });

  // NFT Art Section state
  const [selectedArtType, setSelectedArtType] = useState<"same" | "unique">(
    "unique"
  );
  const [metadataUrl, setMetadataUrl] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  // Collection image state
  const [collectionImageFile, setCollectionImageFile] = useState<File | null>(
    null
  );

  // Mint details state
  const [mintStartDate, setMintStartDate] = useState<Date>(new Date());
  const [mintPrice, setMintPrice] = useState("0.00");
  const [royaltyFee, setRoyaltyFee] = useState("0");
  const [maxSupply, setMaxSupply] = useState("");
  const [mintLimit, setMintLimit] = useState("");
  // Form validation state
  const [formIsValid, setFormIsValid] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { chain: "base", name: "", symbol: "", description: "" },
  });

  // Watch for chain changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "chain" && value.chain) {
        setSelectedChain(value.chain as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };


  // Get the button text based on the selected chain
  const getButtonText = () => {
    if (isLoading) return "Processing...";
    return `Switch Wallet to ${
      chainDisplayNames[selectedChain] || selectedChain
    }`;
  };

  // Check form validity
  useEffect(() => {
    // Basic form validation from react-hook-form
    const basicFormValid = form.formState.isValid;

    // Additional validation for required fields not in the schema
    const hasRequiredFields =
      // Check if collection image is selected
      collectionImageFile !== null &&
      // Check if artwork is selected for "same" type or metadata URL is provided for "unique" type
      ((selectedArtType === "same" && artworkFile !== null) ||
        (selectedArtType === "unique" && metadataUrl.trim() !== "")) &&
      // Check mint details
      maxSupply.trim() !== "" &&
      mintLimit.trim() !== "";

    setFormIsValid(basicFormValid && hasRequiredFields);
  }, [
    form.formState.isValid,
    collectionImageFile,
    selectedArtType,
    artworkFile,
    metadataUrl,
    maxSupply,
    mintLimit,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Collect all form data
    const completeFormData = {
      // Basic form fields from formSchema
      ...values,

      // NFT Art Type data
      artType: selectedArtType,
      ...(selectedArtType === "same"
        ? { artwork: artworkFile }
        : { metadataUrl }),

      // Mint Details
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate,
      allowlistStages,
      publicMint,

      // Collection Image
      collectionImage: collectionImageFile,
    };

    console.log("Form submitted:", completeFormData);

    // For demonstration, let's also log what would be sent in a FormData object
    const formData = new FormData();

    // Add basic form fields
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Add files
    if (collectionImageFile) {
      formData.append("collectionImage", collectionImageFile);
    }

    // Add NFT art type data
    formData.append("artType", selectedArtType);
    if (selectedArtType === "same" && artworkFile) {
      formData.append("artwork", artworkFile);
    } else if (selectedArtType === "unique") {
      formData.append("metadataUrl", metadataUrl);
    }

    // Add mint details
    formData.append("mintPrice", mintPrice);
    formData.append("royaltyFee", royaltyFee);
    formData.append("maxSupply", maxSupply);
    formData.append("mintLimit", mintLimit);
    formData.append("mintStartDate", mintStartDate.toISOString());

    // Add allowlist stages and public mint (as JSON strings)
    formData.append("allowlistStages", JSON.stringify(allowlistStages));
    formData.append("publicMint", JSON.stringify(publicMint));

    // Log what would be sent (can't log the actual FormData contents directly)
    console.log("FormData would contain:", {
      basicFields: values,
      files: {
        collectionImage: collectionImageFile?.name,
        artwork: artworkFile?.name,
      },
      artType: selectedArtType,
      metadataUrl: metadataUrl,
      mintDetails: {
        mintPrice,
        royaltyFee,
        maxSupply,
        mintLimit,
        mintStartDate,
      },
      allowlistStages,
      publicMint,
    });

    toggleLoading();
    toast("Form submitted", {
      description: "Your NFT collection has been created",
    });
  };

  const handleClearForm = () => {
    form.reset({ chain: "base", name: "", symbol: "", description: "" });
    setSelectedChain("base");
    setAllowlistStages([]);
    setPublicMint({
      mintPrice: "0.00",
      durationDays: "1",
      durationHours: "0",
    });
    setSelectedArtType("unique");
    setMetadataUrl("");
    setArtworkFile(null);
    setCollectionImageFile(null);
    setMintPrice("0.00");
    setRoyaltyFee("0");
    setMaxSupply("");
    setMintLimit("");
    setMintStartDate(new Date());

    // Clear any file inputs
    const collectionImageInput = document.getElementById(
      "collection-image"
    ) as HTMLInputElement;
    if (collectionImageInput) collectionImageInput.value = "";

    const artworkInput = document.getElementById(
      "nft-artwork"
    ) as HTMLInputElement;
    if (artworkInput) artworkInput.value = "";

    toast("Form cleared", {
      description: "All form fields have been reset",
    });
  };

  return (
    <div className="max-w-3xl mx-auto dark">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearForm}
          className="text-gray-400 hover:text-white hover:bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Clear Form
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CollectionDetails
            form={form}
            isLoading={isLoading}
            onChainChange={(chain) => setSelectedChain(chain)}
            onImageChange={(file) => setCollectionImageFile(file)}
            availableChains={availableChains}
          />
          <NFTArtSection
            isLoading={isLoading}
            onArtTypeChange={(type) => setSelectedArtType(type)}
            onArtworkChange={(file) => setArtworkFile(file)}
            onMetadataUrlChange={(url) => setMetadataUrl(url)}
          />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            setAllowlistStages={setAllowlistStages}
            publicMint={publicMint}
            setPublicMint={setPublicMint}
            onMintPriceChange={(price) => setMintPrice(price)}
            onRoyaltyFeeChange={(fee) => setRoyaltyFee(fee)}
            onMaxSupplyChange={(supply) => setMaxSupply(supply)}
            onMintLimitChange={(limit) => setMintLimit(limit)}
            onMintStartDateChange={(date) => setMintStartDate(date)}
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading || !formIsValid}
          >
            {getButtonText()}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            By clicking, you agree to the Magic Eden Terms of Service.
          </p>
        </form>
      </Form>
    </div>
  );
}
