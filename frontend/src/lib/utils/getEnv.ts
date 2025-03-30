export const getMarketplace = () => {
  const marketplaceFeeRecipient =
    process.env.NEXT_PUBLIC_MARKETPLACE_FEE_RECIPIENT; // Dùng NEXT_PUBLIC_ cho Next.js
  const marketplaceFeePercentage =
    process.env.NEXT_PUBLIC_MARKETPLACE_FEE_PERCENT;
  if (!marketplaceFeeRecipient || !marketplaceFeePercentage) {
    throw new Error("Marketplace Fee not found in environment variables");
  }
  console.log(
    `[Marketplace Fee] Recipient: ${marketplaceFeeRecipient}, Percentage: ${marketplaceFeePercentage}`
  );
  return {
    marketplaceFeeRecipient,
    marketplaceFeePercentage,
  };
};
