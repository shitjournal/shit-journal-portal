import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreprintCard } from '../../src/pages/preprints/PreprintCard';
import { createInitialMockDatabase } from '../../src/mocks/data';

describe('PreprintCard component', () => {
  it('renders a mocked article card in the browser', () => {
    const article = createInitialMockDatabase().articles.find(item => item.id === 'art-latrine-1');
    if (!article) {
      throw new Error('Expected mock article art-latrine-1 to exist');
    }

    cy.mount(
      <MemoryRouter>
        <PreprintCard preprint={article} zone="latrine" />
      </MemoryRouter>,
    );

    cy.contains('Benchmarking Latrine Throughput Under Conference Deadline Stress').should('be.visible');
    cy.contains('Dr. Flush').should('be.visible');
    cy.contains('硬核学术').should('be.visible');
  });
});
