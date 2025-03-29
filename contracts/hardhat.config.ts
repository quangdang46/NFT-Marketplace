import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    "eth-sepolia": {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: [process.env.PRIVATE_KEY!],
    },
    "base-sepolia": {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
    },
    "polygon-mumbai": {
      url:
        process.env.POLYGON_MUMBAI_RPC_URL ||
        "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
