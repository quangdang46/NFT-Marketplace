const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const feeRecipient = deployer.address; // Hoặc địa chỉ khác để nhận phí marketplace
  const feePercentage = 250; // 2.5% phí marketplace
  const nft = await NFTMarketplace.deploy(feeRecipient, feePercentage);
  await nft.deployed();

  console.log("NFTMarketplace deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
