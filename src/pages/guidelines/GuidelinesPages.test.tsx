import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { DailyRecruitmentGuidelines } from './DailyRecruitmentGuidelines';
import { SubmissionGuidelines } from './SubmissionGuidelines';

describe('SubmissionGuidelines', () => {
  it('scrolls to top and renders the new submission rules document', () => {
    renderWithProviders(<SubmissionGuidelines />, {
      initialEntries: ['/submission-guidelines'],
      routes: [{ path: '/submission-guidelines', element: <SubmissionGuidelines /> }],
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(screen.getByRole('heading', { name: /shit journal 管理文件/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByText(/抽象整活：论文名称/)).toBeInTheDocument();
    expect(screen.getByText(/初审处置结果（只有四类）/)).toBeInTheDocument();
  });
});

describe('DailyRecruitmentGuidelines', () => {
  it('scrolls to top and renders the daily quota rules', () => {
    renderWithProviders(<DailyRecruitmentGuidelines />, {
      initialEntries: ['/daily-recruitment-guidelines'],
      routes: [{ path: '/daily-recruitment-guidelines', element: <DailyRecruitmentGuidelines /> }],
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(screen.getByRole('heading', { name: /shit journal 每日录用准则/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByText(/前 500 篇/)).toBeInTheDocument();
    expect(screen.getByText(/累计达/i)).toHaveTextContent('3 次');
  });
});
