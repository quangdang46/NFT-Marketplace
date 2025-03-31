const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const contractAddress = "0x40897fbB80B189b61f9cF131FB65c9FFFF12184C";
  const NFTManager = await ethers.getContractFactory("NFTManager");
  const nftManager = await NFTManager.attach(contractAddress);

  // 1. Test mintNFT
  console.log("\n=== Testing mintNFT ===");
  const mintAmount = 5;
  const mintPrice = await nftManager.mintPrice();
  const totalCost = mintPrice * BigInt(mintAmount);
  const mintTx = await nftManager.mintNFT(mintAmount, { value: totalCost });
  await mintTx.wait();
  console.log(`Deployer minted ${mintAmount} NFTs, tx hash:`, mintTx.hash);
  console.log(
    "Deployer balance (TOKEN_ID=1):",
    (await nftManager.balanceOf(deployer.address, 1)).toString()
  );

  // 2. Test bulkMint
  console.log("\n=== Testing bulkMint ===");
  const bulkMintAmount = 3;
  const bulkMintTx = await nftManager.bulkMint(
    deployer.address,
    bulkMintAmount
  );
  await bulkMintTx.wait();
  console.log(
    `Deployer bulk minted ${bulkMintAmount} NFTs, tx hash:`,
    bulkMintTx.hash
  );
  console.log(
    "Deployer balance after bulk mint (TOKEN_ID=1):",
    (await nftManager.balanceOf(deployer.address, 1)).toString()
  );

  // 3. Test lazyMint
  console.log("\n=== Testing lazyMint ===");
  const lazyMintAmount = 2;
  const lazyMintMessage = ethers.solidityPackedKeccak256(
    ["address", "uint256", "string"],
    [deployer.address, lazyMintAmount, await nftManager.uri(1)]
  );
  const signature = await deployer.signMessage(
    ethers.getBytes(lazyMintMessage)
  );
  const lazyMintTx = await nftManager.lazyMint(
    deployer.address,
    lazyMintAmount,
    signature
  );
  await lazyMintTx.wait();
  console.log(
    `Deployer lazy minted ${lazyMintAmount} NFTs, tx hash:`,
    lazyMintTx.hash
  );
  console.log(
    "Deployer balance after lazy mint (TOKEN_ID=1):",
    (await nftManager.balanceOf(deployer.address, 1)).toString()
  );

  // 4. Test createAuction
  console.log("\n=== Testing createAuction ===");
  const auctionAmount = 4;
  const minBid = ethers.parseEther("0.1");
  const duration = 3600;
  const auctionTx = await nftManager.createAuction(
    auctionAmount,
    minBid,
    duration,
    { gasLimit: 300000 }
  );
  await auctionTx.wait();
  console.log("Deployer created auction, tx hash:", auctionTx.hash);
  const auction = await nftManager.auctions(1);
  console.log("Auction details:", {
    seller: auction.seller,
    amount: auction.amount.toString(),
    minBid: ethers.formatEther(auction.minBid),
    endTime: auction.endTime.toString(),
  });

  // 5. Test placeBid
  console.log("\n=== Testing placeBid ===");
  const bidAmount = ethers.parseEther("0.15");
  const bidTx = await nftManager.placeBid(1, { value: bidAmount });
  await bidTx.wait();
  console.log("Deployer placed bid, tx hash:", bidTx.hash);
  const updatedAuction = await nftManager.auctions(1);
  console.log("Updated auction details:", {
    highestBidder: updatedAuction.highestBidder,
    highestBid: ethers.formatEther(updatedAuction.highestBid),
  });

  // 6. Test endAuction
  console.log("\n=== Testing endAuction ===");
  console.log(
    "Note: endAuction requires auction to expire. Check endTime vs current time."
  );
  console.log(
    "Auction end time:",
    (await nftManager.auctions(1)).endTime.toString()
  );
  console.log(
    "Current block timestamp:",
    (await ethers.provider.getBlock("latest")).timestamp
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
