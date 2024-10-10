const backendUrl = 'http://localhost:3000/v1';
const baseUrl = 'http://localhost:4000';
const nftId = '0.0.15397475.1';
const ftId = '0.0.33333';
const sbtId = '0.0.2050787.2';

describe('Free transfer', () => {
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
    cy.intercept('PATCH', `${backendUrl}/nft/transfer`, {
      statusCode: 200,
    }).as('freeTransfer');
    cy.intercept('GET', `${backendUrl}/analytics/search?*`, {
      body: [
        {
          wallet_address: '0.0.15397435',
          user: {
            user_id: 20,
            user_name: 'Mohanlal Viswanathan nair',
            subscriptionType: 'basic',
            verified: 0,
            image: {
              icon: '20.jpeg',
              cover_pic: '20.jpeg',
              display_pic: '20.jpeg',
              thumbnail: '20.jpeg',
            },
          },
          type: 'Account',
          user_id: 20,
          key: '0.0.15397435',
          hash: '/user/20/profile',
        },
      ],
      statusCode: 200,
    }).as('search-for-user');
    cy.intercept('GET', `https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.15397435`, {
      body: {
        account: '0.0.15397435',
        alias: 'CIQHJTY4XAWIKZY5VFU5J77GXZF27EVEY6ZW23OUBAXIVXDLN2STGCI',
        auto_renew_period: 7776000,
        balance: {
          balance: 981278949814,
          timestamp: '1698669114.682382003',
          tokens: [
            {
              token_id: '0.0.5755597',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797188',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797321',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797337',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797342',
              balance: 100000000000000,
            },
          ],
        },
        created_timestamp: '1698215160.384483484',
        decline_reward: false,
        deleted: false,
        ethereum_nonce: 0,
        evm_address: '0x000000000000000000000000000000000057cf12',
        expiry_timestamp: '1705991160.384483484',
        key: {
          _type: 'ED25519',
          key: '74cf1cb82c85671da969d4ffe6be4baf92a4c7b36d6dd4082e8adc6b6ea53309',
        },
        max_automatic_token_associations: 0,
        memo: 'auto-created account',
        pending_reward: 0,
        receiver_sig_required: false,
        staked_account_id: null,
        staked_node_id: null,
        stake_period_start: null,
        transactions: [],
        links: {
          next: '/api/v1/accounts/0.0.5754642?timestamp=lt:1698667038.241974687',
        },
      },
      statusCode: 200,
    }).as('testnet-api');
  });

  it('renders', () => {
    cy.visit(`${baseUrl}/nft/${nftId}/transfer?testing-e2e=true`);
    cy.get('.page-header').should('have.text', 'free transfer');
  });

  it('free transfer: nft', () => {
    cy.visit(`${baseUrl}/nft/${nftId}/transfer?testing-e2e=true`);
    cy.get('[data-cy="receiver-wallet-address"]').type('0.0.15397435');
    cy.get('.create-button').click();
    cy.wait('@freeTransfer').its('request.body').should('deep.equal', {
      buyerWalletId: '0.0.15397435',
      tokenId: '0.0.15397475',
      identifier: '0.0.15397475.1',
      sellerId: 7,
      tokenType: 'nft',
      volume: 0,
    });
  });

  it('free transfer: ft', () => {
    cy.visit(`${baseUrl}/ft/${ftId}/transfer?testing-e2e=true`);
    cy.get('[data-cy="receiver-wallet-address"]').type('0.0.15397435');

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-cy="CounterInput-container"]').find('input').clear().type(10);
    cy.get('[data-cy="CounterInput-container"]').click({ force: true });

    cy.get('.create-button').click();
    cy.wait('@freeTransfer').its('request.body').should('deep.equal', {
      buyerWalletId: '0.0.15397435',
      tokenId: '0.0.33333',
      identifier: '0.0.33333',
      sellerId: 7,
      tokenType: 'ft',
      volume: 10,
    });
  });
});

