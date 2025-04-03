/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCollections.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import client from "@/lib/api/apolloClient";
import {
  Collection,
  Stats,
  GetCollectionsDocument,
  CollectionCreatedDocument,
  CollectionApprovedDocument,
} from "@/lib/api/graphql/generated";

interface UseCollectionsProps {
  chainId: string | null;
}

export function useCollections({ chainId }: UseCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState<Stats>({
    artworks: 0,
    artists: 0,
    collectors: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.query({
          query: GetCollectionsDocument,
          variables: { chainId },
          fetchPolicy: "network-only",
        });
        setCollections(data.getCollections.collections || []);
        setStats(
          data.getCollections.stats || {
            artworks: 0,
            artists: 0,
            collectors: 0,
          }
        );
      } catch (error) {
        toast.error("Không thể tải collections", {
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [chainId]);

  // Subscription handler
  const subscribeTo = (
    query: any,
    onNext: (data: any) => void,
    errorMsg: string
  ) => {
    const subscription = client
      .subscribe({ query, variables: { chainId } })
      .subscribe({
        next: onNext,
        error: (error) => console.error(errorMsg, error),
      });
    return () => subscription.unsubscribe();
  };

  // Subscription: New collection
  useEffect(
    () =>
      subscribeTo(
        CollectionCreatedDocument,
        ({ data }) => {
          const newCollection = data?.collectionCreated;
          if (newCollection) {
            setCollections((prev) => [newCollection, ...prev]);
            toast.success(`Collection mới: ${newCollection.name}`);
          }
        },
        "Lỗi subscription collectionCreated:"
      ),
    [chainId]
  );

  // Subscription: Approved collection
  useEffect(
    () =>
      subscribeTo(
        CollectionApprovedDocument,
        ({ data }) => {
          const approvedCollection = data?.collectionApproved;
          if (approvedCollection) {
            setCollections((prev) =>
              prev.map((col) =>
                col.id === approvedCollection.id
                  ? { ...col, status: approvedCollection.status }
                  : col
              )
            );
            toast.success(`Collection được duyệt: ${approvedCollection.name}`);
          }
        },
        "Lỗi subscription collectionApproved:"
      ),
    [chainId]
  );

  return { collections, stats, isLoading };
}
