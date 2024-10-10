/* eslint-disable */
const backendUrl = 'http://localhost:3000/v1';

describe('Mint NFTs', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 7,
          user_name: 'BCCI',
          user_role: '1',
          subscriptionType: 'gold',
          verified: 2,
          wallet_address: '0.0.15397434',
          image_icon: '7.jpeg',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VyX25hbWUiOiJCQ0NJIiwidXNlcl9yb2xlIjoiMSIsInN1YnNjcmlwdGlvblR5cGUiOiJnb2xkIiwidmVyaWZpZWQiOjIsIndhbGxldF9hZGRyZXNzIjoiMC4wLjE1Mzk3NDM0IiwiaW1hZ2VfaWNvbiI6IjcuanBlZyIsImlhdCI6MTY5ODQ3ODU0NCwiZXhwIjoxNjk4NDc4NTc0fQ.ISj6-yD4LEI4Gp9ixi9BN_2SQBV-Cz-C72fWgh15t_M',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('PUT', `https://dgvstr01.blob.core.windows.net/dgverse-public-image/*`, {
      statusCode: 201,
    }).as('imageUpload');
    cy.intercept('PUT', `http://localhost:3000/v1/nft`, {
      statusCode: 200,
    }).as('mintToken');
    cy.intercept('PUT', `http://localhost:3000/v1/ipfs/metadata`, {
      body: { metadataCid: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json' },
      statusCode: 200,
    }).as('uploadMetadata');
    cy.intercept('GET', `${backendUrl}/user/7/assets?collectionsOwned=true`, {
      body: {
        collectionsOwned: [
          {
            name: '2011 World Cup Moments',
            total_supply: 3,
            timestamp: '2023-09-17T06:14:52.764Z',
            token_id: '0.0.15397475',
            token_type: 'nft',
            wallet: {
              wallet_address: '0.0.15397434',
              wallet_client: 'hashpack',
            },
            image: {
              display_pic: '0.0.15397475.jpeg',
            },
            user: {
              user_name: 'BCCI',
              subscriptionType: 'gold',
              verified: 2,
              user_id: 7,
              image: {
                icon: '7.jpeg',
              },
            },
            Sale: [],
            saleDetails: [],
            inMarketCount: 0,
          },
        ],
        nftOwned: [],
        nftCreated: [],
        nftCollected: [],
        nftOnSale: [],
        ftOnSale: [],
      },
      statusCode: 200,
    }).as('user-token-list');
    window.localStorage.setItem(
      'user',
      '{"user_id":7,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('renders', () => {
    cy.visit('http://localhost:4000/nft/mint');
    cy.get('.page-header').should('have.text', 'mint nft');
  });

  it('mint nft: all details', () => {
    cy.visit('http://localhost:4000/nft/mint?testing-e2e=true');
    cy.get('#collection-list-user').parent().click();
    cy.get('ul > li[data-value="0.0.15397475"]').click();
    cy.get('[data-cy="nft-mint-nft-name"]').type('Sample NFT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 2 cp.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    // Adding 2 SM links
    cy.get('#social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="twitter"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(0).type('https://twitter.com/IPL'); // Adding value in input
    cy.get('[data-cy="add-social-data-next-column"]').eq(0).click({ force: true }); // Adding next row
    cy.get(':nth-child(2) > [data-cy="input-dynamic-key-pair-key-select"] > #social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="insta"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(1).type('https://www.instagram.com/lailamovieofficial/?hl=en'); // Adding value in input
    cy.get('[data-cy="description-mint"]').type('Description');
    cy.get('[data-cy="tags-mint"]').type('#tag #tag2');
    cy.get('[data-cy="input-dynamic-key-pair-key"]').type('Extra key');
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(2).type('Extra data');
    cy.get('.create-button').click();
    const mintRx = {
      name: 'Sample NFT',
      images: {
        displayPic: '0.0.15397475.1.jpeg',
        icon: '0.0.15397475.1.jpeg',
        thumbnail: '0.0.15397475.1.jpeg',
        coverPic: '0.0.15397475.1.jpeg',
      },
      socialMedia: [
        {
          media: 'twitter',
          url: 'https://twitter.com/IPL',
        },
        {
          media: 'insta',
          url: 'https://www.instagram.com/lailamovieofficial/?hl=en',
        },
      ],
      description: 'Description',
      tags: '#tag #tag2',
      additionalDetails: [
        {
          attribute: 'Extra key',
          value: 'Extra data',
        },
      ],
      tokenId: '0.0.15397475',
      tokenType: 'nft',
      volume: 0,
      userId: 7,
      totalSupply: '10',
      metadata: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json',
      nftId: '0.0.15397475.1',
      serialNumber: '1',
    };
    cy.wait('@mintToken', { timeout: '15000ms' }).then((interception) => {
      expect(interception.request.body).to.deep.equal(mintRx);
    });
  });

  it('mint nft: essential details', () => {
    cy.visit('http://localhost:4000/nft/mint?testing-e2e=true');
    cy.get('#collection-list-user').parent().click();
    cy.get('ul > li[data-value="0.0.15397475"]').should('exist');
    cy.get('ul > li[data-value="0.0.15397475"]').click();
    cy.get('[data-cy="nft-mint-nft-name"]').type('Sample NFT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    // Adding 2 SM links
    cy.get('[data-cy="description-mint"]').type('Description');
    cy.get('.create-button').click();
    const mintRx = {
      name: 'Sample NFT',
      images: {
        displayPic: '0.0.15397475.1.jpeg',
        icon: '0.0.15397475.1.jpeg',
        thumbnail: '0.0.15397475.1.jpeg',
      },
      description: 'Description',
      tokenId: '0.0.15397475',
      tokenType: 'nft',
      volume: 0,
      userId: 7,
      totalSupply: '10',
      metadata: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json',
      nftId: '0.0.15397475.1',
      serialNumber: '1',
    };
    cy.wait('@mintToken', { timeout: '15000ms' }).then((interception) => {
      expect(interception.request.body).to.deep.equal(mintRx);
    });
  });
});

describe('Mint SBTs', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 7,
          user_name: 'BCCI',
          user_role: '1',
          subscriptionType: 'gold',
          verified: 2,
          wallet_address: '0.0.15397434',
          image_icon: '7.jpeg',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VyX25hbWUiOiJCQ0NJIiwidXNlcl9yb2xlIjoiMSIsInN1YnNjcmlwdGlvblR5cGUiOiJnb2xkIiwidmVyaWZpZWQiOjIsIndhbGxldF9hZGRyZXNzIjoiMC4wLjE1Mzk3NDM0IiwiaW1hZ2VfaWNvbiI6IjcuanBlZyIsImlhdCI6MTY5ODQ3ODU0NCwiZXhwIjoxNjk4NDc4NTc0fQ.ISj6-yD4LEI4Gp9ixi9BN_2SQBV-Cz-C72fWgh15t_M',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('PUT', `https://dgvstr01.blob.core.windows.net/dgverse-public-image/*`, {
      statusCode: 201,
    }).as('imageUpload');
    cy.intercept('PUT', `http://localhost:3000/v1/nft`, {
      statusCode: 200,
    }).as('mintToken');
    cy.intercept('PUT', `http://localhost:3000/v1/ipfs/metadata`, {
      body: { metadataCid: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json' },
      statusCode: 200,
    }).as('uploadMetadata');
    cy.intercept('GET', `${backendUrl}/user/7/assets?collectionsOwned=true`, {
      body: {
        collectionsOwned: [
          {
            name: 'SBT',
            total_supply: 3,
            timestamp: '2023-09-17T06:14:52.764Z',
            token_id: '0.0.15397475',
            token_type: 'sbt',
            wallet: {
              wallet_address: '0.0.15397434',
              wallet_client: 'hashpack',
            },
            image: {
              display_pic: '0.0.15397475.jpeg',
            },
            user: {
              user_name: 'BCCI',
              subscriptionType: 'gold',
              verified: 2,
              user_id: 7,
              image: {
                icon: '7.jpeg',
              },
            },
            Sale: [],
            saleDetails: [],
            inMarketCount: 0,
          },
        ],
        nftOwned: [],
        nftCreated: [],
        nftCollected: [],
        nftOnSale: [],
        ftOnSale: [],
      },
      statusCode: 200,
    }).as('user-token-list');
    window.localStorage.setItem(
      'user',
      '{"user_id":7,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('mint nft: all details', () => {
    cy.visit('http://localhost:4000/nft/mint?testing-e2e=true');
    cy.get('#collection-list-user').parent().click();
    cy.get('ul > li[data-value="0.0.15397475"]').click();
    cy.get('[data-cy="nft-mint-nft-name"]').type('Sample SBT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 2 cp.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    // Adding 2 SM links
    cy.get('#social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="twitter"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(0).type('https://twitter.com/IPL'); // Adding value in input
    cy.get('[data-cy="add-social-data-next-column"]').eq(0).click({ force: true }); // Adding next row
    cy.get(':nth-child(2) > [data-cy="input-dynamic-key-pair-key-select"] > #social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="insta"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(1).type('https://www.instagram.com/lailamovieofficial/?hl=en'); // Adding value in input
    cy.get('[data-cy="description-mint"]').type('Description');
    cy.get('[data-cy="tags-mint"]').type('#tag #tag2');
    cy.get('[data-cy="input-dynamic-key-pair-key"]').type('Extra key');
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(2).type('Extra data');
    cy.get('.create-button').click();
    const mintRx = {
      name: 'Sample SBT',
      images: {
        displayPic: '0.0.15397475.1.jpeg',
        icon: '0.0.15397475.1.jpeg',
        thumbnail: '0.0.15397475.1.jpeg',
        coverPic: '0.0.15397475.1.jpeg',
      },
      socialMedia: [
        {
          media: 'twitter',
          url: 'https://twitter.com/IPL',
        },
        {
          media: 'insta',
          url: 'https://www.instagram.com/lailamovieofficial/?hl=en',
        },
      ],
      description: 'Description',
      tags: '#tag #tag2',
      additionalDetails: [
        {
          attribute: 'Extra key',
          value: 'Extra data',
        },
      ],
      tokenId: '0.0.15397475',
      tokenType: 'sbt',
      volume: 0,
      userId: 7,
      totalSupply: '10',
      metadata: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json',
      nftId: '0.0.15397475.1',
      serialNumber: '1',
    };
    cy.wait('@mintToken', { timeout: '15000ms' }).then((interception) => {
      expect(interception.request.body).to.deep.equal(mintRx);
    });
  });

  it('mint nft: essential details', () => {
    cy.visit('http://localhost:4000/nft/mint?testing-e2e=true');
    cy.get('#collection-list-user').parent().click();
    cy.get('ul > li[data-value="0.0.15397475"]').should('exist');
    cy.get('ul > li[data-value="0.0.15397475"]').click();
    cy.get('[data-cy="nft-mint-nft-name"]').type('Sample SBT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    // Adding 2 SM links
    cy.get('[data-cy="description-mint"]').type('Description');
    cy.get('.create-button').click();
    const mintRx = {
      name: 'Sample SBT',
      images: {
        displayPic: '0.0.15397475.1.jpeg',
        icon: '0.0.15397475.1.jpeg',
        thumbnail: '0.0.15397475.1.jpeg',
      },
      description: 'Description',
      tokenId: '0.0.15397475',
      tokenType: 'sbt',
      volume: 0,
      userId: 7,
      totalSupply: '10',
      metadata: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json',
      nftId: '0.0.15397475.1',
      serialNumber: '1',
    };
    cy.wait('@mintToken', { timeout: '15000ms' }).then((interception) => {
      expect(interception.request.body).to.deep.equal(mintRx);
    });
  });
});

describe('Mint FT', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 7,
          user_name: 'BCCI',
          user_role: '1',
          subscriptionType: 'gold',
          verified: 2,
          wallet_address: '0.0.15397434',
          image_icon: '7.jpeg',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VyX25hbWUiOiJCQ0NJIiwidXNlcl9yb2xlIjoiMSIsInN1YnNjcmlwdGlvblR5cGUiOiJnb2xkIiwidmVyaWZpZWQiOjIsIndhbGxldF9hZGRyZXNzIjoiMC4wLjE1Mzk3NDM0IiwiaW1hZ2VfaWNvbiI6IjcuanBlZyIsImlhdCI6MTY5ODQ3ODU0NCwiZXhwIjoxNjk4NDc4NTc0fQ.ISj6-yD4LEI4Gp9ixi9BN_2SQBV-Cz-C72fWgh15t_M',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('PUT', `https://dgvstr01.blob.core.windows.net/dgverse-public-image/*`, {
      statusCode: 201,
    }).as('imageUpload');
    cy.intercept('PUT', `http://localhost:3000/v1/nft`, {
      statusCode: 200,
    }).as('mintToken');
    cy.intercept('PUT', `http://localhost:3000/v1/ipfs/metadata`, {
      body: { metadataCid: 'ipfs://bafyreih632pmjql65h5d3arfjwszhmcnpe6chbrlh53ffoumkxqu7hn6ii/metadata.json' },
      statusCode: 200,
    }).as('uploadMetadata');
    cy.intercept('GET', `${backendUrl}/user/7/assets?collectionsOwned=true`, {
      body: {
        collectionsOwned: [
          {
            name: 'FT',
            total_supply: 3,
            timestamp: '2023-09-17T06:14:52.764Z',
            token_id: '0.0.15397475',
            token_type: 'ft',
            wallet: {
              wallet_address: '0.0.15397434',
              wallet_client: 'hashpack',
            },
            image: {
              display_pic: '0.0.15397475.jpeg',
            },
            user: {
              user_name: 'BCCI',
              subscriptionType: 'gold',
              verified: 2,
              user_id: 7,
              image: {
                icon: '7.jpeg',
              },
            },
            Sale: [],
            saleDetails: [],
            inMarketCount: 0,
          },
        ],
        nftOwned: [],
        nftCreated: [],
        nftCollected: [],
        nftOnSale: [],
        ftOnSale: [],
      },
      statusCode: 200,
    }).as('user-token-list');
    window.localStorage.setItem(
      'user',
      '{"user_id":7,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('mint nft: all details', () => {
    cy.visit('http://localhost:4000/nft/mint?testing-e2e=true');
    cy.get('#collection-list-user').parent().click();
    cy.get('ul > li[data-value="0.0.15397475"]').click();
    cy.get('[data-cy="CounterInput-container"]').find('input').clear().type(10);
    // Below statement to update state
    cy.get('[data-cy="CounterInput-container"]').click({ force: true });
    cy.get('.create-button').click();
    const mintRx = {
      tokenId: '0.0.15397475',
      tokenType: 'ft',
      volume: 10,
      userId: 7,
      totalSupply: '10',
    };
    cy.wait('@mintToken', { timeout: '15000ms' }).then((interception) => {
      expect(interception.request.body).to.deep.equal(mintRx);
    });
  });
});
