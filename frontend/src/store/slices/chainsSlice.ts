import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface Chain {
  id: string;
  name: string;
  icon: string;
  symbol: string;
}

interface ChainsState {
  chains: Chain[];
  selectedChain: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChainsState = {
  chains: [],
  selectedChain: null,
  status: "idle",
  error: null,
};

export const fetchChains = createAsyncThunk("chains/fetchChains", async () => {
  // In a real app, this would be an API call
  // Simulating API call
  return new Promise<Chain[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "solana",
          name: "Solana",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
          symbol: "SOL",
        },
        {
          id: "ethereum",
          name: "Ethereum",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
          symbol: "ETH",
        },
        {
          id: "polygon",
          name: "Polygon",
          icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
          symbol: "MATIC",
        },
      ]);
    }, 1000);
  });
});

const chainsSlice = createSlice({
  name: "chains",
  initialState,
  reducers: {
    setSelectedChain: (state, action: PayloadAction<string>) => {
      state.selectedChain = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChains.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chains = action.payload;
        if (!state.selectedChain && action.payload.length > 0) {
          state.selectedChain = action.payload[0].id;
        }
      })
      .addCase(fetchChains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch chains";
      });
  },
});

export const { setSelectedChain } = chainsSlice.actions;

export default chainsSlice.reducer;
