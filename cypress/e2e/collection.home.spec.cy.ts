const backendUrl = 'http://localhost:3000/v1';
const tokenId = '0.0.15397475';

describe('Collection home: NFT', () => {
  // Not logged
  it('Collection Child: home', () => {
    cy.intercept('GET', `${backendUrl}/token/${tokenId}?*`, {
      fixture: 'filterPage/collection/nft/collection.home.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/nft/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('[data-cy="trending-card"]').should('have.length.be', 2);
  });

  // Logged in own view
  it('Collection Child: same user as collection creator logged in', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 7,
          user_name: 'BCCI',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '7.jpeg',
            display_pic: '7.jpeg',
            icon: '7.jpeg',
            thumbnail: '7.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${tokenId}?*`, {
      fixture: 'filterPage/collection/nft/collection.self.view.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/nft/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('[data-cy="favorite-button"]').should('not.exist');
    cy.get('[data-cy="follow-button"]').should('not.exist');
  });

  it('Collection Child: diiferent user as collection creator logged in', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 20,
          user_name: 'Mohanlal Viswanathan nair',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '20.jpeg',
            display_pic: '20.jpeg',
            icon: '20.jpeg',
            thumbnail: '20.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${tokenId}?*`, {
      fixture: 'filterPage/collection/nft/collection.different.view.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/nft/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('[data-cy="favorite-button"]').should('exist');
    cy.get('[data-cy="follow-button"]').should('exist');
  });

  it('Collection Child: NFTs: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      statusCode: 400,
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('Collection Child: NFTs: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      statusCode: 500,
    }).as('trending');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });
});

describe('Collection home: SBT', () => {
  const sbtTokenId = '0.0.11111';
  // Not logged
  it('Collection Child: home', () => {
    cy.intercept('GET', `${backendUrl}/token/${sbtTokenId}?*`, {
      fixture: 'filterPage/collection/sbt/collection.home.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/sbt/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${sbtTokenId}/home`);
    cy.get('[data-cy="trending-card"]').should('have.length.be', 2);
  });

  // Logged in own view
  it('Collection Child: same user as collection creator logged in', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 7,
          user_name: 'BCCI',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '7.jpeg',
            display_pic: '7.jpeg',
            icon: '7.jpeg',
            thumbnail: '7.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${sbtTokenId}?*`, {
      fixture: 'filterPage/collection/sbt/collection.self.view.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/sbt/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${sbtTokenId}/home`);
    cy.get('[data-cy="favorite-button"]').should('not.exist');
    cy.get('[data-cy="follow-button"]').should('not.exist');
  });

  it('Collection Child: diiferent user as collection creator logged in', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 20,
          user_name: 'Mohanlal Viswanathan nair',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '20.jpeg',
            display_pic: '20.jpeg',
            icon: '20.jpeg',
            thumbnail: '20.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${sbtTokenId}?*`, {
      fixture: 'filterPage/collection/sbt/collection.self.view.json',
    }).as('home-items');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/collection/sbt/collection.child.valid.json',
    }).as('home-child-nfts');
    cy.visit(`http://localhost:4000/collection/${sbtTokenId}/home`);
    cy.get('[data-cy="favorite-button"]').should('exist');
    cy.get('[data-cy="follow-button"]').should('exist');
  });
});

