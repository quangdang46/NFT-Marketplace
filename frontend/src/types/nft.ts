export interface NFT {
  id: string;
  image: string;
  price: string;
  lastPrice: string;
  selected: boolean;
  background: string;
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
