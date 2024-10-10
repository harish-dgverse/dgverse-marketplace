/* eslint-disable no-unused-vars */

declare const APP_NAME: string;
declare const HEDERA_NETWORK: 'testnet' | 'mainnet';
declare const HEDERA_MIRROR_NODE_API_VERSION: string;
declare const MIRROR_NODE: string;
declare const DGVERSE_PROVIDER_ACCOUNT: string;
declare const BACKEND_BASE_URL: string;
declare const IPFS_URL: string;
declare const API_HOST: string;
declare const HASHPACK_APP_CONFIG_NAME: string;
declare const HASHPACK_APP_CONFIG_DESCRIPTION: string;
declare const HASHPACK_APP_CONFIG_ICON_URL: string;
declare const IPFS_GATEWAYS: string[] | undefined;

// eslint-disable-next-line no-underscore-dangle
const _APP_NAME = APP_NAME;
// eslint-disable-next-line no-underscore-dangle
const _HEDERA_NETWORK = HEDERA_NETWORK;
// eslint-disable-next-line no-underscore-dangle
const _BACKEND_BASE_URL = BACKEND_BASE_URL;
// eslint-disable-next-line no-underscore-dangle
const _MIRROR_NODE = MIRROR_NODE;
// eslint-disable-next-line no-underscore-dangle
const _DGVERSE_PROVIDER_ACCOUNT = DGVERSE_PROVIDER_ACCOUNT;
// eslint-disable-next-line no-underscore-dangle
const _HEDERA_MIRROR_NODE_API_VERSION = HEDERA_MIRROR_NODE_API_VERSION;
// eslint-disable-next-line no-underscore-dangle
const _IPFS_URL = IPFS_URL;
// eslint-disable-next-line no-underscore-dangle
const _API_HOST = API_HOST;
// eslint-disable-next-line no-underscore-dangle
const _HASHPACK_APP_CONFIG_NAME = HASHPACK_APP_CONFIG_NAME;
// eslint-disable-next-line no-underscore-dangle
const _HASHPACK_APP_CONFIG_DESCRIPTION = HASHPACK_APP_CONFIG_DESCRIPTION;
// eslint-disable-next-line no-underscore-dangle
const _HASHPACK_APP_CONFIG_ICON_URL = HASHPACK_APP_CONFIG_ICON_URL;
// eslint-disable-next-line no-underscore-dangle
const _IPFS_GATEWAYS = IPFS_GATEWAYS;

export {
  _APP_NAME as APP_NAME,
  _HEDERA_NETWORK as HEDERA_NETWORK,
  _BACKEND_BASE_URL as BACKEND_BASE_URL,
  _MIRROR_NODE as MIRROR_NODE,
  _DGVERSE_PROVIDER_ACCOUNT as DGVERSE_PROVIDER_ACCOUNT,
  _HEDERA_MIRROR_NODE_API_VERSION as HEDERA_MIRROR_NODE_API_VERSION,
  _IPFS_URL as IPFS_URL,
  _API_HOST as API_HOST,
  _HASHPACK_APP_CONFIG_NAME as HASHPACK_APP_CONFIG_NAME,
  _HASHPACK_APP_CONFIG_DESCRIPTION as HASHPACK_APP_CONFIG_DESCRIPTION,
  _HASHPACK_APP_CONFIG_ICON_URL as HASHPACK_APP_CONFIG_ICON_URL,
  _IPFS_GATEWAYS as IPFS_GATEWAYS,
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IPFS_KEYS: string[];
      IPFS_URL: string;
      HEDERA_NETWORK: string;
      BACKEND_BASE_URL: string;
      MIRROR_NODE: string;
      DGVERSE_PROVIDER_ACCOUNT: string;
      HEDERA_MIRROR_NODE_API_VERSION: string;
      APP_NAME: string;
    }
  }
}
