/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FE: CreateCollection.tsx
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
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useBalance,
  useWaitForTransactionReceipt,
  useConnect,
} from "wagmi";
import { injected } from "@wagmi/connectors";
import { uploadImage } from "@/lib/utils/upload";
import { ethers } from "ethers";
import client from "@/lib/api/apolloClient";
import { CreateCollectionDocument } from "@/lib/api/graphql/generated";
import { getMarketplace } from "@/lib/utils/getEnv";
import * as NFTManager from "@/lib/constant/NFTManager.json";
export default function CreateCollection() {
  const { address, chain, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [gasPriceOption, setGasPriceOption] = useState<
    "low" | "medium" | "high" | "custom"
  >("medium");
  const [customGasPrice, setCustomGasPrice] = useState<string>("");
  const [customGasLimit, setCustomGasLimit] = useState<string>("");
  const [useCustomGas, setUseCustomGas] = useState<boolean>(false);

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

  const {
    writeContractAsync,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    data: txReceipt,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "chain" && value.chain)
        setSelectedChain(value.chain as string);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (isConnected && chain && chain.name !== selectedChain) {
      const chainId = mockChains.find((c) => c.name === selectedChain)?.id;
      if (chainId) switchChain({ chainId });
    }
  }, [isConnected, chain, selectedChain, switchChain]);

  useEffect(() => {
    if (isTxSuccess && txReceipt) {
      const contractAddress = txReceipt.contractAddress;
      if (contractAddress)
        proceedToCreateCollection(form.getValues(), contractAddress);
      else toast.error("Failed to retrieve contract address");
    }
  }, [isTxSuccess, txReceipt]);

  useEffect(() => {
    if (writeError)
      toast.error("Failed to deploy contract", {
        description: writeError.message,
      });
  }, [writeError]);

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isLoading) return "Processing...";
    if (chain?.name === selectedChain)
      return `Create Collection on ${chain?.name}`;
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
        toast.error("Failed to connect wallet", { description: error.message });
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

    if (userRole === "user") {
      const userBalance = balance
        ? ethers.utils.formatEther(balance.value)
        : "0";
      if (parseFloat(userBalance) < 0.001) {
        toast.error("Insufficient ETH", {
          description: "You need sufficient ETH to cover the gas fee.",
        });
        return;
      }
      const { marketplaceFeeRecipient, marketplaceFeePercentage } =
        getMarketplace();
      toast("Notice", {
        description: (
          <div>
            <p>
              Creating a collection will incur a gas fee. Confirm in your
              wallet.
            </p>
            <div className="mt-2">
              <label>Gas Price Option:</label>
              <select
                value={gasPriceOption}
                onChange={(e) => setGasPriceOption(e.target.value as any)}
              >
                <option value="low">Low (1 Gwei)</option>
                <option value="medium">Medium (2 Gwei)</option>
                <option value="high">High (3 Gwei)</option>
                <option value="custom">Custom</option>
              </select>
              {useCustomGas && (
                <div>
                  <input
                    type="number"
                    value={customGasPrice}
                    onChange={(e) => setCustomGasPrice(e.target.value)}
                    placeholder="Gas Price (Gwei)"
                  />
                  <input
                    type="number"
                    value={customGasLimit}
                    onChange={(e) => setCustomGasLimit(e.target.value)}
                    placeholder="Gas Limit (Wei)"
                  />
                </div>
              )}
            </div>
          </div>
        ),
        action: {
          label: "Proceed",
          onClick: async () => {
            try {
              await writeContractAsync({
                abi: NFTManager.abi,
                functionName: "constructor",
                args: [
                  values.name,
                  values.symbol,
                  marketplaceFeeRecipient,
                  BigInt(marketplaceFeePercentage), // Lấy từ env
                  BigInt(maxSupply), // Từ form
                  BigInt(mintLimit), // Từ form
                ],
                data: NFTManager.bytecode,
                chainId: mockChains.find((c) => c.name === selectedChain)?.id,
                gasPrice:
                  useCustomGas && customGasPrice
                    ? BigInt(
                        ethers.utils
                          .parseUnits(customGasPrice, "gwei")
                          .toString()
                      )
                    : undefined,
                gas:
                  useCustomGas && customGasLimit
                    ? BigInt(customGasLimit)
                    : undefined,
              });
            } catch (error) {
              toast.error("Transaction failed", { description: error.message });
            }
          },
        },
      });
    } else if (userRole === "admin") {
      await proceedToCreateCollection(values);
    }
  };

  const proceedToCreateCollection = async (
    values: z.infer<typeof formSchema>,
    contractAddress?: string
  ) => {
    setIsLoading(true);
    const collectionImageUrl = await uploadImage(collectionImageFile!);
    let artworkUrl = null;
    if (selectedArtType === "same" && artworkFile)
      artworkUrl = await uploadImage(artworkFile);

    const input = {
      chain: values.chain,
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      artType: selectedArtType,
      metadataUrl: selectedArtType === "unique" ? metadataUrl : null,
      collectionImageUrl,
      artworkUrl,
      mintPrice,
      royaltyFee,
      maxSupply,
      mintLimit,
      mintStartDate: mintStartDate.toISOString(),
      allowlistStages: formattedAllowlistStages(allowlistStages),
      publicMint,
      contractAddress,
    };

    try {
      const result = await client.mutate({
        mutation: CreateCollectionDocument,
      });
      toast.success("Collection created", {
        description: `Collection ID: ${result.data.createCollection.collectionId}, Contract: ${result.data.createCollection.contractAddress}`,
      });
    } catch (error) {
      toast.error("Failed to create collection", {
        description: error.message,
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
