
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
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { PublicMint } from "@/types/create-collection.type";
import { toast } from "sonner";

interface PublicStageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  publicMint: PublicMint;
  onSave: (publicMint: PublicMint) => void;
}

export function PublicStageDialog({
  isOpen,
  onOpenChange,
  publicMint,
  onSave,
}: PublicStageDialogProps) {
  const [mintPrice, setMintPrice] = useState(publicMint.mintPrice);
  const [durationDays, setDurationDays] = useState(publicMint.durationDays);
  const [durationHours, setDurationHours] = useState(publicMint.durationHours);
  const [startDate, setStartDate] = useState<Date | undefined>(
    publicMint.startDate ? new Date(publicMint.startDate) : undefined
  );

  useEffect(() => {
    if (isOpen) {
      setMintPrice(publicMint.mintPrice);
      setDurationDays(publicMint.durationDays);
      setDurationHours(publicMint.durationHours);
      setStartDate(
        publicMint.startDate ? new Date(publicMint.startDate) : undefined
      );
    }
  }, [publicMint, isOpen]);

  const handleSave = () => {
    // Validation cơ bản
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

    onSave({
      mintPrice,
      durationDays,
      durationHours,
      startDate: startDate?.toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="bg-[#0e0a1a] dark:bg-[#0e0a1a] border-[#3a3450] dark:border-[#3a3450] text-white hidden">
        Public Stage
      </DialogTitle>
      <DialogContent className="bg-[#0e0a1a] dark:bg-[#0e0a1a] border-[#3a3450] dark:border-[#3a3450] text-white max-w-md p-0">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Public Stage</h2>
        </div>

        <div className="p-6 space-y-4">
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
            <Label className="text-white">Start Date (Optional)</Label>
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
                  onSelect={setStartDate}
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