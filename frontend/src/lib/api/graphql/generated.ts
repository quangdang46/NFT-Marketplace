import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AllowlistStage = {
  __typename?: 'AllowlistStage';
  durationDays: Scalars['String']['output'];
  durationHours: Scalars['String']['output'];
  id: Scalars['String']['output'];
  mintPrice: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  wallets: Array<Scalars['String']['output']>;
};

export type AllowlistStageInput = {
  durationDays: Scalars['String']['input'];
  durationHours: Scalars['String']['input'];
  id: Scalars['String']['input'];
  mintPrice: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  wallets: Array<Scalars['String']['input']>;
};

export type ApproveCollectionResponse = {
  __typename?: 'ApproveCollectionResponse';
  success: Scalars['Boolean']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Collection = {
  __typename?: 'Collection';
  allowlistStages?: Maybe<Array<AllowlistStage>>;
  chain: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creatorId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  maxSupply: Scalars['String']['output'];
  mintPrice: Scalars['String']['output'];
  mintStartDate: Scalars['String']['output'];
  name: Scalars['String']['output'];
  publicMint?: Maybe<PublicMint>;
  status: Scalars['String']['output'];
  totalMinted: Scalars['String']['output'];
};

export type CollectionsResponse = {
  __typename?: 'CollectionsResponse';
  collections: Array<Collection>;
  stats: Stats;
};

export type CreateCollectionInput = {
  allowlistStages: Array<AllowlistStageInput>;
  artType: Scalars['String']['input'];
  chain: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  collectionImageUrl: Scalars['String']['input'];
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  maxSupply: Scalars['String']['input'];
  mintLimit: Scalars['String']['input'];
  mintPrice: Scalars['String']['input'];
  mintStartDate: Scalars['String']['input'];
  name: Scalars['String']['input'];
  publicMint: PublicMintInput;
  royaltyFee: Scalars['String']['input'];
  uri: Scalars['String']['input'];
};

export type CreateCollectionResponse = {
  __typename?: 'CreateCollectionResponse';
  collectionId?: Maybe<Scalars['String']['output']>;
  contractAddress?: Maybe<Scalars['String']['output']>;
  steps?: Maybe<Array<CreateCollectionStep>>;
};

export type CreateCollectionStep = {
  __typename?: 'CreateCollectionStep';
  id: Scalars['String']['output'];
  params: Scalars['String']['output'];
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveCollection: ApproveCollectionResponse;
  createCollection: CreateCollectionResponse;
  createUser: CreateUserResponse;
  logout: Scalars['Boolean']['output'];
  refreshToken: AuthResponse;
  sendMessage: Scalars['String']['output'];
  verify: AuthResponse;
  verifyUser: VerifyUserResponse;
};


export type MutationApproveCollectionArgs = {
  collectionId: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateUserArgs = {
  _address: Scalars['String']['input'];
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  message: Scalars['String']['input'];
};


export type MutationVerifyArgs = {
  message: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};


export type MutationVerifyUserArgs = {
  userId: Scalars['String']['input'];
};

export type PendingCollection = {
  __typename?: 'PendingCollection';
  collectionId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creatorId: Scalars['String']['output'];
  creatorRole: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PublicMint = {
  __typename?: 'PublicMint';
  durationDays: Scalars['String']['output'];
  durationHours: Scalars['String']['output'];
  mintPrice: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
};

export type PublicMintInput = {
  durationDays: Scalars['String']['input'];
  durationHours: Scalars['String']['input'];
  mintPrice: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getCollections: CollectionsResponse;
  getPendingCollections: Array<PendingCollection>;
  getSignedUrl: Scalars['String']['output'];
  getUser: User;
  hello: Scalars['String']['output'];
  me: UserResponse;
  nonce: Scalars['String']['output'];
};


export type QueryGetCollectionsArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserArgs = {
  userId: Scalars['String']['input'];
};

export type Stats = {
  __typename?: 'Stats';
  artists: Scalars['Float']['output'];
  artworks: Scalars['Float']['output'];
  collectors: Scalars['Float']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  collectionApproved: Collection;
  collectionCreated: Collection;
  messageAdded: Scalars['String']['output'];
  statsUpdated: Stats;
};


export type SubscriptionCollectionApprovedArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionCollectionCreatedArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  is_verified: Scalars['Boolean']['output'];
  role: Scalars['String']['output'];
  username: Scalars['String']['output'];
  wallet_address: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type VerifyUserResponse = {
  __typename?: 'VerifyUserResponse';
  status: Scalars['String']['output'];
};

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', id: string, address: string } };

export type NonceQueryVariables = Exact<{ [key: string]: never; }>;


export type NonceQuery = { __typename?: 'Query', nonce: string };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string } };

export type VerifyMutationVariables = Exact<{
  message: Scalars['String']['input'];
  signature: Scalars['String']['input'];
}>;


export type VerifyMutation = { __typename?: 'Mutation', verify: { __typename?: 'AuthResponse', accessToken: string, refreshToken: string } };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'CreateCollectionResponse', collectionId?: string | null, contractAddress?: string | null, steps?: Array<{ __typename?: 'CreateCollectionStep', id: string, params: string }> | null } };

