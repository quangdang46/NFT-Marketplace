import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  address: string;
  bio: string;
  avatar: string;
  isConnected: boolean;
}

interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

export const connectWallet = createAsyncThunk(
  "user/connectWallet",
  async () => {
    // In a real app, this would connect to a wallet like MetaMask
    // Simulating wallet connection
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: "user-1",
          name: "CryptoCollector",
          address: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          bio: "Passionate NFT collector and digital art enthusiast.",
          avatar: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?100x100`,
          isConnected: true,
        };

        resolve(mockUser);
      }, 1000);
    });
  }
);

export const disconnectWallet = createAsyncThunk(
  "user/disconnectWallet",
  async () => {
    // In a real app, this would disconnect from the wallet
    // Simulating wallet disconnection
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId: string) => {
    // In a real app, this would be an API call
    // Simulating API call
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: userId,
          name: userId === "me" ? "CryptoCollector" : `User ${userId}`,
          address: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          bio: "Passionate NFT collector and digital art enthusiast.",
          avatar: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?100x100`,
          isConnected: userId === "me",
        };

        resolve(mockUser);
      }, 1000);
    });
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to connect wallet";
      })
      .addCase(disconnectWallet.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user profile";
      });
  },
});

export default userSlice.reducer;
