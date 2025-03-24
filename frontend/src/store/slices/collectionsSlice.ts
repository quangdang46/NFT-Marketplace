import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface Collection {
  id: string;
  address: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number;
  volume: number;
  itemCount: number;
  ownerAddress: string;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
  };
}

interface CollectionsState {
  collections: Collection[];
  filteredCollections: Collection[];
  selectedCollection: Collection | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  filteredCollections: [],
  selectedCollection: null,
  status: "idle",
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (chainId?: string) => {
    // In a real app, this would be an API call
    // Simulating API call
    return new Promise<Collection[]>((resolve) => {
      setTimeout(() => {
        const mockCollections = Array(12)
          .fill(null)
          .map((_, index) => {
            const chainIndex = chainId
              ? ["solana", "ethereum", "polygon"].indexOf(chainId)
              : Math.floor(Math.random() * 3);

            const finalChainIndex = chainIndex === -1 ? 0 : chainIndex;
            const chainIds = ["solana", "ethereum", "polygon"];
            const chainNames = ["Solana", "Ethereum", "Polygon"];
            const chainSymbols = ["SOL", "ETH", "MATIC"];

            return {
              id: `collection-${index}`,
              address: `0x${Math.random()
                .toString(16)
                .substring(2, 10)}...${Math.random()
                .toString(16)
                .substring(2, 6)}`,
              name: `Awesome Collection ${index + 1}`,
              description:
                "This is an amazing collection of unique digital art pieces.",
              image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?200x200`,
              floorPrice: 0.5 + Math.random() * 2,
              volume: 10 + Math.random() * 100,
              itemCount: 10 + Math.floor(Math.random() * 990),
              ownerAddress: `0x${Math.random()
                .toString(16)
                .substring(2, 10)}...${Math.random()
                .toString(16)
                .substring(2, 6)}`,
              chain: {
                id: chainIds[finalChainIndex],
                name: chainNames[finalChainIndex],
                icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
                symbol: chainSymbols[finalChainIndex],
              },
            };
          });

        resolve(mockCollections);
      }, 1000);
    });
  }
);

export const fetchCollectionById = createAsyncThunk(
  "collections/fetchCollectionById",
  async (collectionId: string) => {
    // In a real app, this would be an API call
    // Simulating API call
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        const chainIndex = Math.floor(Math.random() * 3);
        const chainIds = ["solana", "ethereum", "polygon"];
        const chainNames = ["Solana", "Ethereum", "Polygon"];
        const chainSymbols = ["SOL", "ETH", "MATIC"];

        const mockCollection = {
          id: collectionId,
          address: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          name: `Awesome Collection ${collectionId}`,
          description:
            "This is an amazing collection of unique digital art pieces. Each NFT is carefully crafted and has unique properties and rarity.",
          image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?300x300`,
          floorPrice: 0.5 + Math.random() * 2,
          volume: 10 + Math.random() * 100,
          itemCount: 10 + Math.floor(Math.random() * 990),
          ownerAddress: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          chain: {
            id: chainIds[chainIndex],
            name: chainNames[chainIndex],
            icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
            symbol: chainSymbols[chainIndex],
          },
        };

        resolve(mockCollection);
      }, 1000);
    });
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    filterCollectionsByChain: (state, action: PayloadAction<string>) => {
      if (action.payload === "all") {
        state.filteredCollections = state.collections;
      } else {
        state.filteredCollections = state.collections.filter(
          (collection) => collection.chain.id === action.payload
        );
      }
    },
    clearSelectedCollection: (state) => {
      state.selectedCollection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.collections = action.payload;
        state.filteredCollections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch collections";
      })
      .addCase(fetchCollectionById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCollection = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch collection";
      });
  },
});

export const { filterCollectionsByChain, clearSelectedCollection } =
  collectionsSlice.actions;

export default collectionsSlice.reducer;
