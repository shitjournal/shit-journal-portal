import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('links to the contributor-added guideline documents', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /submission guidelines \/ 投稿准则/i })).toHaveAttribute(
      'href',
      '/submission-guidelines',
    );
    expect(
      screen.getByRole('link', { name: /daily recruitment guidelines \/ 每日录用准则/i }),
    ).toHaveAttribute('href', '/daily-recruitment-guidelines');
  });
});
