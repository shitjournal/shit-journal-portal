import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CookieConsent } from '../../src/components/layout/CookieConsent';

describe('CookieConsent component', () => {
  it('requires explicit consent before entering the site', () => {
    cy.mount(
      <MemoryRouter>
        <CookieConsent />
      </MemoryRouter>,
    );

    cy.contains('USER NOTICE / 用户须知').should('be.visible');
    cy.contains('button', '请先勾选同意声明').should('be.disabled');

    cy.get('input[type="checkbox"]').check();
    cy.contains('button', 'ENTER S.H.I.T. JOURNAL / 同意并进入')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.window().its('localStorage.shit_journal_consent').should('eq', 'true');
    cy.contains('USER NOTICE / 用户须知').should('not.exist');
  });
});
