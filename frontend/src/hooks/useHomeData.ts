// hooks/useHomeData.ts
import { useCollections } from "./useCollections";

interface UseHomeDataProps {
  chainId: string | null;
}

export function useHomeData({ chainId }: UseHomeDataProps) {
  const {
    collections,
    stats,
    isLoading: collectionsLoading,
  } = useCollections({ chainId });

  const isLoading = collectionsLoading;

  return {
    collections,
    stats,
    isLoading,
  };
}
