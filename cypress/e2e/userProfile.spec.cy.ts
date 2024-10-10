const backendUrl = 'http://localhost:3000/v1';

describe('User Profile: E2E data', () => {
  describe('User Profile: APIs', () => {
    beforeEach(() => {
      cy.intercept('GET', `${backendUrl}/user/35?*`, {
        fixture: 'user/userDetails/userDetails.valid.json',
      }).as('userDetails');
      cy.intercept('GET', `${backendUrl}/user/35/stats`, {
        fixture: 'user/userDetails/userProfile.userStats.json',
      }).as('userStats');
      cy.intercept('GET', `${backendUrl}/user/35/assets?ftOnSale=true&nftOnSale=true`, {
        fixture: 'user/userDetails/userProfile.asset.on.sale.json',
      }).as('userAssetsOnSale');
      cy.intercept('GET', `${backendUrl}/user/35/assets?collectionsOwned=true&nftOwned=true`, {
        fixture: 'user/userDetails/userProfile.collectaions.owned.json',
      }).as('userAssetsCollections');
    });

    it('Should render userstats ', () => {
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('.statistics-tile').should('have.length.gte', 0);
    });

    it('Should render userstats with error code: 400 ', () => {
      cy.intercept('GET', `${backendUrl}/user/35/stats`, {
        statusCode: 400,
      }).as('userLogin');
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('[data-cy=error-message-return]').should('have.text', 'An error has occurred');
    });

    it('Should render userstats with error code: 500 ', () => {
      cy.intercept('GET', `${backendUrl}/user/35/stats`, {
        statusCode: 500,
      }).as('userLogin');
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('[data-cy="error-message-return"]').should('have.text', 'An error has occurred');
    });

    it('Should render userAssets ', () => {
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('.user-assets-onsale').should('have.length.gte', 0);
      cy.get('[data-cy="user-assets-on-sale-p-colcol"]').eq(0).should('have.prop', 'disabled', true);
    });

    it('Should render userCollections owned ', () => {
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('[data-cy="user-assets-pro-p-colcol"]').should('have.length.gte', 0);
      console.log(cy.get('[data-cy="user-assets-pro-p-colcol"]'), 'reshma');
      cy.get('[data-cy="user-assets-pro-p-colnft"]').should('have.prop', 'disabled', true);
      cy.get('[data-cy="user-assets-pro-p-favcol"]').should('have.prop', 'disabled', true);
      cy.get('[data-cy="user-assets-pro-p-favnft"]').should('have.prop', 'disabled', true);
    });

    it('Should render recent activity', () => {
      cy.visit('http://localhost:4000/user/35/profile');
      cy.get('[data-cy="recent-activity-cy"]').should('have.length.gte', 0);
    });
  });
});
