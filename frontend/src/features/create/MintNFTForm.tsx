"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Chain {
  id: string;
  name: string;
  icon: string;
  symbol: string;
}

interface Collection {
  id: string;
  name: string;
  chain: {
    id: string;
  };
}

const mockChains = [
  {
    id: "solana",
    name: "Solana",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=24&width=24",
    symbol: "SOL",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=24&width=24",
    symbol: "ETH",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=24&width=24",
    symbol: "MATIC",
  },
];

export function MintNFTForm() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [symbol, setSymbol] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Simulating API call
    const fetchChains = async () => {
      // In a real app, this would be an API call

      setChains(mockChains);
      setSelectedChain(mockChains[0].id);
      setSymbol(mockChains[0].symbol);
    };

    const fetchCollections = async () => {
      // In a real app, this would be an API call
      const mockCollections = [
        {
          id: "collection-1",
          name: "Awesome Collection 1",
          chain: { id: "solana" },
        },
        {
          id: "collection-2",
          name: "Awesome Collection 2",
          chain: { id: "ethereum" },
        },
        {
          id: "collection-3",
          name: "Awesome Collection 3",
          chain: { id: "polygon" },
        },
        {
          id: "collection-4",
          name: "Awesome Collection 4",
          chain: { id: "solana" },
        },
        {
          id: "collection-5",
          name: "Awesome Collection 5",
          chain: { id: "ethereum" },
        },
      ];

      setCollections(mockCollections);

      // Check if collection is specified in URL
      const collectionParam = searchParams.get("collection");
      if (collectionParam) {
        const collection = mockCollections.find(
          (c) => c.id === collectionParam
        );
        if (collection) {
          setSelectedCollection(collection.id);
          setSelectedChain(collection.chain.id);

          // Set symbol based on chain
          const chain = mockChains.find((c) => c.id === collection.chain.id);
          if (chain) {
            setSymbol(chain.symbol);
          }
        }
      }
    };

    fetchChains();
    fetchCollections();
  }, [searchParams]);

  useEffect(() => {
    // Filter collections based on selected chain
    if (selectedChain) {
      const filtered = collections.filter(
        (collection) => collection.chain.id === selectedChain
      );
      setFilteredCollections(filtered);

      // If the currently selected collection is not in the filtered list, reset it
      if (
        selectedCollection &&
        !filtered.some((c) => c.id === selectedCollection)
      ) {
        setSelectedCollection("");
      }

      // Update symbol based on selected chain
      const chain = chains.find((c) => c.id === selectedChain);
      if (chain) {
        setSymbol(chain.symbol);
      }
    }
  }, [selectedChain, collections, selectedCollection, chains]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !image ||
      !selectedChain ||
      !selectedCollection ||
      !price
    ) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("NFT minted!", {
        description: "Your NFT has been minted successfully",
      });

      // Redirect to the collection page
      router.push(`/collections/${selectedCollection}`);
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#2a2a3e] rounded-lg p-6 space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="chain">Blockchain</Label>
        <Select
          value={selectedChain}
          onValueChange={setSelectedChain}
          disabled={!!searchParams.get("collection")}
        >
          <SelectTrigger id="chain" className="bg-[#1a1a2e] border-[#3a3a4e]">
            <SelectValue placeholder="Select Chain" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a3e] border-[#3a3a4e]">
            {chains.map((chain) => (
              <SelectItem
                key={chain.id}
                value={chain.id}
                className="focus:bg-[#3a3a4e]"
              >
                <div className="flex items-center">
                  <Image
                    src={
                      chain.icon ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={chain.name}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  {chain.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection">Collection</Label>
        <Select
          value={selectedCollection}
          onValueChange={setSelectedCollection}
          disabled={!!searchParams.get("collection")}
        >
          <SelectTrigger
            id="collection"
            className="bg-[#1a1a2e] border-[#3a3a4e]"
          >
            <SelectValue placeholder="Select Collection" />
          </SelectTrigger>
          <SelectContent className="bg-[#2a2a3e] border-[#3a3a4e]">
            {filteredCollections.map((collection) => (
              <SelectItem
                key={collection.id}
                value={collection.id}
                className="focus:bg-[#3a3a4e]"
              >
                {collection.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">NFT Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#1a1a2e] border-[#3a3a4e]"
          placeholder="Enter NFT name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#1a1a2e] border-[#3a3a4e] min-h-[100px]"
          placeholder="Describe your NFT"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ({symbol})</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-[#1a1a2e] border-[#3a3a4e]"
          placeholder={`Enter price in ${symbol}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">NFT Image</Label>
        <div className="flex flex-col items-center gap-4">
          {image ? (
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
              <Image
                src={
                  image ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt="NFT preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[200px] h-[200px] bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Preview</span>
            </div>
          )}

          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-[#1a1a2e] border-[#3a3a4e]"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#ff007a] hover:bg-[#ff007a]/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Minting..." : "Mint NFT"}
      </Button>
    </form>
  );
}
