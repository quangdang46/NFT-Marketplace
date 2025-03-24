import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  owner: {
    id: string;
    name: string;
  };
  collection: {
    id: string;
    name: string;
  };
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
  };
  history: {
    date: string;
    price: number;
    from: string;
    to: string;
    type: "mint" | "sale" | "transfer";
  }[];
}

interface NFTsState {
  nfts: NFT[];
  filteredNfts: NFT[];
  selectedNft: NFT | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NFTsState = {
  nfts: [],
  filteredNfts: [],
  selectedNft: null,
  status: "idle",
  error: null,
};

export const fetchNFTs = createAsyncThunk(
  "nfts/fetchNFTs",
  async ({
    chainId,
    collectionId,
  }: {
    chainId?: string;
    collectionId?: string;
  }) => {
    // In a real app, this would be an API call
    // Simulating API call
    return new Promise<NFT[]>((resolve) => {
      setTimeout(() => {
        const mockNFTs = Array(12)
          .fill(null)
          .map((_, index) => {
            const chainIndex = chainId
              ? ["solana", "ethereum", "polygon"].indexOf(chainId)
              : Math.floor(Math.random() * 3);

            const finalChainIndex = chainIndex === -1 ? 0 : chainIndex;
            const chainIds = ["solana", "ethereum", "polygon"];
            const chainNames = ["Solana", "Ethereum", "Polygon"];
            const chainSymbols = ["SOL", "ETH", "MATIC"];

            const price = 0.1 + Math.random() * 1;

            return {
              id: `nft-${index}`,
              name: `${collectionId ? `${collectionId} ` : ""}NFT #${
                index + 1
              }`,
              description: "This is an amazing NFT with unique properties.",
              image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?150x150`,
              price,
              owner: {
                id: "user-1",
                name: "CryptoCollector",
              },
              collection: {
                id: collectionId || "collection-1",
                name: collectionId
                  ? `Collection ${collectionId}`
                  : "Awesome Collection",
              },
              chain: {
                id: chainIds[finalChainIndex],
                name: chainNames[finalChainIndex],
                icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
                symbol: chainSymbols[finalChainIndex],
              },
              history: [
                {
                  date: "2023-06-15",
                  price: price * 0.8,
                  from: "0x1234...5678",
                  to: "CryptoCollector",
                  type: "sale",
                },
                {
                  date: "2023-05-20",
                  price: price * 0.6,
                  from: "Creator",
                  to: "0x1234...5678",
                  type: "sale",
                },
                {
                  date: "2023-04-10",
                  price: price * 0.5,
                  from: "0x0000...0000",
                  to: "Creator",
                  type: "mint",
                },
              ],
            };
          });

        resolve(mockNFTs);
      }, 1000);
    });
  }
);

export const fetchNFTById = createAsyncThunk(
  "nfts/fetchNFTById",
  async (nftId: string) => {
    // In a real app, this would be an API call
    // Simulating API call
    return new Promise<NFT>((resolve) => {
      setTimeout(() => {
        const chainIndex = Math.floor(Math.random() * 3);
        const chainIds = ["solana", "ethereum", "polygon"];
        const chainNames = ["Solana", "Ethereum", "Polygon"];
        const chainSymbols = ["SOL", "ETH", "MATIC"];

        const price = 0.1 + Math.random() * 1;

        const mockNFT = {
          id: nftId,
          name: `Awesome NFT #${nftId}`,
          description:
            "This is an amazing NFT with unique properties. It represents digital art at its finest with vibrant colors and intricate details.",
          image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?400x400`,
          price,
          owner: {
            id: "user-1",
            name: "CryptoCollector",
          },
          collection: {
            id: "collection-1",
            name: "Awesome Collection",
          },
          chain: {
            id: chainIds[chainIndex],
            name: chainNames[chainIndex],
            icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
            symbol: chainSymbols[chainIndex],
          },
          history: [
            {
              date: "2023-06-15",
              price: price * 0.8,
              from: "0x1234...5678",
              to: "CryptoCollector",
              type: "sale",
            },
            {
              date: "2023-05-20",
              price: price * 0.6,
              from: "Creator",
              to: "0x1234...5678",
              type: "sale",
            },
            {
              date: "2023-04-10",
              price: price * 0.5,
              from: "0x0000...0000",
              to: "Creator",
              type: "mint",
            },
          ],
        };

        resolve(mockNFT);
      }, 1000);
    });
  }
);

const nftsSlice = createSlice({
  name: "nfts",
  initialState,
  reducers: {
    filterNFTsByChain: (state, action: PayloadAction<string>) => {
      if (action.payload === "all") {
        state.filteredNfts = state.nfts;
      } else {
        state.filteredNfts = state.nfts.filter(
          (nft) => nft.chain.id === action.payload
        );
      }
    },
    clearSelectedNFT: (state) => {
      state.selectedNft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNFTs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.nfts = action.payload;
        state.filteredNfts = action.payload;
      })
      .addCase(fetchNFTs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch NFTs";
      })
      .addCase(fetchNFTById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNFTById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedNft = action.payload;
      })
      .addCase(fetchNFTById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch NFT";
      });
  },
});

export const { filterNFTsByChain, clearSelectedNFT } = nftsSlice.actions;

export default nftsSlice.reducer;
