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
import { formSchema, AllowlistStage, PublicMint } from "@/types/create.type";
import { z } from "zod";
import { RotateCcw } from "lucide-react";

export default function CreateCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [selectedChain, setSelectedChain] = useState("sepolia");
  const [publicMint, setPublicMint] = useState<PublicMint>({
    mintPrice: "0.00",
    durationDays: "1",
    durationHours: "0",
  });

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
  // Chain display names for the button text
  const chainDisplayNames: Record<string, string> = {
    ethereum: "Ethereum",
    base: "Base",
    apechain: "ApeChain",
    abstract: "Abstract",
    berachain: "Berachain",
    monad: "Monad",
    arbitrum: "Arbitrum",
    sei: "Sei",
    bnb: "BNB Chain",
    polygon: "Polygon",
  };

  // Get the button text based on the selected chain
  const getButtonText = () => {
    if (isLoading) return "Processing...";
    return `Switch Wallet to ${
      chainDisplayNames[selectedChain] || selectedChain
    }`;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
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

    // Clear any file inputs
    const fileInput = document.getElementById(
      "collection-image"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast("Form cleared", {
      description: "All form fields have been reset",
    });
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearForm}
          className="text-gray-400 hover:text-white hover:bg-transparent cursor-pointer"
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
          />
          <NFTArtSection isLoading={isLoading} />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            setAllowlistStages={setAllowlistStages}
            publicMint={publicMint}
            setPublicMint={setPublicMint}
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading}
          >
            {getButtonText()}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            By clicking , you agree to the Magic Eden Terms of Service.
          </p>
        </form>
      </Form>
    </div>
  );
}
