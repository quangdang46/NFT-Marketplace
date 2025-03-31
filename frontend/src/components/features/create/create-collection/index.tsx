/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { formSchema } from "@/types/create-collection.type";
import { type z } from "zod";
import { RotateCcw } from "lucide-react";
import { mockChains } from "@/lib/constant/chains";
import { formattedAllowlistStages } from "@/lib/utils/format";
import { useAccount, useSwitchChain, useConnect, useWalletClient } from "wagmi";
import { injected } from "@wagmi/connectors";
import { uploadImage } from "@/lib/utils/upload";
import client from "@/lib/api/apolloClient";
import { CreateCollectionDocument } from "@/lib/api/graphql/generated";
import { BrowserProvider } from "ethers";
export default function CreateCollection() {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<any[]>([]);
  const [selectedChain, setSelectedChain] = useState("Sepolia");
  const [publicMint, setPublicMint] = useState<any>({
    mintPrice: "0.00",
    durationDays: "1",
    durationHours: "0",
  });
  const [selectedArtType, setSelectedArtType] = useState<"same" | "unique">(
    "unique"
  );
  const [metadataUrl, setMetadataUrl] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [collectionImageFile, setCollectionImageFile] = useState<File | null>(
    null
  );
  const [mintStartDate, setMintStartDate] = useState<Date>(new Date());
  const [mintPrice, setMintPrice] = useState("0.00");
  const [royaltyFee, setRoyaltyFee] = useState("0");
  const [maxSupply, setMaxSupply] = useState("");
  const [mintLimit, setMintLimit] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { chain: "Sepolia", name: "", symbol: "", description: "" },
  });
  const watchedChain = form.watch("chain");

  useEffect(() => {
    const fetchUserRole = async () => {
      setUserRole("user"); // Giả lập
    };
    fetchUserRole();
  }, []);

  const chainDisplayNames = mockChains.reduce((acc, chain) => {
    acc[chain.id] = chain.name;
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    if (watchedChain) setSelectedChain(watchedChain);
  }, [watchedChain]);

  useEffect(() => {
    if (!isConnected || !chain || !chain.name) return;

    const targetChain = mockChains.find((c) => c.name === selectedChain);
    if (targetChain && chain.id !== targetChain.id) {
      switchChain({ chainId: targetChain.id });
    }
  }, [isConnected, chain, selectedChain, switchChain]);

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isLoading) return "Processing...";
    if (chain?.name === selectedChain)
      return `Create Collection on ${chain.name}`;
    return `Switch Wallet to ${
      chainDisplayNames[selectedChain] || selectedChain
    }`;
  };

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
    setPublicMint({ mintPrice: "0.00", durationDays: "1", durationHours: "0" });
    setSelectedArtType("unique");
    setMetadataUrl("");
    setArtworkFile(null);
    setCollectionImageFile(null);
    setMintPrice("0.00");
    setRoyaltyFee("0");
    setMaxSupply("");
    setMintLimit("");
    setMintStartDate(new Date());
    toast("Form cleared", { description: "All form fields have been reset" });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      try {
        await connectAsync({ connector: injected() });
      } catch (error) {
        toast.error("Failed to connect wallet", {
          description: (error as Error).message,
        });
      }
      return;
    }

    if (chain?.name !== selectedChain) {
      const chainId = mockChains.find((c) => c.name === selectedChain)?.id;
      if (chainId) switchChain({ chainId });
      return;
    }

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

    setIsLoading(true);
    const collectionImageUrl = await uploadImage(collectionImageFile);
    let artworkUrl = null;
    if (selectedArtType === "same" && artworkFile)
      artworkUrl = await uploadImage(artworkFile);

    const input = {
      chain: values.chain,
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      artType: selectedArtType,
      uri: selectedArtType === "same" ? artworkUrl : metadataUrl, // Thêm uri
      collectionImageUrl,
      artworkUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate: mintStartDate.toISOString(),
      allowlistStages: formattedAllowlistStages(allowlistStages),
      publicMint,
    };

    try {
      const { data } = await client.mutate({
        mutation: CreateCollectionDocument,
        variables: { input },
      });
      const { steps, contractAddress } = data.createCollection;

      let finalContractAddress = null;
      if (userRole === "user" && steps && steps.length > 0) {
        if (!walletClient) {
          toast.error("Wallet client is not available. Please reconnect.");
          return;
        }
        const provider = new BrowserProvider(walletClient?.transport);
        const signer = await provider.getSigner();

        for (const step of steps) {
          const tx = await signer.sendTransaction({
            ...step.params,
            from: address,
          });
          const receipt = await tx.wait();

          if (receipt && step.id === "create-token") {
            finalContractAddress = receipt.contractAddress;
          }
        }
      } else if (userRole === "admin" && contractAddress) {
        finalContractAddress = contractAddress;
      } else {
        throw new Error("Invalid response from server");
      }

      await proceedToCreateCollection(values, finalContractAddress);
      toast.success("Collection created successfully", {
        description: `Contract Address: ${finalContractAddress}. You can now share this address for others to mint.`,
      });
    } catch (error) {
      toast.error("Failed to create collection", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToCreateCollection = async (
    values: z.infer<typeof formSchema>,
    contractAddress?: string
  ) => {
    const input = {
      chain: values.chain,
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      artType: selectedArtType,
      uri:
        selectedArtType === "same"
          ? await uploadImage(artworkFile!)
          : metadataUrl, // Thêm uri
      collectionImageUrl: await uploadImage(collectionImageFile!),
      artworkUrl:
        selectedArtType === "same" && artworkFile
          ? await uploadImage(artworkFile)
          : null,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate: mintStartDate.toISOString(),
      allowlistStages: formattedAllowlistStages(allowlistStages),
      publicMint,
      contractAddress,
    };

    const result = await client.mutate({
      mutation: CreateCollectionDocument,
      variables: { input },
    });
    return result.data.createCollection;
  };

  return (
    <div className="max-w-3xl mx-auto dark">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearForm}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Clear Form
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CollectionDetails
            form={form}
            isLoading={isLoading}
            onChainChange={setSelectedChain}
            onImageChange={setCollectionImageFile}
          />
          <NFTArtSection
            isLoading={isLoading}
            onArtTypeChange={setSelectedArtType}
            onArtworkChange={setArtworkFile}
            onMetadataUrlChange={setMetadataUrl}
          />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            setAllowlistStages={setAllowlistStages}
            publicMint={publicMint}
            setPublicMint={setPublicMint}
            onMintPriceChange={setMintPrice}
            onRoyaltyFeeChange={setRoyaltyFee}
            onMaxSupplyChange={setMaxSupply}
            onMintLimitChange={setMintLimit}
            onMintStartDateChange={setMintStartDate}
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading || !formIsValid}
          >
            {getButtonText()}
          </Button>
        </form>
      </Form>
    </div>
  );
}
