/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";
import { RefreshTokenDocument } from "@/lib/api/graphql/generated"; // Generated từ graphql-codegen

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
  credentials: "include", // Để gửi cookie
});

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

          // Tạo client tạm để gọi refreshToken
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
                mutation: RefreshTokenDocument, // Generated document
                variables: { refreshToken },
              })
              .then(({ data }) => {
                const { accessToken, refreshToken: newRefreshToken } =
                  data!.refreshToken;
                Cookies.set("auth_token", accessToken, {
                  expires: 1 / 24,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                });
                Cookies.set("refresh_token", newRefreshToken, {
                  expires: 7,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                });

                // Cập nhật header cho request gốc
                operation.setContext({
                  headers: { Authorization: `Bearer ${accessToken}` },
                  retry: true,
                });

                // Thử lại request gốc
                const subscriber = forward(operation).subscribe({
                  next: (result) => observer.next(result),
                  error: (error) => observer.error(error),
                  complete: () => observer.complete(),
                });

                return () => subscriber.unsubscribe();
              })
              .catch((refreshError) => {
                console.error("Refresh token failed:", refreshError);
                Cookies.remove("auth_token", {
                  secure: true,
                  sameSite: "strict",
                });
                Cookies.remove("refresh_token", {
                  secure: true,
                  sameSite: "strict",
                });
                if (typeof window !== "undefined") window.location.href = "/";
                observer.error(refreshError);
              });
          });
        }
        // các lỗi khác
        console.log(
          `[GraphQL error from apoloclient]: Message: ${err.message}`
        );
        Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
        Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
      }
    }
    if (networkError) console.error(`[Network error]: ${networkError}`);
  }
);
const logLink = new ApolloLink((operation, forward) => {
  console.log("Apollo Request:", operation.operationName, operation.variables);
  return forward(operation).map((response) => {
    console.log("Apollo Response:", response);
    return response;
  });
});
const client = new ApolloClient({
  link: from([logLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
