
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { CollectionDetails } from "./components/CollectionDetails";
import { NFTArtSection } from "./components/NFTArtSection";
import { MintDetails } from "./components/MintDetails";
import { AllowlistStageDialog } from "./components/AllowlistStageDialog";
import { PublicMintDialog } from "./components/PublicMintDialog";
import {
  allowlistStageSchema,
  publicMintSchema,
  formSchema,
  AllowlistStage,
  PublicMint,
} from "./components/types";

export default function CreateCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [publicMint, setPublicMint] = useState<PublicMint>({
    id: "public-mint",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  });
  const [isPublicMintDialogOpen, setIsPublicMintDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { chain: "base", name: "", symbol: "", description: "" },
  });

  const allowlistStageForm = useForm({
    resolver: zodResolver(allowlistStageSchema),
    defaultValues: {
      id: "",
      mintPrice: "",
      durationDays: "",
      durationHours: "",
      wallets: "",
    },
  });

  const publicMintForm = useForm({
    resolver: zodResolver(publicMintSchema),
    defaultValues: publicMint,
  });

  const toggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const onSubmit = (values: any) => {
    toggleLoading();
    toast("Form submitted", {
      description: "Your NFT collection has been created",
    });
  };

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

  const handleEditStage = (stage: AllowlistStage) => {
    setIsEditMode(true);
    allowlistStageForm.reset(stage);
    setIsStageDialogOpen(true);
  };

  const handleSaveStage = (values: AllowlistStage) => {
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

  const handleEditPublicMint = () => {
    publicMintForm.reset(publicMint);
    setIsPublicMintDialogOpen(true);
  };

  const handleSavePublicMint = (values: PublicMint) => {
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
          <CollectionDetails form={form} isLoading={isLoading} />
          <NFTArtSection isLoading={isLoading} />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            setAllowlistStages={setAllowlistStages}
            publicMint={publicMint}
            setPublicMint={setPublicMint}
            handleAddStage={handleAddStage}
            handleEditStage={handleEditStage}
            handleEditPublicMint={handleEditPublicMint}
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Switch Wallet to Base"}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-2">
            By clicking , you agree to the Magic Eden Terms of Service.
          </p>
        </form>
      </Form>

      <AllowlistStageDialog
        isOpen={isStageDialogOpen}
        onOpenChange={setIsStageDialogOpen}
        form={allowlistStageForm}
        onSubmit={handleSaveStage}
      />

      <PublicMintDialog
        isOpen={isPublicMintDialogOpen}
        onOpenChange={setIsPublicMintDialogOpen}
        form={publicMintForm}
        onSubmit={handleSavePublicMint}
      />
    </div>
  );
}