export type GetCollectionsQueryVariables = Exact<{
  chainId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCollectionsQuery = { __typename?: 'Query', getCollections: { __typename?: 'CollectionsResponse', collections: Array<{ __typename?: 'Collection', id: string, name: string, image: string, mintPrice: string, maxSupply: string, mintStartDate: string, chain: string, createdAt: string, totalMinted: string, creatorId: string, isVerified: boolean, status: string, publicMint?: { __typename?: 'PublicMint', mintPrice: string, startDate: string, durationDays: string, durationHours: string } | null, allowlistStages?: Array<{ __typename?: 'AllowlistStage', id: string, mintPrice: string, startDate: string, durationDays: string, durationHours: string, wallets: Array<string> }> | null }>, stats: { __typename?: 'Stats', artworks: number, artists: number, collectors: number } } };

export type CollectionCreatedSubscriptionVariables = Exact<{
  chainId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CollectionCreatedSubscription = { __typename?: 'Subscription', collectionCreated: { __typename?: 'Collection', id: string, name: string, chainId: string, status: string } };

export type CollectionApprovedSubscriptionVariables = Exact<{
  chainId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CollectionApprovedSubscription = { __typename?: 'Subscription', collectionApproved: { __typename?: 'Collection', id: string, name: string, status: string } };

export type GetSignedUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSignedUrlQuery = { __typename?: 'Query', getSignedUrl: string };


export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    address
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NonceDocument = gql`
    query Nonce {
  nonce
}
    `;

/**
 * __useNonceQuery__
 *
 * To run a query within a React component, call `useNonceQuery` and pass it any options that fit your needs.
 * When your component renders, `useNonceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNonceQuery({
 *   variables: {
 *   },
 * });
 */
export function useNonceQuery(baseOptions?: Apollo.QueryHookOptions<NonceQuery, NonceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NonceQuery, NonceQueryVariables>(NonceDocument, options);
      }
export function useNonceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NonceQuery, NonceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NonceQuery, NonceQueryVariables>(NonceDocument, options);
        }
export function useNonceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NonceQuery, NonceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NonceQuery, NonceQueryVariables>(NonceDocument, options);
        }
export type NonceQueryHookResult = ReturnType<typeof useNonceQuery>;
export type NonceLazyQueryHookResult = ReturnType<typeof useNonceLazyQuery>;
export type NonceSuspenseQueryHookResult = ReturnType<typeof useNonceSuspenseQuery>;
export type NonceQueryResult = Apollo.QueryResult<NonceQuery, NonceQueryVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const VerifyDocument = gql`
    mutation Verify($message: String!, $signature: String!) {
  verify(message: $message, signature: $signature) {
    accessToken
    refreshToken
  }
}
    `;
export type VerifyMutationFn = Apollo.MutationFunction<VerifyMutation, VerifyMutationVariables>;

/**
 * __useVerifyMutation__
 *
 * To run a mutation, you first call `useVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyMutation, { data, loading, error }] = useVerifyMutation({
 *   variables: {
 *      message: // value for 'message'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useVerifyMutation(baseOptions?: Apollo.MutationHookOptions<VerifyMutation, VerifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyMutation, VerifyMutationVariables>(VerifyDocument, options);
      }
export type VerifyMutationHookResult = ReturnType<typeof useVerifyMutation>;
export type VerifyMutationResult = Apollo.MutationResult<VerifyMutation>;
export type VerifyMutationOptions = Apollo.BaseMutationOptions<VerifyMutation, VerifyMutationVariables>;
export const CreateCollectionDocument = gql`
    mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    collectionId
    contractAddress
    steps {
      id
      params
    }
  }
}
    `;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const GetCollectionsDocument = gql`
    query GetCollections($chainId: String) {
  getCollections(chainId: $chainId) {
    collections {
      id
      name
      image
      mintPrice
      maxSupply
      mintStartDate
      publicMint {
        mintPrice
        startDate
        durationDays
        durationHours
      }
      allowlistStages {
        id
        mintPrice
        startDate
        durationDays
        durationHours
        wallets
      }
      chain
      createdAt
      totalMinted
      creatorId
      isVerified
      status
    }
    stats {
      artworks
      artists
      collectors
    }
  }
}
    `;

/**
 * __useGetCollectionsQuery__
 *
 * To run a query within a React component, call `useGetCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionsQuery({
 *   variables: {
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useGetCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(GetCollectionsDocument, options);
      }
export function useGetCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(GetCollectionsDocument, options);
        }
export function useGetCollectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCollectionsQuery, GetCollectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(GetCollectionsDocument, options);
        }
export type GetCollectionsQueryHookResult = ReturnType<typeof useGetCollectionsQuery>;
export type GetCollectionsLazyQueryHookResult = ReturnType<typeof useGetCollectionsLazyQuery>;
export type GetCollectionsSuspenseQueryHookResult = ReturnType<typeof useGetCollectionsSuspenseQuery>;
export type GetCollectionsQueryResult = Apollo.QueryResult<GetCollectionsQuery, GetCollectionsQueryVariables>;
export const CollectionCreatedDocument = gql`
    subscription CollectionCreated($chainId: String) {
  collectionCreated(chainId: $chainId) {
    id
    name
    chainId
    status
  }
}
    `;

/**
 * __useCollectionCreatedSubscription__
 *
 * To run a query within a React component, call `useCollectionCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCollectionCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionCreatedSubscription({
 *   variables: {
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useCollectionCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CollectionCreatedSubscription, CollectionCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CollectionCreatedSubscription, CollectionCreatedSubscriptionVariables>(CollectionCreatedDocument, options);
      }
export type CollectionCreatedSubscriptionHookResult = ReturnType<typeof useCollectionCreatedSubscription>;
export type CollectionCreatedSubscriptionResult = Apollo.SubscriptionResult<CollectionCreatedSubscription>;
export const CollectionApprovedDocument = gql`
    subscription CollectionApproved($chainId: String) {
  collectionApproved(chainId: $chainId) {
    id
    name
    status
  }
}
    `;

/**
 * __useCollectionApprovedSubscription__
 *
 * To run a query within a React component, call `useCollectionApprovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCollectionApprovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionApprovedSubscription({
 *   variables: {
 *      chainId: // value for 'chainId'
 *   },
 * });
 */
export function useCollectionApprovedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CollectionApprovedSubscription, CollectionApprovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CollectionApprovedSubscription, CollectionApprovedSubscriptionVariables>(CollectionApprovedDocument, options);
      }
