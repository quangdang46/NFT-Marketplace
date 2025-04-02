/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useSwitchChain, useConnect, useWalletClient } from "wagmi";
import { injected } from "@wagmi/connectors";
import { toast } from "sonner";
import { BrowserProvider } from "ethers";
import { AllowlistStage, PublicMint } from "@/lib/api/graphql/generated";
import { StepStatus, formSchema, FormData } from "@/types/collection.type";
import { mockChains } from "@/lib/constant/chains";
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
  const [publicMint, setPublicMint] = useState<PublicMint>({
    mintPrice: "0.00",
    durationDays: "1",
    durationHours: "0",
    startDate:""
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
  // Thêm trạng thái cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step1Status, setStep1Status] = useState<StepStatus>("pending");
  const [step2Status, setStep2Status] = useState<StepStatus>("pending");

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
      (selectedArtType === "same"
        ? artworkFile !== null
        : metadataUrl.trim() !== "");
    setIsFormValid(basicFormValid && hasRequiredFiles);
  }, [
    form.formState.isValid,
    collectionImageFile,
    selectedArtType,
    artworkFile,
    metadataUrl,
  ]);

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
    setPublicMint({ mintPrice: "0.00", durationDays: "1", durationHours: "0", startDate:"" });
    setSelectedArtType("unique");
    setMetadataUrl("");
    setArtworkFile(null);
    setCollectionImageFile(null);
    toast("Form cleared");
  };

  const uploadMetadata = async (values: FormData, file: File) => {
    const artworkUrl = await uploadImage(file);
    if (!artworkUrl) throw new Error("Failed to upload artwork");
    const metadata = {
      name: values.name,
      description: values.description,
      image: artworkUrl,
      attributes: [],
    };
    const metadataFile = new File(
      [JSON.stringify(metadata)],
      `${values.name}-metadata.json`,
      { type: "application/json" }
    );
    return (await uploadImage(metadataFile)) || "";
  };

  const createInput = (
    values: FormData,
    tokenUri: string,
    collectionImageUrl: string,
    contractAddress?: string
  ) => ({
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
    allowlistStages: allowlistStages || [],
    publicMint: publicMint,
    ...(contractAddress && { contractAddress }),
  });

  const onSubmit = async (values: FormData) => {
    console.log("onSubmit called with values:", values);
    if (!isConnected) {
      try {
        await connectAsync({ connector: injected() });
        return;
      } catch (error) {
        toast.error("Failed to connect wallet", {
          description: (error as Error).message,
        });
        return;
      }
    }

    if (chain?.name !== selectedChain) {
      const chainId = mockChains.find((c) => c.name === selectedChain)?.id;
      if (chainId) switchChain({ chainId });
      return;
    }

    if (
      !collectionImageFile ||
      (selectedArtType === "same" && !artworkFile) ||
      (selectedArtType === "unique" && !metadataUrl.trim())
    ) {
      toast.error("Missing required files or metadata URL");
      return;
    }

    setIsLoading(true);
    setIsModalOpen(true); // Mở modal khi bắt đầu submit
    setStep1Status("processing"); // Bắt đầu bước 1

    try {
      const collectionImageUrl = (await uploadImage(collectionImageFile)) || "";
      const tokenUri =
        selectedArtType === "same"
          ? await uploadMetadata(values, artworkFile!)
          : metadataUrl;

      const input = createInput(values, tokenUri, collectionImageUrl);
      console.log("Sending to server:", input);

      const { data } = await client.mutate({
        mutation: CreateCollectionDocument,
        variables: { input },
      });
      console.log("Backend response:", data);

      const { steps, contractAddress } = data.createCollection;
      let finalContractAddress = contractAddress;

      if (steps?.length) {
        if (!walletClient) throw new Error("Wallet client not available");
        const signer = await new BrowserProvider(
          walletClient.transport
        ).getSigner();

        for (const step of steps) {
          console.log("Processing step:", step);
          const params = JSON.parse(step.params);
          const tx = await signer.sendTransaction({ ...params, from: address });
          const receipt = await tx.wait();
          if (!receipt) throw new Error("Receipt not found");

          if (step.id === "create-token") {
            finalContractAddress = receipt.contractAddress;
            setStep1Status("completed"); // Hoàn thành bước 1
            setStep2Status("processing"); // Bắt đầu bước 2
          }
        }

        setStep2Status("completed"); // Hoàn thành bước 2 sau khi xử lý tất cả steps
      }

      const saveInput = createInput(
        values,
        tokenUri,
        collectionImageUrl,
        finalContractAddress
      );
      await client.mutate({
        mutation: CreateCollectionDocument,
        variables: { input: saveInput },
      });

      toast.success("Collection created", {
        description: `Contract Address: ${finalContractAddress}`,
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to create collection", {
        description: (error as Error).message,
      });
      setStep1Status("pending");
      setStep2Status("pending");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); // Đóng modal khi hoàn thành hoặc lỗi
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
    // Trả thêm các giá trị cho modal
    isModalOpen,
    step1Status,
    step2Status,
    setIsModalOpen,
  };
}
