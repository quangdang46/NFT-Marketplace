import { AllowlistStage } from "@/types/create-collection.type";

export const formattedAllowlistStages = (allowlistStages: AllowlistStage[]) =>
  allowlistStages.map((stage) => {
    let walletsArray: string[] = [];

    if (typeof stage.wallets === "string") {
      walletsArray = stage.wallets
        .split("\n")
        .map((wallet) => wallet.trim())
        .filter((wallet) => wallet.length > 0);
    } else if (Array.isArray(stage.wallets)) {
      walletsArray = stage.wallets;
    }

    return {
      ...stage,
      wallets: walletsArray,
    };
  });