export type CollectionApprovedSubscriptionHookResult = ReturnType<typeof useCollectionApprovedSubscription>;
export type CollectionApprovedSubscriptionResult = Apollo.SubscriptionResult<CollectionApprovedSubscription>;
export const GetSignedUrlDocument = gql`
    query GetSignedUrl {
  getSignedUrl
}
    `;

/**
 * __useGetSignedUrlQuery__
 *
 * To run a query within a React component, call `useGetSignedUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignedUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignedUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSignedUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetSignedUrlQuery, GetSignedUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSignedUrlQuery, GetSignedUrlQueryVariables>(GetSignedUrlDocument, options);
      }
export function useGetSignedUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSignedUrlQuery, GetSignedUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSignedUrlQuery, GetSignedUrlQueryVariables>(GetSignedUrlDocument, options);
        }
export function useGetSignedUrlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSignedUrlQuery, GetSignedUrlQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSignedUrlQuery, GetSignedUrlQueryVariables>(GetSignedUrlDocument, options);
        }
export type GetSignedUrlQueryHookResult = ReturnType<typeof useGetSignedUrlQuery>;
export type GetSignedUrlLazyQueryHookResult = ReturnType<typeof useGetSignedUrlLazyQuery>;
export type GetSignedUrlSuspenseQueryHookResult = ReturnType<typeof useGetSignedUrlSuspenseQuery>;
export type GetSignedUrlQueryResult = Apollo.QueryResult<GetSignedUrlQuery, GetSignedUrlQueryVariables>;