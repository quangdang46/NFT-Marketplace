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
  DateTime: { input: any; output: any; }
};

export type CreateNftDto = {
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createNFT: Nft;
  createUser: User;
  removeUser: User;
  updateUser: User;
};


export type MutationCreateNftArgs = {
  data: CreateNftDto;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Nft = {
  __typename?: 'NFT';
  contract_address: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  creator: User;
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image_url: Scalars['String']['output'];
  metadata_url: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: User;
  token_id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAllNFTs: Array<Nft>;
  user: User;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  avatar_url?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
  wallet_address?: Maybe<Scalars['String']['output']>;
};

export type CreateNftMutationVariables = Exact<{
  data: CreateNftDto;
}>;


export type CreateNftMutation = { __typename?: 'Mutation', createNFT: { __typename?: 'NFT', name: string } };

export type GetAllNfTsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNfTsQuery = { __typename?: 'Query', getAllNFTs: Array<{ __typename?: 'NFT', id: number, name: string }> };


export const CreateNftDocument = gql`
    mutation CreateNFT($data: CreateNFTDto!) {
  createNFT(data: $data) {
    name
  }
}
    `;
export type CreateNftMutationFn = Apollo.MutationFunction<CreateNftMutation, CreateNftMutationVariables>;

/**
 * __useCreateNftMutation__
 *
 * To run a mutation, you first call `useCreateNftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNftMutation, { data, loading, error }] = useCreateNftMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateNftMutation(baseOptions?: Apollo.MutationHookOptions<CreateNftMutation, CreateNftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNftMutation, CreateNftMutationVariables>(CreateNftDocument, options);
      }
export type CreateNftMutationHookResult = ReturnType<typeof useCreateNftMutation>;
export type CreateNftMutationResult = Apollo.MutationResult<CreateNftMutation>;
export type CreateNftMutationOptions = Apollo.BaseMutationOptions<CreateNftMutation, CreateNftMutationVariables>;
export const GetAllNfTsDocument = gql`
    query GetAllNFTs {
  getAllNFTs {
    id
    name
  }
}
    `;

/**
 * __useGetAllNfTsQuery__
 *
 * To run a query within a React component, call `useGetAllNfTsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllNfTsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllNfTsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllNfTsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllNfTsQuery, GetAllNfTsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllNfTsQuery, GetAllNfTsQueryVariables>(GetAllNfTsDocument, options);
      }
export function useGetAllNfTsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllNfTsQuery, GetAllNfTsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllNfTsQuery, GetAllNfTsQueryVariables>(GetAllNfTsDocument, options);
        }
export function useGetAllNfTsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllNfTsQuery, GetAllNfTsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllNfTsQuery, GetAllNfTsQueryVariables>(GetAllNfTsDocument, options);
        }
export type GetAllNfTsQueryHookResult = ReturnType<typeof useGetAllNfTsQuery>;
export type GetAllNfTsLazyQueryHookResult = ReturnType<typeof useGetAllNfTsLazyQuery>;
export type GetAllNfTsSuspenseQueryHookResult = ReturnType<typeof useGetAllNfTsSuspenseQuery>;
export type GetAllNfTsQueryResult = Apollo.QueryResult<GetAllNfTsQuery, GetAllNfTsQueryVariables>;