import { z } from "zod";

export const formSchema = z.object({
  chain: z.string().min(1, "Chain is required"),
  chainId: z.string().min(1, { message: "Chain ID is required" }),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  artType: z.enum(["same", "unique"]),
  uri: z.string().optional(), // Không bắt buộc, sẽ được tạo trong onSubmit
  collectionImageUrl: z.string().optional(), // Không bắt buộc, sẽ được tạo trong onSubmit
  mintPrice: z.string().regex(/^\d+(\.\d+)?$/, "Mint price must be a number"),
  royaltyFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Royalty fee must be a number")
    .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 100, {
      message: "Royalty fee must be between 0 and 100",
    }),
  maxSupply: z.string().optional(),
  mintLimit: z.string().optional(),
  mintStartDate: z.string().min(1, "Mint start date is required"),
  allowlistStages: z.array(z.any()).optional(),
  publicMint: z.object({
    mintPrice: z.string().regex(/^\d+(\.\d+)?$/, "Mint price must be a number"),
    durationDays: z.string().regex(/^\d+$/, "Duration days must be a number"),
    durationHours: z.string().regex(/^\d+$/, "Duration hours must be a number"),
    startDate: z.string().optional(),
  }),
});

export type FormData = z.infer<typeof formSchema>;

export type StepStatus = "pending" | "processing" | "completed";

export interface PublishCollectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  step1Status: StepStatus;
  step2Status: StepStatus;
}
