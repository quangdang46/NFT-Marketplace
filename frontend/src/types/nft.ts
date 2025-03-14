export interface NFT {
  id: string;
  image: string;
  price: string;
  lastPrice: string;
  selected: boolean;
  background: string;
}

export interface MintStage {
  name: string;
  status: string;
  time: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  details: string;
  active: boolean;
  isPublic?: boolean;
}

export interface NFTData {
  title: string;
  currentPrice: string;
  ethPrice: string;
  totalMinted: number;
  totalSupply: number;
  mintStages: MintStage[];
  images: string[];
}
export interface NFTItem {
  id: number;
  title: string;
  image: string;
  price: string;
  items: string;
  minted: string;
  endDate: string;
}
