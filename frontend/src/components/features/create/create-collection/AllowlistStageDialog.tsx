"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { AllowlistStage } from "@/lib/api/graphql/generated";
import { toast } from "sonner";

interface AllowlistStageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stage: AllowlistStage | null;
  onSave: (stage: AllowlistStage) => void;
}

export function AllowlistStageDialog({
  isOpen,
  onOpenChange,
  stage,
  onSave,
}: AllowlistStageDialogProps) {
  const MAX_WALLET_LENGTH = 42;
  const [id, setId] = useState(stage?.id || crypto.randomUUID());
  const [mintPrice, setMintPrice] = useState(stage?.mintPrice || "0.00");
  const [durationDays, setDurationDays] = useState(stage?.durationDays || "1");
  const [durationHours, setDurationHours] = useState(
    stage?.durationHours || "0"
  );
  const [wallets, setWallets] = useState(stage?.wallets || []);
  const [startDate, setStartDate] = useState<Date>(
    stage?.startDate ? new Date(stage.startDate) : new Date()
  );

  useEffect(() => {
    if (isOpen && stage) {
      setId(stage.id);
      setMintPrice(stage.mintPrice);
      setDurationDays(stage.durationDays);
      setDurationHours(stage.durationHours);
      setWallets(stage.wallets);
      setStartDate(new Date(stage.startDate));
    } else if (isOpen && !stage) {
      // Reset form khi thêm stage mới
      setId(crypto.randomUUID());
      setMintPrice("0.00");
      setDurationDays("1");
      setDurationHours("0");
      setWallets([]);
      setStartDate(new Date());
    }
  }, [isOpen, stage]);

  const handleSave = () => {
    // Validation cơ bản trước khi lưu
    if (!id) {
      toast.error("Stage ID is required");
      return;
    }
    if (!/^\d+(\.\d+)?$/.test(mintPrice)) {
      toast.error("Mint price must be a valid number");
      return;
    }
    if (!/^\d+$/.test(durationDays)) {
      toast.error("Duration days must be a valid number");
      return;
    }
    if (!/^\d+$/.test(durationHours)) {
      toast.error("Duration hours must be a valid number");
      return;
    }
    if (!wallets.length) {
      toast.error("Wallets are required");
      return;
    }

    const newStage: AllowlistStage = {
      id,
      mintPrice,
      durationDays,
      durationHours,
      wallets, // Chuỗi địa chỉ cách nhau bởi \n
      startDate: startDate.toISOString(),
    };

    onSave(newStage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="bg-[#0e0a1a] dark:bg-[#0e0a1a] border-[#3a3450] dark:border-[#3a3450] text-white hidden">
        Allowlist Stage
      </DialogTitle>
      <DialogContent className="bg-[#0e0a1a] dark:bg-[#0e0a1a] border-[#3a3450] dark:border-[#3a3450] text-white max-w-md p-0">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Allowlist Stage</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label className="text-white">Stage ID</Label>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. Stage1"
              className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <Label className="text-white">Mint Price</Label>
            <div className="flex mt-2">
              <Input
                placeholder="0.00"
                value={mintPrice}
                onChange={(e) => setMintPrice(e.target.value)}
                className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="bg-[#2a2535] dark:bg-[#2a2535] border border-[#3a3450] dark:border-[#3a3450] rounded-r-md px-4 flex items-center text-white dark:text-white">
                ETH
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white">Stage Duration</Label>
            <div className="flex gap-2 mt-2">
              <div className="flex flex-1">
                <Input
                  placeholder="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="bg-[#2a2535] dark:bg-[#2a2535] border border-[#3a3450] dark:border-[#3a3450] rounded-r-md px-4 flex items-center text-white dark:text-white">
                  Days
                </div>
              </div>
              <div className="flex flex-1">
                <Input
                  placeholder="0"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="bg-[#2a2535] dark:bg-[#2a2535] border border-[#3a3450] dark:border-[#3a3450] rounded-r-md px-4 flex items-center text-white dark:text-white">
                  Hours
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white">Wallets (one per line)</Label>
            <Textarea
              value={wallets.join("\n")}
              onChange={(e) => {
                const newWallets = e.target.value.split("\n").map((wallet) => {
                  return wallet.length > MAX_WALLET_LENGTH
                    ? wallet.slice(0, MAX_WALLET_LENGTH)
                    : wallet;
                });
                setWallets(newWallets);
              }}
              placeholder="0x123...\n0x456..."
              className="bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 min-h-[100px] max-h-[300px] overflow-y-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <Label className="text-white">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-[#1a1525] dark:bg-[#1a1525] border-[#3a3450] dark:border-[#3a3450] text-white dark:text-white mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "MM/dd/yyyy h:mm a")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1a1525] border-[#3a3450]">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(newDate) => newDate && setStartDate(newDate)}
                  initialFocus
                  className="bg-[#1a1525] text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="px-0 pt-2">
            <Button
              type="submit"
              onClick={handleSave}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
