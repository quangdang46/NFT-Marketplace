"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed right-4 bottom-16 z-50 w-72 max-w-[90vw] rounded-lg border bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
interface CartItem {
  id: string;
  image: string;
  price: string;
  background: string;
}

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onBuy: () => void;
}

export function CartModal({
  open,
  onOpenChange,
  items,
  onRemoveItem,
  onBuy,
}: CartModalProps) {
  const takerFee = 0.02; // 2%
  const networkFee = 0.00003;

  const totalPrice = items.reduce(
    (sum, item) => sum + Number.parseFloat(item.price),
    0
  );
  const takerFeeAmount = totalPrice * takerFee;
  const totalWithFees = totalPrice + takerFeeAmount + networkFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle className="text-base font-semibold">
            Cart ({items.length})
          </DialogTitle>
        </DialogHeader>
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
                    src={item.image || "/placeholder.svg"}
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
              By clicking , you agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Magic Eden Terms of Service
              </a>
              .
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
