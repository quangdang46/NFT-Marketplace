import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("mainnet", {
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export default sdk;