describe('Collection home: FT', () => {
  const ftId = '0.0.4529984';
  // Not logged
  it('Collection Child: home', () => {
    cy.intercept('GET', `${backendUrl}/token/${ftId}?*`, {
      fixture: 'filterPage/collection/ft/collection.home.json',
    }).as('home-items');
    cy.visit(`http://localhost:4000/collection/${ftId}/home`);
    cy.get('[data-cy="favorite-button"]').should('not.exist');
    cy.get('[data-cy="follow-button"]').should('not.exist');
    cy.get('[data-cy="buy-ft-button"]').should('not.exist');
    cy.get('[data-cy="ft-holders-list"]').should('have.length', 1);
  });

  it('Collection Child: same user as collection creator logged in - have token to sell', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 57,
          user_name: 'BCCI',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '57.jpeg',
            display_pic: '57.jpeg',
            icon: '57.jpeg',
            thumbnail: '57.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${ftId}?*`, {
      fixture: 'filterPage/collection/ft/collection.home.for-sale.json',
    }).as('home-items');
    cy.visit(`http://localhost:4000/collection/${ftId}/home`);
    cy.get('[data-cy="favorite-button"]').should('not.exist');
    cy.get('[data-cy="follow-button"]').should('not.exist');
    cy.get('[data-cy="send-ft-to-marketplace"]').should('exist');
    cy.get('[data-cy="withdraw-ft"]').should('not.exist');
  });

  it('Collection Child: same user as collection creator logged in - have token to withdraw', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 57,
          user_name: 'BCCI',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '57.jpeg',
            display_pic: '57.jpeg',
            icon: '57.jpeg',
            thumbnail: '57.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${ftId}?*`, {
      fixture: 'filterPage/collection/ft/collection.home.withdraw.json',
    }).as('home-items');
    cy.visit(`http://localhost:4000/collection/${ftId}/home`);
    cy.get('[data-cy="favorite-button"]').should('not.exist');
    cy.get('[data-cy="follow-button"]').should('not.exist');
    cy.get('[data-cy="send-ft-to-marketplace"]').should('not.exist');
    cy.get('[data-cy="withdraw-ft"]').should('exist');
  });

  it('Collection Child: diiferent user as collection creator logged in', () => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 20,
          user_name: 'Mohanlal Viswanathan nair',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: '20.jpeg',
            display_pic: '20.jpeg',
            icon: '20.jpeg',
            thumbnail: '20.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 7,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('GET', `${backendUrl}/token/${ftId}?*`, {
      fixture: 'filterPage/collection/ft/collection.different.view.json',
    }).as('home-items');
    cy.visit(`http://localhost:4000/collection/${ftId}/home`);
    cy.get('[data-cy="favorite-button"]').should('exist');
    cy.get('[data-cy="follow-button"]').should('exist');
    cy.get('[data-cy="buy-ft-button"]').should('exist');
  });
});

describe('User Profile: Stub | User stats API', () => {
  it('User stats: OK case', () => {
    cy.intercept('GET', `${backendUrl}/token/${tokenId}?*`).as('home-items');
    cy.intercept('GET', `${backendUrl}/token/${tokenId}/stats`).as('token-stats');
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.wait('@home-items', { timeout: '15000ms' });
    cy.wait('@token-stats', { timeout: '15000ms' });
    cy.get('.statistics-tile').should('have.length', 2);
  });

  it('User stats: returing empty response', () => {
    cy.intercept('GET', `${backendUrl}/token/${tokenId}/stats`, {
      statusCode: 200,
      body: [],
    });
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('.statistics-tile').should('not.exist');
  });

  it('User stats: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/token/${tokenId}/stats`, {
      statusCode: 400,
    });
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('.statistics-tile').should('not.exist');
  });

  it('User stats: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/token/${tokenId}/stats`, {
      statusCode: 500,
    });
    cy.visit(`http://localhost:4000/collection/${tokenId}/home`);
    cy.get('.statistics-tile').should('not.exist');
  });
});

