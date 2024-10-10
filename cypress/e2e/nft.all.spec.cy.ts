const backendUrl = 'http://localhost:3000/v1';

describe('NFT listing pages: APIs', () => {
  it('Trending API: nft', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/nft/nft.all.valid.json',
    }).as('nft-trend');
    cy.visit('http://localhost:4000/nft');
    cy.get('[data-cy="trending-card"]').should('have.length', 6);
    cy.get('.imagesec > a > img')
      .eq(0)
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });

  it('Trending API: returing 400 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      statusCode: 400,
    }).as('trending');
    cy.visit('http://localhost:4000/nft');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('Trending API: returing 500 response', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      statusCode: 500,
    }).as('trending');
    cy.visit('http://localhost:4000/nft');
    cy.get('[data-cy="error-message-component"]').should('have.text', 'Unable to load data');
  });

  it('Trending API: filtering results', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/nft/nft.all.valid.json',
    }).as('home-trend');
    cy.intercept(
      'GET',
      `${backendUrl}/artifact/listing/nft?filterOptions=%7B%22category%22:%7B%22photography%22:false,%22digi_art%22:false%7D,%22saletype%22:%7B%22on_sale%22:false,%22not_on_sale%22:false%7D,%22tokenType%22:%7B%22nft%22:false,%22sbt%22:true%7D%7D&sortOrder=trending&limit=6&page=1&filterByToken=&favoriteOnly=false`,
      {
        fixture: 'filterPage/nft/nft.filter.json',
      }
    ).as('home-trend-filtered');
    cy.visit('http://localhost:4000/nft');
    cy.wait('@home-trend');
    cy.get('[data-cy="tokenType.sbt"]').click();
    cy.get('.apply > .MuiButtonBase-root').click();
    cy.wait('@home-trend-filtered');
    cy.get('[data-cy="trending-card"]').should('have.length', 2);
  });

  it('Trending API: sorting results', () => {
    cy.intercept('GET', `${backendUrl}/artifact/listing/nft?*`, {
      fixture: 'filterPage/nft/nft.all.valid.json',
    }).as('home-trend');
    cy.intercept(
      'GET',
      `${backendUrl}/artifact/listing/nft?filterOptions=%7B%22category%22:%7B%22photography%22:false,%22digi_art%22:false%7D,%22saletype%22:%7B%22on_sale%22:false,%22not_on_sale%22:false%7D,%22tokenType%22:%7B%22nft%22:false,%22sbt%22:false%7D%7D&sortOrder=newest+first&limit=6&page=1&filterByToken=&favoriteOnly=false`,
      {
        fixture: 'filterPage/nft/nft.sorted.json',
      }
    ).as('home-trend-sorted');
    cy.visit('http://localhost:4000/nft');
    cy.wait('@home-trend');
    cy.get('.sort-button-label').click();
    cy.get(':nth-child(2) > .dropdown-menu').click();
    cy.wait('@home-trend-sorted');
    cy.get('[data-cy="trending-card"]').should('have.length', 6);
    cy.get('[data-cy="trending-card"]').eq(0).find('h4').should('have.text', 'Winning moment sorted');
  });
});
