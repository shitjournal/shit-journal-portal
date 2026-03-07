import './commands';
import { mount } from 'cypress/react';
import '../../src/index.css';
import { resetMockDb } from '../../src/mocks/handlers';

beforeEach(() => {
  cy.viewport(1280, 900);
  localStorage.clear();
  sessionStorage.clear();
  resetMockDb();
});

Cypress.Commands.add('mount', mount);
