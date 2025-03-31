const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  // Deploy contract trên Hardhat local
  const marketplaceFeeRecipient = deployer.address; // Dùng deployer làm recipient cho đơn giản
  const marketplaceFeePercentage = 200; // 2%
  const name = "MyNFTCollection";
  const uri = "https://ipfs.io/ipfs/QmTestUri";
  const maxSupply = 1000;
  const mintLimit = 10;
  const mintPrice = ethers.parseEther("0.01");

  const NFTManager = await ethers.getContractFactory("NFTManager");
  const nftManager = await NFTManager.deploy(
    name,
    uri,
    marketplaceFeeRecipient,
    marketplaceFeePercentage,
    maxSupply,
    mintLimit,
    mintPrice
  );
  await nftManager.waitForDeployment();
  const contractAddress = await nftManager.getAddress();
  console.log("NFTManager deployed to:", contractAddress);

  // Test với các tài khoản
  const nftManagerDeployer = nftManager.connect(deployer);
  const nftManagerUser1 = nftManager.connect(user1);
  const nftManagerUser2 = nftManager.connect(user2);

  // 1. Test mintNFT
  console.log("\n=== Testing mintNFT ===");
  const mintAmount = 5;
  const totalCost = mintPrice * BigInt(mintAmount);
  const mintTx = await nftManagerUser1.mintNFT(mintAmount, {
    value: totalCost,
  });
  await mintTx.wait();
  console.log(`User1 minted ${mintAmount} NFTs, tx hash:`, mintTx.hash);
  console.log(
    "User1 balance (TOKEN_ID=1):",
    (await nftManager.balanceOf(user1.address, 1)).toString()
  );

  // 2. Test bulkMint
  console.log("\n=== Testing bulkMint ===");
  const bulkMintAmount = 3;
  const bulkMintTx = await nftManagerDeployer.bulkMint(
    user2.address,
    bulkMintAmount
  );
  await bulkMintTx.wait();
  console.log(
    `Deployer bulk minted ${bulkMintAmount} NFTs to User2, tx hash:`,
    bulkMintTx.hash
  );
  console.log(
    "User2 balance (TOKEN_ID=1):",
    (await nftManager.balanceOf(user2.address, 1)).toString()
  );

  // 3. Test lazyMint
  console.log("\n=== Testing lazyMint ===");
  const lazyMintAmount = 2;
  const lazyMintMessage = ethers.solidityPackedKeccak256(
    ["address", "uint256", "string"],
    [user1.address, lazyMintAmount, await nftManager.uri(1)]
  );
  const signature = await deployer.signMessage(
    ethers.getBytes(lazyMintMessage)
  );
  const lazyMintTx = await nftManagerDeployer.lazyMint(
    user1.address,
    lazyMintAmount,
    signature
  );
  await lazyMintTx.wait();
  console.log(
    `Deployer lazy minted ${lazyMintAmount} NFTs to User1, tx hash:`,
    lazyMintTx.hash
  );
  console.log(
    "User1 balance after lazy mint (TOKEN_ID=1):",
    (await nftManager.balanceOf(user1.address, 1)).toString()
  );

  // 4. Test createAuction
  console.log("\n=== Testing createAuction ===");
  const auctionAmount = 4;
  const minBid = ethers.parseEther("0.1");
  const duration = 3600;
  const auctionTx = await nftManagerUser1.createAuction(
    auctionAmount,
    minBid,
    duration
  );
  await auctionTx.wait();
  console.log("User1 created auction, tx hash:", auctionTx.hash);
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
  const bidTx = await nftManagerUser2.placeBid(1, { value: bidAmount });
  await bidTx.wait();
  console.log("User2 placed bid, tx hash:", bidTx.hash);
  const updatedAuction = await nftManager.auctions(1);
  console.log("Updated auction details:", {
    highestBidder: updatedAuction.highestBidder,
    highestBid: ethers.formatEther(updatedAuction.highestBid),
  });

  // 6. Test endAuction
  console.log("\n=== Testing endAuction ===");
  await ethers.provider.send("evm_increaseTime", [3600]);
  await ethers.provider.send("evm_mine", []);
  const endAuctionTx = await nftManagerUser1.endAuction(1);
  await endAuctionTx.wait();
  console.log("Auction ended, tx hash:", endAuctionTx.hash);
  console.log(
    "User2 balance after auction (TOKEN_ID=1):",
    (await nftManager.balanceOf(user2.address, 1)).toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
