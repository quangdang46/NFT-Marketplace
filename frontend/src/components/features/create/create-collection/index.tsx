
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RotateCcw } from "lucide-react";
import { CollectionDetails } from "./CollectionDetails";
import { NFTArtSection } from "./NFTArtSection";
import { MintDetails } from "./MintDetails";
import { useCreateCollection } from "@/hooks/useCreateCollection";
import { AllowlistStage, PublicMint } from "@/types/create-collection.type";

export default function CreateCollection() {
  const {
    form,
    isLoading,
    allowlistStages,
    publicMint,
    isFormValid,
    setAllowlistStages,
    setSelectedChain,
    setPublicMint,
    setSelectedArtType,
    setCollectionImageFile,
    setArtworkFile,
    setMetadataUrl,
    getButtonText,
    handleClearForm,
    onSubmit,
  } = useCreateCollection();

  const callbacks = {
    onChainChange: setSelectedChain,
    onImageChange: setCollectionImageFile,
    onArtTypeChange: (type: "same" | "unique") => { setSelectedArtType(type); form.setValue("artType", type); },
    onArtworkChange: setArtworkFile,
    onMetadataUrlChange: (url: string) => { setMetadataUrl(url); form.setValue("uri", url); },
    setAllowlistStages: (stages: AllowlistStage[]) => { setAllowlistStages(stages); form.setValue("allowlistStages", stages); },
    setPublicMint: (mint: PublicMint) => { setPublicMint(mint); form.setValue("publicMint", mint); },
    onMintPriceChange: (price: string) => form.setValue("mintPrice", price),
    onRoyaltyFeeChange: (fee: string) => form.setValue("royaltyFee", fee),
    onMaxSupplyChange: (supply: string) => form.setValue("maxSupply", supply),
    onMintLimitChange: (limit: string) => form.setValue("mintLimit", limit),
    onMintStartDateChange: (date: Date) => form.setValue("mintStartDate", date.toISOString()),
  };

  return (
    <div className="max-w-3xl mx-auto dark">
      <div className="flex justify-end mb-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleClearForm}>
          <RotateCcw className="h-4 w-4 mr-1" /> Clear Form
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CollectionDetails form={form} isLoading={isLoading} {...callbacks} />
          <NFTArtSection isLoading={isLoading} {...callbacks} />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            publicMint={publicMint}
            {...callbacks}
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading || !isFormValid}
          >
            {getButtonText()}
          </Button>
        </form>
      </Form>
    </div>
  );
}