const backendUrl = 'http://localhost:3000/v1';

describe('Create Collection: NFT', () => {
  beforeEach(() => {
    cy.intercept('POST', `http://localhost:3000/v1/token/create`, {
      statusCode: 200,
    }).as('createToken');
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
    window.localStorage.setItem(
      'user',
      '{"user_id":2,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('renders', () => {
    cy.visit('http://localhost:4000/collection/create');
    cy.get('.page-header').should('have.text', 'create collection');
  });

  it('create collection: NFT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Non fungible token (NFT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();
    cy.get('#nft-type').parent().click();
    cy.get('ul > li[data-value="Photography"]').click();
    cy.get('[data-cy="collection-name"]').type('Sample Token');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 2 cp.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="collection-maxsupply"]').type('100');
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    // Royalty
    cy.get('[data-cy="switch royalty status"]').click();
    cy.get('[data-cy="royalty-percent"]').type('5');
    cy.get('[data-cy="switch ability change fee schedule"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Immutable
    cy.get('[data-cy="switch immutable status"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Freeze
    cy.get('[data-cy="switch freeze status"]').click();
    cy.get('[data-cy="switch default freeze"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Kyc, pause, wipe
    cy.get('[data-cy="switch kyc status"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="switch pause status"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="switch wipe status"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Adding 2 SM links
    cy.get('#social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="twitter"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(0).type('https://twitter.com/IPL'); // Adding value in input
    cy.get('[data-cy="add-social-data-next-column"]').eq(0).click(); // Adding next row
    cy.get(':nth-child(2) > [data-cy="input-dynamic-key-pair-key-select"] > #social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="insta"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(1).type('https://www.instagram.com/lailamovieofficial/?hl=en'); // Adding value in input
    cy.get('[data-cy="tags-create"]').type('#tag #tag2');
    cy.get('[data-cy="input-dynamic-key-pair-key"]').type('Extra key');
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(2).type('Extra data');

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      const rx = result.request.body;
      expect(result.request.body.images).to.have.all.keys('icon', 'displayPic', 'thumbnail', 'coverPic');
      expect(rx).to.deep.equal({
        name: 'Sample Token',
        royaltyStatus: true,
        royaltyPercent: '5',
        defaultFreezeStatus: true,
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
        maxSupply: '100',
        additionalDetails: [
          {
            attribute: 'Extra key',
            value: 'Extra data',
          },
        ],
        kycKey: true,
        freezeKey: true,
        wipeKey: true,
        customFeeKey: true,
        pauseKey: true,
        immutable: true,
        tokenType: 'Non fungible token (NFT)',
        tokenCategory: 'Photography',
        sendToMarketplace: false,
        decimal: 0,
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
          coverPic: '0.0.333123.jpeg',
        },
      });
    });
  });

  it('create collection: essential details NFT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Non fungible token (NFT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();
    cy.get('#nft-type').parent().click();
    cy.get('ul > li[data-value="Photography"]').click();
    cy.get('[data-cy="collection-name"]').type('Sample Token');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    // Royalty
    cy.get('[data-cy="next-button"]').click();

    // Immutable
    cy.get('[data-cy="next-button"]').click();

    // Freeze
    cy.get('[data-cy="next-button"]').click();

    // Kyc, pause, wipe
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      const rx = result.request.body;
      expect(result.request.body.images).to.have.all.keys('icon', 'displayPic', 'thumbnail');
      expect(rx).to.deep.equal({
        name: 'Sample Token',
        royaltyStatus: false,
        defaultFreezeStatus: false,
        description: 'Description',
        kycKey: false,
        freezeKey: false,
        wipeKey: false,
        customFeeKey: false,
        pauseKey: false,
        immutable: false,
        tokenType: 'Non fungible token (NFT)',
        tokenCategory: 'Photography',
        sendToMarketplace: false,
        decimal: 0,
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
        },
      });
    });
  });
});

describe('Create Collection: SBT', () => {
  beforeEach(() => {
    cy.intercept('POST', `http://localhost:3000/v1/token/create`, {
      statusCode: 200,
    }).as('createToken');
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
    window.localStorage.setItem(
      'user',
      '{"user_id":2,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('create collection: NFT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Soul bound token (SBT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="collection-name"]').type('Sample SBT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 2 cp.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="collection-maxsupply"]').type('100');
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    // Adding 2 SM links
    cy.get('#social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="twitter"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(0).type('https://twitter.com/IPL'); // Adding value in input
    cy.get('[data-cy="add-social-data-next-column"]').eq(0).click(); // Adding next row
    cy.get(':nth-child(2) > [data-cy="input-dynamic-key-pair-key-select"] > #social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="insta"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(1).type('https://www.instagram.com/lailamovieofficial/?hl=en'); // Adding value in input
    cy.get('[data-cy="tags-create"]').type('#tag #tag2');
    cy.get('[data-cy="input-dynamic-key-pair-key"]').type('Extra key');
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(2).type('Extra data');

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      const rx = result.request.body;
      expect(rx).to.deep.equal({
        name: 'Sample SBT',
        royaltyStatus: false,
        defaultFreezeStatus: false,
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
        maxSupply: '100',
        additionalDetails: [
          {
            attribute: 'Extra key',
            value: 'Extra data',
          },
        ],
        kycKey: false,
        freezeKey: false,
        wipeKey: false,
        customFeeKey: false,
        pauseKey: false,
        immutable: false,
        tokenType: 'Soul bound token (SBT)',
        sendToMarketplace: false,
        decimal: 0,
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
          coverPic: '0.0.333123.jpeg',
        },
      });
    });
  });

  it('create collection: essential details NFT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Soul bound token (SBT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="collection-name"]').type('Sample SBT');
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      const rx = result.request.body;
      expect(rx).to.deep.equal({
        name: 'Sample SBT',
        royaltyStatus: false,
        defaultFreezeStatus: false,
        description: 'Description',
        kycKey: false,
        freezeKey: false,
        wipeKey: false,
        customFeeKey: false,
        pauseKey: false,
        immutable: false,
        tokenType: 'Soul bound token (SBT)',
        sendToMarketplace: false,
        decimal: 0,
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
        },
      });
    });
  });
});

