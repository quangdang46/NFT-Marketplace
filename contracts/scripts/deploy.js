const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const marketplaceFeeRecipient = process.env.MARKETPLACE_FEE_RECIPIENT;
  const marketplaceFeePercentage = process.env.MARKETPLACE_FEE_PERCENT;

  if (!marketplaceFeeRecipient || !marketplaceFeePercentage) {
    throw new Error("Marketplace fee settings not found in .env");
  }

const name = "MyNFTCollection";
const symbol = "MNC";
const maxSupply = 1000; // Đây là số
const mintLimit = 10; // Đây là số
const mintPrice = ethers.parseEther("0.01");

const NFTManager = await ethers.getContractFactory("NFTManager");
const nftManager = await NFTManager.deploy(
  name,
  symbol,
  marketplaceFeeRecipient,
  parseInt(marketplaceFeePercentage),
  maxSupply,
  mintLimit,
  mintPrice,
);

await nftManager.waitForDeployment();
console.log("NFTManager deployed to:", await nftManager.getAddress());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
