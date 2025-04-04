"use client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/api/apolloClient";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { memo, ReactNode } from "react";
import { WalletProvider } from "@/components/providers/WalletProvider";

// Memoize the WalletProvider component
const MemoizedWalletProvider = memo(({ children }: { children: ReactNode }) => {
  return <WalletProvider>{children}</WalletProvider>;
});
MemoizedWalletProvider.displayName = "MemoizedWalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <MemoizedWalletProvider>{children}</MemoizedWalletProvider>
        </ApolloProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