describe('Collection home: Manage tokens', () => {
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
    cy.intercept('POST', `${backendUrl}/token/delete`, {
      statusCode: 200,
    }).as('delete');
    cy.intercept('POST', `${backendUrl}/nft/burn`, {
      statusCode: 200,
    }).as('burn');
    cy.intercept('POST', `${backendUrl}/nft/wipe`, {
      statusCode: 200,
    }).as('wipe');
    cy.intercept('PATCH', `${backendUrl}/token/update/pause-status/`, {
      statusCode: 200,
    }).as('pause');
    cy.intercept('GET', `https://testnet.mirrornode.hedera.com/api/v1/accounts/null/nfts?token.id=0.0.15397475&order=asc`, {
      body: {
        nfts: [
          {
            account_id: '0.0.2245283',
            created_timestamp: '1698688667.202612003',
            delegating_spender: null,
            deleted: false,
            metadata:
              'aHR0cDovL2xvY2FsaG9zdDozMDAwL3YxL2p1bm8vZG93bmxvYWRfZG9jdW1lbnQ/ZG9jX2lkPXB1YmxpYy10RjVMNzVXMkVQeVJkNXh2UG5wYmlG',
            modified_timestamp: '1698688667.202612003',
            serial_number: 1,
            spender: null,
            token_id: '0.0.5802310',
          },
        ],
        links: {
          next: null,
        },
      },
      statusCode: 200,
    }).as('testnet-api');
  });

  it('Collection: delete', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/delete-collection?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('.delete-token-button').click();
    cy.wait('@delete').its('request.body').should('deep.equal', {
      tokenId: '0.0.15397475',
    });
  });

  it('Collection: freeze', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/freeze-an-account?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#account-id').type('0.0.15397435');
    cy.get('.freeze-button').click();
    cy.wait(500);
    cy.url().should('include', '/collection/0.0.15397475/home');
  });

  it('Collection: unfreeze', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/unfreeze-an-account?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#account-id').type('0.0.15397435');
    cy.get('.freeze-button').click();
    cy.wait(500);
    cy.url().should('include', '/collection/0.0.15397475/home');
  });

  it('Collection: kyc', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/enable-kyc-on-account?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#account-id').type('0.0.15397435');
    cy.get('.freeze-button').click();
    cy.wait(500);
    cy.url().should('include', '/collection/0.0.15397475/home');
  });

  it('Collection: un kyc', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/disable-kyc-on-account?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#account-id').type('0.0.15397435');
    cy.get('.freeze-button').click();
    cy.wait(500);
    cy.url().should('include', '/collection/0.0.15397475/home');
  });

  it('Collection: token-associate', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/token-associate?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#token-id').type('0.0.15397435');
    cy.get('.token-associate-button').click();
    cy.wait(500);
    cy.url().should('include', '/user/7/profile');
  });

  it('Collection: token-disassociate', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/token-dissociate?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('#token-id').type('0.0.15397435');
    cy.get('.token-associate-button').click();
    cy.wait(500);
    cy.url().should('include', '/user/7/profile');
  });

  it('Collection: Pause', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/pause-collection?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('.pause-button').click();
    cy.wait('@pause').its('request.body').should('deep.equal', {
      tokenId: '0.0.15397475',
      doOperation: true,
    });
  });

  it('Collection: un-Pause', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/unpause-collection?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('.pause-button').click();
    cy.wait('@pause').its('request.body').should('deep.equal', {
      tokenId: '0.0.15397475',
      doOperation: false,
    });
  });

  it('Collection: Burn NFTs', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/burn-tokens?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('.dropdown-heading').click();
    cy.get('[type="checkbox"]').check();
    cy.wait(100);
    cy.get('.dropdown-heading').click();
    cy.wait(100);
    cy.get('.burn-button').click();
    cy.wait('@burn')
      .its('request.body')
      .should('deep.equal', {
        serials: [1],
        tokenType: 'nft',
        userId: 7,
        nftIds: ['0.0.5802310.1'],
        volume: 1,
        tokenId: '0.0.15397475',
        totalSupply: '25',
      });
  });

  it('Collection: Burn FTs', () => {
    cy.visit(`http://localhost:4000/collection/actions/ft/burn-tokens?parentTokenId=${tokenId}&testing-e2e=true`);
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-cy="CounterInput-container"]').find('input').clear().type(10);
    cy.get('[data-cy="CounterInput-container"]').click({ force: true });
    cy.get('.burn-button').click();
    cy.wait('@burn').its('request.body').should('deep.equal', {
      tokenType: 'ft',
      userId: 7,
      volume: 10,
      tokenId: '0.0.15397475',
      totalSupply: '25',
    });
  });

  it('Collection: Wipe NFTs', () => {
    cy.visit(`http://localhost:4000/collection/actions/nft/wipe-tokens?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('[data-cy="wallet-id"]').type('0.0.15397475');
    cy.get('[data-cy="nft-ids-wipe"]').type('0.0.32343.1');
    cy.get('.wipe-button').click();
    cy.wait('@wipe')
      .its('request.body')
      .should('deep.equal', {
        wipeAccountId: '0.0.15397475',
        serials: ['1'],
        volume: 1,
        tokenId: '0.0.15397475',
        nftIds: ['0.0.32343.1'],
        totalSupply: '25',
      });
  });

  it('Collection: Wipe Fts', () => {
    cy.visit(`http://localhost:4000/collection/actions/ft/wipe-tokens?parentTokenId=${tokenId}&testing-e2e=true`);
    cy.get('[data-cy="wallet-id"]').type('0.0.15397475');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-cy="CounterInput-container"]').find('input').clear().type(10);
    cy.get('[data-cy="CounterInput-container"]').click({ force: true });
    cy.get('.wipe-button').click();
    cy.wait('@wipe')
      .its('request.body')
      .should('deep.equal', {
        wipeAccountId: '0.0.15397475',
        serials: [null],
        volume: 10,
        tokenId: '0.0.15397475',
        nftIds: [''],
        totalSupply: '25',
      });
  });
});
