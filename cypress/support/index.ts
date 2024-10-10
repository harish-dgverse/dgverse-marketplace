/* eslint-disable no-unused-vars */
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
