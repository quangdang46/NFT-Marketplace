"use client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/api/apolloClient";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";
import { WalletProvider } from "@/components/providers/WalletProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <WalletProvider>{children}</WalletProvider>
        </ApolloProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
