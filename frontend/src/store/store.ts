import { configureStore, combineReducers } from "@reduxjs/toolkit";
import chainsReducer from "./slices/chainsSlice";
import collectionsReducer from "./slices/collectionsSlice";
import nftsReducer from "./slices/nftsSlice";
import userReducer from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
  timeout: 1000,
};
const rootReducer = combineReducers({
  auth: authReducer,
  chains: chainsReducer,
  collections: collectionsReducer,
  nfts: nftsReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
