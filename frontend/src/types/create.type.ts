

import { z } from "zod";

export const formSchema = z.object({
  chain: z.string(),
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  description: z.string(),
});

export const allowlistStageSchema = z.object({
  id: z.string(),
  mintPrice: z.string(),
  durationDays: z.string(),
  durationHours: z.string(),
  wallets: z.string().min(1, "Wallets are required"),
});

export const publicMintSchema = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export type AllowlistStage = {
  id: string;
  mintPrice: string;
  durationDays: string;
  durationHours: string;
  wallets: string;
};

export type PublicMint = {
  mintPrice: string;
  durationDays: string;
  durationHours: string;
};


