const hre = require("hardhat");
const { ethers } = hre; // Thêm ethers từ hre để dùng ethers.parseEther

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const marketplaceFeeRecipient = process.env.MARKETPLACE_FEE_RECIPIENT;
  const marketplaceFeePercentage = process.env.MARKETPLACE_FEE_PERCENT;

  if (!marketplaceFeeRecipient || !marketplaceFeePercentage) {
    throw new Error("Marketplace fee settings not found in .env");
  }

  // Thông tin deploy
  const name = "MyNFTCollection";
  const uri = "https://ipfs.io/ipfs/QmTestUri"; // URI mẫu cho metadata chung
  const maxSupply = 1000; // Tổng cung tối đa
  const mintLimit = 10; // Giới hạn mint mỗi ví
  const mintPrice = ethers.parseEther("0.01"); // Giá mint mỗi NFT (0.01 ETH)

  // Deploy contract
  const NFTManager = await ethers.getContractFactory("NFTManager");
  const nftManager = await NFTManager.deploy(
    name,
    uri, // Thay symbol bằng uri
    marketplaceFeeRecipient,
    parseInt(marketplaceFeePercentage),
    maxSupply,
    mintLimit,
    mintPrice
  );

  await nftManager.waitForDeployment();
  console.log("NFTManager deployed to:", await nftManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
