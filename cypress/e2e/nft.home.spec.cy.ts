const backendUrl = 'http://localhost:3000/v1';
let nftId = '0.0.15397475.1';
let sbtId = '0.0.4529779.1';

describe('NFT home: NFT', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      fixture: 'filterPage/nft/nft.home.json',
    }).as('home-nft');
    cy.intercept('GET', `${backendUrl}/analytics/related/${nftId}`, {
      fixture: 'filterPage/nft/nft.related.json',
    }).as('nft-related');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/nft/nft.more-from-user.json',
    }).as('nft-more-from-user');
  });

  it('NFT Home: Valid Data: User not logged in', () => {
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.get('.nft-name').should('have.text', 'Winning moments#2');
    cy.get('.user-name').should('have.text', 'BCCI');
    cy.get('.cover-photo').should('exist');
    cy.get('.display-picture')
      .should('exist')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('div.user-icon > .user-icon')
      .should('exist')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('[data-cy="trending-card"]').should('have.length', 2);
  });

  it('NFT Home: Valid Data, with no cover', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      fixture: 'filterPage/nft/nft.home.image.null.json',
    }).as('home-nft-no-cover');
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.wait('@home-nft-no-cover');
    cy.get('.profile-photo')
      .should('exist')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('.cover-photo').should('not.exist');
  });

  it('NFT Home: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      statusCode: 400,
    }).as('trending');
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it.only('NFT home: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      statusCode: 500,
    }).as('trending');
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('NFT Home: Valid Data: Owner logged in', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      fixture: 'filterPage/nft/nft.home.owner-login.json',
    }).as('home-nft-owner-login');
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
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.wait('@home-nft-owner-login');
    cy.get('[data-cy="free-transfer-nft"]').should('exist');
    cy.get('[data-cy="stm-nft"]').should('exist');
  });

  // Withdraw case
  it('NFT Home: Valid Data: Owner logged in: NFT is on sale', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      fixture: 'filterPage/nft/nft.home.owner-login.onsale.json',
    }).as('home-nft-onsale');
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
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.wait('@home-nft-onsale');
    // cy.get('[data-cy="free-transfer-nft"]').should('not.exist');l≠0
    cy.get('[data-cy="stm-nft"]').should('not.exist');
    cy.get('[data-cy="stm-withdraw-transfer-nft"]').should('exist');
  });

  // Buy case for another logged in user
  it('NFT Home: Valid Data: different logged in: NFT is on sale', () => {
    cy.intercept('GET', `${backendUrl}/nft/${nftId}?*`, {
      fixture: 'filterPage/nft/nft.home.owner-login.onsale.json',
    }).as('home-nft-onsale');
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 20,
          user_name: 'Mohanlal',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694623',
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
            user_id: 20,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.visit(`http://localhost:4000/nft/${nftId}/home`);
    cy.wait('@home-nft-onsale');
    cy.get('[data-cy="free-transfer-nft"]').should('not.exist');
    cy.get('[data-cy="stm-nft"]').should('not.exist');
    cy.get('[data-cy="stm-withdraw-transfer-nft"]').should('not.exist');
    cy.get('[data-cy="buy-nft"]').should('exist');
  });
});

describe('NFT home: SBT', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/nft/${sbtId}?*`, {
      fixture: 'filterPage/sbt/sbt.home.json',
    }).as('home-nft');
    cy.intercept('GET', `${backendUrl}/analytics/related/*`, {
      fixture: 'filterPage/nft/nft.related.json',
    }).as('nft-related');
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/nft/nft.more-from-user.json',
    }).as('nft-more-from-user');
  });

  it('NFT Home: Valid Data: User not logged in', () => {
    cy.visit(`http://localhost:4000/nft/${sbtId}/home`);
    cy.get('.nft-name').should('have.text', 'BA Arts certificate for John#5');
    cy.get('.user-name').eq(0).should('have.text', 'John H Doemann');
    cy.get('.cover-photo').should('not.exist');
    cy.get('.profile-photo')
      .should('exist')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('div.user-icon > .user-icon')
      .eq(0)
      .should('exist')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });

  it('NFT Home: Valid Data: Owner logged in', () => {
    cy.intercept('GET', `${backendUrl}/nft/${sbtId}?*`, {
      fixture: 'filterPage/sbt/sbt.home.owner-login.json',
    }).as('home-nft-owner-login');
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 63,
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
            cover_pic: '63.jpeg',
            display_pic: '63.jpeg',
            icon: '63.jpeg',
            thumbnail: '63.jpeg',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 63,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
    cy.visit(`http://localhost:4000/nft/${sbtId}/home`);
    cy.wait('@home-nft-owner-login');
    cy.get('[data-cy="free-transfer-nft"]').should('not.exist');
    cy.get('[data-cy="transfer-sbt"]').should('exist');
  });

  it('NFT Home: Valid Data: diff user logged in', () => {
    cy.intercept('GET', `${backendUrl}/nft/${sbtId}?*`, {
      fixture: 'filterPage/sbt/sbt.home.diff-user-login.json',
    }).as('home-nft-diffuser');
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
    cy.visit(`http://localhost:4000/nft/${sbtId}/home`);
    cy.wait('@home-nft-diffuser');
    cy.get('[data-cy="stm-nft"]').should('not.exist');
    cy.get('[data-cy="stm-withdraw-transfer-nft"]').should('not.exist');
    cy.get('[data-cy="transfer-sbt"]').should('not.exist');
  });
});
