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

  it('keeps a long stone title on the first row, with topic below and rating visible', () => {
    const article = {
      id: 'art-stone-long-title',
      title: '「她是不是喜欢我？」信号误判率的贝叶斯更新模型与认知偏差修正机制——一种多轮社交博弈的概率收敛分析',
      tag: 'meme',
      discipline: 'interdisciplinary',
      created_at: '2026-03-03T00:00:00.000Z',
      avg_score: 4.82,
      weighted_score: 4.82,
      rating_count: 128,
      co_authors: [],
      topic: 'Longform Debate',
      author: {
        display_name: '特种兵溜娃',
        institution: '清醒点行为经济学联合研究中心',
      },
    };

    cy.mount(
      <div style={{ width: '1130px' }}>
        <MemoryRouter>
          <PreprintCard preprint={article} zone="stone" />
        </MemoryRouter>
      </div>,
    );

    cy.get('[title="构石 / The Stone"]').should('be.visible').as('stoneIcon');
    cy.contains('h4', article.title).should('be.visible').and('have.class', 'line-clamp-2').as('title');
    cy.contains('span', 'Longform Debate').should('be.visible').as('topic');
    cy.contains('4.82 / 5').should('be.visible');
    cy.contains('(128)').should('be.visible');

    cy.get('@stoneIcon').then(($icon) => {
      const iconRect = $icon[0].getBoundingClientRect();

      cy.get('@title').then(($title) => {
        const titleRect = $title[0].getBoundingClientRect();

        expect(titleRect.left).to.be.greaterThan(iconRect.right);
        expect(titleRect.top).to.be.closeTo(iconRect.top, 8);
      });
    });

    cy.get('@title').then(($title) => {
      const titleRect = $title[0].getBoundingClientRect();

      cy.get('@topic').then(($topic) => {
        const topicRect = $topic[0].getBoundingClientRect();

        expect(topicRect.top).to.be.greaterThan(titleRect.bottom);
      });
    });
  });
});
