import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreprintCard } from './PreprintCard';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('PreprintCard', () => {
  it('clamps long stone titles and renders the topic badge below the heading', () => {
    const longTitle = '「她是不是喜欢我？」信号误判率的贝叶斯更新模型与认知偏差修正机制——一种多轮社交博弈的概率收敛分析';

    renderWithProviders(
      <PreprintCard
        zone="stone"
        preprint={{
          id: 'stone-long-title',
          title: longTitle,
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
        }}
      />,
    );

    const title = screen.getByRole('heading', { level: 4, name: longTitle });
    const topic = screen.getByText('Longform Debate');

    expect(title.className).toContain('line-clamp-2');
    expect(title.className).toContain('[overflow-wrap:anywhere]');
    expect(topic.parentElement?.previousElementSibling).toBe(title);
    expect(screen.getByTitle('构石 / The Stone')).toBeInTheDocument();
    expect(screen.getByText(/4\.82 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText('(128)')).toBeInTheDocument();
  });

  it('preserves the latrine progress area for long unbroken titles', () => {
    const longUnbrokenTitle = 'SignalMisreadProbability'.repeat(8);

    renderWithProviders(
      <PreprintCard
        zone="latrine"
        preprint={{
          id: 'latrine-long-title',
          title: longUnbrokenTitle,
          tag: 'hardcore',
          discipline: 'medical',
          created_at: '2026-02-25T00:00:00.000Z',
          avg_score: 0,
          weighted_score: 0,
          rating_count: 12,
          co_authors: null,
          author: {
            display_name: '真名',
            institution: '皇家新国立柯基大',
          },
        }}
      />,
    );

    const title = screen.getByRole('heading', { level: 4, name: longUnbrokenTitle });

    expect(title.className).toContain('line-clamp-2');
    expect(title.className).toContain('[overflow-wrap:anywhere]');
    expect(screen.getByText('评价进度 / Progress')).toBeInTheDocument();
    expect(screen.getByText('12 / 30')).toBeInTheDocument();
  });
});
