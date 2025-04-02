import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  PublishCollectionModalProps,
  StepStatus,
} from "@/types/collection.type";
import { CheckCircle2, Loader2 } from "lucide-react";

export function PublishCollectionModal({
  isOpen,
  onOpenChange,
  step1Status,
  step2Status,
}: PublishCollectionModalProps) {
  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "processing":
        return (
          <div className="h-5 w-5 rounded-full bg-pink-600 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        );
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-500" />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] bg-[#0e0a1a] border-[#3a3450] text-white [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-medium">
            Publish Collection
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Step 1 */}
          <div className="bg-[#1a1527] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(step1Status)}</div>
              <div>
                <h4 className="font-medium text-white text-base">
                  Step 1 - Deploy Contract
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  Deploy the smart contract for your new collection.
                </p>
                <p className="text-sm text-gray-400">
                  Awaiting transaction signature
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1a1527] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(step2Status)}</div>
              <div>
                <h4 className="font-medium text-white text-base">
                  Step 2 - Configure Collection
                </h4>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
