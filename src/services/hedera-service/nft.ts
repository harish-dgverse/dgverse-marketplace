import { TokenWipeTransaction, TokenBurnTransaction, TokenMintTransaction, TokenId } from '@hashgraph/sdk';
// import { getNftId } from './utils/htsUtils';

export const mintNftHedera = async (nftState: any, metadataCID: string[]) => {
  try {
    let mintTx;
    const tokenId = TokenId.fromString(nftState.tokenId);
    if (nftState.tokenType === 'nft' || nftState.tokenType === 'sbt') {
      const CID = metadataCID.map((cid) => Buffer.from(cid));
      mintTx = new TokenMintTransaction().setTokenId(tokenId).setMetadata(CID); // Batch minting - UP TO 10 NFTs in single tx
    } else {
      mintTx = new TokenMintTransaction().setTokenId(tokenId).setAmount(nftState.volume);
    }
    return {
      status: 'success',
      transaction: mintTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const burnToken = async (payload: any) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    let burnTx;
    if (payload.tokenType === 'nft') {
      const nftSerials = payload.serials;
      burnTx = new TokenBurnTransaction().setTokenId(tokenId).setSerials(nftSerials);
    } else {
      burnTx = new TokenBurnTransaction().setTokenId(tokenId).setAmount(payload.volume);
    }
    return {
      status: 'success',
      transaction: burnTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const wipeToken = async (payload: any) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    let wipeTokenTx;
    const { wipeAccountId } = payload;
    if (payload.tokenType === 'nft') {
      const nftSerials = payload.serials;
      wipeTokenTx = new TokenWipeTransaction().setAccountId(wipeAccountId).setTokenId(tokenId).setSerials(nftSerials);
    } else {
      wipeTokenTx = new TokenWipeTransaction().setAccountId(wipeAccountId).setTokenId(tokenId).setAmount(payload.volume);
    }
    return {
      status: 'success',
      transaction: wipeTokenTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};
