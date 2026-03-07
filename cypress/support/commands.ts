/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof import('cypress/react').mount;
    }
  }
}

export {};