describe('Send to marketplace', () => {
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
    cy.intercept('POST', `${backendUrl}/sale`, {
      statusCode: 200,
    }).as('sendToMarketplace');
    window.localStorage.setItem(
      'user',
      '{"user_id":2,"user_name":"sample","user_role":"1","created_at":"2022-12-24T12:13:39.607Z","Wallet":[{"wallet_address":"0.0.47694622"}],"image":{"image_id":2,"cover_pic":"token cp 1.png","display_pic":"user 2.png","icon":"user 2.png","thumbnail":"user 2.png","added_at":"2022-12-24T12:13:39.607Z","token_id":null,"user_id":2,"nft_id":null}}'
    );
  });

  it('renders', () => {
    cy.visit(`${baseUrl}/nft/0.0.15397475.1/transfer/send-to-marketplace?testing-e2e=true`);
    cy.get('.page-header').should('have.text', 'send to marketplace');
  });

  it('send to marketplace: nft', () => {
    cy.visit(`${baseUrl}/nft/0.0.15397475.1/transfer/send-to-marketplace?testing-e2e=true`);
    cy.get('#stm-base-amount').type('100');

    cy.get('.create-button').click();
    cy.wait('@sendToMarketplace').then((result) => {
      const responseWithoutTokenId = result.request.body;
      expect(responseWithoutTokenId).to.deep.equal({
        identifier: '0.0.15397475.1',
        tokenType: 'nft',
        sellerId: 7,
        quotedPrice: '100',
        volume: 0,
      });
    });
  });

  it('send to marketplace: ft', () => {
    cy.intercept('GET', `${backendUrl}/token/${ftId}`, {
      fixture: 'transfer/ft-kok.json',
    }).as('home-trend-filtered');
    cy.visit(`${baseUrl}/ft/${ftId}/transfer/send-to-marketplace?testing-e2e=true`);
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[data-cy="CounterInput-container"]').find('input').clear().type(10);
    cy.get('[data-cy="CounterInput-container"]').click({ force: true });

    cy.get('.create-button').click();
    cy.wait('@sendToMarketplace').then((result) => {
      const responseWithoutTokenId = result.request.body;
      expect(responseWithoutTokenId).to.deep.equal({
        identifier: '0.0.33333',
        tokenType: 'ft',
        quotedPrice: 10,
        sellerId: 7,
        volume: 10,
      });
    });
  });
});

describe('SBT transfer', () => {
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
    cy.intercept('PATCH', `${backendUrl}/nft/transfer`, {
      statusCode: 200,
    }).as('freeTransfer');
    cy.intercept('GET', `${backendUrl}/analytics/search?*`, {
      body: [
        {
          wallet_address: '0.0.15397435',
          user: {
            user_id: 20,
            user_name: 'Mohanlal Viswanathan nair',
            subscriptionType: 'basic',
            verified: 0,
            image: {
              icon: '20.jpeg',
              cover_pic: '20.jpeg',
              display_pic: '20.jpeg',
              thumbnail: '20.jpeg',
            },
          },
          type: 'Account',
          user_id: 20,
          key: '0.0.15397435',
          hash: '/user/20/profile',
        },
      ],
      statusCode: 200,
    }).as('search-for-user');
    cy.intercept('GET', `https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.15397435`, {
      body: {
        account: '0.0.15397435',
        alias: 'CIQHJTY4XAWIKZY5VFU5J77GXZF27EVEY6ZW23OUBAXIVXDLN2STGCI',
        auto_renew_period: 7776000,
        balance: {
          balance: 981278949814,
          timestamp: '1698669114.682382003',
          tokens: [
            {
              token_id: '0.0.5755597',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797188',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797321',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797337',
              balance: 100000000000000,
            },
            {
              token_id: '0.0.5797342',
              balance: 100000000000000,
            },
          ],
        },
        created_timestamp: '1698215160.384483484',
        decline_reward: false,
        deleted: false,
        ethereum_nonce: 0,
        evm_address: '0x000000000000000000000000000000000057cf12',
        expiry_timestamp: '1705991160.384483484',
        key: {
          _type: 'ED25519',
          key: '74cf1cb82c85671da969d4ffe6be4baf92a4c7b36d6dd4082e8adc6b6ea53309',
        },
        max_automatic_token_associations: 0,
        memo: 'auto-created account',
        pending_reward: 0,
        receiver_sig_required: false,
        staked_account_id: null,
        staked_node_id: null,
        stake_period_start: null,
        transactions: [],
        links: {
          next: '/api/v1/accounts/0.0.5754642?timestamp=lt:1698667038.241974687',
        },
      },
      statusCode: 200,
    }).as('testnet-api');
    cy.visit(`${baseUrl}/nft/${nftId}/transfer?testing-e2e=true`);
  });

  it('renders', () => {
    cy.get('.page-header').should('have.text', 'free transfer');
  });

  it('free transfer', () => {
    cy.get('[data-cy="receiver-wallet-address"]').type('0.0.15397435');
    cy.get('.create-button').click();
    cy.wait('@freeTransfer').its('request.body').should('deep.equal', {
      buyerWalletId: '0.0.15397435',
      tokenId: '0.0.15397475',
      identifier: '0.0.15397475.1',
      sellerId: 7,
      tokenType: 'nft',
      volume: 0,
    });
  });
});

