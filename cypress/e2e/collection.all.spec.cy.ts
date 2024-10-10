const backendUrl = 'http://localhost:3000/v1';

describe('Collection listing: APIs', () => {
  beforeEach(() => {
    cy.intercept('GET', `${backendUrl}/auth/refresh`, {
      body: {
        user: {
          user_id: 2,
          user_name: 'sample',
          user_role: '1',
          created_at: '2022-12-24T12:13:39.607Z',
          Wallet: [
            {
              wallet_address: '0.0.47694622',
            },
          ],
          image: {
            image_id: 2,
            cover_pic: 'token cp 1.png',
            display_pic: 'user 2.png',
            icon: 'user 2.png',
            thumbnail: 'user 2.png',
            added_at: '2022-12-24T12:13:39.607Z',
            token_id: null,
            user_id: 2,
            nft_id: null,
          },
        },
        accessToken: 'adasdadasdasd',
      },
      statusCode: 200,
    }).as('userLogin');
  });

  it('Trending API: token', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      fixture: 'filterPage/collection/collection.all.valid.json',
    }).as('home-trend');
    cy.visit('http://localhost:4000/collection');
    cy.get('[data-cy="trending-card"]').should('have.length.be.gte', 3);
    cy.get('.imagesec > a > img').eq(0).should('be.visible');
    cy.get('[data-cy="trending-card"]').eq(0).find('[data-cy="in-market-count"]').should('have.text', '8');
  });

  it('Trending API: imperfect token', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      fixture: 'filterPage/collection/collection.all.flawed.json',
    }).as('home-trend');
    cy.visit('http://localhost:4000/collection');
    cy.get('[data-cy="trending-card"]').should('have.length', 2);
  });

  it('Trending API: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      statusCode: 400,
    }).as('trending');
    cy.visit('http://localhost:4000/collection');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('Trending API: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      statusCode: 500,
    }).as('trending');
    cy.visit('http://localhost:4000/collection');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('Trending API: filtering results', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      fixture: 'filterPage/collection/collection.all.valid.json',
    }).as('home-trend');
    cy.intercept(
      'GET',
      `${backendUrl}/artifact/listing/token?filterOptions=%7B%22category%22:%7B%22photography%22:false,%22digi_art%22:false%7D,%22tokenType%22:%7B%22nftc%22:false,%22ft%22:false,%22sbt%22:true%7D,%22saletype%22:%7B%22on_sale%22:false,%22not_on_sale%22:false%7D%7D&sortOrder=trending&limit=6&page=1&filterByToken=&favoriteOnly=false`,
      {
        fixture: 'filterPage/collection/collection.filter.sbt.json',
      }
    ).as('home-trend-filtered');
    cy.visit('http://localhost:4000/collection');
    cy.wait('@home-trend');
    cy.get('[data-cy="tokenType.sbt"]').click();
    cy.get('.apply > .MuiButtonBase-root').click();
    cy.wait('@home-trend-filtered');
    cy.get('[data-cy="trending-card"]').should('have.length', 2);
  });

  it('Trending API: sorting results', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/token?*`, {
      fixture: 'filterPage/collection/collection.filter.sbt.json',
    }).as('home-trend');
    cy.intercept(
      'GET',
      `${backendUrl}/artifact/listing/token?filterOptions=%7B%22category%22:%7B%22photography%22:false,%22digi_art%22:false%7D,%22tokenType%22:%7B%22nftc%22:false,%22ft%22:false,%22sbt%22:false%7D,%22saletype%22:%7B%22on_sale%22:false,%22not_on_sale%22:false%7D%7D&sortOrder=newest+first&limit=6&page=1&filterByToken=&favoriteOnly=false`,
      {
        fixture: 'filterPage/collection/collection.sorted.sbt.json',
      }
    ).as('home-trend-sorted');
    cy.visit('http://localhost:4000/collection');
    cy.wait('@home-trend');
    cy.get('.sort-button-label').click();
    cy.get(':nth-child(2) > .dropdown-menu').click();
    cy.wait('@home-trend-sorted');
    cy.get('[data-cy="trending-card"]').should('have.length', 2);
  });
});
