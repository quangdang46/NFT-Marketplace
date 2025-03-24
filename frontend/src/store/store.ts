import { configureStore } from "@reduxjs/toolkit"
import chainsReducer from "./slices/chainsSlice"
import collectionsReducer from "./slices/collectionsSlice"
import nftsReducer from "./slices/nftsSlice"
import userReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    chains: chainsReducer,
    collections: collectionsReducer,
    nfts: nftsReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

