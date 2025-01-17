import { useCallback, useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import MirrorNode, { GroupedNFTsByCollectionIdWithInfo } from '../services/MirrorNode';

export default function useHederaAccountNFTs(userWalletId: string | undefined, showLoadError = false) {
  const [collections, setCollections] = useState<GroupedNFTsByCollectionIdWithInfo[] | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchHederaAccountNFTs = useCallback(
    async (onlyAllowedToMint = false) => {
      let groupedCollections;

      try {
        const accountId = userWalletId ?? null;

        if (!accountId) {
          throw new Error('No account ID! Connect wallet first.');
        }

        const fetchedNfts = await MirrorNode.fetchAllNFTs(accountId);
        const groupedFetchedNfts = groupBy(fetchedNfts, 'token_id');

        groupedCollections = await MirrorNode.fetchCollectionInfoForGroupedNFTs(groupedFetchedNfts);

        if (onlyAllowedToMint) {
          groupedCollections = await MirrorNode.filterCollectionInfoForGroupedNFTs(groupedCollections, accountId, {
            onlyAllowedToMint,
          });
        }

        setCollections(groupedCollections);
        setLoading(false);
      } catch (e) {
        if (showLoadError && e instanceof Error) {
          console.error(e.message);
        }
      }

      return groupedCollections;
    },
    [showLoadError, userWalletId]
  );

  useEffect(() => {
    if (!userWalletId) {
      setCollections(null);
      setLoading(true);
    }
  }, [userWalletId]);

  return {
    collections,
    loading,
    fetchHederaAccountNFTs,
  };
}
