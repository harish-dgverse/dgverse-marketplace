/* eslint-disable no-param-reassign */
import axios from 'axios';
import concat from 'lodash/concat';
import { TokenId } from '@hashgraph/sdk';
import { TokenInfo } from '../../utils/entity/TokenInfo';
import { NFTInfo } from '../../utils/entity/NFTInfo';
import { MIRROR_NODE } from '../../Global.d';

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

interface ResponseLinks {
  next: null | string;
}

interface FetchAllNFTsResponse {
  nfts: NFTInfo[];
  links: ResponseLinks;
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

  static async fetchAllNFTs(accountId: string, tokenId: string | TokenId, nextLink?: string) {
    const { data } = await this.instance.get<FetchAllNFTsResponse>(
      nextLink ? nextLink.split(`api/v1/`)[1] : `/accounts/${accountId}/nfts?token.id=${tokenId}&order=asc`
    );

    nextLink = undefined;

    let { nfts } = data;

    if (data.links.next) {
      nextLink = data.links.next;
    }

    if (nextLink) {
      const nextLinkNfts = await this.fetchAllNFTs(accountId, tokenId, nextLink);

      nfts = concat(nfts, nextLinkNfts);
    }

    return nfts;
  }
}
