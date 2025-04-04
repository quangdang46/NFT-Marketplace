import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated?: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    connectWalletRedux: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    disconnectWalletRedux: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { connectWalletRedux, disconnectWalletRedux } = authSlice.actions;

export default authSlice.reducer;
