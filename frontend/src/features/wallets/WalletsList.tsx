"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, User } from "lucide-react";
import { mockChains } from "../../data/mockData";
import Image from "next/image";
import { toast } from "sonner";

interface Wallet {
  address: string;
  shortAddress: string;
  balance: number;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
    color: string;
  };
  nftCount: number;
  lastActive: string;
}

export function WalletsList() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch wallets
    const fetchWallets = async () => {
      setTimeout(() => {
        const mockWallets = Array(10)
          .fill(null)
          .map((_, index) => {
            const address = `0x${Math.random().toString(16).substring(2, 42)}`;
            const shortAddress = `${address.substring(
              0,
              6
            )}...${address.substring(address.length - 4)}`;
            const randomChainIndex = Math.floor(
              Math.random() * mockChains.length
            );

            // Tạo ngày hoạt động gần đây ngẫu nhiên
            const now = new Date();
            const daysAgo = Math.floor(Math.random() * 30);
            now.setDate(now.getDate() - daysAgo);

            return {
              address,
              shortAddress,
              balance: Math.random() * 10,
              chain: {
                id: mockChains[randomChainIndex].id,
                name: mockChains[randomChainIndex].name,
                icon: mockChains[randomChainIndex].icon,
                symbol: mockChains[randomChainIndex].symbol,
                color: mockChains[randomChainIndex].color,
              },
              nftCount: Math.floor(Math.random() * 100),
              lastActive: now.toLocaleDateString(),
            };
          });

        setWallets(mockWallets);
        setLoading(false);
      }, 1500);
    };

    fetchWallets();
  }, []);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied", {
      description: "Wallet address copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-card rounded-lg p-6 h-[150px]">
              <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {wallets.map((wallet, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{wallet.shortAddress}</span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: wallet.chain.color }}
              >
                <Image
                  src={
                    wallet.chain.icon ||
                    "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                  }
                  alt={wallet.chain.name}
                  width={14}
                  height={14}
                />
              </div>
            </CardTitle>
            <CardDescription>Last active: {wallet.lastActive}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-medium">
                  {wallet.balance.toFixed(2)} {wallet.chain.symbol}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NFTs</p>
                <p className="font-medium">{wallet.nftCount}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(wallet.address)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://${wallet.chain.id}.com/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </a>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/profile/address/${wallet.address}`}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
