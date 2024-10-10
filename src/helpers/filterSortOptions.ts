export const nftFilterInitialState = {
  category: {
    photography: false,
    digi_art: false,
  },
  saletype: {
    on_sale: false,
    not_on_sale: false,
  },
  tokenType: {
    nft: false,
    sbt: false,
  },
};

export const sortNFTOptions = [
  {
    label: 'Trending',
    value: 'trending',
    key: 'key01',
  },
  {
    label: 'Newest first',
    value: 'newest first',
    key: 'key02',
  },
  {
    label: 'Ending soon',
    value: 'ending soon',
    key: 'key03',
  },
  {
    label: 'Quoted Price: Low to High',
    value: 'price lth',
    key: 'key04',
  },
  {
    label: 'Quoted Price: High to Low',
    value: 'price htl',
    key: 'key05',
  },
];

export const filterNFTOptions = [
  {
    sectionHeader: {
      label: 'Collection Type',
      value: 'tokenType',
      key: 'key-sectionHeader-03',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'Non fungible tokens (NFTs)',
        value: 'nft',
        key: 'key-sectionHeader-03-option-01',
      },
      {
        label: 'Soul bound tokens (SBT)',
        value: 'sbt',
        key: 'key-sectionHeader-03-option-02',
      },
    ],
  },
  {
    sectionHeader: {
      label: 'Category',
      value: 'category',
      key: 'key-sectionHeader-01',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'Photography',
        value: 'photography',
        key: 'key-sectionHeader-01-option-01',
      },
      {
        label: 'Digital Art',
        value: 'digi_art',
        key: 'key-sectionHeader-01-option-02',
      },
    ],
  },
  {
    sectionHeader: {
      label: 'Sale type',
      value: 'saletype',
      key: 'key-sectionHeader-02',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'On Sale',
        value: 'on_sale',
        key: 'key-sectionHeader-02-option-01',
      },
      {
        label: 'Not on Sale',
        value: 'not_on_sale',
        key: 'key-sectionHeader-02-option-02',
      },
    ],
  },
];

export const filterChildNFTOptions = [
  {
    sectionHeader: {
      label: 'Category',
      value: 'category',
      key: 'key-sectionHeader-01',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'Photography',
        value: 'photography',
        key: 'key-sectionHeader-01-option-01',
      },
      {
        label: 'Digital Art',
        value: 'digi_art',
        key: 'key-sectionHeader-01-option-02',
      },
    ],
  },
  {
    sectionHeader: {
      label: 'Sale type',
      value: 'saletype',
      key: 'key-sectionHeader-02',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'On Sale',
        value: 'on_sale',
        key: 'key-sectionHeader-02-option-01',
      },
      {
        label: 'Not on Sale',
        value: 'not_on_sale',
        key: 'key-sectionHeader-02-option-02',
      },
    ],
  },
];

/* Collection Settings */
export const collectionFilterInitialState = {
  category: {
    photography: false,
    digi_art: false,
  },
  tokenType: {
    nftc: false,
    ft: false,
    sbt: false,
  },
  saletype: {
    on_sale: false,
    not_on_sale: false,
  },
};

export const sortCollectionOptions = [
  {
    label: 'Trending',
    value: 'trending',
    key: 'key01',
  },
  {
    label: 'Newest first',
    value: 'newest first',
    key: 'key02',
  },
  {
    label: 'Tokens minted: Low to High',
    value: 'nft minted lth',
    key: 'key03',
  },
  {
    label: 'Tokens minted: High to Low',
    value: 'nft minted htl',
    key: 'key04',
  },
  {
    label: 'Tokens in market: Low to High',
    value: 'token onsale lth',
    key: 'key05',
  },
  {
    label: 'Tokens in market: High to Low',
    value: 'token onsale htl',
    key: 'key06',
  },
];

export const filterCollectionOptions = [
  {
    sectionHeader: {
      label: 'Collection Type',
      value: 'tokenType',
      key: 'key-sectionHeader-01',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'Non fungible collections (NFT)',
        value: 'nftc',
        key: 'key-sectionHeader-01-option-01',
      },
      {
        label: 'Fungible Collection (FT)',
        value: 'ft',
        key: 'key-sectionHeader-01-option-02',
      },
      {
        label: 'Soul bound tokens (SBT)',
        value: 'sbt',
        key: 'key-sectionHeader-01-option-03',
      },
    ],
  },
  {
    sectionHeader: {
      label: 'Tokens on sale',
      value: 'saletype',
      key: 'key-sectionHeader-coll-filter-03',
    },
    type: 'multi_option_checkbox',
    options: [
      {
        label: 'On Sale',
        value: 'on_sale',
        key: 'key-sectionHeader-03-option-01',
      },
      {
        label: 'Not on Sale',
        value: 'not_on_sale',
        key: 'key-sectionHeader-03-option-02',
      },
    ],
  },
  // {
  //   sectionHeader: {
  //     label: 'Category',
  //     value: 'category',
  //     key: 'key-sectionHeader-02',
  //   },
  //   type: 'multi_option_checkbox',
  //   options: [
  //     {
  //       label: 'Photography',
  //       value: 'photography',
  //       key: 'key-sectionHeader-02-option-01',
  //     },
  //     {
  //       label: 'Digital Art',
  //       value: 'digi_art',
  //       key: 'key-sectionHeader-02-option-02',
  //     },
  //   ],
  // },
];

export const paginationLimit = 6;
