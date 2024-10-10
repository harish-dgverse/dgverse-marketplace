/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import axios, { AxiosResponse } from 'axios';
import { Buffer } from 'buffer';
import { IPFS_GATEWAYS, IPFS_URL } from '../Global.d';
import { NFTMetadata } from '../utils/entity/NFT-Metadata';

export interface UploadResponse {
  ok: boolean;
  value: {
    cid: string;
    created: string;
    deals?: [];
    files?: File[];
    name: string;
    pin?: {
      cid: string;
      created: string;
      size: number;
      status: string;
    };
    scope: string;
    size: number;
    type: string;
  };
}

const DEFAULT_IPFS_PROVIDER = 'https://ipfs.io/ipfs/{CID}';

export default class IPFS {
  static readonly UPLOAD_URL = '/upload';

  static readonly instance = axios.create({
    baseURL: IPFS_URL,
  });

  static gateways = IPFS_GATEWAYS ?? [DEFAULT_IPFS_PROVIDER];

  static async uploadFile(file: File | Blob) {
    try {
      return await this.instance.post<UploadResponse>(this.UPLOAD_URL, file);
    } catch (e) {
      throw new Error('We are experiencing very high demand. Please retry in 2 minutes.');
    }
  }

  static async createMetadataFile(meta: NFTMetadata) {
    try {
      const file = new File([JSON.stringify(meta)], 'meta.json', { type: 'application/json' });

      return await this.instance.post<UploadResponse>(this.UPLOAD_URL, file);
    } catch (e) {
      throw new Error('We are experiencing very high demand. Please retry in 2 minutes.');
    }
  }

  static async fetchDataFromCid(cid: string): Promise<NFTMetadata> {
    let counter = 0;

    do {
      const url = this.gateways[counter].replace('{CID}', cid);
      let res: AxiosResponse<NFTMetadata> | null = null;

      try {
        res = await IPFS.instance.get(url);
      } catch {
        counter += 1;
        continue;
      }

      if (res && res.status === 200) {
        return res.data;
      }
    } while (counter < this.gateways.length);

    throw new Error('Fetch metadata failed');
  }

  static async fetchData(metadata: string) {
    if (/^0*$/.test(Buffer.from(metadata).toString('hex'))) {
      return null;
    }

    if (metadata.includes('https://')) {
      const { data } = await this.instance.get(metadata);

      return data;
    }

    return this.fetchDataFromCid(atob(metadata).replace('ipfs://', ''));
  }

  static async fetchImage(cidImage: string) {
    let counter = 0;

    do {
      const url = this.gateways[counter].replace('{CID}', cidImage);
      let res: AxiosResponse | null = null;

      try {
        res = await IPFS.instance.get(url, {
          responseType: 'arraybuffer',
        });
      } catch {
        counter += 1;
        continue;
      }

      if (res && res.status === 200) {
        const { data, headers } = res;
        const base64 = Buffer.from(data, 'binary').toString('base64');
        const src = `data:${headers['content-type']};base64,${base64}`;

        return src;
      }
    } while (counter < this.gateways.length);

    throw new Error('Fetch image failed');
  }
}
