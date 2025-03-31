import { AllowlistStage } from "@/types/create-collection.type";

export const formattedAllowlistStages = (allowlistStages: AllowlistStage[]) =>
  allowlistStages.map((stage) => ({
    ...stage,
    wallets: stage.wallets
      .split("\n")
      .map((wallet) => wallet.trim())
      .filter((wallet) => wallet.length > 0),
  }));