describe('SBT transfer', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 21,
          user_name: 'Alice',
          user_role: '1',
          subscriptionType: 'silver',
          verified: 0,
          wallet_address: '0.0.1137819',
          image_icon: '21.jpeg',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwidXNlcl9uYW1lIjoiQWxpY2UiLCJ1c2VyX3JvbGUiOiIxIiwic3Vic2NyaXB0aW9uVHlwZSI6InNpbHZlciIsInZlcmlmaWVkIjowLCJ3YWxsZXRfYWRkcmVzcyI6IjAuMC4xMTM3ODE5IiwiaW1hZ2VfaWNvbiI6IjIxLmpwZWciLCJpYXQiOjE2OTg2NzE5MjcsImV4cCI6MTY5ODY3MTk1N30.MgSfC635aAUNM0Sq9l-i0MszKkwqBVNBubge7mCbmFo',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.intercept('PATCH', `${backendUrl}/nft/transfer`, {
      statusCode: 200,
    }).as('freeTransfer');
    cy.intercept('GET', `${backendUrl}/analytics/search?*`, {
      body: [
        {
          wallet_address: '0.0.15397435',
          user: {
            user_id: 20,
            user_name: 'Mohanlal Viswanathan nair',
            subscriptionType: 'basic',
            verified: 0,
            image: {
              icon: '20.jpeg',
              cover_pic: '20.jpeg',
              display_pic: '20.jpeg',
              thumbnail: '20.jpeg',
            },
          },
          type: 'Account',
          user_id: 20,
          key: '0.0.15397435',
          hash: '/user/20/profile',
        },
      ],
      statusCode: 200,
    }).as('search-for-user');
    cy.intercept('GET', `https://testnet.mirrornode.hedera.com/api/v1/accounts/*`, {
      body: {
        account: '0.0.15397435',
        alias: 'CIQHJTY4XAWIKZY5VFU5J77GXZF27EVEY6ZW23OUBAXIVXDLN2STGCI',
        auto_renew_period: 7776000,
        balance: {
          balance: 981278949814,
          timestamp: '1698669114.682382003',
          tokens: [
            {
              token_id: '0.0.2050787',
              balance: 100000000000000,
            },
          ],
        },
        created_timestamp: '1698215160.384483484',
        decline_reward: false,
        deleted: false,
        ethereum_nonce: 0,
        evm_address: '0x000000000000000000000000000000000057cf12',
        expiry_timestamp: '1705991160.384483484',
        key: {
          _type: 'ED25519',
          key: '74cf1cb82c85671da969d4ffe6be4baf92a4c7b36d6dd4082e8adc6b6ea53309',
        },
        max_automatic_token_associations: 0,
        memo: 'auto-created account',
        pending_reward: 0,
        receiver_sig_required: false,
        staked_account_id: null,
        staked_node_id: null,
        stake_period_start: null,
        transactions: [],
        links: {
          next: '/api/v1/accounts/0.0.5754642?timestamp=lt:1698667038.241974687',
        },
      },
      statusCode: 200,
    }).as('testnet-api');
  });

  it('transfer: sbt', () => {
    cy.visit(`${baseUrl}/sbt/${sbtId}/transfer?testing-e2e=true`);
    cy.get('[data-cy="receiver-wallet-address"]').type('0.0.15397435');
    // cy.get('.page-header').click({ force: true });
    cy.wait('@testnet-api', { timeout: 15000 });
    cy.get('[data-cy="next-button"]').click();
    // Unfreezing
    cy.get('[data-cy="sbt-transfer-unfreeze"]').click();
    // Transfer
    cy.get('[data-cy="sbt-transfer-transfer"]').click();
    // Freeze
    cy.get('[data-cy="sbt-transfer-freeze"]').click();

    cy.wait('@freeTransfer').its('request.body').should('deep.equal', {
      buyerWalletId: '0.0.15397435',
      tokenId: '0.0.2050787',
      identifier: '0.0.2050787.2',
      sellerId: 21,
      tokenType: 'sbt',
      volume: 0,
    });
  });
});
