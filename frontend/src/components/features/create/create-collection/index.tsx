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
import {
  FormData,
  formSchema,
  AllowlistStage,
  PublicMint,
} from "@/types/create-collection.type";
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
  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [selectedChain, setSelectedChain] = useState("Sepolia");
  const [publicMint, setPublicMint] = useState<PublicMint>({
    mintPrice: "0.00",
    durationDays: "1",
    durationHours: "0",
  });
  const [selectedArtType, setSelectedArtType] = useState<"same" | "unique">(
    "unique"
  );
  const [collectionImageFile, setCollectionImageFile] = useState<File | null>(
    null
  );
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chain: "Sepolia",
      name: "",
      description: "",
      artType: "unique",
      uri: "", // Đảm bảo được điền trong onSubmit
      collectionImageUrl: "", // Đảm bảo được điền trong onSubmit
      mintPrice: "0.00",
      royaltyFee: "0",
      maxSupply: "",
      mintLimit: "",
      mintStartDate: new Date().toISOString(),
      allowlistStages: [],
      publicMint: { mintPrice: "0.00", durationDays: "1", durationHours: "0" },
    },
  });

  const watchedChain = form.watch("chain");

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

  useEffect(() => {
    const basicFormValid = form.formState.isValid;
    const hasRequiredFiles =
      collectionImageFile !== null &&
      ((selectedArtType === "same" && artworkFile !== null) ||
        (selectedArtType === "unique" && metadataUrl.trim() !== ""));
    setIsFormValid(basicFormValid && hasRequiredFiles);
  }, [
    form.formState.isValid,
    collectionImageFile,
    selectedArtType,
    artworkFile,
    metadataUrl,
  ]);

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isLoading) return "Processing...";
    if (chain?.name === selectedChain)
      return `Create Collection on ${chain.name}`;
    return `Switch to ${selectedChain}`;
  };

  const handleClearForm = () => {
    form.reset({
      chain: "Sepolia",
      name: "",
      description: "",
      artType: "unique",
      uri: "", // Đảm bảo được điền trong onSubmit
      collectionImageUrl: "", // Đảm bảo được điền trong onSubmit
      mintPrice: "0.00",
      royaltyFee: "0",
      maxSupply: "",
      mintLimit: "",
      mintStartDate: new Date().toISOString(),
      allowlistStages: [],
      publicMint: { mintPrice: "0.00", durationDays: "1", durationHours: "0" },
    });
    setSelectedChain("Sepolia");
    setAllowlistStages([]);
    setPublicMint({ mintPrice: "0.00", durationDays: "1", durationHours: "0" });
    setSelectedArtType("unique");
    setMetadataUrl("");
    setArtworkFile(null);
    setCollectionImageFile(null);
    toast("Form cleared");
  };

  const onSubmit = async (values: FormData) => {
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

    try {
      const collectionImageUrl = await uploadImage(collectionImageFile);
      if (!collectionImageUrl) {
        throw new Error("Failed to upload collection image");
      }

      let tokenUri: string;
      if (selectedArtType === "same") {
        if (!artworkFile) {
          throw new Error("Artwork file is missing for 'Same' type");
        }
        const artworkUrl = await uploadImage(artworkFile);
        if (!artworkUrl) {
          throw new Error("Failed to upload artwork");
        }
        const metadata = {
          name: values.name,
          description: values.description,
          image: artworkUrl,
          attributes: [],
        };
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
          type: "application/json",
        });
        const metadataFile = new File(
          [metadataBlob],
          `${values.name}-metadata.json`
        );
        tokenUri = await uploadImage(metadataFile);
        if (!tokenUri) {
          throw new Error("Failed to upload metadata");
        }
      } else {
        tokenUri = metadataUrl;
        if (!tokenUri) {
          throw new Error("Metadata URL is missing for 'Unique' type");
        }
      }

      const input = {
        chain: values.chain,
        name: values.name,
        description: values.description,
        artType: selectedArtType,
        uri: tokenUri,
        collectionImageUrl,
        mintPrice: values.mintPrice,
        royaltyFee: (parseFloat(values.royaltyFee) * 100).toString(),
        maxSupply: values.maxSupply,
        mintLimit: values.mintLimit,
        mintStartDate: values.mintStartDate,
        allowlistStages: formattedAllowlistStages(allowlistStages) || [],
        publicMint: publicMint || {
          mintPrice: "0.00",
          durationDays: "1",
          durationHours: "0",
        },
      };

      console.log("Input sent to server:", input); // Log để debug

      const { data } = await client.mutate({
        mutation: CreateCollectionDocument,
        variables: { input },
      });
      const { steps, contractAddress } = data.createCollection;

      let finalContractAddress = contractAddress;
      if (steps && steps.length > 0) {
        if (!walletClient) throw new Error("Wallet client not available");
        const provider = new BrowserProvider(walletClient.transport);
        const signer = await provider.getSigner();

        for (const step of steps) {
          // Parse params từ chuỗi JSON thành object
          const params = JSON.parse(step.params);
          const tx = await signer.sendTransaction({
            ...params,
            from: address,
          });
          const receipt = await tx.wait();
          if (!receipt) throw new Error("Receipt not found");
          if (step.id === "create-token") {
            finalContractAddress = receipt.contractAddress;
          } else if (step.id.startsWith("set-whitelist")) {
            console.log(`Whitelist stage ${step.id} set successfully`);
          }
        }
      }

      // Lưu collection vào database
      const saveInput = {
        contractAddress: finalContractAddress,
        chain: values.chain,
        name: values.name,
        description: values.description,
        artType: selectedArtType,
        uri: tokenUri,
        collectionImageUrl,
        mintPrice: values.mintPrice,
        royaltyFee: (parseFloat(values.royaltyFee) * 100).toString(),
        maxSupply: values.maxSupply,
        mintLimit: values.mintLimit,
        mintStartDate: values.mintStartDate,
        allowlistStages: formattedAllowlistStages(allowlistStages) || [],
        publicMint: publicMint || {
          mintPrice: "0.00",
          durationDays: "1",
          durationHours: "0",
        },
      };

      const { data: savedCollectionData } = await client.mutate({
        mutation: CreateCollectionDocument, // Mutation mới
        variables: { input: saveInput },
      });
      console.log("Collection saved to database:", savedCollectionData);
      toast.success("Collection created", {
        description: `Contract Address: ${finalContractAddress}`,
      });
    } catch (error) {
      toast.error("Failed to create collection", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
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
            onArtTypeChange={(type) => {
              setSelectedArtType(type);
              form.setValue("artType", type);
            }}
            onArtworkChange={setArtworkFile}
            onMetadataUrlChange={(url) => {
              setMetadataUrl(url);
              form.setValue("uri", url);
            }}
          />
          <MintDetails
            isLoading={isLoading}
            allowlistStages={allowlistStages}
            setAllowlistStages={(stages) => {
              setAllowlistStages(stages);
              form.setValue("allowlistStages", stages);
            }}
            publicMint={publicMint}
            setPublicMint={(mint) => {
              setPublicMint(mint);
              form.setValue("publicMint", mint);
            }}
            onMintPriceChange={(price) => form.setValue("mintPrice", price)}
            onRoyaltyFeeChange={(fee) => form.setValue("royaltyFee", fee)}
            onMaxSupplyChange={(supply) => form.setValue("maxSupply", supply)}
            onMintLimitChange={(limit) => form.setValue("mintLimit", limit)}
            onMintStartDateChange={(date) =>
              form.setValue("mintStartDate", date.toISOString())
            }
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isLoading}
          >
            {getButtonText()}
          </Button>
        </form>
      </Form>
    </div>
  );
}
