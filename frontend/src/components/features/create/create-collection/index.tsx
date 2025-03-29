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
} from "@/types/create-collection.type";
import type { z } from "zod";
import { RotateCcw } from "lucide-react";
import { mockChains } from "@/lib/constant/chains";
import { formattedAllowlistStages } from "@/lib/utils/format";
import { useAccount } from "wagmi";
export default function CreateCollection() {
  const { chain } = useAccount();
  // Create a map for easy lookup
  const chainDisplayNames = mockChains.reduce((acc, chain) => {
    acc[chain.id] = chain.name;
    return acc;
  }, {} as Record<string, string>);

  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [selectedChain, setSelectedChain] = useState("Sepolia");
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
    defaultValues: { chain: "Sepolia", name: "", symbol: "", description: "" },
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
    if (chain?.name === selectedChain) {
      return `Create Collection on ${chain?.name}`;
    }
    return `Switch Wallet to ${
      chainDisplayNames[selectedChain] || selectedChain
    }`;
  };

  // Check form validity
  useEffect(() => {
    const basicFormValid = form.formState.isValid;

    const hasRequiredFields =
      collectionImageFile !== null &&
      ((selectedArtType === "same" && artworkFile !== null) ||
        (selectedArtType === "unique" && metadataUrl.trim() !== "")) &&
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

  const handleClearForm = () => {
    form.reset({ chain: "Sepolia", name: "", symbol: "", description: "" });
    setSelectedChain("Sepolia");
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!collectionImageFile) {
      toast.error("Please upload a collection image");
      return;
    }
    if (selectedArtType === "same" && !artworkFile) {
      toast.error("Please upload an artwork file for 'Same' type");
      return;
    }
    if (selectedArtType === "unique" && !metadataUrl.trim()) {
      toast.error("Please provide a metadata URL for 'Unique' type");
      return;
    }

    toggleLoading();

    // Chuẩn bị variables cho GraphQL mutation
    const variables = {
      chain: values.chain,
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      artType: selectedArtType,
      metadataUrl: selectedArtType === "unique" ? metadataUrl : null,
      artwork: selectedArtType === "same" ? artworkFile : null,
      collectionImage: collectionImageFile,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate: mintStartDate.toISOString(),
      allowlistStages: formattedAllowlistStages(allowlistStages),
      publicMint,
    };
    console.log("Submitting variables:", variables);
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