describe('Create Collection: FT', () => {
  beforeEach(() => {
    cy.intercept('POST', `http://localhost:3000/v1/token/create`, {
      statusCode: 200,
    }).as('createToken');
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
    window.localStorage.setItem(
      'user',
      '{"user_id":2,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('create collection: FT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Fungible token (FT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="collection-name"]').type('Sample FT');
    cy.get('[data-cy="collection-symbol"]').type('FT');
    cy.get('#nft-type').parent().click();
    cy.get('ul > li[data-value="Others"]').click();
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 2 cp.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="collection-maxsupply"]').type('100');
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    // Royalty
    cy.get('[data-cy="switch royalty status"]').click();
    cy.get('[data-cy="royalty-percent"]').type('5');
    cy.get('[data-cy="switch ability change fee schedule"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Immutable
    cy.get('[data-cy="switch immutable status"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Freeze
    cy.get('[data-cy="switch freeze status"]').click();
    cy.get('[data-cy="switch default freeze"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Kyc, pause, wipe
    cy.get('[data-cy="switch kyc status"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="switch pause status"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="switch wipe status"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Adding 2 SM links
    cy.get('#social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="twitter"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(0).type('https://twitter.com/IPL'); // Adding value in input
    cy.get('[data-cy="add-social-data-next-column"]').eq(0).click(); // Adding next row
    cy.get(':nth-child(2) > [data-cy="input-dynamic-key-pair-key-select"] > #social-media-add-dropdown').parent().click(); // Clicking dropdown
    cy.get('ul > li[data-value="insta"]').click(); // Selecting value
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(1).type('https://www.instagram.com/lailamovieofficial/?hl=en'); // Adding value in input
    cy.get('[data-cy="tags-create"]').type('#tag #tag2');
    cy.get('[data-cy="input-dynamic-key-pair-key"]').type('Extra key');
    cy.get('[data-cy="input-dynamic-key-pair-value"]').eq(2).type('Extra data');
    cy.get('[data-cy="next-button"]').click();

    // Extra sale details
    cy.get('[data-cy="collection-initialSupply"]').type('10');
    cy.get('[data-cy="collection-decimal"]').type('1');
    cy.get('[data-cy="collection-salePrice"]').type('5');

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      console.log(JSON.stringify(result.request.body));
      const rx = result.request.body;
      expect(result.request.body.images).to.have.all.keys('icon', 'displayPic', 'thumbnail', 'coverPic');
      expect(rx).to.deep.equal({
        name: 'Sample FT',
        royaltyStatus: true,
        royaltyPercent: '5',
        defaultFreezeStatus: true,
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
        maxSupply: '100',
        initialSupply: '10',
        additionalDetails: [
          {
            attribute: 'Extra key',
            value: 'Extra data',
          },
        ],
        kycKey: true,
        freezeKey: true,
        wipeKey: true,
        customFeeKey: true,
        pauseKey: true,
        immutable: true,
        tokenType: 'Fungible token (FT)',
        symbol: 'FT',
        tokenCategory: 'Others',
        salePrice: '5',
        sendToMarketplace: false,
        decimal: '01',
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
          coverPic: '0.0.333123.jpeg',
        },
      });
    });
  });

  it('create collection: essential details NFT', () => {
    cy.visit('http://localhost:4000/collection/create?testing-e2e=true');
    cy.get('[data-cy="Fungible token (FT)"]').click({ force: true });
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="collection-name"]').type('Sample FT');
    cy.get('[data-cy="collection-symbol"]').type('FT');
    cy.get('#nft-type').parent().click();
    cy.get('ul > li[data-value="Others"]').click();
    cy.get('input[type=file]').eq(0).selectFile('./cypress/e2e/token 1.png', { force: true });
    cy.wait(500);
    cy.get('.button-wrapper > :nth-child(2)').click();
    cy.wait(500);
    cy.get('[data-cy="description-create"]').type('Description');
    cy.get('[data-cy="next-button"]').click();

    // Royalty
    cy.get('[data-cy="next-button"]').click();

    // Immutable
    cy.get('[data-cy="next-button"]').click();

    // Freeze
    cy.get('[data-cy="next-button"]').click();

    // Kyc, pause, wipe
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="next-button"]').click();

    // Extra sale details
    cy.get('[data-cy="collection-initialSupply"]').type('10');
    cy.get('[data-cy="collection-salePrice"]').type('5');

    cy.get('.create-button').click();
    cy.wait('@createToken').then((result) => {
      const rx = result.request.body;
      expect(rx).to.deep.equal({
        name: 'Sample FT',
        royaltyStatus: false,
        defaultFreezeStatus: false,
        description: 'Description',
        initialSupply: '10',
        kycKey: false,
        freezeKey: false,
        wipeKey: false,
        customFeeKey: false,
        pauseKey: false,
        immutable: false,
        tokenType: 'Fungible token (FT)',
        symbol: 'FT',
        tokenCategory: 'Others',
        salePrice: '5',
        sendToMarketplace: false,
        decimal: 0,
        userId: 7,
        tokenId: '0.0.333123',
        images: {
          displayPic: '0.0.333123.jpeg',
          icon: '0.0.333123.jpeg',
          thumbnail: '0.0.333123.jpeg',
        },
      });
    });
  });
});
