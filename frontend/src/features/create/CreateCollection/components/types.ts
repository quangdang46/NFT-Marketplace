import { z } from "zod";

export const allowlistStageSchema = z.object({
  id: z.string(),
  mintPrice: z.string().min(1, "Mint price is required"),
  durationDays: z.string().min(1, "Days are required"),
  durationHours: z.string().min(1, "Hours are required"),
  wallets: z.string().min(1, "Wallet addresses are required"),
});

export type AllowlistStage = z.infer<typeof allowlistStageSchema>;

export const publicMintSchema = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export type PublicMint = z.infer<typeof publicMintSchema>;

export const formSchema = z.object({
  chain: z.string(),
  name: z.string().min(2, {
    message: "Collection name must be at least 2 characters.",
  }),
  symbol: z.string().min(2, {
    message: "Symbol must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
