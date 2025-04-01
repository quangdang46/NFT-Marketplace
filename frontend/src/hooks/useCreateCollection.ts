/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useSwitchChain, useConnect, useWalletClient } from "wagmi";
import { injected } from "@wagmi/connectors";
import { toast } from "sonner";
import { BrowserProvider } from "ethers";
import { FormData, formSchema, AllowlistStage, PublicMint } from "@/types/create-collection.type";
import { mockChains } from "@/lib/constant/chains";
import { formattedAllowlistStages } from "@/lib/utils/format";
import { uploadImage } from "@/lib/utils/upload";
import client from "@/lib/api/apolloClient";
import { CreateCollectionDocument } from "@/lib/api/graphql/generated";

export function useCreateCollection() {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  const [isLoading, setIsLoading] = useState(false);
  const [allowlistStages, setAllowlistStages] = useState<AllowlistStage[]>([]);
  const [selectedChain, setSelectedChain] = useState("Sepolia");
  const [publicMint, setPublicMint] = useState<PublicMint>({ mintPrice: "0.00", durationDays: "1", durationHours: "0" });
  const [selectedArtType, setSelectedArtType] = useState<"same" | "unique">("unique");
  const [collectionImageFile, setCollectionImageFile] = useState<File | null>(null);
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
      uri: "",
      collectionImageUrl: "",
      mintPrice: "0.00",
      royaltyFee: "0",
      maxSupply: "",
      mintLimit: "",
      mintStartDate: new Date().toISOString(),
      allowlistStages: [],
      publicMint: { mintPrice: "0.00", durationDays: "1", durationHours: "0" },
    },
  });

  useEffect(() => setSelectedChain(form.watch("chain") || "Sepolia"), [form]);

  useEffect(() => {
    if (isConnected && chain?.name && chain.name !== selectedChain) {
      const targetChain = mockChains.find((c) => c.name === selectedChain);
      if (targetChain) switchChain({ chainId: targetChain.id });
    }
  }, [isConnected, chain, selectedChain, switchChain]);

  useEffect(() => {
    const basicFormValid = form.formState.isValid;
    const hasRequiredFiles =
      collectionImageFile !== null &&
      (selectedArtType === "same" ? artworkFile !== null : metadataUrl.trim() !== "");
    setIsFormValid(basicFormValid && hasRequiredFiles);
  }, [form.formState.isValid, collectionImageFile, selectedArtType, artworkFile, metadataUrl]);

  const getButtonText = () =>
    !isConnected
      ? "Connect Wallet"
      : isLoading
      ? "Processing..."
      : chain?.name === selectedChain
      ? `Create Collection on ${chain.name}`
      : `Switch to ${selectedChain}`;

  const handleClearForm = () => {
    form.reset();
    setSelectedChain("Sepolia");
    setAllowlistStages([]);
    setPublicMint({ mintPrice: "0.00", durationDays: "1", durationHours: "0" });
    setSelectedArtType("unique");
    setMetadataUrl("");
    setArtworkFile(null);
    setCollectionImageFile(null);
    toast("Form cleared");
  };

  const uploadMetadata = async (values: FormData, file: File) => {
    const artworkUrl = await uploadImage(file);
    if (!artworkUrl) throw new Error("Failed to upload artwork");
    const metadata = { name: values.name, description: values.description, image: artworkUrl, attributes: [] };
    const metadataFile = new File([JSON.stringify(metadata)], `${values.name}-metadata.json`, { type: "application/json" });
    return await uploadImage(metadataFile) || "";
  };

  const createInput = (values: FormData, tokenUri: string, collectionImageUrl: string, contractAddress?: string) => ({
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
    publicMint: publicMint,
    ...(contractAddress && { contractAddress }),
  });

  const onSubmit = async (values: FormData) => {
    console.log("onSubmit called with values:", values); // Debug
    if (!isConnected) {
      try {
        await connectAsync({ connector: injected() });
        return;
      } catch (error) {
        toast.error("Failed to connect wallet", { description: (error as Error).message });
        return;
      }
    }

    if (chain?.name !== selectedChain) {
      const chainId = mockChains.find((c) => c.name === selectedChain)?.id;
      if (chainId) switchChain({ chainId });
      return;
    }

    if (!collectionImageFile || (selectedArtType === "same" && !artworkFile) || (selectedArtType === "unique" && !metadataUrl.trim())) {
      toast.error("Missing required files or metadata URL");
      return;
    }

    setIsLoading(true);
    try {
      const collectionImageUrl = await uploadImage(collectionImageFile) || "";
      const tokenUri = selectedArtType === "same" ? await uploadMetadata(values, artworkFile!) : metadataUrl;

      const input = createInput(values, tokenUri, collectionImageUrl);
      console.log("Sending to server:", input);

      const { data } = await client.mutate({ mutation: CreateCollectionDocument, variables: { input } });
      const { steps, contractAddress } = data.createCollection;

      let finalContractAddress = contractAddress;
      if (steps?.length) {
        if (!walletClient) throw new Error("Wallet client not available");
        const signer = await new BrowserProvider(walletClient.transport).getSigner();
        for (const step of steps) {
          const params = JSON.parse(step.params);
          const tx = await signer.sendTransaction({ ...params, from: address });
          const receipt = await tx.wait();
          if (!receipt) throw new Error("Receipt not found");
          if (step.id === "create-token") finalContractAddress = receipt.contractAddress;
        }
      }

      const saveInput = createInput(values, tokenUri, collectionImageUrl, finalContractAddress);
      await client.mutate({ mutation: CreateCollectionDocument, variables: { input: saveInput } });
      toast.success("Collection created", { description: `Contract Address: ${finalContractAddress}` });
    } catch (error) {
      toast.error("Failed to create collection", { description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    allowlistStages,
    selectedChain,
    publicMint,
    selectedArtType,
    collectionImageFile,
    artworkFile,
    metadataUrl,
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
  };
}