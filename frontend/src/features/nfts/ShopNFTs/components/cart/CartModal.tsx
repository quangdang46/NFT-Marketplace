"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { NFT } from "@/types/nft";

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NFT[];
  onRemoveItem: (id: string) => void;
  onBuy: () => void;
}

export default function CartModal({
  open,
  onOpenChange,
  items,
  onRemoveItem,
  onBuy,
}: CartModalProps) {
  if (!open) return null;

  const takerFee = 0.02; // 2%
  const networkFee = 0.00003;

  const totalPrice = items.reduce(
    (sum, item) => sum + Number.parseFloat(item.price),
    0
  );
  const takerFeeAmount = totalPrice * takerFee;
  const totalWithFees = totalPrice + takerFeeAmount + networkFee;

  return (
    <div className="fixed right-4 bottom-16 z-50 w-72 max-w-[90vw] rounded-lg border bg-background p-4 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-right-1/2">
      <div className="flex flex-row items-center justify-between pb-2">
        <div className="text-base font-semibold">Cart ({items.length})</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full absolute right-3 top-3"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="space-y-3">
        {/* Cart Items */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <div
                className={cn(
                  "w-8 h-8 rounded overflow-hidden flex-shrink-0",
                  `bg-${item.background}-800`
                )}
              >
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                  }
                  alt={`OCM Genesis ${item.id}`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  OCM Genesis {item.id}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.price} BTC
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveItem(item.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <div>Price ({items.length})</div>
            <div>{totalPrice.toFixed(6)} BTC</div>
          </div>
          <div className="flex justify-between">
            <div>Taker Fee (2%)</div>
            <div>{takerFeeAmount.toFixed(6)} BTC</div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              Network Fee
              <span className="text-[10px] px-1 py-0.5 rounded-full bg-muted">
                Standard
              </span>
            </div>
            <div>{networkFee.toFixed(6)} BTC</div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between font-medium pt-2 border-t text-sm">
          <div>Total</div>
          <div>{totalWithFees.toFixed(6)} BTC</div>
        </div>

        {/* Mempool Protection */}
        <div className="flex items-start gap-2">
          <Checkbox id="mempool" className="mt-1" />
          <div className="grid gap-0.5 leading-none">
            <label
              htmlFor="mempool"
              className="text-xs font-medium leading-none cursor-pointer"
            >
              Add Partial Mempool Protection
            </label>
            <p className="text-[10px] text-muted-foreground">
              Protect your transaction from frontrunning
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full bg-pink-600 hover:bg-pink-700 text-sm h-8"
            onClick={onBuy}
          >
            Connect wallet to buy
          </Button>
          <div className="text-[10px] text-center text-muted-foreground">
            By clicking buy, you agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Magic Eden Terms of Service
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
