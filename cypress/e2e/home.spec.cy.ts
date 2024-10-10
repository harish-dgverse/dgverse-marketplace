const backendUrl = 'http://localhost:3000/v1';

describe('Home Page: Wallet Integration', () => {
  it('renders', () => {
    cy.visit('http://localhost:4000');
    cy.get('.logo > img').should('exist');
  });
});

describe('Home Page: APIs', () => {
  it('Trending API: token', () => {
    cy.intercept('GET', `${backendUrl}/analytics/trend`).as('home-trend');
    cy.visit('http://localhost:4000');
    cy.wait('@home-trend', { timeout: 15000 });
    cy.get('[data-cy="trending-card"]').should('have.length.be.gte', 1);
    cy.get('.imagesec > a > img')
      .eq(0)
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('[data-cy="carousal-card-name"]').eq(0).should('have.length.be.gte', 1);
  });
  it('Trending API: token key missing', () => {
    cy.intercept('GET', `${backendUrl}/analytics/trend`, { fixture: 'home/home.token.missing.json' }).as('home-trend');
    cy.visit('http://localhost:4000');
    cy.get('[data-cy="trending-card"]').should('not.exist');
  });
  it('Trending API: nft', () => {
    cy.intercept('GET', `${backendUrl}/analytics/trend`, { fixture: 'home/home.valid.json' }).as('home-trend');
    cy.visit('http://localhost:4000');
    cy.get('.dropdown-menu').click();
    cy.get(':nth-child(2) > .dropdown-menu').click();
    cy.get('[data-cy="trending-card"]').should('have.length', 1);
    cy.get('.imagesec > a > img')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('[data-cy="trending-card"]').find('h4').should('have.text', '2011 World Cup Moments');
  });
  it('Trending API: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/analytics/trend`, {
      statusCode: 500,
    }).as('trend');
    cy.visit('http://localhost:4000/');
    cy.get('[data-cy="trending-card"]').should('not.exist');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });
  it('Trending API: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/analytics/trend`, {
      statusCode: 500,
    }).as('trend');
    cy.visit('http://localhost:4000/');
    cy.get('[data-cy="trending-card"]').should('not.exist');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });
});

describe('Home Page: Leaderboard', () => {
  it('Leaderboard API: Valid data', () => {
    cy.intercept('GET', `${backendUrl}/analytics/leaderboard`).as('leaderboard-trend');
    cy.visit('http://localhost:4000');
    cy.wait('@leaderboard-trend');
    cy.get('[data-cy="leaderbordcard"]').should('have.length.be.gte', 1);
  });

  it('Leaderboard API: Valid stubbed data', () => {
    cy.intercept('GET', `${backendUrl}/analytics/leaderboard`, { fixture: 'home/leaderboard.valid.json' }).as(
      'leaderboard-trend'
    );
    cy.visit('http://localhost:4000');
    cy.get('[data-cy="leaderbordcard"]').should('have.length', 3);
    cy.get('[data-cy="leaderboard-card-name"]').eq(0).should('have.text', 'sample');
    cy.get('[data-cy="leaderboard-follower-count"]').should('have.length', 2);
    cy.get('[data-cy="leaderboard-assets-count"]').should('have.length', 2);
  });

  it('Leaderboard API: Missing keys in data', () => {
    cy.intercept('GET', `${backendUrl}/analytics/leaderboard`, { fixture: 'home/leaderboard.missing.data.json' }).as(
      'home-trend'
    );
    cy.visit('http://localhost:4000');
    cy.get('[data-cy="leaderbordcard"]').should('have.length', 2);
  });

  it('Leaderboard API: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/analytics/leaderboard`, {
      statusCode: 400,
    }).as('leaderboard');
    cy.visit('http://localhost:4000/');
    cy.get('[data-cy="error-message-return"]').should('have.text', 'An error has occurred');
  });

  it('Leaderboard API: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/analytics/leaderboard`, {
      statusCode: 500,
    }).as('leaderboard');
    cy.visit('http://localhost:4000/');
    cy.get('[data-cy="error-message-return"]').should('have.text', 'An error has occurred');
  });
});
