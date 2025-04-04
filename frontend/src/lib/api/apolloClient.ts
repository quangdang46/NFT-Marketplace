/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";
import { RefreshTokenDocument } from "@/lib/api/graphql/generated";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// Biến để đồng bộ hóa refresh token
let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${process.env.NEXT_PUBLIC_GRAPHQL_WS_URL}`,
    connectionParams: () => {
      const token = Cookies.get("auth_token");
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
    on: {
      connected: () => console.log("WebSocket kết nối thành công"),
      closed: () => console.log("WebSocket bị đóng"),
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get("auth_token");
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.extensions?.code === "UNAUTHENTICATED" &&
          !operation.getContext().retry
        ) {
          const refreshToken = Cookies.get("refresh_token");
          if (!refreshToken) {
            Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
            Cookies.remove("refresh_token", {
              secure: true,
              sameSite: "strict",
            });
            if (typeof window !== "undefined") window.location.href = "/";
            return;
          }

          if (isRefreshing) {
            // Nếu đang refresh, thêm request vào hàng đợi
            return new Observable((observer) => {
              pendingRequests.push((newToken: string) => {
                operation.setContext({
                  headers: { Authorization: `Bearer ${newToken}` },
                  retry: true,
                });
                const subscriber = forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
                return () => subscriber.unsubscribe();
              });
            });
          }

          isRefreshing = true;

          const refreshClient = new ApolloClient({
            link: new HttpLink({
              uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
              credentials: "include",
            }),
            cache: new InMemoryCache(),
          });

          return new Observable((observer) => {
            refreshClient
              .mutate({
                mutation: RefreshTokenDocument,
                variables: { refreshToken },
              })
              .then(({ data }) => {
                const { accessToken, refreshToken: newRefreshToken } =
                  data!.refreshToken;
                Cookies.set("auth_token", accessToken, {
                  expires: 1 / 24, // 1 giờ
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                });
                Cookies.set("refresh_token", newRefreshToken, {
                  expires: 7, // 7 ngày
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                });

                // Cập nhật request gốc
                operation.setContext({
                  headers: { Authorization: `Bearer ${accessToken}` },
                  retry: true,
                });

                // Giải quyết các request đang chờ
                pendingRequests.forEach((resolve) => resolve(accessToken));
                pendingRequests = [];
                isRefreshing = false;

                const subscriber = forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });

                return () => subscriber.unsubscribe();
              })
              .catch((refreshError) => {
                console.log("Refresh token thất bại:", refreshError);
                Cookies.remove("auth_token", {
                  secure: true,
                  sameSite: "strict",
                });
                Cookies.remove("refresh_token", {
                  secure: true,
                  sameSite: "strict",
                });
                pendingRequests = [];
                isRefreshing = false;
                if (typeof window !== "undefined") window.location.href = "/";
                observer.error(refreshError);
              });
          });
        }
        console.log(`[Lỗi GraphQL]: ${err.message}`);
      }
    }
    if (networkError) console.log(`[Lỗi mạng]: ${networkError}`);
  }
);

const logLink = new ApolloLink((operation, forward) => {
  console.log("Yêu cầu Apollo:", operation.operationName, operation.variables);
  return forward(operation).map((response) => {
    console.log("Phản hồi Apollo:", response);
    return response;
  });
});

const client = new ApolloClient({
  link: from([logLink, errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});

export default client;
