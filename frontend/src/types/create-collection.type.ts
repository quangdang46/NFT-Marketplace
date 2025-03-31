import { z } from "zod";

export const formSchema = z.object({
  chain: z.string().min(1, "Chain is required"),
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
  maxSupply: z.string().regex(/^\d+$/, "Max supply must be a positive integer"),
  mintLimit: z.string().regex(/^\d+$/, "Mint limit must be a positive integer"),
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

// Schema cho Allowlist Stage
export const allowlistStageSchema = z.object({
  id: z.string().min(1, "Stage ID is required"),
  mintPrice: z.string().regex(/^\d+(\.\d+)?$/, "Mint price must be a number"),
  durationDays: z.string().regex(/^\d+$/, "Duration days must be a number"),
  durationHours: z.string().regex(/^\d+$/, "Duration hours must be a number"),
  wallets: z.string().min(1, "Wallets are required"), // Chuỗi địa chỉ cách nhau bởi \n
  startDate: z.string().min(1, "Start date is required"), // Chuỗi ISO date
});

// Schema cho Public Mint
export const publicMintSchema = z.object({
  mintPrice: z.string().regex(/^\d+(\.\d+)?$/, "Mint price must be a number"),
  durationDays: z.string().regex(/^\d+$/, "Duration days must be a number"),
  durationHours: z.string().regex(/^\d+$/, "Duration hours must be a number"),
  startDate: z.string().optional(), // Optional theo graphql
});

// Type cho Allowlist Stage
export type AllowlistStage = {
  id: string;
  mintPrice: string;
  durationDays: string;
  durationHours: string;
  wallets: string; // Chuỗi địa chỉ cách nhau bởi \n
  startDate: string; // Chuỗi ISO date
};

// Type cho Public Mint
export type PublicMint = {
  mintPrice: string;
  durationDays: string;
  durationHours: string;
  startDate?: string; // Optional
};
