"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface ChainFilterProps {
  baseUrl: string;
}

interface Chain {
  id: string;
  name: string;
  icon: string;
}

export function ChainFilter({ baseUrl }: ChainFilterProps) {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    // Simulating API call
    const fetchChains = async () => {
      // In a real app, this would be an API call
      const mockChains = [
        {
          id: "all",
          name: "All Chains",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
        },
        {
          id: "solana",
          name: "Solana",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
        },
        {
          id: "ethereum",
          name: "Ethereum",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
        },
        {
          id: "polygon",
          name: "Polygon",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
        },
        {
          id: "binance",
          name: "Binance",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
        },
      ];

      setChains(mockChains);
    };

    fetchChains();
  }, []);

  const handleChainChange = (chainId: string) => {
    setSelectedChain(chainId);

    if (chainId === "all") {
      router.push("/collections");
    } else {
      router.push(`${baseUrl}/${chainId}`);
    }
  };

  if (chains.length === 0) {
    return <div className="h-10 bg-card animate-pulse rounded-lg w-48"></div>;
  }

  return (
    <Select value={selectedChain} onValueChange={handleChainChange}>
      <SelectTrigger className="w-48 bg-card border-border">
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {chains.map((chain) => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            className="focus:bg-accent"
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
  );
}
