/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import { TokenId } from '@hashgraph/sdk';
import map from 'lodash/map';
import concat from 'lodash/concat';
import entries from 'lodash/entries';
import filter from 'lodash/filter';
import { MIRROR_NODE, HEDERA_MIRROR_NODE_API_VERSION } from '../Global.d';
import { TokenInfo, TokenSupplyType } from '../utils/entity/TokenInfo';
import { NFTInfo } from '../utils/entity/NFTInfo';

type GroupedNFTs = {
  [index: string]: NFTInfo[];
};

interface ResponseLinks {
  next: null | string;
}

interface Token {
  token_id: string;
  balance: number;
}

interface AccountBalance {
  account: string;
  balance: number;
  tokens: Token[];
}

interface AccountResponse {
  balance: AccountBalance;
  timestamp: string;
  key: { _type: string; key: string };
}

interface FetchAllNFTsResponse {
  nfts: NFTInfo[];
  links: ResponseLinks;
}

export interface GroupedNFTsByCollectionIdWithInfo {
  collection_id: string;
  nfts: NFTInfo[];
  collection_info: TokenInfo;
}

export default class MirrorNode {
  static readonly instance = axios.create({
    baseURL: MIRROR_NODE,
  });

  static async fetchAccountInfo(accountId: string) {
    const { data } = await this.instance.get<AccountResponse>(`/accounts/${accountId}`);

    return data;
  }

  static async fetchTokenInfo(tokenId: string): Promise<TokenInfo> {
    const { data } = await this.instance.get(`/tokens/${tokenId}`);

    return data;
  }

  static async fetchNFTInfo(tokenId: string | TokenId): Promise<{ nfts: NFTInfo[] }> {
    const { data } = await this.instance.get(`/tokens/${tokenId}/nfts`);

    return data;
  }

  static async fetchAllNFTs(idOrAliasOrEvmAddress: string, nextLink?: string) {
    const { data } = await this.instance.get<FetchAllNFTsResponse>(
      nextLink ? nextLink.split(`api/${HEDERA_MIRROR_NODE_API_VERSION}/`)[1] : `/accounts/${idOrAliasOrEvmAddress}/nfts`
    );

    nextLink = undefined;

    let { nfts } = data;

    if (data.links.next) {
      nextLink = data.links.next;
    }

    if (nextLink) {
      const nextLinkNfts = await this.fetchAllNFTs(idOrAliasOrEvmAddress, nextLink);

      nfts = concat(nfts, nextLinkNfts);
    }

    return nfts;
  }

  static async fetchCollectionInfoForGroupedNFTs(groupedNfts: GroupedNFTs) {
    const groupedNFTsByCollectionIdWithInfo: GroupedNFTsByCollectionIdWithInfo[] = await Promise.all(
      map(entries(groupedNfts), async ([collectionId, nfts]) => ({
        collection_id: collectionId,
        nfts,
        collection_info: await this.fetchTokenInfo(collectionId),
      }))
    );

    return groupedNFTsByCollectionIdWithInfo;
  }

  static async filterCollectionInfoForGroupedNFTs(
    groupedNFTsByCollectionIdWithInfo: GroupedNFTsByCollectionIdWithInfo[],
    accountId: string,
    options: {
      onlyAllowedToMint?: boolean;
    }
  ) {
    const { key } = await this.fetchAccountInfo(accountId);

    return filter(groupedNFTsByCollectionIdWithInfo, (groupedNFTsByCollectionIdWithInfo) => {
      if (options.onlyAllowedToMint) {
        if (groupedNFTsByCollectionIdWithInfo?.collection_info?.supply_key?.key !== key.key) {
          return false;
        }

        return (
          groupedNFTsByCollectionIdWithInfo?.collection_info?.supply_type === TokenSupplyType.FINITE &&
          parseInt(groupedNFTsByCollectionIdWithInfo?.collection_info.total_supply ?? '0', 10) <=
            parseInt(groupedNFTsByCollectionIdWithInfo?.collection_info.max_supply ?? '0', 10)
        );
      }

      return true;
    });
  }
}
